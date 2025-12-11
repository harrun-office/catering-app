import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, User, BarChart3, CheckCircle, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import Navbar from './Navbar';
import { Footer } from './Footer';

export const MainLayout = ({ children }) => {
    const { user, logout, isAuthenticated, isAdmin, updateProfile } = useContext(AuthContext);
    const { count } = useContext(CartContext);
    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = useState(false);
    const [profileSaving, setProfileSaving] = useState(false);
    const [profileMsg, setProfileMsg] = useState(null); // {type:'success'|'error', text:string}
    const [profileForm, setProfileForm] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        phone: user?.phone || '',
    });

    useEffect(() => {
        setProfileForm({
            first_name: user?.first_name || '',
            last_name: user?.last_name || '',
            phone: user?.phone || '',
        });
    }, [user]);

    const initials = useMemo(() => {
        const first = user?.first_name?.[0] || '';
        const last = user?.last_name?.[0] || '';
        return (first + last || 'U').toUpperCase();
    }, [user]);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleProfileSave = async () => {
        setProfileSaving(true);
        setProfileMsg(null);
        try {
            const result = await updateProfile(profileForm);
            if (result?.success) {
                setProfileMsg({ type: 'success', text: 'Profile updated' });
            } else {
                setProfileMsg({ type: 'error', text: result?.error || 'Update failed' });
            }
        } catch (err) {
            setProfileMsg({ type: 'error', text: 'Update failed' });
        } finally {
            setProfileSaving(false);
        }
    };

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
                    className="hidden md:flex items-center justify-between py-4 px-6 lg:px-8 sticky top-0 z-30 bg-white"
                    style={{ boxShadow: 'var(--shadow-md)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}
                >
                    <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-[#FF6A28] to-[#ff8a4c] bg-clip-text text-transparent tracking-wide hover:opacity-80 transition-opacity cursor-pointer">
                        Cater Hub
                    </Link>

                    <div className="flex items-center gap-4 lg:gap-6 relative">
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

                                <div className="relative">
                                    <button
                                        onClick={() => setProfileOpen((o) => !o)}
                                        className="flex items-center gap-2 text-gray-700 font-semibold hover:text-[#FF6A28] transition-colors"
                                    >
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#FF6A28] to-[#FF8B4A] text-white flex items-center justify-center font-bold shadow-md">
                                            {initials}
                                        </div>
                                        <span className="hidden lg:inline">{user?.first_name}</span>
                                    </button>

                                    {profileOpen && (
                                        <div className="absolute right-0 mt-3 w-[280px] max-w-[80vw] bg-white rounded-2xl border border-orange-100 shadow-xl p-4 z-40">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#FF6A28] to-[#FF8B4A] text-white flex items-center justify-center font-bold shadow">
                                                    {initials}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-[#301b16]">{user?.first_name} {user?.last_name}</p>
                                                    <p className="text-xs text-[#7b5a4a]">{user?.email}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-2 mb-2">
                                                <div className="space-y-1">
                                                    <label className="text-xs font-semibold text-[#7b5a4a]">First name</label>
                                                    <input
                                                        name="first_name"
                                                        value={profileForm.first_name}
                                                        onChange={handleProfileChange}
                                                        className="w-full rounded-lg border border-orange-100 px-3 py-2 text-sm text-[#301b16] focus:border-[#FF6A28] focus:ring-2 focus:ring-[#FF6A28]/20"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-semibold text-[#7b5a4a]">Last name</label>
                                                    <input
                                                        name="last_name"
                                                        value={profileForm.last_name}
                                                        onChange={handleProfileChange}
                                                        className="w-full rounded-lg border border-orange-100 px-3 py-2 text-sm text-[#301b16] focus:border-[#FF6A28] focus:ring-2 focus:ring-[#FF6A28]/20"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-semibold text-[#7b5a4a]">Phone</label>
                                                    <input
                                                        name="phone"
                                                        value={profileForm.phone}
                                                        onChange={handleProfileChange}
                                                        className="w-full rounded-lg border border-orange-100 px-3 py-2 text-sm text-[#301b16] focus:border-[#FF6A28] focus:ring-2 focus:ring-[#FF6A28]/20"
                                                    />
                                                </div>
                                            </div>

                                            {profileMsg && (
                                                <div
                                                    className={`flex items-center gap-2 text-xs font-semibold px-2 py-1.5 rounded-lg ${
                                                        profileMsg.type === 'success'
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                            : 'bg-red-50 text-red-600 border border-red-100'
                                                    }`}
                                                >
                                                    {profileMsg.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                                                    <span>{profileMsg.text}</span>
                                                </div>
                                            )}

                                            <div className="flex justify-between items-center mt-3">
                                                <button
                                                    onClick={handleProfileSave}
                                                    disabled={profileSaving}
                                                    className="px-3 py-2 rounded-lg bg-[#FF6A28] text-white text-sm font-semibold hover:bg-[#E85A1F] disabled:opacity-60"
                                                >
                                                    {profileSaving ? 'Saving...' : 'Save changes'}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setProfileOpen(false);
                                                        setProfileMsg(null);
                                                        setProfileForm({
                                                            first_name: user?.first_name || '',
                                                            last_name: user?.last_name || '',
                                                            phone: user?.phone || '',
                                                        });
                                                    }}
                                                    className="text-sm text-[#7b5a4a] hover:text-[#301b16]"
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        </div>
                                    )}
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
