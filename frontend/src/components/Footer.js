import React from 'react';
import { Heart, MapPin, Clock, DollarSign } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="container-main py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">🍽️ CaterHub</h3>
            <p className="text-gray-300 text-sm mb-4">
              Premium catering services at your doorstep. Delicious food, real-time delivery tracking, and exceptional service.
            </p>
            <div className="flex gap-4">
              <a href="www.facebook.com" className="text-purple-400 hover:text-purple-300">
                Facebook
              </a>
              <a href="www.twitter.com" className="text-purple-400 hover:text-purple-300">
                Twitter
              </a>
              <a href="www.instagram.com" className="text-purple-400 hover:text-purple-300">
                Instagram
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <a href="/" className="hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-white transition">
                  Browse Menu
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-white transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-white transition">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-lg mb-4">Support</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <a href="/" className="hover:text-white transition">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-white transition">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-white transition">
                  Returns
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contact</h4>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li className="flex items-center gap-2">
                <MapPin size={16} /> 123 Food Street, City
              </li>
              <li>
                <a href="tel:+91234567890" className="hover:text-white transition">
                  +91 234 567 890
                </a>
              </li>
              <li>
                <a href="mailto:info@caterhub.com" className="hover:text-white transition">
                  info@caterhub.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <Clock className="text-purple-400" />
            <div>
              <p className="font-semibold">Fast Delivery</p>
              <p className="text-xs text-gray-400">30-45 minutes</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DollarSign className="text-purple-400" />
            <div>
              <p className="font-semibold">Best Price</p>
              <p className="text-xs text-gray-400">Quality guaranteed</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Heart className="text-purple-400" />
            <div>
              <p className="font-semibold">Quality Food</p>
              <p className="text-xs text-gray-400">Fresh ingredients</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; 2024 CaterHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
