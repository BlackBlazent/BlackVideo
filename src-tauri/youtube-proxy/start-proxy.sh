#!/bin/bash

# /*
# Copyright (c) 2026 BlackVideo (Zephyra)
# All Rights Reserved.
# This source code is the confidential and proprietary property of BlackVideo.
# * Unauthorized copying, modification, distribution, or use of this source code,
# in whole or in part, is strictly prohibited without prior written permission
# from BlackVideo.
# */

# YouTube Proxy Server Startup Script for Linux/Mac

echo ""
echo "================================================"
echo "  BlackVideo YouTube Proxy Server"
echo "================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    echo ""
    exit 1
fi

echo "[INFO] Node.js found: $(node --version)"
echo ""

# Navigate to script directory
cd "$(dirname "$0")"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "[INFO] Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "[ERROR] Failed to install dependencies"
        exit 1
    fi
    echo ""
fi

# Start the server
echo "[INFO] Starting YouTube Proxy Server..."
echo "[INFO] Server will run on http://localhost:9292"
echo "[INFO] Press Ctrl+C to stop the server"
echo ""

node youtube-stream-server.js
