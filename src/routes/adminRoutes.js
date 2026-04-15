// FILNOTAT: Admin-ruter for drift av turnering.
// GJOR: CRUD for turneringer, lag, spillere, kamper og resultater.
// SNAKKER MED: middleware/auth.js, middleware/internalOnly.js, modeller og views/admin/*.

const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");
const { internalOnly } = require("../middleware/internalOnly");
const Tournament = require("../models/Tournament");
const Team = require("../models/Team");
const Player = require("../models/Player");
const Match = require("../models/Match");
const MatchSignup = require("../models/MatchSignup");

const router = express.Router();

// Alle adminruter krever: intern IP + innlogging + adminrolle.
router.use(internalOnly, requireAuth, requireRole("superadmin", "turneringsleder", "lagleder"));

// Admin dashboard med enkle tellerdata.
router.get("/", async (req, res, next) => {
  try {
    const [tournaments, teams, players, matches] = await Promise.all([
      Tournament.countDocuments(),
      Team.countDocuments(),
      Player.countDocuments(),
      Match.countDocuments()
    ]);

    res.render("admin/dashboard", {
      title: "Admin",
      stats: { tournaments, teams, players, matches }
    });
  } catch (err) {
    next(err);
  }
});

// Liste over turneringer.
router.get("/tournaments", async (req, res, next) => {
  try {
    const tournaments = await Tournament.find().sort({ startDate: 1 }).lean();
    res.render("admin/tournaments", { title: "Turneringer", tournaments });
  } catch (err) {
    next(err);
  }
});

// Opprett turnering.
router.post("/tournaments", requireRole("superadmin", "turneringsleder"), async (req, res, next) => {
  try {
    const { title, sport, startDate, endDate, location, status } = req.body;
    await Tournament.create({ title, sport, startDate, endDate, location, status });
    res.redirect("/admin/tournaments");
  } catch (err) {
    next(err);
  }
});

// Slett turnering + kamper + påmeldinger knyttet til turneringen.
router.post("/tournaments/:id/delete", requireRole("superadmin", "turneringsleder"), async (req, res, next) => {
  try {
    const matches = await Match.find({ tournamentId: req.params.id }).select("_id").lean();
    const matchIds = matches.map((m) => m._id);
    if (matchIds.length) {
      await MatchSignup.deleteMany({ matchId: { $in: matchIds } });
    }
    await Tournament.findByIdAndDelete(req.params.id);
    await Match.deleteMany({ tournamentId: req.params.id });
    res.redirect("/admin/tournaments");
  } catch (err) {
    next(err);
  }
});

// Liste over lag.
router.get("/teams", async (req, res, next) => {
  try {
    const teams = await Team.find().sort({ createdAt: -1 }).lean();
    res.render("admin/teams", { title: "Lag", teams });
  } catch (err) {
    next(err);
  }
});

// Opprett lag.
router.post("/teams", requireRole("superadmin", "turneringsleder", "lagleder"), async (req, res, next) => {
  try {
    const { name, ageGroup, managerName } = req.body;
    await Team.create({ name, ageGroup, managerName });
    res.redirect("/admin/teams");
  } catch (err) {
    next(err);
  }
});

// Slett lag + spillere + kamper + påmeldinger som bruker laget.
router.post("/teams/:id/delete", requireRole("superadmin", "turneringsleder"), async (req, res, next) => {
  try {
    const matches = await Match.find({ $or: [{ homeTeamId: req.params.id }, { awayTeamId: req.params.id }] })
      .select("_id")
      .lean();
    const matchIds = matches.map((m) => m._id);
    if (matchIds.length) {
      await MatchSignup.deleteMany({ matchId: { $in: matchIds } });
    }
    await Team.findByIdAndDelete(req.params.id);
    await Player.deleteMany({ teamId: req.params.id });
    await Match.deleteMany({ $or: [{ homeTeamId: req.params.id }, { awayTeamId: req.params.id }] });
    res.redirect("/admin/teams");
  } catch (err) {
    next(err);
  }
});

// Liste over deltakere (med hvilket lag de tilhører).
router.get("/players", async (req, res, next) => {
  try {
    const [players, teams] = await Promise.all([
      Player.find().populate("teamId").sort({ createdAt: -1 }).lean(),
      Team.find().sort({ name: 1 }).lean()
    ]);
    res.render("admin/players", { title: "Deltakere", players, teams });
  } catch (err) {
    next(err);
  }
});

// Opprett deltaker.
router.post("/players", requireRole("superadmin", "turneringsleder", "lagleder"), async (req, res, next) => {
  try {
    const { teamId, firstName, lastName, birthDate, guardianName, guardianPhone, consentPhoto } = req.body;
    await Player.create({
      teamId,
      firstName,
      lastName,
      birthDate,
      guardianName,
      guardianPhone,
      consentPhoto: consentPhoto === "on"
    });
    res.redirect("/admin/players");
  } catch (err) {
    next(err);
  }
});

// Slett deltaker.
router.post("/players/:id/delete", requireRole("superadmin", "turneringsleder"), async (req, res, next) => {
  try {
    await Player.findByIdAndDelete(req.params.id);
    res.redirect("/admin/players");
  } catch (err) {
    next(err);
  }
});

// Liste over kamper + antall påmeldte.
router.get("/matches", async (req, res, next) => {
  try {
    const [matches, tournaments, teams] = await Promise.all([
      Match.find().populate("tournamentId homeTeamId awayTeamId").sort({ kickoff: 1 }).lean(),
      Tournament.find().sort({ startDate: 1 }).lean(),
      Team.find().sort({ name: 1 }).lean()
    ]);

    const matchIds = matches.map((m) => m._id);
    const signups = await MatchSignup.find({ matchId: { $in: matchIds } }).lean();
    const signupCountMap = new Map();
    for (const signup of signups) {
      const key = String(signup.matchId);
      signupCountMap.set(key, (signupCountMap.get(key) || 0) + 1);
    }

    res.render("admin/matches", { title: "Kamper", matches, tournaments, teams, signupCountMap });
  } catch (err) {
    next(err);
  }
});

// Opprett kamp.
router.post("/matches", requireRole("superadmin", "turneringsleder"), async (req, res, next) => {
  try {
    const { tournamentId, homeTeamId, awayTeamId, kickoff, venue } = req.body;
    if (homeTeamId === awayTeamId) {
      return res.status(400).render("public/error", {
        title: "Ugyldig kamp",
        message: "Et lag kan ikke spille mot seg selv."
      });
    }

    await Match.create({ tournamentId, homeTeamId, awayTeamId, kickoff, venue });
    res.redirect("/admin/matches");
  } catch (err) {
    next(err);
  }
});

// Registrer resultat og marker kamp som spilt.
router.post("/matches/:id/result", requireRole("superadmin", "turneringsleder"), async (req, res, next) => {
  try {
    const homeScore = Number(req.body.homeScore);
    const awayScore = Number(req.body.awayScore);

    await Match.findByIdAndUpdate(req.params.id, {
      homeScore,
      awayScore,
      status: "spilt"
    });

    res.redirect("/admin/matches");
  } catch (err) {
    next(err);
  }
});

// Slett kamp + alle påmeldinger til kampen.
router.post("/matches/:id/delete", requireRole("superadmin", "turneringsleder"), async (req, res, next) => {
  try {
    await MatchSignup.deleteMany({ matchId: req.params.id });
    await Match.findByIdAndDelete(req.params.id);
    res.redirect("/admin/matches");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
