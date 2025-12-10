import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, User, BarChart3 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import Navbar from './Navbar';
import { Footer } from './Footer';

export const MainLayout = ({ children }) => {
    const { user, logout, isAuthenticated, isAdmin } = useContext(AuthContext);
    const { count } = useContext(CartContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <Navbar />
            <div className="flex flex-col min-h-screen" style={{ marginLeft: "var(--sidebar-width)" }}>
                {/* Desktop Header */}
                <header
                    className="hidden md:flex items-center justify-between py-4 px-8 sticky top-0 z-30 bg-white"
                    style={{ boxShadow: 'var(--shadow-md)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}
                >
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FF6A28] to-[#ff8a4c] bg-clip-text text-transparent tracking-wide">Cater Hub</h1>

                    <div className="flex items-center gap-6">
                        {/* CART */}
                        <Link
                            to="/cart"
                            className="relative text-gray-700 hover:text-[#FF6A28] transition-colors"
                        >
                            <ShoppingCart size={24} />
                            {count > 0 && (
                                <span className="absolute -top-1 -right-1 text-white text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 animate-scale-in" style={{ background: 'var(--color-accent)', boxShadow: 'var(--shadow-md)' }}>
                                    {count > 99 ? '99+' : count}
                                </span>
                            )}
                        </Link>

                        {/* AUTH */}
                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                {isAdmin && (
                                    <Link
                                        to="/admin"
                                        className="flex items-center gap-2 text-gray-700 hover:text-[#FF6A28] transition-colors"
                                        title="Admin Dashboard"
                                    >
                                        <BarChart3 size={24} />
                                    </Link>
                                )}

                                <div className="flex items-center gap-2 text-gray-700 font-medium">
                                    <User size={24} />
                                    <span>{user?.first_name}</span>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="text-red-500 hover:text-red-600 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut size={24} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    to="/login"
                                    className="text-[#FF6A28] font-semibold hover:underline"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-[#FF6A28] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#E85A1F] transition-all shadow-md hover:shadow-lg"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </header>

                <main className="flex-1 p-4">
                    {children}
                </main>
                <Footer />
            </div>
        </>
    );
};
