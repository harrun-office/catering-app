import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI } from '../utils/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Alert } from '../components/Alert';
import { CheckCircle, Clock, Package, Truck, MapPin, ChefHat, Home } from 'lucide-react';

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
        <div className="min-h-screen bg-[#F7F7F7] py-10 md:py-12">
            <div className="container-main max-w-4xl px-0 md:px-0">
                <div className="bg-white/95 backdrop-blur rounded-3xl shadow-[0_24px_70px_rgba(255,106,40,0.08)] overflow-hidden border border-orange-100">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#FF6A28] via-[#FF8B4A] to-[#FF6A28] p-6 text-white text-center">
                        <h1 className="text-2xl md:text-3xl font-bold mb-1">Order Tracking</h1>
                        <p className="opacity-90 text-sm md:text-base">Order #{order.order_number}</p>
                        {isCancelled && <div className="mt-3 bg-red-500/20 inline-block px-3 py-1 rounded-full text-sm font-bold border border-red-500/40">CANCELLED</div>}
                    </div>

                    {/* Stepper */}
                    {!isCancelled && (
                        <div className="p-6 md:p-8 bg-orange-50/50 border-b border-orange-100">
                            <div className="relative flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                                {/* Connecting Line */}
                                <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-orange-100 -z-10 transform -translate-y-1/2"></div>
                                <div
                                    className="hidden md:block absolute top-1/2 left-0 h-1 bg-gradient-to-r from-[#FF6A28] to-[#FF8B4A] -z-10 transform -translate-y-1/2 transition-all duration-500"
                                    style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                                ></div>

                                {steps.map((step, index) => {
                                    const Icon = step.icon;
                                    const isCompleted = index <= currentStepIndex;
                                    const isCurrent = index === currentStepIndex;

                                    return (
                                        <div key={step.status} className="flex flex-col items-center gap-2 px-2 text-center w-full md:w-auto">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                                    isCompleted
                                                        ? 'bg-gradient-to-r from-[#FF6A28] to-[#FF8B4A] border-transparent text-white shadow'
                                                        : 'bg-white border-orange-200 text-orange-200'
                                                } ${isCurrent ? 'ring-4 ring-orange-100 scale-110' : ''}`}
                                            >
                                                <Icon size={20} />
                                            </div>
                                            <span className={`text-xs font-semibold ${isCompleted ? 'text-[#301b16]' : 'text-[#a07c6c]'}`}>
                                                {step.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Order Details */}
                    <div className="p-6 md:p-8 bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="rounded-2xl border border-orange-100 bg-orange-50/60 p-4">
                                <h3 className="font-bold text-[#301b16] mb-3 flex items-center gap-2">
                                    <Package size={18} className="text-[#FF6A28]" />
                                    Order Items
                                </h3>
                                <ul className="space-y-2">
                                    {order.items?.map((item) => (
                                        <li key={item.id} className="flex justify-between text-sm text-[#7b5a4a]">
                                            <span>{item.quantity}x {item.name}</span>
                                            <span className="font-semibold text-[#FF6A28]">₹{item.total_price}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-3 pt-3 border-t border-orange-100 flex justify-between font-bold text-[#301b16]">
                                    <span>Total Amount</span>
                                    <span className="text-[#FF6A28]">₹{order.total_amount}</span>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-orange-100 bg-orange-50/60 p-4">
                                <h3 className="font-bold text-[#301b16] mb-3 flex items-center gap-2">
                                    <MapPin size={18} className="text-[#FF6A28]" />
                                    Delivery Details
                                </h3>
                                <p className="text-sm text-[#7b5a4a] mb-1">{order.delivery_address}</p>
                                <p className="text-sm text-[#7b5a4a]">
                                    Expected: {new Date(order.delivery_date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
