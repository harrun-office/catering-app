import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, User, BarChart3, CheckCircle, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { SharedHeader } from './SharedHeader';
import { Footer } from './Footer';
import CateringInvitationPopup from './CateringInvitationPopup';

export const MainLayout = ({ children }) => {
    const { user, logout, isAuthenticated, isAdmin, updateProfile } = useContext(AuthContext);
    const { count, items } = useContext(CartContext);
    const navigate = useNavigate();
    const location = useLocation();
    const isHome = location.pathname === '/';
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
            {/* Shared header with menu and scroll behavior */}
            <SharedHeader 
                isAuthenticated={isAuthenticated} 
                user={user} 
                onLogout={handleLogout}
            />

            {/* Floating cart button (bottom-right) */}
                        <Link
                            to="/cart"
                aria-label="Go to cart"
                className="fixed bottom-5 right-4 z-40 h-12 w-12 rounded-full bg-white shadow-lg border border-orange-100 flex items-center justify-center ring-2 ring-orange-100/50 hover:ring-[#FF6A28]/60 hover:-translate-y-0.5 transition"
                        >
                <ShoppingCart size={22} className="text-[#FF6A28]" />
                            {count > 0 && (
                    <span className="absolute -top-1 -right-1 text-white text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 bg-[#FF6A28] shadow-md">
                                    {count > 99 ? '99+' : count}
                                </span>
                            )}
                        </Link>

            <div className="flex flex-col min-h-screen transition-all duration-300 overflow-x-hidden">
                <main className={`flex-1 ${isHome ? 'p-0' : 'px-4 pb-4 pt-0 md:pt-3'}`}>
                    {children}
                </main>
                <Footer />
            </div>

            {/* Catering Invitation Popup - Shows only on home page when user logs in with empty cart */}
            {isHome && isAuthenticated && user && (user.id || user.userId || user._id) && (
                <CateringInvitationPopup
                    cartItems={items || []}
                    userId={user.id || user.userId || user._id}
                    isAuthenticated={isAuthenticated}
                />
            )}
            {/* Debug: Uncomment to test popup */}
            {/* <CateringInvitationPopup
                cartItems={[]}
                userId={'test'}
                isAuthenticated={true}
            /> */}
        </>
    );
};
