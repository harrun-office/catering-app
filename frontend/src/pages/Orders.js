import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { orderAPI } from '../utils/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Alert } from '../components/Alert';
import { Clock, MapPin, Package, IndianRupee, XCircle } from 'lucide-react';

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const formatAmount = useMemo(
    () =>
      new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }),
    []
  );

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = selectedStatus === 'all' ? {} : { status: selectedStatus };
      const response = await orderAPI.getUserOrders(params);
      setOrders(response.data.orders || []);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [selectedStatus]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await orderAPI.cancelOrder(orderId);
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
      } catch (err) {
        setError('Failed to cancel order');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-orange-50 text-[#FF6A28] border border-orange-100',
      confirmed: 'bg-orange-50 text-[#E85A1F] border border-orange-100',
      preparing: 'bg-orange-50 text-[#CF4F15] border border-orange-100',
      ready: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
      out_for_delivery: 'bg-orange-50 text-[#FF6A28] border border-orange-100',
      delivered: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
      cancelled: 'bg-red-50 text-red-700 border border-red-100',
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
    <div className="min-h-screen bg-[#F7F7F7] py-12">
      <div className="container-main">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-gradient-to-r from-[#FF6A28] to-[#FF8B4A] text-white text-sm font-semibold shadow-md">
            Orders
          </div>
          <h1 className="text-3xl font-bold text-[#301b16] mt-3">My Order History</h1>
          <p className="text-sm text-[#7b5a4a] mt-1">Review your recent orders and their delivery status.</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedStatus(option.value)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                selectedStatus === option.value
                  ? 'bg-[#FF6A28] text-white shadow'
                  : 'bg-white border border-orange-100 text-gray-700 hover:border-[#FF6A28] hover:bg-orange-50'
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
          <div className="text-center py-12 bg-white rounded-2xl border border-orange-100 shadow">
            <Package size={64} className="mx-auto text-orange-200 mb-4" />
            <h2 className="text-2xl font-bold text-[#301b16] mb-2">No Orders Yet</h2>
            <p className="text-[#7b5a4a]">Start ordering delicious food from our menu!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden hover:shadow-lg transition">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-50/80 to-white p-6 border-b border-orange-100 flex justify-between items-start">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[#FF6A28] font-semibold">Order Number</p>
                    <h3 className="text-2xl font-bold text-[#301b16] mt-1">{order.order_number}</h3>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-4 py-2 rounded-full font-semibold text-sm ${getStatusColor(order.status)}`}>
                      {order.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3 rounded-xl border border-orange-100 bg-orange-50/60 px-3 py-2">
                      <Clock className="text-[#FF6A28]" />
                      <div>
                        <p className="text-xs text-[#7b5a4a]">Ordered</p>
                        <p className="font-semibold text-[#301b16]">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-orange-100 bg-orange-50/60 px-3 py-2">
                      <MapPin className="text-[#FF6A28]" />
                      <div>
                        <p className="text-xs text-[#7b5a4a]">Delivery</p>
                        <p className="font-semibold text-[#301b16]">
                          {order.delivery_date ? new Date(order.delivery_date).toLocaleDateString() : '—'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-orange-100 bg-orange-50/60 px-3 py-2">
                      <IndianRupee className="text-[#FF6A28]" />
                      <div>
                        <p className="text-xs text-[#7b5a4a]">Total</p>
                        <p className="font-semibold text-[#FF6A28]">{formatAmount.format(order.total_amount || 0)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-orange-100 bg-orange-50/60 px-3 py-2">
                      <Package className="text-[#FF6A28]" />
                      <div>
                        <p className="text-xs text-[#7b5a4a]">Items</p>
                        <p className="font-semibold text-[#301b16]">{order.items?.length || 0} items</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-orange-50/60 rounded-xl border border-orange-100 p-4">
                    <p className="font-semibold text-[#301b16] mb-3">Items</p>
                    <ul className="space-y-2">
                      {order.items?.map((item) => (
                        <li key={item.id} className="flex flex-col sm:flex-row sm:justify-between text-sm text-[#7b5a4a] gap-1">
                          <span>{item.name} × {item.quantity}</span>
                          <span className="font-semibold text-[#FF6A28]">
                            {formatAmount.format(Number(item.total_price || item.unit_price * item.quantity || 0))}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Delivery Address */}
                  <div className="text-sm text-[#7b5a4a]">
                    <strong className="text-[#301b16]">Delivery To:</strong> {order.delivery_address}
                  </div>

                  {/* Action Button */}
                  {(order.status === 'pending' || order.status === 'confirmed') && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="inline-flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold"
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
