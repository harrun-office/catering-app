import React from 'react';

export const useAuth = () => {
  const context = React.useContext(require('../context/AuthContext').AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const useCart = () => {
  const context = React.useContext(require('../context/CartContext').CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
