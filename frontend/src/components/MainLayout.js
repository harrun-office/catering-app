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
                <header className="hidden md:flex items-center justify-between glass py-4 px-8 sticky top-0 z-30" style={{ boxShadow: 'var(--shadow-md)' }}>
                    <h1 className="text-2xl font-bold gradient-text tracking-wide">Cater Hub</h1>

                    <div className="flex items-center gap-6">
                        {/* CART */}
                        <Link
                            to="/cart"
                            className="relative text-gray-700 hover:text-purple-600 transition-colors"
                        >
                            <ShoppingCart size={24} />
                            {count > 0 && (
                                <span className="absolute -top-2 -right-2 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-scale-in" style={{ background: 'var(--color-accent)', boxShadow: 'var(--shadow-md)' }}>
                                    {count}
                                </span>
                            )}
                        </Link>

                        {/* AUTH */}
                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                {isAdmin && (
                                    <Link
                                        to="/admin"
                                        className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors"
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
                                    className="text-purple-700 font-semibold hover:underline"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
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
