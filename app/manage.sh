#!/bin/bash

# Usage: ./react-manage.sh [dev-install|dev-start|prod-install|prod-serve|build|all]

set -e

APP_DIR="Frontend"
DEV_PORT=3000
PROD_PORT=5000
NODE_VERSION="22"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

install_node() {
    if ! command -v node &> /dev/null; then
        echo -e "${YELLOW}Node.js not found. Installing Node.js $NODE_VERSION...${NC}"
        curl -fsSL https://deb.nodesource.com/setup_$NODE_VERSION.x | sudo -E bash -
        sudo apt-get install -y nodejs
        echo -e "${GREEN}Node.js $(node -v) installed successfully!${NC}"
    else
        echo -e "${GREEN}Node.js $(node -v) is already installed.${NC}"
    fi
}

install_npm() {
    if ! command -v npm &> /dev/null; then
        echo -e "${YELLOW}npm not found. Installing npm...${NC}"
        sudo apt-get install -y npm
        echo -e "${GREEN}npm $(npm -v) installed successfully!${NC}"
    else
        echo -e "${GREEN}npm $(npm -v) is already installed.${NC}"
    fi
}

install_serve() {
    if ! command -v serve &> /dev/null; then
        echo -e "${YELLOW}Installing serve globally...${NC}"
        sudo npm install -g serve
        echo -e "${GREEN}serve installed successfully!${NC}"
    fi
}

dev_install() {
    echo -e "${YELLOW}Installing development dependencies...${NC}"
    cd "$APP_DIR" || exit
    npm install
    cd ..
    echo -e "${GREEN}Development dependencies installed!${NC}"
}

prod_install() {
    echo -e "${YELLOW}Installing production dependencies...${NC}"
    cd "$APP_DIR" || exit
    npm install --production
    cd ..
    echo -e "${GREEN}Production dependencies installed!${NC}"
}

build_app() {
    echo -e "${YELLOW}Building React app...${NC}"
    cd "$APP_DIR" || exit
    npm run build
    cd ..
    echo -e "${GREEN}React app built successfully!${NC}"
}

dev_start() {
    echo -e "${YELLOW}Starting development server with pm2...${NC}"
    cd "$APP_DIR" || exit
    echo -e "${GREEN}Development server running on: http://localhost:$DEV_PORT${NC}"
    pm2 start "npm start" --name "react-dev-server"
    echo -e "${GREEN}Server started with pm2!${NC}"
    pm2 save
    pm2 startup
}

prod_serve() {
    echo -e "${YELLOW}Serving production build with pm2...${NC}"
    cd "$APP_DIR" || exit
    echo -e "${GREEN}Production app running on: http://localhost:$PROD_PORT${NC}"
    pm2 start "serve -s build -l $PROD_PORT" --name "react-prod-server"
    echo -e "${GREEN}Server started with pm2!${NC}"
    pm2 save
    pm2 startup
}

prod_all() {
    install_node
    install_npm
    install_serve
    prod_install
    build_app
    prod_serve
}

dev_all() {
    install_node
    install_npm
    dev_install
    dev_start
}

case "$1" in
    dev-install)
        dev_install
        ;;
    dev-start)
        dev_start
        ;;
    prod-install)
        prod_install
        ;;
    prod-serve)
        prod_serve
        ;;
    build)
        build_app
        ;;
    prod-all)
        prod_all
        ;;
    dev-all)
        dev_all
        ;;
    *)
        echo -e "${RED}Usage: $0 {command}${NC}"
        echo -e "Development commands:"
        echo -e "  dev-install   - Install development dependencies"
        echo -e "  dev-start     - Start development server"
        echo -e "  dev-all       - Full development setup (install + start)"
        echo -e "Production commands:"
        echo -e "  prod-install  - Install production dependencies"
        echo -e "  prod-serve    - Serve production build"
        echo -e "  build         - Build the React app"
        echo -e "  prod-all      - Full production setup (install + build + serve)"
        exit 1
        ;;
esac