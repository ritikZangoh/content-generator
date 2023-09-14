#!/bin/bash

# Script for setting up Python project dependencies

echo "Python Project Setup Script"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python is not installed. Please install Python before proceeding."
    exit 1
fi

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js before proceeding."
    exit 1
fi

# Create a virtual environment (if not already created)
if [ ! -d "venv" ]; then
    echo "Creating a virtual environment..."
    python3 -m venv venv
fi

# Activate the virtual environment
echo "Activating the virtual environment..."
source venv/bin/activate

# Upgrade pip
pip3 install --upgrade pip

# Install project dependencies from requirements.txt
cd backend
echo "Installing project dependencies..."
pip3 install -r requirements.txt

cd ..

# Deactivate the virtual environment
deactivate

cd frontend

npm install

cd ..

# Display setup completion message
echo "Setup complete. To activate the virtual environment, run 'source venv/bin/activate', before starting server"
