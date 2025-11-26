# CaterHub Quick Start Guide

## Step-by-Step Setup Instructions

### Step 1: Clone/Download the Project
```bash
# Navigate to the project directory
cd cater
```

### Step 2: Setup MySQL Database

**Option A: Using MySQL Command Line**
```bash
# Open MySQL
mysql -u root -p

# Execute the SQL file
source backend/src/utils/database.sql

# Verify
SHOW TABLES;
```

**Option B: Using MySQL Workbench**
1. Open MySQL Workbench
2. File → Run SQL Script
3. Select `backend/src/utils/database.sql`
4. Execute

### Step 3: Configure Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
# Copy content from .env.example to .env
cat > .env << EOF
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=catering_db
DB_PORT=3306
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
JWT_EXPIRE=7d
EOF

# Start backend server
npm run dev
# Should see: Server running on port 5000
```

### Step 4: Configure Frontend

```bash
# Navigate to frontend (in new terminal)
cd frontend

# Install dependencies
npm install

# Create .env.local (usually auto-created, but ensure it has)
cat > .env.local << EOF
REACT_APP_API_URL=http://localhost:5000/api
EOF

# Start frontend
npm start
# Browser will open http://localhost:3000
```

---

## 🧪 Testing the Application

### Test User Login
1. Go to http://localhost:3000
2. Click "Login"
3. Enter credentials:
   - Email: `user@example.com`
   - Password: `Demo@123`

### Test Admin Login
1. Go to http://localhost:3000
2. Click "Login"
3. Enter credentials:
   - Email: `admin@example.com`
   - Password: `Demo@123`
4. You'll be redirected to `/admin` dashboard

### Test User Features
- Browse menu items
- Filter by category
- Search dishes
- Add items to cart
- Place order
- View orders

### Test Admin Features
- View dashboard statistics
- Manage orders (update status)
- Manage users (block/unblock)
- View analytics

---

## 📊 Database Queries for Testing

```sql
-- View all users
SELECT * FROM users;

-- View all orders
SELECT o.*, u.email FROM orders o JOIN users u ON o.user_id = u.id;

-- View menu items
SELECT * FROM menu_items;

-- View categories
SELECT * FROM categories;

-- Check admin logs
SELECT * FROM admin_logs;
```

---

## 🔧 Environment Variables

### Backend (.env)
```env
# Database
DB_HOST=localhost          # MySQL host
DB_USER=root              # MySQL user
DB_PASSWORD=password      # MySQL password
DB_NAME=catering_db       # Database name
DB_PORT=3306              # MySQL port

# Server
PORT=5000                 # Express server port
NODE_ENV=development      # Environment

# JWT
JWT_SECRET=your_key       # JWT secret key
JWT_EXPIRE=7d             # Token expiry

# Payment (Optional)
STRIPE_SECRET_KEY=sk_...  # Stripe secret
STRIPE_PUBLISHABLE_KEY=pk_...

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=app_password
```

### Frontend (.env.local)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🚨 Common Issues & Solutions

### Issue: "Cannot connect to database"
```
Solution:
1. Verify MySQL is running
2. Check credentials in .env
3. Ensure database exists: SHOW DATABASES;
4. Restart MySQL service
```

### Issue: "Port 5000 already in use"
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Issue: CORS errors in browser console
```
Solution:
1. Verify backend is running on port 5000
2. Check REACT_APP_API_URL in .env.local
3. Restart frontend: npm start
```

### Issue: "Invalid token" error
```
Solution:
1. Clear browser localStorage
2. Log out and log in again
3. Check JWT_SECRET matches between sessions
```

### Issue: Menu items not loading
```sql
Solution: Ensure categories exist
INSERT INTO categories (name, description) VALUES 
('Appetizers', 'Delicious starters'),
('Main Course', 'Hearty mains'),
('Desserts', 'Sweet treats'),
('Beverages', 'Refreshing drinks');
```

---

## 📱 API Testing with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name":"John",
    "last_name":"Doe",
    "email":"john@example.com",
    "password":"Test@1234",
    "phone":"+91234567890"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "password":"Demo@123"
  }'
```

### Get Menu Items
```bash
curl http://localhost:5000/api/menu?page=1&limit=12
```

### Create Order (requires token)
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "items":[
      {"menu_item_id":1,"quantity":2}
    ],
    "delivery_date":"2024-12-25",
    "delivery_time":"18:00",
    "delivery_address":"123 Main St, City"
  }'
```

---

## 🎯 Next Steps After Setup

1. **Add Menu Items**
   - Log in as admin
   - Go to Menu Management
   - Add your dishes with prices, descriptions, images

2. **Create Categories**
   - Add in database: INSERT INTO categories...
   - Refresh page to see them

3. **Customize Branding**
   - Update app name in Navbar.js
   - Change colors in Tailwind config
   - Add your logo

4. **Configure Payment**
   - Get Stripe keys from stripe.com
   - Add to backend .env
   - Implement payment endpoint

5. **Deploy**
   - Deploy backend to Heroku/Railway
   - Deploy frontend to Vercel/Netlify
   - Update API URL in frontend .env

---

## 📞 Getting Help

1. **Check logs**
   - Backend: Terminal output
   - Frontend: Browser DevTools Console
   - Database: MySQL logs

2. **Review documentation**
   - README.md for full features
   - Database schema comments
   - API endpoint descriptions

3. **Debug mode**
   - Set NODE_ENV=development
   - Check network tab in DevTools
   - Review server error responses

---

**Happy Coding! 🎉**
