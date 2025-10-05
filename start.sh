#!/bin/bash

echo "Starting Restaurant Reservation System..."
echo

echo "Checking if .env file exists..."
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp "env.template" ".env"
    echo "Please edit .env file with your database configuration"
    echo
fi

echo "Installing dependencies..."
npm install

echo "Installing client dependencies..."
cd client
npm install
cd ..

echo
echo "Dependencies installed successfully!"
echo
echo "Next steps:"
echo "1. Edit .env file with your MongoDB connection string"
echo "2. Run: npm run seed (to populate database with sample data)"
echo "3. Run: npm run dev (to start the application)"
echo
echo "Press Enter to continue..."
read
