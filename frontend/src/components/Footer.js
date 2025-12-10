import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Clock, DollarSign, Mail, Phone, Instagram, Twitter, Facebook } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-950 to-black text-white mt-12">
      <div className="container-main py-12 space-y-8">
        {/* CTA strip */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg shadow-black/20">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/80">Plan an event</p>
            <h3 className="text-xl md:text-2xl font-bold">Need catering for your next gathering?</h3>
            <p className="text-white/80 text-sm mt-1">We’ll help you with menus, quantities, and timelines.</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/contact"
              className="bg-[#FF6A28] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#E85A1F] transition-all shadow-md hover:shadow-lg"
            >
              Talk to us
            </Link>
            <Link
              to="/menu"
              className="bg-white/10 text-white px-5 py-3 rounded-xl font-semibold border border-white/15 hover:bg-white/15 transition-all"
            >
              View menu
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#FF6A28] to-[#ff8a4c] bg-clip-text text-transparent">CaterHub</h3>
            <p className="text-gray-300 text-sm mb-4">
              Premium catering services at your doorstep. Delicious food, real-time delivery tracking, and exceptional service.
            </p>
            <div className="flex gap-3 text-white/80">
              <a href="https://facebook.com" className="hover:text-[#FF6A28] transition-colors" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="https://twitter.com" className="hover:text-[#FF6A28] transition-colors" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="https://instagram.com" className="hover:text-[#FF6A28] transition-colors" aria-label="Instagram">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-[#FF6A28]">Quick Links</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-white transition">
                  Browse Menu
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Contact Us
                </Link>
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
                <a href="tel:+91234567890" className="hover:text-white transition flex items-center gap-2">
                  <Phone size={16} /> +91 234 567 890
                </a>
              </li>
              <li>
                <a href="mailto:info@caterhub.com" className="hover:text-white transition flex items-center gap-2">
                  <Mail size={16} /> info@caterhub.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-[#FC4300]">
              <Clock size={18} />
            </div>
            <div>
              <p className="font-semibold">Fast Delivery</p>
              <p className="text-xs text-gray-400">30-45 minutes</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-[#FC4300]">
              <DollarSign size={18} />
            </div>
            <div>
              <p className="font-semibold">Best Price</p>
              <p className="text-xs text-gray-400">Quality guaranteed</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-[#FC4300]">
              <Heart size={18} />
            </div>
            <div>
              <p className="font-semibold">Quality Food</p>
              <p className="text-xs text-gray-400">Fresh ingredients</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; 2025 CaterHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
