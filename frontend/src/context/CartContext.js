// src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";

/**
 * CartContext
 *
 * - Persists cart per-user under localStorage key cart_<userId>, or per-session under cart_guest_<sessionId>.
 * - Consumes AuthContext to reliably detect the current user.
 */

/* -------------------- Helper functions -------------------- */

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

export const CartContext = createContext(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}

export function CartProvider({ children }) {
  // Consume AuthContext to get the current user
  const { user } = useContext(AuthContext) || {};

  // Derive userId from the AuthContext user object
  const derivedUserId = user?.id || user?.userId || user?._id || null;

  // compute the storage key (changes when derivedUserId changes)
  const storageKey = useMemo(() => storageKeyForUserId(derivedUserId), [derivedUserId]);

  // cart is array of items: { id, name, price, qty, ... }
  const [items, setItems] = useState(() => {
    try {
      // Initial load: we might not have AuthContext ready yet if it's async, 
      // but AuthContext usually initializes from localStorage synchronously for the initial state.
      // We'll rely on the useEffect below to correct it if it changes.
      const initialKey = storageKeyForUserId(derivedUserId);
      const raw = localStorage.getItem(initialKey);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed)
        ? parsed.map((it) => ({ ...it, qty: Number(it.qty ?? it.quantity ?? 0), quantity: Number(it.quantity ?? it.qty ?? 0) }))
        : [];
    } catch (e) {
      console.warn("CartProvider: failed to parse stored cart, starting empty", e);
      return [];
    }
  });

  // Merge helper: combine arrays summing quantities by id
  const mergeItems = (listA = [], listB = []) => {
    const map = new Map();
    const normalizeId = (it) => String(it?.id ?? it?._id ?? it?.menu_item_id ?? it?.productId ?? '');
    const addToMap = (arr) => {
      arr.forEach((it) => {
        const id = normalizeId(it);
        if (!id) return;
        const existing = map.get(id) || { ...it, qty: 0, quantity: 0 };
        const inc = Number(it.qty ?? it.quantity ?? 0);
        const newQty = Number(existing.qty ?? existing.quantity ?? 0) + inc;
        map.set(id, { ...existing, qty: newQty, quantity: newQty });
      });
    };
    addToMap(listA);
    addToMap(listB);
    return Array.from(map.values());
  };

  // When derivedUserId changes (login/logout), load the cart for that user (or guest).
  // On login, merge guest cart into the user cart once, then clear the guest cart key.
  useEffect(() => {
    const userKey = storageKeyForUserId(derivedUserId);
    const guestKey = storageKeyForUserId(null);
    try {
      const load = (key) => {
        const raw = localStorage.getItem(key);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed)
          ? parsed.map((it) => ({ ...it, qty: Number(it.qty ?? it.quantity ?? 0), quantity: Number(it.quantity ?? it.qty ?? 0) }))
          : [];
      };

      const userCart = load(userKey);
      const guestCart = load(guestKey);

      // If user is logged in and there is a guest cart, merge and clear guest cart
      if (derivedUserId && guestCart.length > 0) {
        const merged = mergeItems(userCart, guestCart);
        localStorage.setItem(userKey, JSON.stringify(merged));
        localStorage.removeItem(guestKey);
        setItems(merged);
      } else {
        setItems(userCart);
      }
    } catch (e) {
      console.warn("CartProvider: failed to load/merge cart, resetting to empty", e);
      setItems([]);
    }
  }, [derivedUserId]);

  // Persist changes to localStorage under the current user's key
  useEffect(() => {
    try {
      const key = storageKeyForUserId(derivedUserId);
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
    }

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [derivedUserId]);

  /* -------------------- Cart operations -------------------- */

  function addItem(newItem, qty = 1) {
    setItems((prev) => {
      const isObject = newItem && typeof newItem === "object";
      const id = isObject
        ? String(newItem.id ?? newItem._id ?? newItem.productId ?? newItem.sku ?? JSON.stringify(newItem))
        : String(newItem);
      const existsIndex = prev.findIndex((it) => String(it.id ?? it._id ?? it.productId) === id);
      let result;
      if (existsIndex > -1) {
        const copy = [...prev];
        const existingQty = Number(copy[existsIndex].qty || copy[existsIndex].quantity || 0);
        const newQty = existingQty + Number(qty || 0);
        copy[existsIndex] = { ...copy[existsIndex], qty: newQty, quantity: newQty };
        result = copy;
      } else {
        const stored = isObject ? { ...newItem, id, qty: Number(qty || 0), quantity: Number(qty || 0) } : { id, qty: Number(qty || 0), quantity: Number(qty || 0) };
        result = [...prev, stored];
      }
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
    removeItem,
    remove: removeItem,
    updateQty,
    updateQuantity: updateQty,
    updateQuantityCtx: updateQty,
    clearCart,
    clear: clearCart,
    replaceCartFromServer,
    totalQuantity,
    count: totalQuantity, // Alias for totalQuantity for cart icon badge
    totalPrice,
    total: totalPrice,
    total_amount: totalPrice,
    storageKey,
    derivedUserId,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default CartContext;
