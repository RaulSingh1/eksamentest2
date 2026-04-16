// FILNOTAT: Varslingsmodell for admin.
// GJOR: Lagrer automatiske påminnelser, for eksempel når en turnering nærmer seg slutten uten alle resultater.
// SNAKKER MED: utils/adminReminderJob.js og routes/adminRoutes.js.

const mongoose = require("mongoose");

const adminNotificationSchema = new mongoose.Schema(
  {
    // Type varsel, brukt til å skille mellom ulike automatiske sjekker.
    kind: { type: String, required: true, enum: ["missing-results"] },
    // Hvilken turnering varslet gjelder.
    tournamentId: { type: mongoose.Schema.Types.ObjectId, ref: "Tournament", required: true },
    // Lagret tittel for enklere visning i dashboard.
    tournamentTitle: { type: String, required: true, trim: true },
    // Selve meldingen som vises til admin.
    message: { type: String, required: true, trim: true },
    // Antall kamper uten resultat når varselet ble laget/oppdatert.
    pendingMatchCount: { type: Number, required: true, min: 0 },
    // Når turneringen passerer grensen for varslet.
    dueAt: { type: Date, required: true },
    // Når varselet ble oppdaget sist.
    lastCheckedAt: { type: Date, required: true },
    // Når problemet ble løst. Null betyr at varselet fortsatt er aktivt.
    resolvedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

// Én aktiv varslingslinje per turnering og varseltype.
adminNotificationSchema.index({ tournamentId: 1, kind: 1 }, { unique: true });

module.exports = mongoose.model("AdminNotification", adminNotificationSchema);
