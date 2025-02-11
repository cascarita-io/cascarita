#!/bin/zsh

# Step 1: Install Homebrew
echo "----------------------------------------"
echo "Step 1: Install Homebrew"
echo "----------------------------------------"
if ! command -v brew &> /dev/null
then
    echo "Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
    echo "Homebrew is already installed."
fi

# Step 2: Install node, nvm, and pnpm
echo "----------------------------------------"
echo "Step 2: Install node, nvm, and pnpm"
echo "----------------------------------------"
echo "Checking if node, nvm, and pnpm are installed..."

if ! command -v node &> /dev/null
then
    echo "Installing node..."
    brew install node
else
    echo "Node is already installed."
fi

if ! command -v nvm &> /dev/null
then
    echo "Installing nvm..."
    brew install nvm
else
    echo "NVM is already installed."
fi

if ! command -v pnpm &> /dev/null
then
    echo "Installing pnpm..."
    brew install pnpm
else
    echo "PNPM is already installed."
fi

# Step 4: Source .zshrc file to capture install updates
echo "----------------------------------------"
echo "Step 3: Sourcing .zshrc file to capture install updates"
echo "----------------------------------------"
source ~/.zshrc

# Step 4: Install dependencies within server
echo "----------------------------------------"
echo "Step 4: Install dependencies within server"
echo "----------------------------------------"
echo "Fetching environment variables from AWS Secrets Manager...."

cd server
source $(brew --prefix nvm)/nvm.sh
nvm use
npm install
npm run create-dev-env

cd ../client
source $(brew --prefix nvm)/nvm.sh
nvm use
pnpm install
pnpm run create-dev-env

cd ..
# Step 5: Check if .env files exist
echo "----------------------------------------"
echo "Step 5: Check if .env files exist in server and client directories"
echo "----------------------------------------"
if [ -f server/.env ]; then
    echo ".env file exists in server directory."
else
    echo ".env file does not exist in server directory."
    exit 1
fi

if [ -f client/.env ]; then
    echo ".env file exists in client directory."
else
    echo ".env file does not exist in client directory."
    exit 1
fi

# Step 6: Build docker containers
echo "----------------------------------------"
echo "Step 6: Build and run docker containers"
echo "----------------------------------------"
docker compose build 
docker compose up -d
