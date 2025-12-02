// src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

/**
 * CartContext
 *
 * - Persists cart per-user under localStorage key cart_<userId>, or per-session under cart_guest_<sessionId>.
 * - Exports CartContext so callers can import { CartContext }.
 * - Provides compatibility aliases for legacy callers (updateQuantity, updateQty, clear, total, etc.).
 *
 * NOTE: This file intentionally keeps a backwards-compatible API surface while fixing a bug
 * where carts could leak between different signed-in accounts in the same browser session.
 */

/* -------------------- Helper functions -------------------- */

function parseJwt(token) {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    // atob may throw if malformed
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    // decodeURIComponent/escape to handle utf8 bytes if present
    // eslint-disable-next-line no-undef
    return JSON.parse(decodeURIComponent(escape(decoded)));
  } catch (e) {
    return null;
  }
}

function getStoredUserId() {
  try {
    // 1) Try localStorage.user as JSON object
    const rawUser = localStorage.getItem("user");
    if (rawUser) {
      try {
        const u = JSON.parse(rawUser);
        if (u) {
          if (u.id) return String(u.id);
          if (u.userId) return String(u.userId);
          if (u._id) return String(u._id);
        }
      } catch (err) {
        // not JSON, ignore
      }
    }

    // 2) Try localStorage token (JWT)
    const token = localStorage.getItem("token") || localStorage.getItem("authToken");
    if (token) {
      const payload = parseJwt(token);
      if (payload) {
        if (payload.sub) return String(payload.sub);
        if (payload.userId) return String(payload.userId);
        if (payload.id) return String(payload.id);
        if (payload._id) return String(payload._id);
      }
    }

    // 3) fallback keys
    const alt = localStorage.getItem("currentUserId") || localStorage.getItem("userId");
    if (alt) return String(alt);

    // no logged in user
    return null;
  } catch (e) {
    return null;
  }
}

function ensureSessionId() {
  let s = sessionStorage.getItem("anon_session_id");
  if (!s) {
    s = `s_${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem("anon_session_id", s);
  }
  return s;
}

function storageKeyForUserId(userId) {
  if (userId) return `cart_${userId}`;
  const sid = ensureSessionId();
  return `cart_guest_${sid}`;
}

/* -------------------- Context & Provider -------------------- */

// Export CartContext so other modules can import it by name (fixes missing export errors).
export const CartContext = createContext(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}

export function CartProvider({ children }) {
  // derive current userId at render-time from localStorage/token; we do not import other contexts
  const derivedUserId = getStoredUserId(); // string or null

  // compute the storage key (changes when derivedUserId changes)
  const storageKey = useMemo(() => storageKeyForUserId(derivedUserId), [derivedUserId]);

  // keep track of previous user id
  const prevUserIdRef = useRef(derivedUserId);

  // cart is array of items: { id, name, price, qty, ... }
  const [items, setItems] = useState(() => {
    try {
      const initialKey = storageKeyForUserId(getStoredUserId());
      const raw = localStorage.getItem(initialKey);
      const parsed = raw ? JSON.parse(raw) : [];
      // normalize stored items to include both qty and quantity
      return Array.isArray(parsed)
        ? parsed.map((it) => ({ ...it, qty: Number(it.qty ?? it.quantity ?? 0), quantity: Number(it.quantity ?? it.qty ?? 0) }))
        : [];
    } catch (e) {
      console.warn("CartProvider: failed to parse stored cart, starting empty", e);
      return [];
    }
  });

  // When derivedUserId changes, always load the cart for the NEW user (or guest).
  useEffect(() => {
    const newKey = storageKeyForUserId(derivedUserId);
    try {
      const raw = localStorage.getItem(newKey);
      const parsed = raw ? JSON.parse(raw) : [];
      setItems(Array.isArray(parsed) ? parsed.map((it) => ({ ...it, qty: Number(it.qty ?? it.quantity ?? 0), quantity: Number(it.quantity ?? it.qty ?? 0) })) : []);
    } catch (e) {
      console.warn("CartProvider: failed to load cart for new user, resetting to empty", e);
      setItems([]);
    }

    // update prev ref
    prevUserIdRef.current = derivedUserId;
  }, [derivedUserId]);

  // Persist changes to localStorage under the current user's key
  useEffect(() => {
    try {
      const key = storageKeyForUserId(derivedUserId);
      console.debug && console.debug('CartProvider persisting', { key, items });
      localStorage.setItem(key, JSON.stringify(items));
    } catch (e) {
      console.warn("CartProvider: could not persist cart to localStorage", e);
    }
  }, [items, derivedUserId]);

  // Sync across tabs. If storage for current key changed, update items.
  useEffect(() => {
    function onStorage(e) {
      if (!e.key) return;

      // updates for the exact cart key
      if (e.key === storageKeyForUserId(derivedUserId)) {
        try {
          setItems(e.newValue ? JSON.parse(e.newValue) : []);
        } catch {
          setItems([]);
        }
      }

      // If user/token changed in another tab, recompute the derived id + key and load it
      if (e.key === "user" || e.key === "token" || e.key === "currentUserId" || e.key === "userId") {
        const newUserId = getStoredUserId();
        const newKey = storageKeyForUserId(newUserId);
        try {
          const raw = localStorage.getItem(newKey);
          setItems(raw ? JSON.parse(raw) : []);
        } catch {
          setItems([]);
        }
      }
    }

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [derivedUserId]);

  /* -------------------- Cart operations -------------------- */

  function addItem(newItem, qty = 1) {
    console.debug && console.debug('CartContext.addItem called', { newItem, qty });
    setItems((prev) => {
      const isObject = newItem && typeof newItem === "object";
      const id = isObject
        ? String(newItem.id ?? newItem._id ?? newItem.productId ?? newItem.sku ?? JSON.stringify(newItem))
        : String(newItem);
      const existsIndex = prev.findIndex((it) => String(it.id ?? it._id ?? it.productId) === id);
      let result;
      if (existsIndex > -1) {
        const copy = [...prev];
        // ensure using qty field for consistency
        const existingQty = Number(copy[existsIndex].qty || copy[existsIndex].quantity || 0);
        const newQty = existingQty + Number(qty || 0);
        copy[existsIndex] = { ...copy[existsIndex], qty: newQty, quantity: newQty };
        result = copy;
      } else {
        // store both `qty` and `quantity` for compatibility across components
        const stored = isObject ? { ...newItem, id, qty: Number(qty || 0), quantity: Number(qty || 0) } : { id, qty: Number(qty || 0), quantity: Number(qty || 0) };
        result = [...prev, stored];
      }
      console.debug && console.debug('CartContext.addItem result', { id, result });
      return result;
    });
  }

  function removeItem(id) {
    const sid = String(id);
    setItems((prev) => prev.filter((it) => String(it.id ?? it._id ?? it.productId) !== sid));
  }

  function updateQty(id, qty) {
    const sid = String(id);
    if (qty <= 0) {
      removeItem(sid);
      return;
    }
    setItems((prev) => prev.map((it) => (String(it.id ?? it._id ?? it.productId) === sid ? { ...it, qty: Number(qty), quantity: Number(qty) } : it)));
  }

  function clearCart() {
    setItems([]);
    try {
      const key = storageKeyForUserId(derivedUserId);
      localStorage.removeItem(key);
    } catch (e) {
      // ignore
    }
  }

  function replaceCartFromServer(serverCartArray = []) {
    setItems(Array.isArray(serverCartArray) ? serverCartArray : []);
  }

  const totalQuantity = items.reduce((s, it) => s + (Number(it.qty) || 0), 0);
  const totalPrice = items.reduce((s, it) => s + (Number(it.qty) || 0) * (Number(it.price) || 0), 0);

  // Provide aliases for backward/alternate names expected across the app.
  const value = {
    items,
    addItem,

    // remove
    removeItem,
    remove: removeItem,

    // update qty
    updateQty,
    updateQuantity: updateQty,
    updateQuantityCtx: updateQty,

    // clear
    clearCart,
    clear: clearCart,

    // replace
    replaceCartFromServer,

    // totals
    totalQuantity,
    totalPrice,
    total: totalPrice,
    total_amount: totalPrice,

    // debug / meta
    storageKey,
    derivedUserId,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default CartContext;
