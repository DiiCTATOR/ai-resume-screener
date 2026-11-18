#!/bin/bash
# ==============================================================================
# AWS EC2 One-Command Deployment Script for AI Resume Screener
# ==============================================================================

set -e

echo "🚀 Starting AWS EC2 Deployment for AI Resume Screener..."

# 1. Update package list
echo "📦 Updating system packages..."
sudo apt update -y

# 1.5 Add Swap Memory (Prevents Out-Of-Memory crashes on t2.micro / t3.micro)
SWAP_TOTAL=$(free -m | awk '/^Swap:/ {print $2}')
if [ -z "$SWAP_TOTAL" ] || [ "$SWAP_TOTAL" -lt 1024 ]; then
    echo "🧠 Creating 2GB swap file to prevent Out-Of-Memory freeze on micro instances..."
    sudo swapoff -a 2>/dev/null || true
    sudo rm -f /swapfile 2>/dev/null || true
    sudo fallocate -l 2G /swapfile 2>/dev/null || sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    if ! grep -q '/swapfile' /etc/fstab; then
        echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    fi
    echo "✅ 2GB Swap memory activated."
fi

# 2. Check if Node.js is installed, if not install Node.js 22 LTS
if ! command -v node &> /dev/null; then
    echo "⬇️ Installing Node.js 22 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    sudo apt install -y nodejs
fi

echo "✅ Node version: $(node -v)"
echo "✅ NPM version: $(npm -v)"

# 3. Setup environment files if missing
if [ ! -f backend_ai/.env ]; then
    echo "📄 Creating backend_ai/.env from template..."
    cp backend_ai/.env.example backend_ai/.env
fi

if [ ! -f mern_ai/.env ]; then
    echo "📄 Creating mern_ai/.env from template..."
    cp mern_ai/.env.example mern_ai/.env
fi

# 4. Install all dependencies
echo "📥 Installing frontend and backend dependencies..."
npm run install:all

# 5. Build React frontend into backend_ai/build
echo "🔨 Building React production frontend..."
npm run build

# 6. Install PM2 if not present
if ! command -v pm2 &> /dev/null; then
    echo "⚙️ Installing PM2 process manager..."
    sudo npm install -g pm2
fi

# 7. Start or restart the app with PM2
echo "🔄 Starting application with PM2..."
pm2 startOrReload ecosystem.config.js
pm2 save

echo ""
echo "=============================================================="
echo "🎉 Deployment Complete!"
echo "🌐 Your app is running on port 4000."
echo "🔗 Access it at: http://$(curl -s http://checkip.amazonaws.com):4000"
echo "📊 Check logs with: pm2 logs ai-resume-screener"
echo "=============================================================="
