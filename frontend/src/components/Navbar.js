// src/components/Navbar.jsx
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
// new
import {
  ShoppingCart,
  LogOut,
  User,
  BarChart3,
  Home as HomeIcon,
  Menu as MenuIcon,
  ChevronLeft,
  ChevronRight,
  Info,
  Image,

  Phone,
  Truck,
  Clock
} from 'lucide-react';



export const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useContext(AuthContext);
  const { count } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);   // NEW
  const [sidebarWidth, setSidebarWidth] = useState(288); // 72 * 4 = 288px
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const width = collapsed ? 80 : 288;
    setSidebarWidth(width);
    document.documentElement.style.setProperty("--sidebar-width", `${width}px`);
    setLogoError(false); // Reset logo error when sidebar state changes
  }, [collapsed]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // inside src/components/Navbar.jsx, replace the existing goToSection function with this:

  const goToSection = (id) => {
    // pages that now have their own routes
    const pageRoutes = ['about', 'gallery', 'contact'];

    if (pageRoutes.includes(id)) {
      // navigate to dedicated page
      navigate(`/${id}`);
      setMobileOpen(false);
      return;
    }

    // fall back to scrolling on home for hero/menu
    if (location.pathname !== '/') {
      navigate(`/?scrollTo=${id}`);
      // small timeout to allow Home to mount and handle the scroll param
      setTimeout(() => {
        // keep old behavior of setting hash if needed
        window.location.hash = id;
      }, 120);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else window.location.hash = id;
    }
    setMobileOpen(false);
  };


  return (
    <>
      {/* SIDEBAR (desktop) */}
      <aside
        className="hidden md:flex fixed inset-y-0 left-0 z-50 flex-col glass-strong text-gray-800 p-4 transition-all duration-300"
        style={{
          width: sidebarWidth,
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
          boxShadow: 'var(--shadow-xl)'
        }}
      >
        {/* HEADER: LOGO + TOGGLE */}
        <div className={`flex-shrink-0 flex items-center ${collapsed ? 'flex-col justify-center gap-4 py-4' : 'justify-between px-2'} h-24 mb-2 transition-all`}>
          {/* LOGO */}
          <div className="flex items-center justify-center">
            {logoError ? (
              <span className="text-3xl">🧑‍🍳</span>
            ) : (
              <img
                src={collapsed ? "/images/logo-small.svg" : "/images/logo.svg"}
                alt="CaterHub"
                className="max-h-12 object-contain"
                onError={() => setLogoError(true)}
              />
            )}
          </div>

          {/* COLLAPSE BUTTON */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition ${collapsed ? '' : ''}`}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {!collapsed && (
          <div className="text-center text-sm font-semibold tracking-wide mb-4">
            CaterHub
          </div>
        )}

        {/* NAV LINKS */}
        <nav className="flex-1 overflow-y-auto space-y-1 mt-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          <button
            onClick={() => goToSection("hero")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:glass transition-all duration-300 hover:scale-105 hover:shadow-md text-gray-800"
          >
            <HomeIcon size={18} />
            {!collapsed && <span>Home</span>}
          </button>

          <button
            onClick={() => goToSection("menu")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:glass transition-all duration-300 hover:scale-105 hover:shadow-md text-gray-800"
          >
            <MenuIcon size={18} />
            {!collapsed && <span>Menu</span>}
          </button>

          <button
            onClick={() => goToSection("about")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:glass transition-all duration-300 hover:scale-105 hover:shadow-md text-gray-800"
          >
            <Info size={18} />
            {!collapsed && <span>About</span>}
          </button>
          <button
            onClick={() => goToSection("gallery")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:glass transition-all duration-300 hover:scale-105 hover:shadow-md text-gray-800"
          >
            <Image size={18} />
            {!collapsed && <span>Gallery</span>}
          </button>

          <button
            onClick={() => goToSection("contact")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:glass transition-all duration-300 hover:scale-105 hover:shadow-md text-gray-800"
          >
            <Phone size={18} />
            {!collapsed && <span>Contact</span>}
          </button>

          {/* TRACKING */}
          <Link
            to="/tracking"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:glass transition-all duration-300 hover:scale-105 hover:shadow-md text-gray-800"
          >
            <Truck size={18} />
            {!collapsed && <span>Track Order</span>}
          </Link>

          {/* ORDER HISTORY */}
          <Link
            to="/orders"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:glass transition-all duration-300 hover:scale-105 hover:shadow-md text-gray-800"
          >
            <Clock size={18} />
            {!collapsed && <span>Order History</span>}
          </Link>

          {/* CART */}
          <Link
            to="/cart"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:glass transition-all duration-300 hover:scale-105 hover:shadow-md text-gray-800 relative"
          >
            <ShoppingCart size={18} />
            {!collapsed && <span>Cart</span>}
            {count > 0 && (
              <span className="absolute right-3 -top-2 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-scale-in" style={{ background: 'var(--color-accent)', boxShadow: 'var(--shadow-md)' }}>
                {count}
              </span>
            )}
          </Link>

          {/* AUTH */}
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition"
                >
                  <BarChart3 size={18} />
                  {!collapsed && <span>Admin</span>}
                </Link>
              )}

              <div className="w-full flex items-center gap-3 px-3 py-2">
                <User size={18} />
                {!collapsed && <span>{user?.first_name}</span>}
              </div>

              <button
                onClick={handleLogout}
                className="w-full mt-2 bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold"
              >
                <LogOut size={18} />
                {!collapsed && <span>Logout</span>}
              </button>
            </>
          ) : (
            !collapsed && (
              <div className="space-y-2 mt-2">
                <Link
                  to="/login"
                  className="block text-center bg-white text-purple-700 px-3 py-2 rounded-lg font-semibold"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block text-center border border-white px-3 py-2 rounded-lg font-semibold"
                >
                  Register
                </Link>
              </div>
            )
          )}
        </nav>

        {!collapsed && (
          <div className="text-xs text-white/60 mt-4 text-center">
            © {new Date().getFullYear()} CaterHub
          </div>
        )}
      </aside>

      {/* MOBILE NAV (unchanged) */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md">
        <div className="container-main flex items-center justify-between py-3 relative">
          <button
            onClick={() => setMobileOpen((s) => !s)}
            className="p-2 rounded-md bg-white/10 z-10"
          >
            <MenuIcon size={18} />
          </button>

          <Link to="/" className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 text-lg font-bold">
            <span>🧑‍�</span>
            <span>Cater Hub</span>
          </Link>

          <Link to="/cart" className="relative z-10">
            <ShoppingCart size={20} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        </div>

        {mobileOpen && (
          <div className="bg-white/5 backdrop-blur-sm p-3 space-y-2">
            <button onClick={() => goToSection("hero")} className="block w-full text-left px-3 py-2 rounded-lg">Home</button>
            <button onClick={() => goToSection("menu")} className="block w-full text-left px-3 py-2 rounded-lg">Menu</button>
            <button onClick={() => goToSection("about")} className="block w-full text-left px-3 py-2 rounded-lg">About</button>
            <button onClick={() => goToSection("gallery")} className="block w-full text-left px-3 py-2 rounded-lg">Gallery</button>
            <button onClick={() => goToSection("contact")} className="block w-full text-left px-3 py-2 rounded-lg">Contact</button>

            {isAuthenticated ? (
              <>
                {isAdmin && <Link to="/admin" className="block px-3 py-2 rounded-lg">Admin</Link>}
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-lg">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-lg">Login</Link>
                <Link to="/register" className="block px-3 py-2 rounded-lg">Register</Link>
              </>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
