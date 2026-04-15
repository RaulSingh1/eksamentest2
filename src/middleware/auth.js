// FILNOTAT: Innloggings- og rollebeskyttelse.
// GJOR: Stopper uinnloggede/feil roller fra beskyttede sider.
// SNAKKER MED: routes/adminRoutes.js og routes/publicRoutes.js.

function requireAuth(req, res, next) {
  // Stopper request hvis ingen innlogget bruker i session.
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    // Krever først innlogging.
    if (!req.session.user) {
      return res.redirect("/auth/login");
    }
    // Krever deretter riktig rolle.
    if (!roles.includes(req.session.user.role)) {
      return res.status(403).render("public/error", {
        title: "Ingen tilgang",
        message: "Du har ikke tilgang til denne siden."
      });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
