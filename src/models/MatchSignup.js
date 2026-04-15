// FILNOTAT: Påmelding til kamp.
// GJOR: Kobler bruker til kamp med unik kombinasjon.
// SNAKKER MED: routes/publicRoutes.js og routes/adminRoutes.js.

const mongoose = require("mongoose");

const matchSignupSchema = new mongoose.Schema(
  {
    // Hvilken kamp brukeren melder seg på.
    matchId: { type: mongoose.Schema.Types.ObjectId, ref: "Match", required: true },
    // Hvilken bruker som melder seg på.
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  // Lager createdAt/updatedAt automatisk.
  { timestamps: true }
);

// Sikrer at samme bruker ikke kan melde seg på samme kamp to ganger.
matchSignupSchema.index({ matchId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("MatchSignup", matchSignupSchema);
