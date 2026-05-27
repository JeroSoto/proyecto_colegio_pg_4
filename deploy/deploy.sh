#!/usr/bin/env bash
# Automated deploy helper for Ubuntu (run on VPS as your non-root user)
set -euo pipefail

PROJECT_DIR="$HOME/proyecto_colegio"
REPO_URL="" # <- Set your git repo URL here or pass as first arg

if [ "$#" -ge 1 ] && [ -n "$1" ]; then
  REPO_URL="$1"
fi

if [ -z "$REPO_URL" ]; then
  echo "Usage: $0 <git-repo-url>"
  exit 1
fi

echo "Deploying proyecto_colegio to $PROJECT_DIR"

# Install system deps
sudo apt update
sudo apt install -y build-essential curl git nginx

# Install Node 20
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
fi

# Clone or update repo
if [ -d "$PROJECT_DIR" ]; then
  echo "Updating existing repo"
  cd "$PROJECT_DIR"
  git pull --rebase
else
  git clone "$REPO_URL" "$PROJECT_DIR"
  cd "$PROJECT_DIR"
fi

npm install

# Ensure data dir
mkdir -p data
chown -R $USER:$USER data

# Install pm2
if ! command -v pm2 >/dev/null 2>&1; then
  sudo npm install -g pm2
fi

# Start app with pm2
pm2 start app.js --name proyecto-colegio --update-env
pm2 save
pm2 startup | sed -n '1,200p'

echo "Deploy finished. Configure /etc/nginx/sites-available/proyecto_colegio and point server_name to your domain or IP. Then restart nginx." 
