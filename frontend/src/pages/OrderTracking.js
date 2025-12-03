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

    if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

    if (error && !order) {
        return (
            <div className="container-main py-12 text-center">
                <Alert type="info" message={error} />
                <button onClick={() => navigate('/menu')} className="mt-4 text-purple-600 font-semibold hover:underline">
                    Browse Menu
                </button>
            </div>
        );
    }

    if (!order) return null;

    const currentStepIndex = getCurrentStepIndex(order.status);
    const isCancelled = order.status === 'cancelled';

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container-main max-w-3xl">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white text-center">
                        <h1 className="text-2xl font-bold mb-2">Order Tracking</h1>
                        <p className="opacity-90">Order #{order.order_number}</p>
                        {isCancelled && <div className="mt-2 bg-red-500/20 inline-block px-3 py-1 rounded-full text-sm font-bold border border-red-500/50">CANCELLED</div>}
                    </div>

                    {/* Stepper */}
                    {!isCancelled && (
                        <div className="p-8">
                            <div className="relative flex justify-between items-center">
                                {/* Connecting Line */}
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
                                <div
                                    className="absolute top-1/2 left-0 h-1 bg-green-500 -z-10 transform -translate-y-1/2 transition-all duration-500"
                                    style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                                ></div>

                                {steps.map((step, index) => {
                                    const Icon = step.icon;
                                    const isCompleted = index <= currentStepIndex;
                                    const isCurrent = index === currentStepIndex;

                                    return (
                                        <div key={step.status} className="flex flex-col items-center gap-2 bg-white px-2">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isCompleted
                                                    ? 'bg-green-500 border-green-500 text-white'
                                                    : 'bg-white border-gray-300 text-gray-300'
                                                    } ${isCurrent ? 'ring-4 ring-green-100 scale-110' : ''}`}
                                            >
                                                <Icon size={20} />
                                            </div>
                                            <span className={`text-xs font-semibold ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                                                {step.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Order Details */}
                    <div className="p-6 border-t bg-gray-50">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <Package size={18} className="text-purple-600" />
                                    Order Items
                                </h3>
                                <ul className="space-y-2">
                                    {order.items?.map((item) => (
                                        <li key={item.id} className="flex justify-between text-sm text-gray-600">
                                            <span>{item.quantity}x {item.name}</span>
                                            <span className="font-semibold">₹{item.total_price}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-3 pt-3 border-t flex justify-between font-bold text-gray-800">
                                    <span>Total Amount</span>
                                    <span>₹{order.total_amount}</span>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <MapPin size={18} className="text-purple-600" />
                                    Delivery Details
                                </h3>
                                <p className="text-sm text-gray-600 mb-1">{order.delivery_address}</p>
                                <p className="text-sm text-gray-600">
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
