// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProtectedRoute } from './utils/ProtectedRoute';
import { RoleGate } from './utils/RoleGate';
import Navbar from './components/Navbar';
import { Footer } from './components/Footer';
import { AdminSidebar } from './components/AdminSidebar';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import Home from './pages/Home';
import Cart from './pages/Cart';
import { Orders } from './pages/Orders';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminOrders } from './pages/AdminOrders';
import { AdminUsers } from './pages/AdminUsers';
import AdminMenu from './pages/AdminMenu';
import './styles/index.css';

function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-[60vh] p-4">{children}</main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Public / User */}
            <Route
              path="/"
              element={
                <RoleGate allowedRoles={['guest', 'user']}>
                  <MainLayout>
                    <Home />
                  </MainLayout>
                </RoleGate>
              }
            />
            <Route
              path="/cart"
              element={
                <RoleGate allowedRoles={['guest', 'user']}>
                  <MainLayout>
                    <Cart />
                  </MainLayout>
                </RoleGate>
              }
            />
            <Route
              path="/orders"
              element={
                <MainLayout>
                  <ProtectedRoute requiredRole="user">
                    <Orders />
                  </ProtectedRoute>
                </MainLayout>
              }
            />

            {/* Admin */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminSidebar>
                    <Routes>
                      <Route path="/" element={<AdminDashboard />} />
                      <Route path="orders" element={<AdminOrders />} />
                      <Route path="menu" element={<AdminMenu />} />
                      <Route path="users" element={<AdminUsers />} />
                    </Routes>
                  </AdminSidebar>
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
