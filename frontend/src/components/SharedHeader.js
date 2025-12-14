import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu as MenuIcon, X as CloseIcon } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Menu', to: '#menu' },
  { label: 'About', to: '/about' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact', to: '/contact' },
  { label: 'Order History', to: '/orders' },
  { label: 'Order Tracking', to: '/tracking' },
];

export const SharedHeader = ({ isAuthenticated, user, onLogout }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [iconAnimating, setIconAnimating] = useState(false);

  useEffect(() => {
    // Show header on based on scroll position for ALL pages
    const handleScroll = () => {
      setShowHeader(window.scrollY > 10);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  return (
    <>
      {/* Persistent menu toggle (always visible) */}
      <button
        onClick={() => {
          setIconAnimating(true);
          setTimeout(() => {
            setMenuOpen(true);
            setIconAnimating(false);
          }, 300);
        }}
        aria-label="Open menu"
        className={`fixed top-4 right-4 z-40 h-11 w-11 rounded-full bg-white shadow-md border border-[#FF6A28] flex items-center justify-center hover:shadow-lg focus:outline-none focus:ring-0 transition-all duration-300 ${iconAnimating ? 'scale-90 rotate-90' : 'hover:-translate-y-0.5'
          }`}
      >
        <MenuIcon
          size={22}
          className={`text-[#FF6A28] transition-transform duration-300 ${iconAnimating ? 'rotate-180 scale-110' : ''
            }`}
        />
      </button>

      {/* Header that appears on scroll */}
      <header
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${showHeader
          ? 'bg-white/95 text-gray-900 backdrop-blur border-b border-primary-200/40 shadow-sm translate-y-0 opacity-100 pointer-events-auto'
          : '-translate-y-full opacity-0 pointer-events-none'
          }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center md:justify-between px-4 py-4">
          <Link
            to="/"
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-3 px-2 py-1 rounded-xl bg-white/80 backdrop-blur hover:bg-white shadow-md border border-[#FF6A28] transition cursor-pointer"
          >
            <img
              src="/images/cater-chef-logo.png"
              alt="Cater Hub"
              className="h-10 w-auto sm:h-11 object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.25)]"
            />
            <span className="text-lg font-semibold tracking-[0.18em] uppercase text-[#FF6A28]">
              Cater Hub
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm font-semibold text-gray-800" style={{ color: 'oklch(0.25 0.012 260)' }}>
                  {user?.first_name || 'User'}
                </span>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-light rounded-lg shadow-md hover:shadow-lg hover:from-primary-light hover:to-primary transition-all"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center animate-menuFadeIn"
          style={{
            animation: 'menuFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <style>{`
            @keyframes menuFadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes menuItemSlideIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .menu-item {
              animation: menuItemSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              opacity: 0;
            }
          `}</style>

          <button
            onClick={() => setMenuOpen(false)}
            className="absolute right-8 top-8 text-white/80 hover:text-white transition-colors p-2"
            aria-label="Close menu"
          >
            <CloseIcon size={32} strokeWidth={1} />
          </button>

          <nav className="flex flex-col items-center w-full max-w-2xl px-4">
            <div className="flex flex-col items-center gap-6 sm:gap-8 w-full mb-8">
              {NAV_LINKS.map((link, index) => {
                const delay = index * 0.05;
                const baseClasses = "menu-item text-white hover:text-[#FF6A28] transition-colors duration-300 text-lg sm:text-xl uppercase tracking-[0.15em] font-medium";

                if (link.to.startsWith('#')) {
                  return (
                    <button
                      key={link.label}
                      className={baseClasses}
                      style={{ animationDelay: `${delay}s` }}
                      onClick={() => {
                        setMenuOpen(false);
                        if (location.pathname !== '/') {
                          window.location.href = `/${link.to}`;
                        } else {
                          setTimeout(() => {
                            const target = document.querySelector(link.to);
                            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }, 100);
                        }
                      }}
                    >
                      {link.label}
                    </button>
                  );
                } else if (link.to === '/') {
                  return (
                    <button
                      key={link.label}
                      className={baseClasses}
                      style={{ animationDelay: `${delay}s` }}
                      onClick={() => {
                        setMenuOpen(false);
                        if (location.pathname === '/') {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        } else {
                          window.location.href = '/';
                        }
                      }}
                    >
                      {link.label}
                    </button>
                  );
                } else {
                  return (
                    <Link
                      key={link.label}
                      to={link.to}
                      onClick={() => setMenuOpen(false)}
                      className={baseClasses}
                      style={{ animationDelay: `${delay}s` }}
                    >
                      {link.label}
                      {link.label === 'About' && <span className="ml-1 text-[#FF6A28]/70">›</span>}
                    </Link>
                  );
                }
              })}
            </div>

            {/* Profile and Auth Controls in Menu */}
            <div className="flex flex-col items-center gap-4 w-full">
              {isAuthenticated ? (
                <>
                  <div className="menu-item pt-4 border-t border-white/20 w-full text-center" style={{ animationDelay: `${NAV_LINKS.length * 0.05}s` }}>
                    <span className="text-white/80 text-sm uppercase tracking-wider">
                      {user?.first_name || 'User'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onLogout();
                    }}
                    className="menu-item text-red-400 hover:text-red-300 transition-colors duration-300 text-sm sm:text-base uppercase tracking-[0.2em] font-medium"
                    style={{ animationDelay: `${(NAV_LINKS.length + 1) * 0.05}s` }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="menu-item text-white hover:text-[#FF6A28] transition-colors duration-300 text-sm sm:text-base uppercase tracking-[0.2em] font-medium mt-4 pt-4 border-t border-white/20"
                    style={{ animationDelay: `${NAV_LINKS.length * 0.05}s` }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="menu-item text-white hover:text-[#FF6A28] transition-colors duration-300 text-sm sm:text-base uppercase tracking-[0.2em] font-medium"
                    style={{ animationDelay: `${(NAV_LINKS.length + 1) * 0.05}s` }}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

