// src/pages/Cart.jsx
import React, { useContext, useState, useEffect } from 'react';
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

  // For controlling date min (no past dates)
  const [minDate, setMinDate] = useState('');

  // For AM/PM toggle when selecting time
  const [time24, setTime24] = useState('12:00'); // internal 24-hour representation (HH:MM)
  const [ampm, setAmpm] = useState('PM'); // 'AM' or 'PM'

  useEffect(() => {
    // set min date to today's date in yyyy-mm-dd
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;
    setMinDate(todayStr);

    // initialize formData.delivery_date to today if empty (optional)
    // (We won't force it, only set min)
  }, []);

  // Helpers
  const toNumber = (v, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };

  const fmt = (n) => {
    return toNumber(n, 0).toFixed(2);
  };

  // Convert 24-hour "HH:MM" to "hh:mm AM/PM"
  const to12Hour = (time24Str) => {
    if (!time24Str) return '';
    const [hh, mm] = String(time24Str).split(':');
    let h = parseInt(hh, 10);
    const m = mm || '00';
    const period = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    return `${String(h).padStart(2, '0')}:${m} ${period}`;
  };

  // Convert 12-hour "hh:mm AM/PM" to 24-hour "HH:MM"
  const to24Hour = (time12Str) => {
    if (!time12Str) return '';
    const parts = time12Str.trim().split(' ');
    if (parts.length !== 2) return '';
    const [hm] = parts;
    const [hh, mm] = hm.split(':').map((s) => parseInt(s, 10));
    const period = parts[1].toUpperCase();
    let h = hh % 12;
    if (period === 'PM') h += 12;
    return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
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

  // Reverse geocode using Google Maps Geocoding API
  const reverseGeocode = async (lat, lng) => {
    try {
      const key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
      if (!key) {
        throw new Error('Google Maps API key not configured. Set REACT_APP_GOOGLE_MAPS_API_KEY.');
      }
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error('Failed to call geocoding API');
      }
      const data = await res.json();
      if (data.status === 'OK' && data.results && data.results.length > 0) {
        // Pick the most relevant formatted_address
        return data.results[0].formatted_address;
      }
      throw new Error('No address found for this location');
    } catch (err) {
      console.error('reverseGeocode error', err);
      throw err;
    }
  };

  // Use browser geolocation to set delivery_address
  const useCurrentLocation = async () => {
    setError('');
    setLoading(true);
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by your browser.');
      }
      const getPos = () =>
        new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 15000 })
        );
      const pos = await getPos();
      const { latitude, longitude } = pos.coords;
      const address = await reverseGeocode(latitude, longitude);
      setFormData((prev) => ({ ...prev, delivery_address: address }));
      setSuccessMessage('Delivery address updated from your current location.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to get location. Please enter address manually.');
    } finally {
      setLoading(false);
    }
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
    }

    return { stillMissing };
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 0) Ensure delivery_time in formData is represented as "hh:mm AM/PM"
      // If user used time24 + ampm controls, compose it
      if (time24) {
        // convert internal 24h time to 12h with AM/PM
        const formatted = to12Hour(time24);
        if (formatted) {
          setFormData((prev) => ({ ...prev, delivery_time: formatted }));
        }
      }

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

      // 2) Date validation: do not allow placing order before current date
      if (formData.delivery_date) {
        const selected = new Date(formData.delivery_date + 'T00:00:00');
        const now = new Date();
        // Normalize to local date parts
        const selY = selected.getFullYear();
        const selM = selected.getMonth();
        const selD = selected.getDate();
        const nowY = now.getFullYear();
        const nowM = now.getMonth();
        const nowD = now.getDate();
        const selectedDateOnly = new Date(selY, selM, selD);
        const todayDateOnly = new Date(nowY, nowM, nowD);
        if (selectedDateOnly < todayDateOnly) {
          setLoading(false);
          setError('Delivery date cannot be before today. Please choose a valid delivery date.');
          return;
        }
      } else {
        setLoading(false);
        setError('Please select a delivery date.');
        return;
      }

      // 3) Auth check
      if (!isAuthenticated) {
        setLoading(false);
        navigate('/login', { state: { from: '/cart' } });
        return;
      }

      // 4) Build normalized items
      const normalizedItems = items.map(item => ({
        menu_item_id: Number(item.id),
        quantity: Number(item.quantity)
      }));

      // Ensure delivery_time is set and in "hh:mm AM/PM" format
      let finalDeliveryTime = formData.delivery_time;
      if (!finalDeliveryTime && time24) {
        finalDeliveryTime = to12Hour(time24);
      }
      if (!finalDeliveryTime) {
        setLoading(false);
        setError('Please select a delivery time.');
        return;
      }

      // 5) Build order payload
      const orderData = {
        items: normalizedItems,
        ...formData,
        delivery_time: finalDeliveryTime,
      };

      const response = await orderAPI.createOrder(orderData);

      if (response?.data?.success) {
        clearCart();
        navigate('/tracking');
      } else {
        setError(response?.data?.message || 'Failed to place order');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to place order');
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
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={useCurrentLocation}
                      className="btn-secondary px-3 py-2"
                      disabled={loading}
                    >
                      Use Current Location
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, delivery_address: '' }));
                      }}
                      className="btn-neutral px-3 py-2"
                    >
                      Clear Address
                    </button>
                  </div>
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
                    min={minDate}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Time (AM/PM)</label>
                  <div className="flex gap-2">
                    {/* time input for convenience (24h) but we convert to AM/PM and store that format */}
                    <input
                      type="time"
                      name="time24"
                      value={time24}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTime24(val);
                        // update formData.delivery_time to be "hh:mm AM/PM"
                        const formatted = to12Hour(val);
                        setFormData(prev => ({ ...prev, delivery_time: formatted }));
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                      required
                    />
                    {/* Provide explicit AM/PM toggle in case user wants to override */}
                    <select
                      name="ampm"
                      value={formData.delivery_time ? formData.delivery_time.split(' ')[1] || ampm : ampm}
                      onChange={(e) => {
                        const chosen = e.target.value;
                        setAmpm(chosen);
                        // adjust time24 accordingly:
                        // take current time24, convert to 12-hour pieces, set period accordingly
                        if (time24) {
                          // current 24h to hh:mm AM/PM
                          let [hStr, mStr] = time24.split(':');
                          let h = parseInt(hStr, 10);
                          // convert to 12h then replace period
                          let hh12 = h % 12;
                          if (hh12 === 0) hh12 = 12;
                          const new12 = `${String(hh12).padStart(2, '0')}:${mStr} ${chosen}`;
                          setFormData(prev => ({ ...prev, delivery_time: new12 }));
                        } else {
                          // no time24 set yet, set a default
                          setFormData(prev => ({ ...prev, delivery_time: `12:00 ${chosen}` }));
                          setTime24('12:00');
                        }
                      }}
                      className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                    >
                      <option>AM</option>
                      <option>PM</option>
                    </select>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Time will be submitted as hh:mm AM/PM (e.g. 02:30 PM)</p>
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
