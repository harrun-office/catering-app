@echo off
REM Interactive MySQL Password Configuration

echo.
echo ====================================
echo CaterHub MySQL Configuration
echo ====================================
echo.

set /p PASSWORD="Enter your MySQL root password: "

echo # Database Configuration > "d:\Fresher-Tasks\cater\backend\.env"
echo DB_HOST=localhost >> "d:\Fresher-Tasks\cater\backend\.env"
echo DB_USER=root >> "d:\Fresher-Tasks\cater\backend\.env"
echo DB_PASSWORD=%PASSWORD% >> "d:\Fresher-Tasks\cater\backend\.env"
echo DB_NAME=catering_db >> "d:\Fresher-Tasks\cater\backend\.env"
echo DB_PORT=3306 >> "d:\Fresher-Tasks\cater\backend\.env"
echo. >> "d:\Fresher-Tasks\cater\backend\.env"
echo # Server Configuration >> "d:\Fresher-Tasks\cater\backend\.env"
echo PORT=5000 >> "d:\Fresher-Tasks\cater\backend\.env"
echo NODE_ENV=development >> "d:\Fresher-Tasks\cater\backend\.env"
echo. >> "d:\Fresher-Tasks\cater\backend\.env"
echo # JWT Configuration >> "d:\Fresher-Tasks\cater\backend\.env"
echo JWT_SECRET=your_jwt_secret_key_here_change_this_in_production >> "d:\Fresher-Tasks\cater\backend\.env"
echo JWT_EXPIRE=7d >> "d:\Fresher-Tasks\cater\backend\.env"
echo. >> "d:\Fresher-Tasks\cater\backend\.env"
echo # Stripe Configuration >> "d:\Fresher-Tasks\cater\backend\.env"
echo STRIPE_SECRET_KEY=your_stripe_secret_key >> "d:\Fresher-Tasks\cater\backend\.env"
echo STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key >> "d:\Fresher-Tasks\cater\backend\.env"
echo. >> "d:\Fresher-Tasks\cater\backend\.env"
echo # Email Configuration (Optional) >> "d:\Fresher-Tasks\cater\backend\.env"
echo SMTP_HOST=smtp.gmail.com >> "d:\Fresher-Tasks\cater\backend\.env"
echo SMTP_PORT=587 >> "d:\Fresher-Tasks\cater\backend\.env"
echo SMTP_USER=your_email@gmail.com >> "d:\Fresher-Tasks\cater\backend\.env"
echo SMTP_PASS=your_app_password >> "d:\Fresher-Tasks\cater\backend\.env"

echo.
echo ✓ Configuration saved to: d:\Fresher-Tasks\cater\backend\.env
echo.
echo The backend server will restart automatically with the new credentials.
echo.
pause
