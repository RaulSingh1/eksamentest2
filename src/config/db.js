// FILNOTAT: Databasekobling mot MongoDB.
// GJOR: Kobler Mongoose til MONGO_URI.
// SNAKKER MED: config/env.js og server.js.

const mongoose = require("mongoose");
const { mongoUri } = require("./env");

async function connectDb() {
  // Streng query-validering i Mongoose.
  mongoose.set("strictQuery", true);
  // Oppretter faktisk kobling mot MongoDB.
  await mongoose.connect(mongoUri);
  console.log("MongoDB koblet til");
}

module.exports = { connectDb };
