// FILNOTAT: Hovedserver for appen.
// GJØR: Starter Express, sessions og ruter.
// SNAKKER MED: config/db.js, config/env.js, routes/authRoutes.js, routes/adminRoutes.js, routes/publicRoutes.js, views/*.

const path = require("path");
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");

const { connectDb } = require("./config/db");
const { port, mongoUri, sessionSecret } = require("./config/env");

const publicRoutes = require("./routes/publicRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

async function start() {
  // Kobler til MongoDB før vi starter webserver.
  await connectDb();

  const app = express();

  app.set("view engine", "ejs");
  app.set("views", path.join(process.cwd(), "views"));

  // Parser form-data fra HTML forms.
  app.use(express.urlencoded({ extended: true }));
  // Gir støtte for _method i skjema (f.eks. PUT/DELETE om ønskelig).
  app.use(methodOverride("_method"));
  // Serverer CSS/ev. statiske filer fra /public.
  app.use(express.static(path.join(process.cwd(), "public")));

  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      // Lagrer session i MongoDB så innlogging overlever restart bedre.
      store: MongoStore.create({ mongoUrl: mongoUri }),
      cookie: {
        // Cookie er kun for server, ikke JS i nettleser.
        httpOnly: true,
        // 8 timer session-varighet.
        maxAge: 1000 * 60 * 60 * 8
      }
    })
  );

  // Gjør currentUser tilgjengelig i alle EJS-views.
  app.use((req, res, next) => {
    res.locals.currentUser = req.session.user || null;
    next();
  });

  // Monterer rutemoduler.
  app.use("/auth", authRoutes);
  app.use("/admin", adminRoutes);
  app.use(publicRoutes);

  // 404-side hvis ingen rute matcher.
  app.use((req, res) => {
    res.status(404).render("public/error", { title: "404", message: "Siden ble ikke funnet." });
  });

  // Felles feilbehandler for unntak i ruter.
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).render("public/error", {
      title: "Serverfeil",
      message: "Noe gikk galt. Prøv igjen senere."
    });
  });

  // Starter HTTP-server på valgt port.
  app.listen(port, () => {
    console.log(`Server kjører på http://localhost:${port}`);
  });
}

start().catch((err) => {
  console.error("Kunne ikke starte app:", err);
  process.exit(1);
});
