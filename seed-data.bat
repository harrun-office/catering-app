@echo off
REM Seed menu data into CaterHub database

echo.
echo ====================================
echo Loading Sample Menu Data...
echo ====================================
echo.

"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < "d:\Fresher-Tasks\cater\seed-menu-data.sql"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ Sample menu data loaded successfully!
    echo.
    echo Your CaterHub application is now ready with:
    echo - 6 categories
    echo - 20 menu items
    echo.
) else (
    echo.
    echo ✗ Failed to load menu data. Please check your MySQL password.
    echo.
)

pause
