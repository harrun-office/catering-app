import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, ShoppingBag, Users, BarChart3 } from 'lucide-react';

export const AdminSidebar = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/admin' },
    { icon: <ShoppingBag size={18} />, label: 'Orders', path: '/admin/orders' },
    { icon: <BarChart3 size={18} />, label: 'Menu', path: '/admin/menu' },
    { icon: <Users size={18} />, label: 'Users', path: '/admin/users' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-primary-gradient text-white transform transition-transform duration-300 lg:relative lg:translate-x-0`}
        style={{ width: 'min(22rem, 92vw)', transform: isOpen ? 'translateX(0)' : undefined }}
        aria-hidden={!isOpen && window.innerWidth < 1024}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-purple-500 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">🍽️ Admin</h1>
              <p className="text-sm text-purple-200">{user?.first_name}</p>
            </div>
            <button className="lg:hidden p-2" onClick={() => setIsOpen(false)} aria-label="Close sidebar">
              <X size={20} />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2 overflow-auto">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-500 transition"
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span className="truncate">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="m-4 flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500 transition w-[calc(100%-2rem)]"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white shadow-md p-4 flex justify-between items-center lg:justify-end">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-gray-800 hover:text-gray-600"
            aria-label="Toggle sidebar"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-50 p-6">{children}</div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};
