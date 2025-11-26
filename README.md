# 🍽️ CaterHub - Real-time Catering Application

A modern, full-stack catering application built with React, Express, Node.js, and MySQL. Features include user menu browsing, order management, real-time order tracking, admin panel with analytics, and professional UI/UX.

## 🌟 Features

### User Module
- **User Authentication**: Secure login/registration with JWT
- **Menu Browsing**: Browse categories and search menu items
- **Shopping Cart**: Add/remove items, manage quantities
- **Order Management**: Place orders, track status in real-time
- **Order History**: View past orders and details
- **Profile Management**: Update user information
- **Responsive Design**: Works seamlessly on all devices

### Admin Module
- **Dashboard**: Key statistics and metrics
- **Order Management**: View all orders, update status in real-time
- **Menu Management**: Add, edit, delete menu items
- **User Management**: Block/unblock users, view user details
- **Analytics**: Revenue tracking and charts
- **Activity Logging**: Track admin actions

### General Features
- **Real-time Updates**: Socket.io for instant notifications
- **Professional UI/UX**: Built with Tailwind CSS
- **Responsive Design**: Mobile-first approach
- **Payment Integration Ready**: Stripe integration structure
- **Database Security**: MySQL with prepared statements

---

## 🏗️ Project Structure

```
cater/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── menuController.js
│   │   │   ├── orderController.js
│   │   │   └── adminController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── menuRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   └── adminRoutes.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── utils/
│   │   │   ├── validators.js
│   │   │   ├── jwt.js
│   │   │   └── database.sql
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── MenuItem.js
    │   │   ├── Alert.js
    │   │   ├── LoadingSpinner.js
    │   │   ├── Footer.js
    │   │   └── AdminSidebar.js
    │   ├── context/
    │   │   ├── AuthContext.js
    │   │   └── CartContext.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Home.js
    │   │   ├── Cart.js
    │   │   ├── Orders.js
    │   │   ├── AdminDashboard.js
    │   │   ├── AdminOrders.js
    │   │   └── AdminUsers.js
    │   ├── styles/
    │   │   └── index.css
    │   ├── utils/
    │   │   ├── api.js
    │   │   ├── ProtectedRoute.js
    │   │   └── hooks.js
    │   ├── App.js
    │   └── index.js
    ├── .env.local
    └── package.json
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### 1. Database Setup

```bash
# Open MySQL client
mysql -u root -p

# Run the database schema
source backend/src/utils/database.sql

# Verify tables created
SHOW TABLES;
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your database credentials
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=catering_db
# JWT_SECRET=your_secret_key

# Start the server
npm run dev
# Server will run on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local if not exists
# REACT_APP_API_URL=http://localhost:5000/api

# Start the development server
npm start
# App will open on http://localhost:3000
```

---

## 📝 API Documentation

### Authentication Endpoints
```
POST   /api/auth/register         - Register new user
POST   /api/auth/login            - Login user
GET    /api/auth/me               - Get current user (protected)
PUT    /api/auth/profile          - Update profile (protected)
```

### Menu Endpoints
```
GET    /api/menu                  - Get all menu items
GET    /api/menu/categories       - Get categories
GET    /api/menu/:id              - Get menu item by ID
POST   /api/menu                  - Create menu item (admin)
PUT    /api/menu/:id              - Update menu item (admin)
DELETE /api/menu/:id              - Delete menu item (admin)
```

### Order Endpoints
```
POST   /api/orders                - Create order (protected)
GET    /api/orders                - Get user orders (protected)
GET    /api/orders/:id            - Get order details (protected)
PUT    /api/orders/:id/cancel     - Cancel order (protected)
```

### Admin Endpoints
```
GET    /api/admin/dashboard/stats - Dashboard statistics (admin)
GET    /api/admin/orders          - Get all orders (admin)
PUT    /api/admin/orders/:id/status - Update order status (admin)
GET    /api/admin/users           - Get all users (admin)
PUT    /api/admin/users/:id/toggle-status - Block/unblock user (admin)
GET    /api/admin/menu-items      - Get menu items (admin)
GET    /api/admin/analytics/revenue - Revenue analytics (admin)
```

---

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication.

### Token Structure
```json
{
  "id": 1,
  "email": "user@example.com",
  "role": "user|admin",
  "iat": 1234567890,
  "exp": 1235167890
}
```

### Protected Routes
- Prepend token in Authorization header: `Bearer <token>`
- Token stored in localStorage
- Auto-logout on token expiration

---

## 🗄️ Database Schema

### Users Table
- Stores user credentials and profile information
- Supports two roles: 'user' and 'admin'

### Categories Table
- Menu categories (Appetizers, Main Course, Desserts, etc.)

### Menu Items Table
- Detailed menu item information with pricing, availability, dietary info

### Orders Table
- Order details with status tracking
- Supports multiple status: pending, confirmed, preparing, ready, out_for_delivery, delivered, cancelled

### Order Items Table
- Line items for each order with quantity and pricing

### Reviews Table
- User reviews and ratings for menu items

### Payments Table
- Payment transaction details and status

### Coupons Table
- Discount codes with expiry and usage limits

### Admin Logs Table
- Audit trail of admin actions

---

## 🎨 UI/UX Features

### Design Principles
- **Gradient Theme**: Purple to Blue gradient for modern look
- **Responsive Layout**: Mobile-first, works on all screen sizes
- **Smooth Animations**: Fade-in and slide-in effects
- **Intuitive Navigation**: Clear menu structure
- **Accessible Colors**: Good contrast ratios

### Key Components
- Custom card designs with hover effects
- Loading spinners for async operations
- Alert notifications (success, error, warning, info)
- Professional tables with sorting/filtering
- Modal dialogs for confirmations

---

## 🔄 Real-time Features

### Socket.io Integration
- Real-time order status updates
- Live notifications for admins
- Order tracking for users

### Socket Events
```javascript
// Client emits
socket.emit('join-room', { userId, role })

// Server broadcasts
io.to('admin-room').emit('order-update', orderData)
io.to(`user-${userId}`).emit('order-status-changed', status)
```

---

## 💾 Sample Data

### Demo Credentials

**User Account:**
- Email: `user@example.com`
- Password: `Demo@123`

**Admin Account:**
- Email: `admin@example.com`
- Password: `Demo@123`

---

## 🛠️ Troubleshooting

### Database Connection Issues
```
Error: connect ECONNREFUSED
Solution: Ensure MySQL is running and credentials are correct in .env
```

### CORS Errors
```
Solution: Check that frontend and backend URLs match in .env files
```

### Port Already in Use
```bash
# Change port in .env or kill existing process
# For Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## 📦 Dependencies

### Backend
- express: Web framework
- mysql2: Database driver
- jsonwebtoken: JWT authentication
- bcryptjs: Password hashing
- socket.io: Real-time communication
- cors: Cross-origin requests
- dotenv: Environment variables

### Frontend
- react: UI library
- react-router-dom: Routing
- axios: HTTP client
- socket.io-client: Real-time client
- tailwindcss: Styling
- lucide-react: Icons

---

## 🚢 Deployment

### Backend Deployment (Heroku/Railway)
1. Set environment variables
2. Update database connection for cloud MySQL
3. Deploy with git push

### Frontend Deployment (Vercel/Netlify)
1. Build the app: `npm run build`
2. Connect GitHub repository
3. Deploy automatically

---

## 🔮 Future Enhancements

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Advanced analytics and charts
- [ ] Subscription plans
- [ ] Bulk ordering features
- [ ] Rating and review system
- [ ] Favorite items tracking
- [ ] Multiple payment methods
- [ ] Refund management

---

## 📞 Support

For issues or questions:
1. Check troubleshooting section
2. Review API documentation
3. Check browser console for errors
4. Review server logs

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Author

Built with ❤️ for efficient catering management

---

## 🎯 Key Features Summary

✅ User Authentication (JWT)
✅ Menu Management
✅ Shopping Cart
✅ Order Placement & Tracking
✅ Admin Dashboard
✅ Real-time Updates (Socket.io)
✅ Responsive Design
✅ Database Security
✅ Error Handling
✅ Professional UI/UX

---

**Version:** 1.0.0
**Last Updated:** November 2024
"# catering-app" 
