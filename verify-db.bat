@echo off
REM Verification script for CaterHub database

echo Verifying database setup...
echo.

"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p -e "SHOW DATABASES LIKE 'catering_db'; USE catering_db; SHOW TABLES;"

echo.
echo Database verification completed!
echo.
pause
