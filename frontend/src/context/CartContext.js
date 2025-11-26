import React, { createContext, useState, useCallback } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem('cartItems');
    return stored ? JSON.parse(stored) : [];
  });

  const addItem = useCallback((item) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);

      let updated;
      if (existingItem) {
        updated = prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
        );
      } else {
        updated = [...prevItems, { ...item, quantity: item.quantity || 1 }];
      }

      localStorage.setItem('cartItems', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeItem = useCallback((itemId) => {
    setItems((prevItems) => {
      const updated = prevItems.filter((i) => i.id !== itemId);
      localStorage.setItem('cartItems', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateQuantity = useCallback((itemId, quantity) => {
    setItems((prevItems) => {
      const updated = prevItems.map((i) =>
        i.id === itemId ? { ...i, quantity: Math.max(1, quantity) } : i
      );
      localStorage.setItem('cartItems', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem('cartItems');
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    count: items.length,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
