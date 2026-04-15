// FILNOTAT: Deltakermodell i MongoDB.
// GJOR: Lagrer spillerinformasjon og samtykke-felt.
// SNAKKER MED: routes/adminRoutes.js og Team-modellen.

const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    // Hvilket lag spilleren tilhører.
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
    // Fornavn på deltaker.
    firstName: { type: String, required: true, trim: true },
    // Etternavn på deltaker.
    lastName: { type: String, required: true, trim: true },
    // Fødselsdato brukes til alder/klassifisering.
    birthDate: { type: Date, required: true },
    // Kontaktperson ved mindreårige.
    guardianName: { type: String, trim: true },
    // Telefon til kontaktperson.
    guardianPhone: { type: String, trim: true },
    // Samtykke til bildepublisering.
    consentPhoto: { type: Boolean, default: false }
  },
  // Lager createdAt/updatedAt automatisk.
  { timestamps: true }
);

module.exports = mongoose.model("Player", playerSchema);
