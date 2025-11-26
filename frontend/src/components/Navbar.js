// src/components/Navbar.jsx
import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, LogOut, Home, Menu as MenuIcon, User, BarChart3 } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useContext(AuthContext);
  const { count } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Navigate to home and scroll to section (id)
  const goToSection = (id) => {
    if (location.pathname !== '/') {
      // go to home first, then set hash a little later so React finishes navigation
      navigate(`/?scrollTo=${id}`);
      // also set hash for direct anchors (helps if user refreshes)
      setTimeout(() => {
        window.location.hash = id;
      }, 120);
    } else {
      // already on home
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else window.location.hash = id;
    }
    setMobileOpen(false);
  };

  return (
    <nav
      className="navbar-custom text-white shadow-lg bg-gradient-to-r from-purple-600 to-blue-600"
      style={{ background: 'linear-gradient(90deg,#6D28D9,#06B6D4)' }}
    >
      <div className="container-main flex items-center justify-between gap-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
          <span>🍽️</span>
          <span>CaterHub</span>
        </Link>

        <button
          className="lg:hidden p-2 rounded-md bg-white/10 hover:bg-white/20"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>

        <div className={`flex-1 lg:flex items-center justify-end gap-6 ${mobileOpen ? 'block' : 'hidden'} lg:block`}>
          <div className="flex items-center gap-4 flex-wrap">
            <button onClick={() => goToSection('hero')} className="hover:opacity-90 transition px-2 py-1 rounded">
              Home
            </button>

            <button onClick={() => goToSection('menu')} className="hover:opacity-90 transition px-2 py-1 rounded">
              Menu
            </button>

            <button onClick={() => goToSection('about')} className="hover:opacity-90 transition px-2 py-1 rounded">
              About
            </button>

            <button onClick={() => goToSection('gallery')} className="hover:opacity-90 transition px-2 py-1 rounded">
              Gallery
            </button>

            <button onClick={() => goToSection('contact')} className="hover:opacity-90 transition px-2 py-1 rounded">
              Contact
            </button>

            {/* Cart - always visible */}
            <Link to="/cart" className="relative hover:opacity-80 transition flex items-center gap-2 px-2 py-1 rounded">
              <ShoppingCart size={20} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="px-2 py-1 rounded hover:opacity-90 transition">
                    <BarChart3 size={18} />
                  </Link>
                )}

                <div className="flex items-center gap-2 px-2 py-1">
                  <User size={16} />
                  <span className="hidden sm:inline">{user?.first_name}</span>
                </div>

                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg flex items-center gap-2 transition text-sm">
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
                  Login
                </Link>
                <Link to="/register" className="border-2 border-white px-4 py-2 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
