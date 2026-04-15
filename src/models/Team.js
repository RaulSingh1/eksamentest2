// FILNOTAT: Lagmodell i MongoDB.
// GJOR: Lagrer lagdata brukt i kamper og deltakere.
// SNAKKER MED: routes/adminRoutes.js og Match/Player-modellene.

const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    // Navn på laget.
    name: { type: String, required: true, trim: true },
    // Aldersklasse (f.eks. G14/J16/Senior).
    ageGroup: { type: String, required: true, trim: true },
    // Navn på ansvarlig lagleder.
    managerName: { type: String, required: true, trim: true }
  },
  // Lager createdAt/updatedAt automatisk.
  { timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);
