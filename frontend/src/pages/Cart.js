// src/pages/Cart.jsx
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext as _CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { orderAPI, menuAPI } from '../utils/api';
import { Alert } from '../components/Alert';
import { resolveImageSrc } from '../components/MenuItem';

export const Cart = () => {
  const navigate = useNavigate();

  const cartCtx = useContext(_CartContext) || {};
  const authCtx = useContext(AuthContext) || { isAuthenticated: false };

  // Normalize available cart methods/values
  const itemsRaw = Array.isArray(cartCtx.items) ? cartCtx.items : [];
  const removeItemFn = cartCtx.removeItem ?? cartCtx.remove ?? (() => { });
  const updateQuantityCtx = cartCtx.updateQuantity ?? cartCtx.updateQty ?? (() => { });
  const clearCartFn = cartCtx.clearCart ?? cartCtx.clear ?? (() => { });
  const ctxTotal = cartCtx.total ?? cartCtx.totalPrice ?? cartCtx.total_amount;

  const { isAuthenticated } = authCtx;

  // Local UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    delivery_address: '',
    delivery_date: '',
    delivery_time: '',
    notes: '',
  });

  // Helpers
  const toNumber = (v, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };

  const fmt = (n) => {
    return toNumber(n, 0).toFixed(2);
  };

  // Levenshtein distance for fuzzy matching
  const levenshtein = (a = '', b = '') => {
    const s = String(a || '');
    const t = String(b || '');
    const n = s.length;
    const m = t.length;
    if (n === 0) return m;
    if (m === 0) return n;
    const v0 = new Array(m + 1).fill(0);
    const v1 = new Array(m + 1).fill(0);
    for (let j = 0; j <= m; j++) v0[j] = j;
    for (let i = 0; i < n; i++) {
      v1[0] = i + 1;
      for (let j = 0; j < m; j++) {
        const cost = s[i] === t[j] ? 0 : 1;
        v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
      }
      for (let j = 0; j <= m; j++) v0[j] = v1[j];
    }
    return v1[m];
  };

  // Normalize items to a known shape (id, name, price, quantity, lineTotal)
  const items = itemsRaw.map((it, idx) => {
    const id = it?.id ?? it?._id ?? it?.menu_item_id ?? `i_${idx}`;
    const name = it?.name ?? it?.title ?? it?.label ?? 'Untitled item';
    const quantity = toNumber(it?.quantity ?? it?.qty ?? it?.amount ?? 0, 0);
    const price = toNumber(it?.price ?? it?.cost ?? it?.unit_price ?? 0, 0);
    const lineTotal = quantity * price;
    return { ...it, id, name, quantity, price, lineTotal };
  });

  const computedTotal = items.reduce((s, it) => s + toNumber(it.lineTotal, 0), 0);
  const total = Number.isFinite(Number(ctxTotal)) ? Number(ctxTotal) : computedTotal;

  // Safely mapped action functions
  const removeItem = (id) => {
    try {
      removeItemFn(id);
    } catch (e) {
      console.warn('removeItem failed', e);
    }
  };

  const addItem = (item, qty) => {
    try {
      if (typeof cartCtx.addItem === 'function') {
        cartCtx.addItem(item, qty);
      } else if (typeof cartCtx.add === 'function') {
        cartCtx.add(item, qty);
      }
    } catch (e) {
      console.warn('addItem failed', e);
    }
  };

  const updateQuantity = (id, qty) => {
    const safeQty = Math.max(1, toNumber(qty, 1));
    try {
      if (typeof updateQuantityCtx === 'function') {
        updateQuantityCtx(id, safeQty);
      } else if (cartCtx && typeof cartCtx.updateQty === 'function') {
        cartCtx.updateQty(id, safeQty);
      }
    } catch (e) {
      console.warn('updateQuantity failed', e);
    }
  };

  const clearCart = () => {
    try {
      clearCartFn();
    } catch (e) {
      console.warn('clearCart failed', e);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Optimized linkPreviewItems
  const linkPreviewItems = async () => {
    setError('');
    setSuccessMessage('');
    setLoading(true);

    const previews = items.filter((it) => !Number.isFinite(Number(it.id)) || it._isLocalShowcase);
    if (previews.length === 0) {
      setLoading(false);
      setSuccessMessage('No preview items found in cart.');
      setTimeout(() => setSuccessMessage(''), 3000);
      return { stillMissing: [] };
    }

    const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
    const linked = [];
    const stillMissing = [];

    // Batch resolve if possible, or sequential but optimized
    for (const p of previews) {
      const name = String(p.name || p.id || '');
      const n = norm(name);
      if (!n) {
        stillMissing.push(p.name || p.id || 'Unknown');
        continue;
      }

      try {
        // Try exact match first via search
        const res = await menuAPI.getMenuItems({ search: name, limit: 5 });
        const list = res?.data?.items || [];

        // Exact match
        let found = list.find(it => norm(it.name) === n);

        // If not exact, try fuzzy
        if (!found && list.length > 0) {
          // Simple fuzzy: check if name contains the search term or vice versa
          found = list.find(it => norm(it.name).includes(n) || n.includes(norm(it.name)));
        }

        if (found && (typeof found.id === 'number' || typeof found.id === 'string')) {
          removeItem(p.id);
          addItem({ id: Number(found.id), name: found.name, price: Number(found.price) || 0, image: found.image }, p.quantity || p.qty || 1);
          linked.push(found.name);
        } else {
          stillMissing.push(p.name);
        }
      } catch (err) {
        console.error('Error resolving preview item:', name, err);
        stillMissing.push(p.name);
      }
    }

    setLoading(false);

    if (linked.length > 0) {
      setSuccessMessage(`Linked ${linked.length} preview item(s) to menu items.`);
      setTimeout(() => setSuccessMessage(''), 3000);
    }

    if (stillMissing.length > 0) {
      // Don't set error here, just return it. Let the caller decide if it's a blocker.
      // But if called explicitly via button, we might want to show it.
      // We'll return it and let the UI show a summary if needed.
    }

    return { stillMissing };
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1) Check for preview items
      const previewItems = items.filter((it) => !Number.isFinite(Number(it.id)) || it._isLocalShowcase);
      if (previewItems.length > 0) {
        // Try to auto-link once
        const { stillMissing } = await linkPreviewItems();
        if (stillMissing && stillMissing.length > 0) {
          setLoading(false);
          setError(
            `The following items cannot be ordered because they are previews: ${stillMissing.join(
              ', '
            )}. Please remove them from the cart or add them from the main menu.`
          );
          return;
        }
        setLoading(false);
        setSuccessMessage("Items updated. Please click Place Order again.");
        return;
      }

      // 2) Auth check
      if (!isAuthenticated) {
        setLoading(false);
        navigate('/login', { state: { from: '/cart' } });
        return;
      }

      // 3) Build normalized items
      const normalizedItems = items.map(item => ({
        menu_item_id: Number(item.id),
        quantity: Number(item.quantity)
      }));

      // 4) Build order payload
      const orderData = {
        items: normalizedItems,
        ...formData,
      };

      const response = await orderAPI.createOrder(orderData);

      if (response?.data?.success) {
        clearCart();
        navigate('/tracking');
      } else {
        setError(response?.data?.message || 'Failed to place order');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-main text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some delicious items to get started</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const tax = toNumber(total * 0.05, 0);
  const deliveryCharge = total > 500 ? 0 : 50;
  const finalTotal = toNumber(total + tax + deliveryCharge, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-main">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {successMessage && <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              {/* Preview items banner */}
              {items.some((it) => !Number.isFinite(Number(it.id)) || it._isLocalShowcase) && (
                <div className="p-4 border-b bg-yellow-50 flex items-center justify-between">
                  <div className="text-sm text-yellow-800">Some items in your cart are previews and may not be directly orderable.</div>
                  <div className="flex items-center gap-2">
                    <button onClick={linkPreviewItems} className="btn-secondary px-3 py-2">Link preview items</button>
                  </div>
                </div>
              )}
              {items.map((item) => {
                const resolvedImage = resolveImageSrc(item.image, item.name);
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-6 border-b last:border-b-0 hover:bg-gray-50 transition"
                  >
                    <img
                      src={resolvedImage}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                      <p className="text-purple-600 font-bold text-lg">₹{fmt(item.price)}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="bg-gray-200 p-2 rounded hover:bg-gray-300 transition"
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        <Minus size={16} />
                      </button>

                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '') {
                            updateQuantity(item.id, 1);
                          } else {
                            updateQuantity(item.id, Math.max(1, parseInt(val, 10)));
                          }
                        }}
                        className="w-12 text-center border border-gray-300 rounded py-1"
                        min="1"
                      />

                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="bg-gray-200 p-2 rounded hover:bg-gray-300 transition"
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-800">₹{fmt(item.price * item.quantity)}</p>
                    </div>

                    <button onClick={() => removeItem(item.id)} className="text-red-600 hover:text-red-800 p-2" aria-label={`Remove ${item.name}`}>
                      <Trash2 size={20} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary & Checkout */}
          <div className="lg:col-span-1">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4 pb-4 border-b">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">₹{fmt(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (5%):</span>
                  <span className="font-semibold">₹{fmt(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Charge:</span>
                  <span className="font-semibold">{deliveryCharge === 0 ? 'FREE' : `₹${fmt(deliveryCharge)}`}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-gray-800 mb-6">
                <span>Total:</span>
                <span className="text-purple-600">₹{fmt(finalTotal)}</span>
              </div>

              {total <= 500 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 text-sm text-blue-800">
                  Free delivery on orders above ₹500
                </div>
              )}
            </div>

            {/* Checkout Form */}
            <form onSubmit={handleCheckout} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Delivery Details</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Address</label>
                  <textarea
                    name="delivery_address"
                    value={formData.delivery_address}
                    onChange={handleChange}
                    placeholder="Enter your delivery address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 resize-none"
                    rows="3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Date</label>
                  <input
                    type="date"
                    name="delivery_date"
                    value={formData.delivery_date}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Time</label>
                  <input
                    type="time"
                    name="delivery_time"
                    value={formData.delivery_time}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Special Instructions</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any special requests?"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 resize-none"
                    rows="2"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;