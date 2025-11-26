import React, { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Alert } from '../components/Alert';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = selectedStatus === 'all' ? {} : { status: selectedStatus };
      const response = await adminAPI.getAllOrders(params);
      setOrders(response.data.orders);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    } catch (err) {
      setError('Failed to update order status');
    }
  };

  const statusOptions = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];

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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2">
        {['all', ...statusOptions].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              selectedStatus === status
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                : 'bg-white border-2 border-gray-200 text-gray-700'
            }`}
          >
            {status.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner size="lg" text="Loading orders..." />
      ) : orders.length === 0 ? (
        <div className="text-center bg-white rounded-lg p-12">
          <p className="text-gray-600 text-lg">No orders found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Order #</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Customer</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Amount</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Date</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-3 font-semibold text-gray-800">{order.order_number}</td>
                    <td className="px-6 py-3 text-gray-700">
                      {order.first_name} {order.last_name}
                    </td>
                    <td className="px-6 py-3 font-bold text-purple-600">₹{order.total_amount}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-700">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        className="text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-2"
                      >
                        {expandedOrder === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        Details
                      </button>
                    </td>
                  </tr>

                  {expandedOrder === order.id && (
                    <tr className="bg-gray-50 border-b">
                      <td colSpan="6" className="px-6 py-4">
                        <div className="space-y-4">
                          {/* Delivery Address */}
                          <div>
                            <p className="font-semibold text-gray-800 mb-1">Delivery Address:</p>
                            <p className="text-gray-700">{order.delivery_address}</p>
                          </div>

                          {/* Status Update */}
                          <div>
                            <p className="font-semibold text-gray-800 mb-2">Update Status:</p>
                            <div className="flex flex-wrap gap-2">
                              {statusOptions.map((status) => (
                                <button
                                  key={status}
                                  onClick={() => handleStatusChange(order.id, status)}
                                  className={`px-4 py-2 rounded-lg font-semibold transition text-sm ${
                                    order.status === status
                                      ? 'bg-purple-600 text-white'
                                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                  }`}
                                >
                                  {status.replace('_', ' ')}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
