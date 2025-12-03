// src/App.jsx
import React from 'react';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
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
import { OrderTracking } from './pages/OrderTracking';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminOrders } from './pages/AdminOrders';
import { AdminUsers } from './pages/AdminUsers';
import AdminMenu from './pages/AdminMenu';
import { ScrollToTop } from './components/ScrollToTop';
import './styles/index.css';

function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen" style={{ marginLeft: "var(--sidebar-width)" }}>
        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-center glass py-5 sticky top-0 z-30" style={{ boxShadow: 'var(--shadow-md)' }}>
          <h1 className="text-2xl font-bold gradient-text tracking-wide">Cater Hub</h1>
        </header>

        <main className="flex-1 p-4">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route
              path="/about"
              element={
                <RoleGate allowedRoles={['guest', 'user']}>
                  <MainLayout>
                    <About />
                  </MainLayout>
                </RoleGate>
              }
            />
            <Route
              path="/gallery"
              element={
                <RoleGate allowedRoles={['guest', 'user']}>
                  <MainLayout>
                    <Gallery />
                  </MainLayout>
                </RoleGate>
              }
            />
            <Route
              path="/contact"
              element={
                <RoleGate allowedRoles={['guest', 'user']}>
                  <MainLayout>
                    <Contact />
                  </MainLayout>
                </RoleGate>
              }
            />
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
            <Route
              path="/tracking"
              element={
                <MainLayout>
                  <ProtectedRoute requiredRole="user">
                    <OrderTracking />
                  </ProtectedRoute>
                </MainLayout>
              }
            />
            <Route
              path="/tracking/:orderId"
              element={
                <MainLayout>
                  <ProtectedRoute requiredRole="user">
                    <OrderTracking />
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
