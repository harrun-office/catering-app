// Test if .env is being loaded correctly
require('dotenv').config();

console.log('=== Environment Variables Check ===\n');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***HIDDEN***' : 'MISSING');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('\n===================================');

if (!process.env.DB_HOST || !process.env.DB_PORT || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
    console.log('\n❌ ERROR: Some environment variables are missing!');
    console.log('Make sure your .env file exists in: D:\\Fresher-Tasks\\cater\\backend\\.env');
} else {
    console.log('\n✅ All required environment variables are loaded!');
}
