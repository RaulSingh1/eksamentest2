// FILNOTAT: Automatisk varslingsjobb for admin.
// GJOR: Finner turneringer som slutter innen 48 timer og markerer dem hvis de fortsatt mangler resultater.
// SNAKKER MED: models/Tournament.js, models/Match.js og models/AdminNotification.js.

const Tournament = require("../models/Tournament");
const Match = require("../models/Match");
const AdminNotification = require("../models/AdminNotification");

const ALERT_WINDOW_MS = 48 * 60 * 60 * 1000;

function formatDeadline(date) {
  return new Intl.DateTimeFormat("no-NO", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

async function syncMissingResultNotifications(now = new Date()) {
  const alertCutoff = new Date(now.getTime() + ALERT_WINDOW_MS);

  const tournaments = await Tournament.find({
    endDate: { $gte: now, $lte: alertCutoff }
  })
    .sort({ endDate: 1 })
    .lean();

  if (!tournaments.length) {
    return [];
  }

  const tournamentIds = tournaments.map((t) => t._id);
  const matches = await Match.find({ tournamentId: { $in: tournamentIds } })
    .select("tournamentId status homeScore awayScore")
    .lean();

  const matchesByTournament = new Map();
  for (const match of matches) {
    const key = String(match.tournamentId);
    const list = matchesByTournament.get(key) || [];
    list.push(match);
    matchesByTournament.set(key, list);
  }

  const activeNotifications = [];

  for (const tournament of tournaments) {
    const tournamentMatches = matchesByTournament.get(String(tournament._id)) || [];
    const missingResults = tournamentMatches.filter(
      (match) => match.status !== "spilt" || match.homeScore === null || match.awayScore === null
    );

    const query = { tournamentId: tournament._id, kind: "missing-results" };

    if (missingResults.length > 0) {
      const message = `Turneringen "${tournament.title}" avsluttes ${formatDeadline(
        tournament.endDate
      )} og mangler ${missingResults.length} kampresultat${missingResults.length === 1 ? "" : "er"}.`;

      const notification = await AdminNotification.findOneAndUpdate(
        query,
        {
          $set: {
            tournamentTitle: tournament.title,
            message,
            pendingMatchCount: missingResults.length,
            dueAt: tournament.endDate,
            lastCheckedAt: now,
            resolvedAt: null
          }
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      activeNotifications.push(notification);
      console.warn(`[ADMIN VARSEL] ${message}`);
      continue;
    }

    const updated = await AdminNotification.findOneAndUpdate(
      query,
      {
        $set: {
          tournamentTitle: tournament.title,
          message: `Turneringen "${tournament.title}" har nå registrerte resultater for alle kamper.`,
          pendingMatchCount: 0,
          dueAt: tournament.endDate,
          lastCheckedAt: now,
          resolvedAt: now
        }
      },
      { new: true }
    );

    if (updated && updated.resolvedAt === null) {
      await AdminNotification.deleteOne({ _id: updated._id });
    }
  }

  return activeNotifications;
}

function startAdminReminderLoop({ intervalMs = 60 * 60 * 1000 } = {}) {
  const run = () =>
    syncMissingResultNotifications().catch((err) => {
      console.error("Kunne ikke kjøre admin-varseljobb:", err);
    });

  run();
  const timer = setInterval(run, intervalMs);
  timer.unref?.();
  return timer;
}

module.exports = { syncMissingResultNotifications, startAdminReminderLoop };
