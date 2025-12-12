import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, ShoppingBag, Users, BarChart3 } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
  { icon: BarChart3, label: 'Menu', path: '/admin/menu' },
  { icon: Users, label: 'Users', path: '/admin/users' },
];

export const AdminSidebar = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  // default open on larger screens; controlled to allow closing on all sizes
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderNavLink = ({ icon: Icon, label, path }) => {
    // For dashboard ('/admin') we only want exact match; for others allow prefix matches
    const isActive =
      path === '/admin'
        ? location.pathname === '/admin'
        : location.pathname === path || location.pathname.startsWith(`${path}/`);
    return (
      <Link
        key={path}
        to={path}
        onClick={() => {
          // Only close sidebar on mobile screens
          if (window.innerWidth < 1024) {
            setIsOpen(false);
          }
        }}
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition border ${isActive
            ? 'bg-gradient-to-r from-[#FF6A28] to-[#FF8B4A] text-white shadow-lg shadow-orange-200 border-transparent'
            : 'text-gray-700 hover:bg-orange-50 hover:text-[#FF6A28] border-transparent'
          }`}
      >
        <Icon size={18} />
        <span className="truncate">{label}</span>
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#F7F7F7]">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[min(22rem,92vw)] transform bg-white border-r border-orange-100 shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex h-full flex-col">
          <div className="relative flex items-center justify-center border-b border-orange-100 px-6 py-6 bg-gradient-to-r from-orange-50 to-white">
            <Link 
              to="/" 
              onClick={(e) => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center justify-center"
            >
              <img
                src="/images/cater-chef-logo.png"
                alt="CaterHub"
                className="h-32 w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity"
                style={{
                  backgroundColor: 'transparent',
                  mixBlendMode: 'normal'
                }}
              />
            </Link>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-orange-50 text-gray-600 hover:bg-orange-100 p-2 transition-colors"
              onClick={() => setIsOpen(false)}
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">{navItems.map(renderNavLink)}</nav>

          <div className="px-4 pb-6 space-y-2 safe-area-bottom sticky bottom-0 z-20 bg-gradient-to-t from-transparent">
            <Link
              to="/admin/settings"
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-gray-700 transition hover:bg-orange-50 hover:text-[#FF6A28]"
            >
            </Link>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-2xl bg-orange-50 px-4 py-3 text-left font-semibold text-[#FF6A28] transition hover:bg-orange-100 border border-orange-200"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
        <div className={`flex flex-1 flex-col transition-all duration-300 ${isOpen ? 'lg:pl-[22rem]' : ''}`}>
        <div className="sticky top-0 z-10 flex items-center border-b border-orange-200 bg-white/95 backdrop-blur-sm shadow-sm">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className={`rounded-full border border-orange-200 p-2 text-[#FF6A28] hover:bg-orange-50 transition-all ml-4 ${isOpen ? 'lg:hidden' : ''}`}
            aria-label="Toggle sidebar"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div className="text-left px-6 py-5 flex-1" style={{ minWidth: 0 }}>
            <p className="text-xs uppercase tracking-[0.3em] font-bold bg-gradient-to-r from-[#FF6A28] to-[#FF8B4A] bg-clip-text text-transparent mb-1">
              Admin Panel
            </p>
            <p className="text-lg font-bold text-gray-800">
              Hi, <span className="bg-gradient-to-r from-[#FF6A28] to-[#FF8B4A] bg-clip-text text-transparent">{user?.first_name || 'Admin'}</span>!
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-[#F7F7F7] p-6 lg:p-10">{children}</div>
      </div>

      {isOpen && (
        <button
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-label="Close menu overlay"
        />
      )}
    </div>
  );
};
