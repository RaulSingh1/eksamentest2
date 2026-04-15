// FILNOTAT: Kampmodell i MongoDB.
// GJOR: Lagrer kampoppsett, status og resultat.
// SNAKKER MED: routes/adminRoutes.js, routes/publicRoutes.js og Team/Tournament-modeller.

const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    // Kobling til hvilken turnering kampen tilhører.
    tournamentId: { type: mongoose.Schema.Types.ObjectId, ref: "Tournament", required: true },
    // Kobling til hjemmelag (Team).
    homeTeamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
    // Kobling til bortelag (Team).
    awayTeamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
    // Når kampen starter.
    kickoff: { type: Date, required: true },
    // Bane/hall/sted for kampen.
    venue: { type: String, required: true, trim: true },
    // Kampstatus: planlagt eller spilt.
    status: { type: String, enum: ["planlagt", "spilt"], default: "planlagt" },
    // Resultat hjemmelag (null til kampen er spilt).
    homeScore: { type: Number, default: null },
    // Resultat bortelag (null til kampen er spilt).
    awayScore: { type: Number, default: null }
  },
  // Lager createdAt/updatedAt automatisk.
  { timestamps: true }
);

module.exports = mongoose.model("Match", matchSchema);
