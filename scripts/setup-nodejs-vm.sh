#!/usr/bin/env bash
set -euo pipefail

# Ubuntu 22.04/24.04 - Node.js VM oppsett
# Kjør som sudo-bruker.

# Tilpass disse verdiene ved behov
NODE_MAJOR="20"
APP_USER="eksamennd"
APP_DIR="/home/${APP_USER}/eksamen102"
APP_PORT="3000"
MONGO_IP="10.12.13.230"

sudo apt-get update
sudo apt-get install -y curl ca-certificates gnupg ufw

# Installer Node.js fra NodeSource
curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | sudo -E bash -
sudo apt-get install -y nodejs

# Åpne app-port i brannmur (juster etter behov)
sudo ufw allow "${APP_PORT}/tcp"
sudo ufw --force enable

# Skriv systemd service for appen
sudo tee /etc/systemd/system/vind-il.service > /dev/null <<SERVICE
[Unit]
Description=Vind IL Node.js app
After=network.target

[Service]
Type=simple
User=${APP_USER}
WorkingDirectory=${APP_DIR}
Environment=NODE_ENV=production
Environment=PORT=${APP_PORT}
Environment=MONGO_URI=mongodb://${MONGO_IP}:27017/vind_il
ExecStart=/usr/bin/node src/server.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
SERVICE

sudo systemctl daemon-reload
sudo systemctl enable vind-il

cat <<MSG
Node.js VM er satt opp.

Neste steg:
1) Legg prosjektet i: ${APP_DIR}
2) Kjør som ${APP_USER}:
   cd ${APP_DIR}
   npm install --no-audit --no-fund
   cp .env.example .env
   # sett korrekt MONGO_URI i .env, f.eks:
   # MONGO_URI=mongodb://${MONGO_IP}:27017/vind_il
   npm run seed-admin
3) Start app-tjenesten:
   sudo systemctl restart vind-il
   sudo systemctl status vind-il --no-pager
MSG
