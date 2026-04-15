// FILNOTAT: Turneringsmodell i MongoDB.
// GJOR: Lagrer turneringer og status.
// SNAKKER MED: routes/adminRoutes.js og routes/publicRoutes.js.

const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema(
  {
    // Navn på turneringen som vises i public/admin UI.
    title: { type: String, required: true, trim: true },
    // Hvilken idrett turneringen gjelder (f.eks. fotball/håndball).
    sport: { type: String, required: true, trim: true },
    // Startdato for turneringen. Brukes i visning og sortering.
    startDate: { type: Date, required: true },
    // Sluttdato for turneringen.
    endDate: { type: Date, required: true },
    // Hvor turneringen arrangeres.
    location: { type: String, required: true, trim: true },
    // Status styrer om turneringen er planlagt, aktiv eller ferdig.
    status: { type: String, enum: ["planlagt", "aktiv", "ferdig"], default: "planlagt" }
  },
  // Lager createdAt/updatedAt automatisk.
  { timestamps: true }
);

module.exports = mongoose.model("Tournament", tournamentSchema);
