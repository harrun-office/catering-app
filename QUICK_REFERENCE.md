# 🚀 CaterHub - Quick Reference Guide

## 📍 Project Location
```
d:\Fresher-Tasks\cater\
```

## 🏃 Quick Start (60 seconds)

### Terminal 1: Backend
```bash
cd d:\Fresher-Tasks\cater\backend
npm install
npm run dev
# Server runs on http://localhost:5000
```

### Terminal 2: Database
```bash
# First time only:
mysql -u root -p < d:\Fresher-Tasks\cater\backend\src\utils\database.sql
```

### Terminal 3: Frontend
```bash
cd d:\Fresher-Tasks\cater\frontend
npm install
npm start
# App opens on http://localhost:3000
```

---

## 🔑 Key Files

| File | Purpose |
|------|---------|
| `README.md` | Full documentation |
| `SETUP_GUIDE.md` | Step-by-step setup |
| `FEATURES_CHECKLIST.md` | Complete features list |
| `backend/src/server.js` | Express server entry |
| `frontend/src/App.js` | React app entry |
| `backend/src/utils/database.sql` | Database schema |

---

## 👤 Test Accounts

### User
- **Email**: user@example.com
- **Password**: Demo@123

### Admin
- **Email**: admin@example.com
- **Password**: Demo@123

---

## 🛣️ Main Routes

### User Routes
```
/              - Home page
/login         - Login page
/register      - Registration page
/cart          - Shopping cart
/orders        - My orders
```

### Admin Routes
```
/admin         - Dashboard
/admin/orders  - Order management
/admin/menu    - Menu management
/admin/users   - User management
```

---

## 📡 API Base URL
```
http://localhost:5000/api
```

---

## 🗂️ Folder Structure

```
backend/
├── src/
│   ├── controllers/   (Business logic)
│   ├── routes/        (API endpoints)
│   ├── middleware/    (Auth, validation)
│   ├── models/        (Database)
│   └── utils/         (Helpers)
├── package.json
└── .env

frontend/
├── src/
│   ├── pages/         (Page components)
│   ├── components/    (Reusable UI)
│   ├── context/       (State management)
│   └── utils/         (Helpers)
├── package.json
└── .env.local
```

---

## 🔧 Common Commands

### Backend
```bash
npm install        # Install dependencies
npm run dev        # Start dev server
npm start          # Start production server
npm test           # Run tests
```

### Frontend
```bash
npm install        # Install dependencies
npm start          # Start dev server
npm run build      # Build for production
npm test           # Run tests
```

---

## 🌐 API Endpoints Summary

### Authentication
```
POST   /auth/register
POST   /auth/login
GET    /auth/me
PUT    /auth/profile
```

### Menu
```
GET    /menu
GET    /menu/categories
GET    /menu/:id
POST   /menu           (admin)
PUT    /menu/:id       (admin)
DELETE /menu/:id       (admin)
```

### Orders
```
POST   /orders
GET    /orders
GET    /orders/:id
PUT    /orders/:id/cancel
```

### Admin
```
GET    /admin/dashboard/stats
GET    /admin/orders
PUT    /admin/orders/:id/status
GET    /admin/users
PUT    /admin/users/:id/toggle-status
```

---

## 🎯 Feature Highlights

✅ User authentication (JWT)
✅ Menu browsing & search
✅ Shopping cart
✅ Order placement & tracking
✅ Admin dashboard
✅ Real-time updates
✅ Mobile responsive
✅ Professional UI

---

## ⚙️ Environment Setup

### Backend .env
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=catering_db
PORT=5000
JWT_SECRET=your_secret_key
```

### Frontend .env.local
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| Cannot connect to DB | Check MySQL is running, verify credentials |
| Port already in use | Kill process: `netstat -ano \| findstr :5000` |
| CORS errors | Verify backend is running on port 5000 |
| Module not found | Run `npm install` in that directory |
| Token expired | Log out and log in again |

---

## 🎨 Customization

### Change Colors
Edit `frontend/src/styles/index.css`

### Add Menu Items
1. Log in as admin
2. Add to database via MySQL

### Change App Name
Update `frontend/src/components/Navbar.js`

### Update Database
Edit `backend/src/utils/database.sql`

---

## 📊 Database Tables

| Table | Purpose |
|-------|---------|
| users | User accounts |
| categories | Menu categories |
| menu_items | Food items |
| orders | Customer orders |
| order_items | Order line items |
| reviews | User reviews |
| payments | Payment records |
| coupons | Discount codes |
| admin_logs | Admin actions |

---

## 🔐 Security Features

- JWT token authentication
- Password hashing (bcrypt)
- SQL injection prevention
- Role-based access control
- Protected API routes
- Input validation

---

## 📱 Device Support

- ✅ Desktop browsers
- ✅ Tablets
- ✅ Mobile phones
- ✅ Responsive design

---

## 💾 Database Backup

```bash
# Backup
mysqldump -u root -p catering_db > backup.sql

# Restore
mysql -u root -p catering_db < backup.sql
```

---

## 🔄 Deployment Checklist

- [ ] Update environment variables
- [ ] Configure production database
- [ ] Set secure JWT secret
- [ ] Enable HTTPS
- [ ] Set NODE_ENV=production
- [ ] Build frontend for production
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Test all features
- [ ] Set up monitoring

---

## 📞 Support Resources

1. **Local Docs**: Check README.md
2. **API Docs**: See SETUP_GUIDE.md
3. **Features**: See FEATURES_CHECKLIST.md
4. **Code**: Check inline comments

---

## 🎓 Learning Path

1. Understand project structure
2. Review database schema
3. Explore API endpoints
4. Study authentication flow
5. Check React component structure
6. Understand state management

---

## 📈 Performance Tips

- Enable compression
- Use database indexes
- Cache API responses
- Lazy load images
- Minify production builds
- Use CDN for assets

---

## 🔮 Future Enhancements

- [ ] Payment integration
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Advanced analytics
- [ ] Subscription plans
- [ ] Bulk ordering
- [ ] Rating system
- [ ] Favorites feature

---

## 📄 File Templates

### Add New API Endpoint
1. Create controller function
2. Add route in routes file
3. Test with cURL
4. Update API docs

### Add New React Page
1. Create file in pages/
2. Add route in App.js
3. Add navigation link
4. Test functionality

### Add New Database Table
1. Write SQL in database.sql
2. Create controller method
3. Add API endpoint
4. Update frontend

---

## 💡 Best Practices

- Keep components small
- Use proper error handling
- Validate all inputs
- Document complex logic
- Test before deploying
- Regular database backups
- Monitor error logs
- Update dependencies

---

## 🎉 Success Criteria

✅ Both servers running
✅ Can register/login
✅ Can browse menu
✅ Can place order
✅ Admin can manage orders
✅ No console errors
✅ All features working
✅ Database connected

**If all above are ✅, you're ready to go!**

---

**Last Updated**: November 2024
**Version**: 1.0.0
**Status**: Ready for Production ✅
