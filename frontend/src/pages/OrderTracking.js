import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI } from '../utils/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Alert } from '../components/Alert';
import { CheckCircle, Clock, Package, Truck, MapPin, ChefHat, Home, Bike } from 'lucide-react';

const steps = [
    { status: 'pending', label: 'Order Placed', icon: Clock },
    { status: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { status: 'preparing', label: 'Preparing', icon: ChefHat },
    { status: 'ready', label: 'Ready', icon: Package },
    { status: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
    { status: 'delivered', label: 'Delivered', icon: Home },
];

export const OrderTracking = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [progress, setProgress] = useState(0); // For animation 0 -> current

    const fetchOrder = React.useCallback(async () => {
        try {
            let response;
            if (orderId) {
                response = await orderAPI.getOrderById(orderId);
                setOrder(response.data.order);
            } else {
                response = await orderAPI.getActiveOrder();
                if (response.data.order) {
                    setOrder(response.data.order);
                    // If we found an active order but URL doesn't have ID, update URL
                    if (!orderId) {
                        navigate(`/tracking/${response.data.order.id}`, { replace: true });
                    }
                } else {
                    setError('No active order found');
                }
            }
        } catch (err) {
            setError('Failed to load order details');
        } finally {
            setLoading(false);
        }
    }, [orderId, navigate]);

    useEffect(() => {
        fetchOrder();
        const interval = setInterval(fetchOrder, 30000); // Poll every 30 seconds
        return () => clearInterval(interval);
    }, [fetchOrder]);

    const getCurrentStepIndex = (status) => {
        if (status === 'cancelled') return -1;
        return steps.findIndex((s) => s.status === status);
    };

    // Trigger animation when order loads
    useEffect(() => {
        if (order && !loading) {
            const index = getCurrentStepIndex(order.status);
            // Small delay to ensure render happens at 0 first, then animates
            const timer = setTimeout(() => {
                setProgress((index / (steps.length - 1)) * 100);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [order, loading]);

    if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" text="Fetching your order..." /></div>;

    if (error && !order) {
        return (
            <div className="container-main py-12 text-center">
                <Alert type="info" message={error} />
                <button onClick={() => navigate('/menu')} className="mt-4 text-[#FC4300] font-semibold hover:underline">
                    Browse Menu
                </button>
            </div>
        );
    }

    if (!order) return null;

    const currentStepIndex = getCurrentStepIndex(order.status);
    const isCancelled = order.status === 'cancelled';

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#FFF5F1] to-[#FFF0EB] py-10 md:py-16">
            <style>{`
                @keyframes subtleZoom {
                    from { opacity: 0; transform: scale(0.8) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
            <div className="container-main max-w-4xl px-0 md:px-0">
                <div className="bg-white/95 backdrop-blur rounded-3xl shadow-[0_24px_70px_rgba(255,106,40,0.08)] overflow-hidden border border-orange-100">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#FF6A28] via-[#FF8B4A] to-[#FF6A28] p-6 text-white text-center">
                        <h1 className="text-2xl md:text-3xl font-bold mb-1">Order Tracking</h1>
                        <p className="opacity-90 text-sm md:text-base">Order #{order.order_number}</p>
                        {isCancelled && <div className="mt-3 bg-red-500/20 inline-block px-3 py-1 rounded-full text-sm font-bold border border-red-500/40">CANCELLED</div>}
                    </div>

                    {/* Stepper */}
                    {/* Stepper with Moving Bike */}
                    {!isCancelled && (
                        <div className="p-8 md:p-12 bg-orange-50/30 border-b border-orange-100 relative overflow-hidden">
                            {/* Mobile Note */}
                            <p className="md:hidden text-center text-xs text-orange-400 mb-6 italic">Scroll right to see progress</p>

                            <div className="relative min-w-[320px] md:min-w-0 mx-4 md:mx-8">
                                {/* Base Grey Line */}
                                <div className="absolute top-1/2 left-0 w-full h-1.5 bg-orange-100 rounded-full -z-10 transform -translate-y-1/2"></div>

                                {/* Active Orange Line with Smooth Gradient */}
                                <div
                                    className="absolute top-1/2 left-0 h-1.5 bg-gradient-to-r from-[#FF6A28] to-[#FF8B4A] rounded-full -z-10 transform -translate-y-1/2 transition-all duration-[2500ms]"
                                    style={{
                                        width: `${progress}%`,
                                        transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' // Custom bounce-slide easing
                                    }}
                                ></div>



                                <div className="flex justify-between items-center w-full">
                                    {steps.map((step, index) => {
                                        const Icon = step.icon;
                                        const isCompleted = index <= currentStepIndex;
                                        const isCurrent = index === currentStepIndex;

                                        return (
                                            <div
                                                key={step.status}
                                                className="relative flex flex-col items-center group transition-all duration-700 ease-out"
                                                style={{
                                                    animation: `subtleZoom 0.5s ease-out ${index * 0.15}s backwards`,
                                                }}
                                            >
                                                <div
                                                    className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center border-4 transition-all duration-500 z-10 relative ${isCompleted
                                                        ? 'bg-[#FF6A28] border-[#FF6A28] text-white shadow-[0_4px_12px_rgba(255,106,40,0.3)] scale-100'
                                                        : 'bg-white border-orange-100 text-orange-200'
                                                        } ${isCurrent ? 'ring-4 ring-orange-100 ring-offset-2 scale-110 shadow-[0_0_20px_rgba(255,106,40,0.2)]' : ''}`}
                                                >
                                                    {isCurrent && (
                                                        <>
                                                            <span className="absolute inset-0 rounded-full bg-orange-400 opacity-20 animate-ping"></span>
                                                            <span className="absolute inset-0 rounded-full border border-orange-200 animate-pulse"></span>
                                                        </>
                                                    )}
                                                    <Icon size={22} className={`transition-transform duration-300 ${isCurrent ? 'scale-110' : ''}`} />
                                                </div>
                                                <span
                                                    className={`absolute top-16 w-32 text-center text-xs md:text-sm font-bold transition-colors duration-300 ${isCompleted ? 'text-[#301b16]' : 'text-orange-200'
                                                        }`}
                                                >
                                                    {step.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="h-12 md:h-10"></div> {/* Spacer for labels */}
                        </div>
                    )}

                    {/* Order Details with Glassmorphism */}
                    <div className="p-6 md:p-8 bg-white/40 backdrop-blur-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="rounded-2xl border border-orange-100 bg-white/60 backdrop-blur-md p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                                <h3 className="font-bold text-[#301b16] mb-4 flex items-center gap-2">
                                    <div className="bg-orange-100 p-2 rounded-full">
                                        <Package size={20} className="text-[#FF6A28]" />
                                    </div>
                                    Order Items
                                </h3>
                                <ul className="space-y-3">
                                    {order.items?.map((item) => (
                                        <li key={item.id} className="flex justify-between text-sm text-[#7b5a4a] border-b border-orange-50 pb-2 last:border-0 last:pb-0">
                                            <span className="font-medium">{item.quantity}x {item.name}</span>
                                            <span className="font-bold text-[#FF6A28]">₹{item.total_price}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-4 pt-4 border-t border-dashed border-orange-200 flex justify-between font-bold text-[#301b16] text-lg">
                                    <span>Total Amount</span>
                                    <span className="text-[#FF6A28]">₹{order.total_amount}</span>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-orange-100 bg-white/60 backdrop-blur-md p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                                <h3 className="font-bold text-[#301b16] mb-4 flex items-center gap-2">
                                    <div className="bg-orange-100 p-2 rounded-full">
                                        <MapPin size={20} className="text-[#FF6A28]" />
                                    </div>
                                    Delivery Details
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-orange-400 font-semibold uppercase tracking-wider mb-1">Address</p>
                                        <p className="text-sm text-[#5a4036] font-medium leading-relaxed">{order.delivery_address}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-orange-400 font-semibold uppercase tracking-wider mb-1">Estimated Arrival</p>
                                        <p className="text-sm text-[#5a4036] font-medium">
                                            {new Date(order.delivery_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};
