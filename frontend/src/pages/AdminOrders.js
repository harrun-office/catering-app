import React, { useState, useEffect, useMemo } from 'react';
import { adminAPI } from '../utils/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Alert } from '../components/Alert';
import { ChevronDown, ChevronUp, Search, RefreshCw } from 'lucide-react';

const statusOptions = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];

const statusStyles = {
  pending: 'bg-amber-50 text-amber-700',
  confirmed: 'bg-orange-50 text-[#FF6A28]',
  preparing: 'bg-orange-100 text-[#E85A1F]',
  ready: 'bg-orange-50 text-[#FF6A28]',
  out_for_delivery: 'bg-orange-100 text-[#E85A1F]',
  delivered: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-rose-50 text-rose-700',
};

const formatAmount = (value) => `₹${Number(value || 0).toFixed(0)}`;

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const params = selectedStatus === 'all' ? {} : { status: selectedStatus };
      const response = await adminAPI.getAllOrders(params);
      setOrders(response.data.orders || []);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)));
    } catch (err) {
      setError('Failed to update order status');
    }
  };

  const statusSummary = useMemo(() => {
    return statusOptions.reduce(
      (acc, status) => ({
        ...acc,
        [status]: orders.filter((order) => order.status === status).length,
      }),
      {}
    );
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return orders;
    return orders.filter((order) => {
      const customer = `${order.first_name || ''} ${order.last_name || ''}`.toLowerCase();
      return (
        order.order_number?.toLowerCase().includes(term) ||
        customer.includes(term) ||
        order.delivery_address?.toLowerCase().includes(term)
      );
    });
  }, [orders, searchTerm]);

  const renderStatusChip = (status) => (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status] || 'bg-slate-100 text-slate-700'}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Operations</p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900">Order Command Center</h1>
          <p className="text-sm text-slate-500">Track, filter, and act on every order in one view.</p>
        </div>
        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-2 rounded-2xl border border-orange-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-orange-50"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {['pending', 'preparing', 'out_for_delivery', 'delivered'].map((status) => (
          <div key={status} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <p className="text-xs uppercase tracking-widest text-slate-400">{status.replace(/_/g, ' ')}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-800">{statusSummary[status] ?? 0}</p>
            <p className="text-xs text-slate-400">of {orders.length} orders</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100 space-y-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search order #, customer, address"
              className="w-full rounded-2xl border border-orange-200 bg-orange-50 py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-[#FF6A28] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6A28]/20"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {['all', ...statusOptions].map((status) => {
              const isActive = selectedStatus === status;
              return (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`rounded-2xl px-3 py-2 text-xs font-semibold transition ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF6A28] to-[#FF8B4A] text-white shadow'
                      : 'bg-orange-50 text-gray-600 hover:bg-orange-100 border border-orange-200'
                  }`}
                >
                  {status.replace(/_/g, ' ')}
                  {status !== 'all' && <span className="ml-1 text-[10px] opacity-80">{statusSummary[status] ?? 0}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" text="Loading orders..." />
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-100">
          <p className="text-lg font-semibold text-slate-700">No orders found</p>
          <p className="text-sm text-slate-500">Try adjusting filters or refreshing.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrder === order.id;
            return (
              <div key={order.id} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400">Order</p>
                    <h3 className="text-xl font-semibold text-slate-900">{order.order_number}</h3>
                    <p className="text-sm text-slate-500">
                      {order.first_name} {order.last_name} • {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-widest text-slate-400">Total</p>
                    <p className="text-2xl font-semibold text-[#FF6A28]">{formatAmount(order.total_amount)}</p>
                    <div className="mt-2">{renderStatusChip(order.status)}</div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-slate-200 pt-4">
                  <p className="text-sm text-slate-500 line-clamp-2">{order.delivery_address}</p>
                  <button
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#FF6A28] hover:text-[#E85A1F]"
                  >
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    {isExpanded ? 'Hide details' : 'View details'}
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-4 space-y-4 rounded-2xl bg-slate-50 p-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-400">Update status</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {statusOptions.map((status) => {
                          const active = order.status === status;
                          return (
                            <button
                              key={status}
                              onClick={() => handleStatusChange(order.id, status)}
                              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                                active ? 'bg-[#FF6A28] text-white shadow' : 'bg-white text-gray-600 hover:bg-orange-50 border border-orange-200'
                              }`}
                            >
                              {status.replace(/_/g, ' ')}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {order.items && order.items.length > 0 && (
                      <div>
                        <p className="text-xs uppercase tracking-widest text-slate-400">Items</p>
                        <div className="mt-3 space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 text-sm text-slate-600">
                              <span>
                                {item.name} × {item.quantity}
                              </span>
                              <span className="font-semibold text-slate-800">{formatAmount(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
