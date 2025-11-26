@echo off
REM Database setup script for CaterHub

echo Setting up MySQL database...

REM Create database and import schema
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < "d:\Fresher-Tasks\cater\backend\src\utils\database.sql"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ Database setup completed successfully!
    echo.
) else (
    echo.
    echo ✗ Database setup failed. Please check your MySQL installation and credentials.
    echo.
)

pause
