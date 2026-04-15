// FILNOTAT: Brukermodell i MongoDB.
// GJOR: Lagrer brukere, passord-hash og rolle.
// SNAKKER MED: routes/authRoutes.js, utils/seedAdmin.js, routes/publicRoutes.js.

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Vist navn på bruker i UI.
    name: { type: String, required: true, trim: true },
    // Innloggingsfelt. Må være unikt.
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // Lagrer hash, aldri passord i klartekst.
    passwordHash: { type: String, required: true },
    // Rolle bestemmer tilgang i auth/admin-ruter.
    role: {
      type: String,
      enum: ["superadmin", "turneringsleder", "lagleder", "viewer"],
      default: "viewer"
    }
  },
  // Lager createdAt/updatedAt automatisk.
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
