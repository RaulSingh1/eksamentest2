// FILNOTAT: Leser miljøvariabler.
// GJOR: Samler PORT, MONGO_URI, secrets og admin-regler.
// SNAKKER MED: server.js, middleware/internalOnly.js, utils/seedAdmin.js.

const path = require("path");
// Leser .env i prosjektroten.
require("dotenv").config({ path: path.resolve(process.cwd(), ".env") });

module.exports = {
  // Port Express skal lytte på.
  port: Number(process.env.PORT || 3000),
  // MongoDB-tilkobling brukt i db.js og session store.
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/vind_il",
  // Nøkkel for signering av session-cookie.
  sessionSecret: process.env.SESSION_SECRET || "dev-secret",
  // Tillatte interne IP-prefiks for adminruter.
  adminAllowedCidrs: (process.env.ADMIN_ALLOWED_CIDRS || "127.0.0.1,::1")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean),
  // Standard admin (brukes av seed-script).
  defaultAdminEmail: process.env.DEFAULT_ADMIN_EMAIL || "admin@vindil.local",
  defaultAdminPassword: process.env.DEFAULT_ADMIN_PASSWORD || "ChangeMe123!"
};
