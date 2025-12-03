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
        onClick={() => setIsOpen(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition border border-transparent ${isActive
            ? 'bg-white/15 text-white shadow-lg shadow-purple-900/20 border-white/20'
            : 'text-white/80 hover:bg-white/10 hover:text-white'
          }`}
      >
        <Icon size={18} />
        <span className="truncate">{label}</span>
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[min(22rem,92vw)] transform bg-gradient-to-b from-purple-900 via-purple-800 to-blue-900 text-white shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/70">CaterHub Admin</p>
              <h1 className="text-2xl font-bold">Control Center</h1>
              <p className="text-sm text-white/70 mt-1">Hello, {user?.first_name || 'Admin'}</p>
            </div>
            <button className="rounded-full bg-white/10 p-2" onClick={() => setIsOpen(false)} aria-label="Close sidebar">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">{navItems.map(renderNavLink)}</nav>

          <div className="px-4 pb-6 space-y-2 safe-area-bottom sticky bottom-0 z-20 bg-gradient-to-t from-transparent">
            <Link
              to="/admin/settings"
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-white/80 transition hover:bg-white/10 hover:text-white"
            >
            </Link>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-left font-semibold text-white transition hover:bg-white/20"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex flex-1 flex-col ${isOpen ? 'lg:pl-[22rem]' : ''}`}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur lg:justify-between">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className={`rounded-full border border-slate-200 p-2 text-slate-700 hover:bg-slate-100 ${isOpen ? 'lg:hidden' : ''}`}
            aria-label="Toggle sidebar"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div className="text-left">
            <p className="text-xs uppercase tracking-widest text-slate-400">Admin Panel</p>
            <p className="text-base font-semibold text-slate-700">Hi..! {user?.first_name}</p>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-slate-50 p-6 lg:p-10">{children}</div>
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
