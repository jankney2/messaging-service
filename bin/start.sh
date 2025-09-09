#!/bin/bash

set -e


echo "Starting the application..."
echo "Environment: ${ENV:-development}"

# Add your application startup commands here
echo "installing dependencies" 

echo "➡️  Installing dependencies..."
npm install

node ./server.js
echo "Application started successfully!" 