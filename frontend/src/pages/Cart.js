// src/pages/Cart.jsx
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { orderAPI } from '../utils/api';
import { Alert } from '../components/Alert';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, total } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    delivery_address: '',
    delivery_date: '',
    delivery_time: '',
    notes: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError('');

    // Redirect guests to login and preserve return route
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: items.map((item) => ({
          menu_item_id: item.id,
          quantity: item.quantity,
        })),
        ...formData,
      };

      const response = await orderAPI.createOrder(orderData);
      if (response.data.success) {
        clearCart();
        navigate(`/order-confirmation/${response.data.order.id}`);
      } else {
        setError(response.data.message || 'Failed to place order');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
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

  const tax = total * 0.05;
  const deliveryCharge = total > 500 ? 0 : 50;
  const finalTotal = total + tax + deliveryCharge;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-main">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-6 border-b last:border-b-0 hover:bg-gray-50 transition"
                >
                  <img
                    src={item.image || 'https://via.placeholder.com/100'}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                    <p className="text-purple-600 font-bold text-lg">₹{item.price}</p>
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
                    <p className="font-bold text-lg text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>

                  <button onClick={() => removeItem(item.id)} className="text-red-600 hover:text-red-800 p-2" aria-label={`Remove ${item.name}`}>
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
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
                  <span className="font-semibold">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (5%):</span>
                  <span className="font-semibold">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Charge:</span>
                  <span className="font-semibold">{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toFixed(2)}`}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-gray-800 mb-6">
                <span>Total:</span>
                <span className="text-purple-600">₹{finalTotal.toFixed(2)}</span>
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
