// FILNOTAT: Nettverksfilter for admin.
// GJOR: Tillater adminruter kun fra godkjente IP-prefikser.
// SNAKKER MED: config/env.js og routes/adminRoutes.js.

const { adminAllowedCidrs } = require("../config/env");

function clientIp(req) {
  // Leser IP fra proxy-header hvis tilgjengelig.
  const xff = req.headers["x-forwarded-for"];
  if (xff) {
    return String(xff).split(",")[0].trim();
  }
  // Fallback til direkte socket-IP.
  return req.socket.remoteAddress || "";
}

function isAllowedIp(ip) {
  if (!ip) return false;
  // Fjerner IPv6-prefix for IPv4-matchelogikk.
  const normalized = ip.replace("::ffff:", "");
  return adminAllowedCidrs.some((prefix) => normalized.startsWith(prefix));
}

function internalOnly(req, res, next) {
  // Brukes av adminRoutes.js for å holde admin internt.
  const ip = clientIp(req);
  if (!isAllowedIp(ip)) {
    return res.status(403).render("public/error", {
      title: "Kun intern tilgang",
      message: "Admin-sider er kun tilgjengelig fra skolenett eller VPN."
    });
  }
  next();
}

module.exports = { internalOnly };
