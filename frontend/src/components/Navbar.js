// src/components/Navbar.jsx
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
// new
import {
  ShoppingCart,
  Home as HomeIcon,
  Menu as MenuIcon,
  Info,
  Image,
  Phone,
  Truck,
  Clock
} from 'lucide-react';



export const Navbar = () => {
  const { logout, isAuthenticated, isAdmin } = useContext(AuthContext);
  const { count } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);   // Start collapsed
  const [sidebarWidth, setSidebarWidth] = useState(288); // 72 * 4 = 288px
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [clickedItem, setClickedItem] = useState(null);

  useEffect(() => {
    // Expand on hover or when not collapsed
    const shouldExpand = isHovered || !collapsed;
    const width = shouldExpand ? 288 : 80;
    setSidebarWidth(width);
    document.documentElement.style.setProperty("--sidebar-width", `${width}px`);
    setLogoError(false); // Reset logo error when sidebar state changes
  }, [collapsed, isHovered]);

  useEffect(() => {
    // Set active item based on current route
    if (location.pathname === "/tracking") {
      setClickedItem("tracking");
      setActiveItem("tracking");
    } else if (location.pathname === "/orders") {
      setClickedItem("orders");
      setActiveItem("orders");
    } else if (location.pathname === "/about") {
      setClickedItem("about");
      setActiveItem("about");
    } else if (location.pathname === "/gallery") {
      setClickedItem("gallery");
      setActiveItem("gallery");
    } else if (location.pathname === "/contact") {
      setClickedItem("contact");
      setActiveItem("contact");
    } else if (location.pathname === "/") {
      // Check hash for home page sections
      if (window.location.hash === "#menu") {
        setClickedItem("menu");
        setActiveItem("menu");
      } else {
        setClickedItem("hero");
        setActiveItem("hero");
      }
    }
  }, [location.pathname]);

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
        className="hidden md:flex fixed inset-y-0 left-0 z-50 flex-col p-4 transition-all duration-300 ease-out cursor-pointer"
        style={{
          width: sidebarWidth,
          background: '#ffffff',
          boxShadow: 'var(--shadow-md)',
          borderRight: '1px solid rgba(0,0,0,0.05)',
          transition: 'width 260ms ease, box-shadow 260ms ease, background-color 260ms ease'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setCollapsed(true);
        }}
        onClick={() => setCollapsed((prev) => !prev)}
      >
        {/* HEADER: LOGO */}
        <div className={`flex-shrink-0 flex items-center ${!isHovered && collapsed ? 'flex-col justify-center gap-4 py-4' : 'justify-center px-2'} h-24 mb-2 transition-all`}>
          {/* LOGO */}
          <Link to="/" className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
            {logoError ? (
              <span className="text-3xl">🧑‍🍳</span>
            ) : (
              <img
                src="/images/logo-caterhub-removebg-preview.png"
                alt="CaterHub"
                className="max-h-48 object-contain"
                style={{
                  backgroundColor: 'transparent',
                  mixBlendMode: 'normal'
                }}
                onError={() => setLogoError(true)}
              />
            )}
          </Link>
        </div>

        {/* NAV LINKS */}
        <nav className="flex-1 overflow-y-auto space-y-1 mt-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          <button
            onClick={() => {
              setClickedItem("hero");
              setActiveItem("hero");
              goToSection("hero");
            }}
            onMouseEnter={() => setActiveItem("hero")}
            onMouseLeave={() => {
              if (clickedItem !== "hero") {
                setActiveItem(null);
              } else {
                setActiveItem("hero");
              }
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-0"
            style={{
              backgroundColor: 'transparent',
              color: (activeItem === "hero" || clickedItem === "hero") ? '#FC4300' : 'inherit',
              border: 'none',
              outline: 'none',
              boxShadow: 'none'
            }}
          >
            <HomeIcon size={18} />
            {(isHovered || !collapsed) && <span>Home</span>}
          </button>

          <button
            onClick={() => {
              setClickedItem("menu");
              setActiveItem("menu");
              goToSection("menu");
            }}
            onMouseEnter={() => setActiveItem("menu")}
            onMouseLeave={() => {
              if (clickedItem !== "menu") {
                setActiveItem(null);
              } else {
                setActiveItem("menu");
              }
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-0"
            style={{
              backgroundColor: 'transparent',
              color: (activeItem === "menu" || clickedItem === "menu") ? '#FC4300' : 'inherit',
              border: 'none',
              outline: 'none',
              boxShadow: 'none'
            }}
          >
            <MenuIcon size={18} />
            {(isHovered || !collapsed) && <span>Menu</span>}
          </button>

          <button
            onClick={() => {
              setClickedItem("about");
              setActiveItem("about");
              goToSection("about");
            }}
            onMouseEnter={() => setActiveItem("about")}
            onMouseLeave={() => {
              if (clickedItem !== "about") {
                setActiveItem(null);
              } else {
                setActiveItem("about");
              }
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-0"
            style={{
              backgroundColor: 'transparent',
              color: (activeItem === "about" || clickedItem === "about") ? '#FC4300' : 'inherit',
              border: 'none',
              outline: 'none',
              boxShadow: 'none'
            }}
          >
            <Info size={18} />
            {(isHovered || !collapsed) && <span>About</span>}
          </button>
          <button
            onClick={() => {
              setClickedItem("gallery");
              setActiveItem("gallery");
              goToSection("gallery");
            }}
            onMouseEnter={() => setActiveItem("gallery")}
            onMouseLeave={() => {
              if (clickedItem !== "gallery") {
                setActiveItem(null);
              } else {
                setActiveItem("gallery");
              }
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-0"
            style={{
              backgroundColor: 'transparent',
              color: (activeItem === "gallery" || clickedItem === "gallery") ? '#FC4300' : 'inherit',
              border: 'none',
              outline: 'none',
              boxShadow: 'none'
            }}
          >
            <Image size={18} />
            {(isHovered || !collapsed) && <span>Gallery</span>}
          </button>

          <button
            onClick={() => {
              setClickedItem("contact");
              setActiveItem("contact");
              goToSection("contact");
            }}
            onMouseEnter={() => setActiveItem("contact")}
            onMouseLeave={() => {
              if (clickedItem !== "contact") {
                setActiveItem(null);
              } else {
                setActiveItem("contact");
              }
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-0"
            style={{
              backgroundColor: 'transparent',
              color: (activeItem === "contact" || clickedItem === "contact") ? '#FC4300' : 'inherit',
              border: 'none',
              outline: 'none',
              boxShadow: 'none'
            }}
          >
            <Phone size={18} />
            {(isHovered || !collapsed) && <span>Contact</span>}
          </button>

          {/* TRACKING */}
          <Link
            to="/tracking"
            onClick={() => {
              setClickedItem("tracking");
              setActiveItem("tracking");
            }}
            onMouseEnter={() => setActiveItem("tracking")}
            onMouseLeave={() => {
              if (clickedItem !== "tracking" && location.pathname !== "/tracking") {
                setActiveItem(null);
              } else {
                setActiveItem("tracking");
              }
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-0"
            style={{
              backgroundColor: 'transparent',
              color: (activeItem === "tracking" || clickedItem === "tracking" || location.pathname === "/tracking") ? '#FC4300' : 'inherit',
              border: 'none',
              outline: 'none',
              boxShadow: 'none'
            }}
          >
            <Truck size={18} />
            {(isHovered || !collapsed) && <span>Track Order</span>}
          </Link>

          {/* ORDER HISTORY */}
          <Link
            to="/orders"
            onClick={() => {
              setClickedItem("orders");
              setActiveItem("orders");
            }}
            onMouseEnter={() => setActiveItem("orders")}
            onMouseLeave={() => {
              if (clickedItem !== "orders" && location.pathname !== "/orders") {
                setActiveItem(null);
              } else {
                setActiveItem("orders");
              }
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-0"
            style={{
              backgroundColor: 'transparent',
              color: (activeItem === "orders" || clickedItem === "orders" || location.pathname === "/orders") ? '#FC4300' : 'inherit',
              border: 'none',
              outline: 'none',
              boxShadow: 'none'
            }}
          >
            <Clock size={18} />
            {(isHovered || !collapsed) && <span>Order History</span>}
          </Link>




        </nav>

        {(isHovered || !collapsed) && (
          <div className="text-xs mt-4 text-center">
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
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {count > 99 ? '99+' : count}
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
