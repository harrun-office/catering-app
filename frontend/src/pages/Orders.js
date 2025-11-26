import React, { useState, useEffect, useContext } from 'react';
import { orderAPI } from '../utils/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Alert } from '../components/Alert';
import { Clock, MapPin, Package, DollarSign, XCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = selectedStatus === 'all' ? {} : { status: selectedStatus };
      const response = await orderAPI.getUserOrders(params);
      setOrders(response.data.orders);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await orderAPI.cancelOrder(orderId);
        setOrders(orders.filter((o) => o.id !== orderId));
      } catch (err) {
        setError('Failed to cancel order');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      ready: 'bg-green-100 text-green-800',
      out_for_delivery: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-teal-100 text-teal-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready', label: 'Ready' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-main">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedStatus(option.value)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                selectedStatus === option.value
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-purple-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading your orders..." />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h2>
            <p className="text-gray-600">Start ordering delicious food from our menu!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 border-b flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600">Order Number</p>
                    <h3 className="text-2xl font-bold text-gray-800">{order.order_number}</h3>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-4 py-2 rounded-full font-semibold text-sm ${getStatusColor(order.status)}`}>
                      {order.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <Clock className="text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-600">Ordered</p>
                        <p className="font-semibold text-gray-800">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin className="text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-600">Delivery</p>
                        <p className="font-semibold text-gray-800">{order.delivery_date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <DollarSign className="text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-600">Total</p>
                        <p className="font-semibold text-gray-800">₹{order.total_amount}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Package className="text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-600">Items</p>
                        <p className="font-semibold text-gray-800">{order.items?.length || 0} items</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="font-semibold text-gray-800 mb-3">Items:</p>
                    <ul className="space-y-2">
                      {order.items?.map((item) => (
                        <li key={item.id} className="flex justify-between text-sm text-gray-700">
                          <span>
                            {item.name} x {item.quantity}
                          </span>
                          <span>₹{(item.total_price || item.unit_price * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Delivery Address */}
                  <p className="text-sm text-gray-600 mb-4">
                    <strong>Delivery To:</strong> {order.delivery_address}
                  </p>

                  {/* Action Button */}
                  {(order.status === 'pending' || order.status === 'confirmed') && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold"
                    >
                      <XCircle size={20} />
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
