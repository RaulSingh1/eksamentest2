// FILNOTAT: Init-script for adminbruker.
// GJOR: Oppretter standard superadmin hvis den ikke finnes.
// SNAKKER MED: config/db.js, config/env.js og models/User.js.

const bcrypt = require("bcrypt");
const { connectDb } = require("../config/db");
const { defaultAdminEmail, defaultAdminPassword } = require("../config/env");
const User = require("../models/User");

async function run() {
  // Kobler til DB for å kunne lese/skrive brukere.
  await connectDb();

  // Stopper hvis admin allerede finnes.
  const existing = await User.findOne({ email: defaultAdminEmail.toLowerCase() });
  if (existing) {
    console.log("Admin finnes allerede:", existing.email);
    process.exit(0);
  }

  // Oppretter hash av passord før lagring.
  const passwordHash = await bcrypt.hash(defaultAdminPassword, 12);
  // Lager superadmin-konto som brukes første gang.
  await User.create({
    name: "Default Admin",
    email: defaultAdminEmail.toLowerCase(),
    passwordHash,
    role: "superadmin"
  });

  console.log("Admin opprettet:", defaultAdminEmail);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
