#!/usr/bin/env bash
set -euo pipefail

# Ubuntu 22.04/24.04 - MongoDB 7.0
# Kjør som sudo-bruker.

sudo apt-get update
sudo apt-get install -y gnupg curl

curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
  sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
  sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list > /dev/null

sudo apt-get update
sudo apt-get install -y mongodb-org

# Bind kun på intern IP + localhost
MONGO_IP="10.12.13.230"
sudo sed -i "s/^  bindIp: .*/  bindIp: 127.0.0.1,${MONGO_IP}/" /etc/mongod.conf

sudo systemctl enable mongod
sudo systemctl restart mongod

# Midlertidig: tillat alle inn til Mongo-porten
sudo ufw allow 27017/tcp
sudo ufw --force enable

echo "MongoDB installert. Sjekk status med: systemctl status mongod"
