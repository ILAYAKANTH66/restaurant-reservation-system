@echo off
echo Starting Restaurant Reservation System...
echo.

echo Checking if .env file exists...
if not exist ".env" (
    echo Creating .env file from template...
    copy "env.template" ".env"
    echo Please edit .env file with your database configuration
    echo.
)

echo Installing dependencies...
call npm install

echo Installing client dependencies...
cd client
call npm install
cd ..

echo.
echo Dependencies installed successfully!
echo.
echo Next steps:
echo 1. Edit .env file with your MongoDB connection string
echo 2. Run: npm run seed (to populate database with sample data)
echo 3. Run: npm run dev (to start the application)
echo.
echo Press any key to continue...
pause > nul
