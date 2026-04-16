// FILNOTAT: Offentlige og deltaker-ruter.
// GJOR: Viser turnering/kamper og håndterer kamp-påmelding for deltakere.
// SNAKKER MED: models/Tournament.js, models/Match.js, models/MatchSignup.js og views/public/*.

const express = require("express");
const { requireAuth } = require("../middleware/auth");
const User = require("../models/User");
const Tournament = require("../models/Tournament");
const Match = require("../models/Match");
const MatchSignup = require("../models/MatchSignup");

const router = express.Router();

// Hjelpefunksjon: sender bruker tilbake til riktig turneringsside med melding.
function backToTournament(req, tournamentId, infoText) {
  return `/tournaments/${tournamentId}?info=${encodeURIComponent(infoText)}`;
}

// Offentlig forside med turneringsliste.
router.get("/", async (req, res, next) => {
  try {
    const tournaments = await Tournament.find().sort({ startDate: 1 }).lean();
    res.render("public/index", { title: "Turneringer", tournaments });
  } catch (err) {
    next(err);
  }
});

// Egen side for innlogget bruker. Viser bare personens egne opplysninger.
router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.session.user.id).lean();
    if (!user) {
      return res.status(404).render("public/error", {
        title: "Ikke funnet",
        message: "Brukeren finnes ikke."
      });
    }

    const signups = await MatchSignup.find({ userId: user._id })
      .populate({
        path: "matchId",
        populate: [
          { path: "tournamentId", select: "title" },
          { path: "homeTeamId", select: "name" },
          { path: "awayTeamId", select: "name" }
        ]
      })
      .sort({ createdAt: -1 })
      .lean();

    res.render("public/me", {
      title: "Min side",
      user,
      signups
    });
  } catch (err) {
    next(err);
  }
});

// Offentlig turneringsside med kamper + påmeldingsstatus.
router.get("/tournaments/:id", async (req, res, next) => {
  try {
    const tournament = await Tournament.findById(req.params.id).lean();
    if (!tournament) {
      return res.status(404).render("public/error", { title: "Ikke funnet", message: "Turnering finnes ikke." });
    }

    // Henter kampoppsett og kobler inn lagnavn fra Team.
    const matches = await Match.find({ tournamentId: tournament._id })
      .populate("homeTeamId")
      .populate("awayTeamId")
      .sort({ kickoff: 1 })
      .lean();

    // Teller antall påmeldte per kamp for UI.
    const matchIds = matches.map((m) => m._id);
    const signups = await MatchSignup.find({ matchId: { $in: matchIds } }).lean();
    const signupCountMap = new Map();

    for (const signup of signups) {
      const key = String(signup.matchId);
      signupCountMap.set(key, (signupCountMap.get(key) || 0) + 1);
    }

    // Hvis bruker er innlogget: hent hvilke kamper akkurat denne brukeren er påmeldt.
    const signedUpMatchIds = new Set();
    if (req.session.user) {
      const mySignups = await MatchSignup.find({
        matchId: { $in: matchIds },
        userId: req.session.user.id
      }).lean();
      for (const s of mySignups) signedUpMatchIds.add(String(s.matchId));
    }

    res.render("public/tournament", {
      title: tournament.title,
      tournament,
      matches,
      signupCountMap,
      signedUpMatchIds,
      info: req.query.info || null
    });
  } catch (err) {
    next(err);
  }
});

// Fallback: hvis noen åpner /matches/:id direkte, send dem til turneringssiden.
router.all("/matches/:id", async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id).lean();
    if (!match) {
      return res.status(404).render("public/error", {
        title: "Ikke funnet",
        message: "Kampen finnes ikke."
      });
    }
    return res.redirect(backToTournament(req, match.tournamentId, "Bruk knappen i kampoversikten"));
  } catch (err) {
    next(err);
  }
});

// Påmelding til kamp (kun viewer-rolle).
router.post("/matches/:id/signup", requireAuth, async (req, res, next) => {
  try {
    if (req.session.user.role !== "viewer") {
      return res.status(403).render("public/error", {
        title: "Ingen tilgang",
        message: "Kun deltakere kan melde seg på kamp."
      });
    }

    const match = await Match.findById(req.params.id).lean();
    if (!match) {
      return res.status(404).render("public/error", {
        title: "Ikke funnet",
        message: "Kampen finnes ikke."
      });
    }

    // Upsert gjør at samme bruker ikke blir duplisert på samme kamp.
    await MatchSignup.findOneAndUpdate(
      { matchId: match._id, userId: req.session.user.id },
      { $setOnInsert: { matchId: match._id, userId: req.session.user.id } },
      { upsert: true, new: true }
    );

    return res.redirect(backToTournament(req, match.tournamentId, "Pamelding registrert"));
  } catch (err) {
    next(err);
  }
});

// GET-fallback for feilklikk/bokmerke på signup-URL.
router.get("/matches/:id/signup", requireAuth, async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id).lean();
    if (!match) {
      return res.status(404).render("public/error", {
        title: "Ikke funnet",
        message: "Kampen finnes ikke."
      });
    }
    return res.redirect(backToTournament(req, match.tournamentId, "Bruk knappen for pamelding"));
  } catch (err) {
    next(err);
  }
});

// Avmelding fra kamp (kun viewer-rolle).
router.post("/matches/:id/unsignup", requireAuth, async (req, res, next) => {
  try {
    if (req.session.user.role !== "viewer") {
      return res.status(403).render("public/error", {
        title: "Ingen tilgang",
        message: "Kun deltakere kan melde seg av kamp."
      });
    }

    const match = await Match.findById(req.params.id).lean();
    if (!match) {
      return res.status(404).render("public/error", {
        title: "Ikke funnet",
        message: "Kampen finnes ikke."
      });
    }

    await MatchSignup.deleteOne({ matchId: match._id, userId: req.session.user.id });
    return res.redirect(backToTournament(req, match.tournamentId, "Pamelding fjernet"));
  } catch (err) {
    next(err);
  }
});

// GET-fallback for feilklikk/bokmerke på unsignup-URL.
router.get("/matches/:id/unsignup", requireAuth, async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id).lean();
    if (!match) {
      return res.status(404).render("public/error", {
        title: "Ikke funnet",
        message: "Kampen finnes ikke."
      });
    }
    return res.redirect(backToTournament(req, match.tournamentId, "Bruk knappen for avmelding"));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
