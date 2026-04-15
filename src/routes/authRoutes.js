// FILNOTAT: Auth-ruter.
// GJOR: Registrering, innlogging og utlogging.
// SNAKKER MED: models/User.js, views/auth/* og session i server.js.

const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

// Viser registreringsside (views/auth/register.ejs).
router.get("/register", (req, res) => {
  res.render("auth/register", { title: "Registrer bruker", error: null });
});

// Oppretter ny standardbruker (viewer).
router.post("/register", async (req, res, next) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").toLowerCase().trim();
    const password = String(req.body.password || "");

    // Enkelt inputkrav før lagring i DB.
    if (!name || !email || password.length < 8) {
      return res.status(400).render("auth/register", {
        title: "Registrer bruker",
        error: "Fyll ut alle felter. Passord må ha minst 8 tegn."
      });
    }

    // Stopper duplikat e-post.
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).render("auth/register", {
        title: "Registrer bruker",
        error: "E-post er allerede i bruk."
      });
    }

    // Lagrer hash i stedet for passord.
    const passwordHash = await bcrypt.hash(password, 12);
    await User.create({ name, email, passwordHash, role: "viewer" });

    return res.redirect("/auth/login");
  } catch (err) {
    next(err);
  }
});

// Viser login-side (views/auth/login.ejs).
router.get("/login", (req, res) => {
  res.render("auth/login", { title: "Innlogging", error: null });
});

// Logger inn bruker og lagrer brukerinfo i session.
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email || "").toLowerCase().trim() });

    if (!user) {
      return res.status(401).render("auth/login", { title: "Innlogging", error: "Feil e-post eller passord." });
    }

    const ok = await bcrypt.compare(password || "", user.passwordHash);
    if (!ok) {
      return res.status(401).render("auth/login", { title: "Innlogging", error: "Feil e-post eller passord." });
    }

    req.session.user = {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role
    };

    // Admin-roller sendes til adminpanel.
    if (["superadmin", "turneringsleder", "lagleder"].includes(user.role)) {
      return res.redirect("/admin");
    }

    // Vanlig bruker sendes til offentlig side.
    return res.redirect("/");
  } catch (err) {
    next(err);
  }
});

// Fjerner session ved utlogging.
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
