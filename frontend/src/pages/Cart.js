// src/pages/Cart.jsx
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Use the context object directly (call hooks unconditionally)
import { CartContext as _CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { orderAPI, menuAPI } from '../utils/api';
import { Alert } from '../components/Alert';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { resolveImageSrc } from '../components/MenuItem';

export const Cart = () => {
  const navigate = useNavigate();

  // CALL HOOKS UNCONDITIONALLY (important for ESLint Rules of Hooks)
  const cartCtx = useContext(_CartContext) || {}; // will be {} if provider missing
  const authCtx = useContext(AuthContext) || { isAuthenticated: false };

  // Normalize available cart methods/values to expected names
  const itemsRaw = Array.isArray(cartCtx.items) ? cartCtx.items : [];
  const removeItemFn = cartCtx.removeItem ?? cartCtx.remove ?? (() => {});
  const updateQuantityCtx = cartCtx.updateQuantity ?? cartCtx.updateQty ?? (() => {});
  const clearCartFn = cartCtx.clearCart ?? cartCtx.clear ?? (() => {});
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
  const items = (itemsRaw || []).map((it, idx) => {
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
      // ignore if provider doesn't support it
      console.warn('removeItem failed', e);
    }
  };

  const addItem = (item, qty) => {
    try {
      if (typeof cartCtx.addItem === 'function') {
        cartCtx.addItem(item, qty);
      } else if (typeof cartCtx.add === 'function') {
        cartCtx.add(item, qty);
      } else {
        console.warn('addItem: cart context has no add function');
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
      } else {
        // no-op
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

 const handleCheckout = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    // 0) Debug: show current cart items in console to help trace null ids
    console.debug('handleCheckout - cart items before normalize:', items);

    // 1) Auto-link preview items first (non-numeric ids)
    const previewItems = items.filter((it) => !Number.isFinite(Number(it.id)) || it._isLocalShowcase);
    if (previewItems.length > 0) {
      const { stillMissing } = await linkPreviewItems({ aggressiveScan: true });
      console.debug('handleCheckout - linkPreviewItems result:', { stillMissing });
      if (stillMissing && stillMissing.length > 0) {
        setLoading(false);
        setError(
          `The following items cannot be ordered because they are previews: ${stillMissing.join(
            ', '
          )}. Please remove them from the cart or add them from the main menu.`
        );
        return;
      }
    }

    // 2) Auth check
    if (!isAuthenticated) {
      setLoading(false);
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    // 3) Build normalized items; try to resolve any remaining non-numeric ids intelligently
    const normalizedItems = [];
    const unresolved = [];

    // helper normalizers
    const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
    const slugify = (s = '') => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    // resolver that tries server-side findMatch first, then search fallback
    const resolveToMenuItem = async (nameOrItem) => {
      const name = String(nameOrItem || '');
      if (!name) return null;
      try {
        // 1) server-side findMatch
        try {
          const fm = await menuAPI.findMatch(name);
          if (fm?.data?.item) return fm.data.item;
        } catch (e) {
          // ignore and fallback
        }

        // 2) search by full name
        const res = await menuAPI.getMenuItems({ search: name, limit: 12 });
        const list = res?.data?.items || [];
        if (!list.length) return null;

        // exact normalized match
        const n = norm(name);
        const exact = list.find((it) => norm(it.name) === n);
        if (exact) return exact;

        // slug match
        const sslug = slugify(name);
        const bySlug = list.find((it) => slugify(it.name) === sslug || (it.image && String(it.image).includes(sslug)));
        if (bySlug) return bySlug;

        // token score fallback
        const tokens = n.split(' ').filter(Boolean);
        let best = null;
        let bestScore = -Infinity;
        for (const cand of list) {
          const cn = norm(cand.name);
          let score = 0;
          if (cn.includes(n)) score += 5;
          for (const t of tokens) if (cn.includes(t)) score += 1;
          if (score > bestScore) {
            bestScore = score;
            best = cand;
          }
        }
        if (best && bestScore > 0) return best;

        return null;
      } catch (err) {
        console.error('resolveToMenuItem failed', err);
        return null;
      }
    };

    for (const item of items) {
      // prefer explicit menu_item_id if present (some callers may set it)
      const rawId = item.menu_item_id ?? item.id;
      const menuItemId = Number(rawId);

      if (Number.isFinite(menuItemId) && menuItemId > 0) {
        normalizedItems.push({ menu_item_id: menuItemId, quantity: Number(item.quantity || item.qty || 1) });
        continue;
      }

      // attempt to resolve by name
      const candidate = await resolveToMenuItem(item.name ?? item.id);
      if (candidate && (typeof candidate.id === 'number' || typeof candidate.id === 'string')) {
        normalizedItems.push({ menu_item_id: Number(candidate.id), quantity: Number(item.quantity || item.qty || 1) });
        continue;
      }

      // as a last-ditch attempt, try token-based search on individual words
      const tokens = (String(item.name || '')).split(/\s+/).filter((t) => t.length > 2);
      let tokenFound = null;
      for (const token of tokens) {
        try {
          const res2 = await menuAPI.getMenuItems({ search: token, limit: 8 });
          const candList = res2?.data?.items || [];
          if (candList.length === 1) {
            tokenFound = candList[0];
            break;
          }
          // prefer exact token inclusion
          const pf = candList.find((c) => norm(c.name).includes(token));
          if (pf) {
            tokenFound = pf;
            break;
          }
        } catch (e) {
          // ignore token search failure
        }
      }
      if (tokenFound && (typeof tokenFound.id === 'number' || typeof tokenFound.id === 'string')) {
        normalizedItems.push({ menu_item_id: Number(tokenFound.id), quantity: Number(item.quantity || item.qty || 1) });
        continue;
      }

      unresolved.push(item.name || item.id || 'Unknown item');
    }

    // 4) If unresolved remain, return helpful error (do not attempt to call createOrder)
    if (unresolved.length) {
      setLoading(false);
      setError(
        `The following items cannot be ordered because they are previews: ${unresolved.join(
          ', '
        )}. Please remove them from the cart and add them from the main menu.`
      );
      return;
    }

    // 5) Build order payload and send to server
    const orderData = {
      items: normalizedItems,
      ...formData,
    };

    console.debug('handleCheckout - sending orderData:', orderData);

    const response = await orderAPI.createOrder(orderData);

    if (response?.data?.success) {
      clearCart();
      navigate(`/order-confirmation/${response.data.order.id}`);
    } else {
      setError(response?.data?.message || 'Failed to place order');
    }
  } catch (err) {
    console.error('handleCheckout unexpected error:', err);
    setError(err?.response?.data?.message || 'Failed to place order');
  } finally {
    setLoading(false);
  }
};



  // Attempt to map preview/local items in the cart to real menu items from the backend.
  // Replace the existing linkPreviewItems with this version
// Cart.jsx — aggressive linkPreviewItems (replace existing function)
const linkPreviewItems = async ({ aggressiveScan = true } = {}) => {
  setError('');
  setSuccessMessage('');
  setLoading(true);

  const previews = items.filter((it) => !Number.isFinite(Number(it.id)) || it._isLocalShowcase);
  if (previews.length === 0) {
    setLoading(false);
    setSuccessMessage('No preview items found in cart.');
    setTimeout(() => setSuccessMessage(''), 3000);
    return { linked: [], autoLinked: [], stillMissing: [] };
  }

  const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const levenshteinLocal = levenshtein;

  const resolvePreviewItem = async (item) => {
    const name = String(item.name || item.id || '');
    const n = norm(name);
    if (!n) return null;

    // 1) attempt server-side matcher
    try {
      try {
        const fm = await menuAPI.findMatch(name);
        if (fm?.data?.item) return fm.data.item;
      } catch (e) { /* ignore */ }

      const res = await menuAPI.getMenuItems({ search: name, limit: 12 });
      const list = res?.data?.items || [];
      if (!list.length) return null;

      // exact normalized match
      const exact = list.find((it) => norm(it.name) === n);
      if (exact) return exact;

      // token-based scoring
      const tokens = n.split(' ').filter((t) => t.length > 2);
      let best = null;
      let bestScore = -Infinity;
      for (const cand of list) {
        const cn = norm(cand.name);
        let tokenScore = 0;
        if (cn.includes(n)) tokenScore += 5;
        for (const t of tokens) if (cn.includes(t)) tokenScore += 1;
        const maxLen = Math.max(cn.length, n.length, 1);
        const dist = levenshteinLocal(cn, n);
        const levSim = 1 - dist / maxLen;
        const combined = tokenScore * 2 + levSim * 3;
        if (combined > bestScore) {
          bestScore = combined;
          best = cand;
        }
      }
      if (best && bestScore > 0.9) return best;
    } catch (err) {
      console.error('resolvePreviewItem step failed', err);
    }

    // 2) large-scan fallback
    try {
      const resAll = await menuAPI.getMenuItems({ page: 1, limit: 500 });
      const listAll = resAll?.data?.items || [];
      let fbest = null;
      let fbestScore = -Infinity;
      const tokens = n.split(' ').filter((t) => t.length > 2);
      for (const cand of listAll) {
        const cn = norm(cand.name);
        let tokenScore = 0;
        if (cn.includes(n)) tokenScore += 5;
        for (const t of tokens) if (cn.includes(t)) tokenScore += 1;
        const maxLen = Math.max(cn.length, n.length, 1);
        const dist = levenshteinLocal(cn, n);
        const levSim = 1 - dist / maxLen;
        const combined = tokenScore * 2 + levSim * 3;
        if (combined > fbestScore) {
          fbestScore = combined;
          fbest = cand;
        }
      }
      if (fbest && fbestScore > 0.9) return fbest;
    } catch (err) {
      console.error('resolvePreviewItem large-scan failed', err);
    }

    return null;
  };

  const linked = [];
  const unlinked = [];

  for (const p of previews) {
    try {
      const found = await resolvePreviewItem(p);
      if (found && (typeof found.id === 'number' || typeof found.id === 'string')) {
        try { removeItem(p.id); } catch (e) { console.warn('remove preview failed', e); }
        addItem({ id: Number(found.id), name: found.name, price: Number(found.price) || 0, image: found.image }, p.quantity || p.qty || 1);
        linked.push({ preview: p.name || p.id, resolved: found.name });
        continue;
      }
    } catch (err) {
      console.error('Error resolving preview', err);
    }
    unlinked.push(p.name || p.id || 'Unknown');
  }

  const autoLinked = [];
  const stillMissing = [];

  if (unlinked.length > 0 && aggressiveScan) {
    try {
      const resAll = await menuAPI.getMenuItems({ page: 1, limit: 1000 });
      const listAll = resAll?.data?.items || [];

      for (const missingName of unlinked) {
        const name = String(missingName || '');
        const n = norm(name);
        if (!n) { stillMissing.push(missingName); continue; }
        const tokens = n.split(' ').filter((t) => t.length > 2);
        let best = null;
        let bestScore = -Infinity;
        for (const cand of listAll) {
          const cn = norm(cand.name);
          let tokenScore = 0;
          if (cn.includes(n)) tokenScore += 5;
          for (const t of tokens) if (cn.includes(t)) tokenScore += 1;
          const maxLen = Math.max(cn.length, n.length, 1);
          const dist = levenshteinLocal(cn, n);
          const levSim = 1 - dist / maxLen;
          const combined = tokenScore * 2 + levSim * 3;
          if (combined > bestScore) {
            bestScore = combined;
            best = cand;
          }
        }
        // lower threshold for aggressive auto-link to avoid blocking users
        if (best && bestScore > 0.45) {
          const previewItem = previews.find((pp) => (pp.name || pp.id) === missingName || String(pp.id) === String(missingName));
          try { if (previewItem) removeItem(previewItem.id); } catch (e) { console.warn('remove preview during auto-link failed', e); }
          addItem({ id: Number(best.id), name: best.name, price: Number(best.price) || 0, image: best.image }, previewItem?.quantity || previewItem?.qty || 1);
          autoLinked.push({ preview: missingName, resolved: best.name, score: bestScore });
        } else {
          stillMissing.push(missingName);
        }
      }
    } catch (err) {
      console.error('Aggressive auto-link scan failed', err);
      stillMissing.push(...unlinked);
    }
  } else {
    stillMissing.push(...unlinked);
  }

  setLoading(false);

  const totalLinked = linked.length + autoLinked.length;
  if (totalLinked) {
    setSuccessMessage(`Linked ${totalLinked} preview item(s) to menu items.`);
    setTimeout(() => setSuccessMessage(''), 3000);
  }
  if (stillMissing.length) {
    setError(`Could not find menu entries for: ${stillMissing.join(', ')}. Please add them from the main menu.`);
  }

  // return result to caller
  return { linked, autoLinked, stillMissing };
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
                        onChange={(e) => updateQuantity(item.id, Math.max(1, parseInt(e.target.value || 1, 10)))}
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
/* -- Add Mandhi & Biryani menu items (adjust prices/descriptions as desired)

INSERT INTO menu_items
  (category_id, name, description, price, image, servings, preparation_time, is_vegetarian, is_vegan, is_gluten_free, rating, total_ratings, is_available, created_at, updated_at)
VALUES
  (5, 'Mutton Mandhi', 'Tender mutton slow-cooked over pit fire, served atop spiced rice with roasted nuts', 699.00, '/uploads/images/mutton-mandhi.jpg', 5, 90, 0, 0, 0, 4.9, 10, 1, '2025-12-02 12:00:00', '2025-12-02 12:00:00'),

  (5, 'Smoked Chicken Mandhi', 'Yemeni-style mandi rice with charcoal-smoked chicken and roasted nuts', 639.00, '/uploads/images/chicken-mandhi.jpg', 5, 75, 0, 0, 0, 4.8, 18, 1, '2025-12-02 12:00:00', '2025-12-02 12:00:00'),

  (5, 'Coastal Fish Mandhi', 'Coastal marinated fish on aromatic mandi rice with lemon zest', 619.00, '/uploads/images/fish-mandhi.jpg', 5, 65, 0, 0, 0, 4.6, 7, 1, '2025-12-02 12:00:00', '2025-12-02 12:00:00'),

  (5, 'Hyderabadi Dum Biryani', 'Layered basmati rice, saffron, and slow-cooked chicken sealed in dum', 499.00, '/uploads/images/hyderabadi-biryani.jpg', 4, 60, 0, 0, 0, 4.9, 45, 1, '2025-12-02 12:00:00', '2025-12-02 12:00:00'),

  (5, 'Ambur Mutton Biryani', 'Short-grain seeraga samba rice with tender mutton and spice-laced broth', 549.00, '/uploads/images/ambur-biryani.jpg', 4, 70, 0, 0, 0, 4.8, 22, 1, '2025-12-02 12:00:00', '2025-12-02 12:00:00'),

  (5, 'Royal Veg Biryani', 'Seasonal vegetables tossed with caramelized onions and cashews', 459.00, '/uploads/images/veg-biryani.jpg', 4, 55, 1, 1, 0, 4.7, 14, 1, '2025-12-02 12:00:00', '2025-12-02 12:00:00');
 */