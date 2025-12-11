// src/pages/Cart.jsx
import React, { useContext, useState, useEffect, useMemo } from 'react';
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
  const [hour12, setHour12] = useState('12');
  const [minute, setMinute] = useState('00');

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

  const formatAmount = useMemo(
    () =>
      new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }),
    []
  );

  const fmt = (n) => {
    return formatAmount.format(toNumber(n, 0));
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

  const to24Hour = (h12Str, mStr, period) => {
    let h = parseInt(h12Str || '12', 10);
    if (Number.isNaN(h) || h < 1 || h > 12) h = 12;
    let m = parseInt(mStr || '00', 10);
    if (Number.isNaN(m) || m < 0 || m > 59) m = 0;
    const isPM = (period || 'AM').toUpperCase() === 'PM';
    if (h === 12) h = isPM ? 12 : 0;
    else if (isPM) h += 12;
    const hh = String(h).padStart(2, '0');
    const mm = String(m).padStart(2, '0');
    return `${hh}:${mm}`;
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

  // Reverse geocode using Google Maps if available; fallback to OpenStreetMap Nominatim
  const reverseGeocode = async (lat, lng) => {
    const key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
    const tryGoogle = async () => {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Google geocoding request failed');
      const data = await res.json();
      if (data.status === 'OK' && data.results && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      throw new Error('Google geocoding returned no results');
    };

    const tryNominatim = async () => {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
      const res = await fetch(url, {
        headers: {
          'Accept-Language': 'en',
        },
      });
      if (!res.ok) throw new Error('Nominatim request failed');
      const data = await res.json();
      if (data?.display_name) return data.display_name;
      throw new Error('Nominatim returned no results');
    };

    try {
      if (key) {
        return await tryGoogle();
      }
      return await tryNominatim();
    } catch (err) {
      console.error('reverseGeocode error', err);
      // If both fail, at least return a lat/lng string so user sees something populated
      return `Lat ${lat.toFixed(5)}, Lng ${lng.toFixed(5)}`;
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
       if (!finalDeliveryTime) {
         const computed = to12Hour(time24);
         if (computed) finalDeliveryTime = computed;
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
      <div className="min-h-screen bg-[#F7F7F7] py-12">
        <div className="container-main text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-gradient-to-r from-[#FF6A28] to-[#FF8B4A] text-white text-sm font-semibold shadow-md mb-4">
            Cart
          </div>
          <ShoppingBag size={64} className="mx-auto text-orange-200 mb-4" />
          <h1 className="text-3xl font-bold text-[#301b16] mb-2">Your Cart is Empty</h1>
          <p className="text-[#7b5a4a] mb-8">Add some delicious items to get started</p>
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
    <div className="min-h-screen bg-[#F7F7F7] py-12">
      <div className="container-main">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-gradient-to-r from-[#FF6A28] to-[#FF8B4A] text-white text-sm font-semibold shadow-md">
              Cart
            </div>
            <h1 className="text-3xl font-bold text-[#301b16] mt-3">Shopping Cart</h1>
            <p className="text-sm text-[#7b5a4a] mt-1">Review items in your bag and set delivery details.</p>
          </div>
          <div className="hidden lg:block text-sm text-[#7b5a4a]">
            Free delivery on orders above ₹500
          </div>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {successMessage && <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-[0_18px_50px_rgba(255,106,40,0.08)] border border-orange-100 overflow-hidden">
              {/* Preview items banner */}
              {items.some((it) => !Number.isFinite(Number(it.id)) || it._isLocalShowcase) && (
                <div className="p-4 border-b bg-orange-50/70 border-orange-100 flex items-center justify-between">
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
                    className="flex items-center gap-4 p-6 border-b last:border-b-0 border-orange-50 hover:bg-orange-50/40 transition"
                  >
                    <img
                      src={resolvedImage}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg shadow-sm"
                    />

                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                      <p className="text-[#FC4300] font-bold text-lg">₹{fmt(item.price)}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="bg-orange-50 border border-orange-100 p-2 rounded hover:bg-orange-100 transition text-[#FF6A28]"
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
                        className="w-12 text-center border border-orange-100 rounded py-1"
                        min="1"
                      />

                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="bg-orange-50 border border-orange-100 p-2 rounded hover:bg-orange-100 transition text-[#FF6A28]"
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-[#FF6A28] font-bold text-lg">{fmt(item.price * item.quantity)}</p>
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
            <div className="bg-white rounded-2xl shadow-[0_18px_50px_rgba(255,106,40,0.08)] border border-orange-100 p-6 mb-6">
              <h2 className="text-2xl font-bold text-[#301b16] mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4 pb-4 border-b">
                <div className="flex justify-between">
                  <span className="text-[#7b5a4a]">Subtotal:</span>
                  <span className="font-semibold text-[#FF6A28]">{fmt(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7b5a4a]">Tax (5%):</span>
                  <span className="font-semibold text-[#FF6A28]">{fmt(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7b5a4a]">Delivery Charge:</span>
                  <span className="font-semibold text-[#FF6A28]">{deliveryCharge === 0 ? 'FREE' : fmt(deliveryCharge)}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-[#301b16] mb-6">
                <span>Total:</span>
                <span className="text-[#FF6A28]">{fmt(finalTotal)}</span>
              </div>

              {total <= 500 && (
                <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 mb-6 text-sm text-[#7b5a4a]">
                  Free delivery on orders above ₹500
                </div>
              )}
            </div>

            {/* Checkout Form */}
            <form onSubmit={handleCheckout} className="bg-white rounded-2xl shadow-[0_18px_50px_rgba(255,106,40,0.08)] border border-orange-100 p-6">
              <h2 className="text-xl font-bold text-[#301b16] mb-4">Delivery Details</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#7b5a4a] mb-2">Delivery Address</label>
                  <textarea
                    name="delivery_address"
                    value={formData.delivery_address}
                    onChange={handleChange}
                    placeholder="Enter your delivery address"
                    className="w-full px-4 py-2 border border-orange-100 rounded-lg focus:outline-none focus:border-[#FF6A28] focus:ring-2 focus:ring-[#FF6A28]/20 resize-none"
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
                  <label className="block text-sm font-semibold text-[#7b5a4a] mb-2">Delivery Date</label>
                  <input
                    type="date"
                    name="delivery_date"
                    value={formData.delivery_date}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-orange-100 rounded-lg focus:outline-none focus:border-[#FF6A28] focus:ring-2 focus:ring-[#FF6A28]/20"
                    required
                    min={minDate}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#7b5a4a] mb-2">Delivery Time</label>
                  <div className="flex gap-2">
                    <select
                      name="hour12"
                      value={hour12}
                      onChange={(e) => {
                        const h12 = e.target.value;
                        setHour12(h12);
                        const new24 = to24Hour(h12, minute, ampm);
                        setTime24(new24);
                        setFormData((prev) => ({ ...prev, delivery_time: to12Hour(new24) }));
                      }}
                      className="w-24 px-4 py-2 border border-orange-100 rounded-lg focus:outline-none focus:border-[#FF6A28] focus:ring-2 focus:ring-[#FF6A28]/20"
                      required
                    >
                      {['01','02','03','04','05','06','07','08','09','10','11','12'].map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                    <select
                      name="minute"
                      value={minute}
                      onChange={(e) => {
                        const m = e.target.value;
                        setMinute(m);
                        const new24 = to24Hour(hour12, m, ampm);
                        setTime24(new24);
                        setFormData((prev) => ({ ...prev, delivery_time: to12Hour(new24) }));
                      }}
                      className="w-24 px-4 py-2 border border-orange-100 rounded-lg focus:outline-none focus:border-[#FF6A28] focus:ring-2 focus:ring-[#FF6A28]/20"
                      required
                    >
                      {['00', '15', '30', '45'].map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <select
                      name="ampm"
                      value={ampm}
                      onChange={(e) => {
                        const chosen = e.target.value;
                        setAmpm(chosen);
                        const new24 = to24Hour(hour12, minute, chosen);
                        setTime24(new24);
                        setFormData((prev) => ({ ...prev, delivery_time: to12Hour(new24) }));
                      }}
                      className="w-24 px-4 py-2 border border-orange-100 rounded-lg focus:outline-none focus:border-[#FF6A28] focus:ring-2 focus:ring-[#FF6A28]/20"
                    >
                      <option>AM</option>
                      <option>PM</option>
                    </select>
                  </div>
                  <p className="text-xs text-[#a07c6c] mt-1">Time will be submitted as hh:mm AM/PM (e.g. 02:30 PM)</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#7b5a4a] mb-2">Special Instructions</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any special requests?"
                    className="w-full px-4 py-2 border border-orange-100 rounded-lg focus:outline-none focus:border-[#FF6A28] focus:ring-2 focus:ring-[#FF6A28]/20 resize-none"
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
