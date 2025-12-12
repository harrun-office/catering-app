import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Clock, IndianRupee, Mail, Phone, Instagram, Twitter, Facebook, Linkedin, Youtube, ArrowRight, CheckCircle2, ChefHat, Truck, Shield, Award } from 'lucide-react';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white mt-16 overflow-hidden" style={{ '--link-color': 'inherit' }}>
      <style>{`
        footer a {
          color: inherit !important;
        }
        footer a:link,
        footer a:visited,
        footer a:active {
          color: inherit !important;
        }
        footer input:focus {
          outline: none !important;
          box-shadow: 0 0 0 2px rgba(255, 106, 40, 0.5) !important;
        }
        footer input:focus-visible {
          outline: none !important;
          box-shadow: 0 0 0 2px rgba(255, 106, 40, 0.5) !important;
        }
      `}</style>
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10"></div>
      
      <div className="relative container-main py-16 space-y-12">
        {/* CTA strip */}
        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6 bg-gradient-to-r from-primary/30 via-primary/20 to-secondary/30 backdrop-blur-sm border border-primary/30 rounded-2xl p-8 md:p-10 shadow-2xl">
          <div className="flex-1 text-center lg:text-left">
            <p className="text-sm uppercase tracking-[0.3em] text-primary-lighter mb-2 font-semibold">Plan an event</p>
            <h3 className="text-2xl md:text-3xl font-bold mb-2 text-white">Ready to make your event unforgettable?</h3>
            <p className="text-gray-200 text-base">We'll help you with custom menus, quantities, and seamless planning.</p>
          </div>
          <div className="flex flex-wrap gap-4 justify-center lg:justify-end">
            <Link
              to="/contact"
              className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              Get a Quote
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/menu"
              className="px-6 py-3 rounded-xl font-semibold border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all transform hover:-translate-y-0.5"
            >
              View Menu
            </Link>
          </div>
        </div>

        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-5">
              <span className="text-3xl font-bold text-white hover:opacity-90 transition-opacity cursor-pointer inline-block bg-gradient-to-r from-primary via-primary-light to-secondary bg-clip-text text-transparent">
                CaterHub
              </span>
            </Link>
            <p className="text-gray-200 text-sm leading-relaxed mb-6 max-w-md">
              Premium catering services at your doorstep. We deliver delicious food with real-time tracking and exceptional service that makes every occasion special.
            </p>
            
            {/* Social Media Links */}
            <div className="flex gap-4 mb-6">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center text-white/80 hover:text-white transition-all transform hover:scale-110 hover:shadow-lg hover:shadow-primary/50" 
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center text-white/80 hover:text-white transition-all transform hover:scale-110 hover:shadow-lg hover:shadow-primary/50" 
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-primary hover:to-secondary flex items-center justify-center text-white/80 hover:text-white transition-all transform hover:scale-110 hover:shadow-lg hover:shadow-primary/50" 
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-white/10 hover:bg-secondary flex items-center justify-center text-white/80 hover:text-white transition-all transform hover:scale-110 hover:shadow-lg hover:shadow-secondary/50" 
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-white/10 hover:bg-secondary flex items-center justify-center text-white/80 hover:text-white transition-all transform hover:scale-110 hover:shadow-lg hover:shadow-secondary/50" 
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
            </div>

            {/* Newsletter Signup */}
            <div className="mt-8">
              <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">Subscribe to our newsletter</h4>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 border border-white/30 text-white placeholder:text-gray-300 focus:outline-none transition-all"
                  style={{ 
                    '--tw-ring-color': 'rgb(255, 106, 40)',
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = '0 0 0 2px rgba(255, 106, 40, 0.5)';
                    e.target.style.outline = 'none';
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = '';
                  }}
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg font-semibold hover:from-primary-light hover:to-primary transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  {subscribed ? (
                    <>
                      <CheckCircle2 size={18} />
                      Subscribed!
                    </>
                  ) : (
                    <>
                      Subscribe
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-5 text-primary flex items-center gap-2" style={{ color: '#FF6A28' }}>
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-200 hover:text-primary transition-colors flex items-center gap-2 group text-sm font-medium"
                  style={{ '--hover-color': '#FF6A28' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-primary transition-all"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/menu" 
                  className="text-gray-200 hover:text-primary transition-colors flex items-center gap-2 group text-sm font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-primary transition-all"></span>
                  Browse Menu
                </Link>
              </li>
              <li>
                <Link 
                  to="/gallery" 
                  className="text-gray-200 hover:text-primary transition-colors flex items-center gap-2 group text-sm font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-primary transition-all"></span>
                  Gallery
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-200 hover:text-primary transition-colors flex items-center gap-2 group text-sm font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-primary transition-all"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-200 hover:text-primary transition-colors flex items-center gap-2 group text-sm font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-primary transition-all"></span>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/orders" 
                  className="text-gray-200 hover:text-primary transition-colors flex items-center gap-2 group text-sm font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-primary transition-all"></span>
                  Order History
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-lg mb-5 flex items-center gap-2" style={{ color: '#FF6A28' }}>
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="/tracking" 
                  className="text-gray-200 hover:text-primary transition-colors flex items-center gap-2 group text-sm font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-primary transition-all"></span>
                  Track Order
                </a>
              </li>
              <li>
                <a 
                  href="/" 
                  className="text-gray-200 hover:text-primary transition-colors flex items-center gap-2 group text-sm font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-primary transition-all"></span>
                  FAQ
                </a>
              </li>
              <li>
                <a 
                  href="/" 
                  className="text-gray-200 hover:text-primary transition-colors flex items-center gap-2 group text-sm font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-primary transition-all"></span>
                  Delivery Info
                </a>
              </li>
              <li>
                <a 
                  href="/" 
                  className="text-gray-200 hover:text-primary transition-colors flex items-center gap-2 group text-sm font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-primary transition-all"></span>
                  Terms of Service
                </a>
              </li>
              <li>
                <a 
                  href="/" 
                  className="text-gray-200 hover:text-primary transition-colors flex items-center gap-2 group text-sm font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-primary transition-all"></span>
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-5 text-white flex items-center gap-2">
              Get in Touch
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <div className="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors" style={{ backgroundColor: 'rgba(255, 106, 40, 0.2)' }}>
                  <MapPin size={16} style={{ color: '#FF6A28' }} />
                </div>
                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-200 hover:text-white transition-colors text-sm leading-relaxed font-medium"
                >
                  123 Food Street,<br />
                  City, State 12345
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors" style={{ backgroundColor: 'rgba(255, 106, 40, 0.2)' }}>
                  <Phone size={16} style={{ color: '#FF6A28' }} />
                </div>
                <a 
                  href="tel:+91234567890" 
                  className="text-gray-200 hover:text-white transition-colors text-sm font-medium"
                >
                  +91 234 567 890
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors" style={{ backgroundColor: 'rgba(255, 106, 40, 0.2)' }}>
                  <Mail size={16} style={{ color: '#FF6A28' }} />
                </div>
                <a 
                  href="mailto:info@caterhub.com" 
                  className="text-gray-200 hover:text-white transition-colors text-sm font-medium break-all"
                >
                  info@caterhub.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-10 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 transition-all group cursor-default">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform flex-shrink-0">
              <Truck size={20} />
            </div>
            <div>
              <p className="font-semibold text-white mb-1">Fast Delivery</p>
              <p className="text-xs text-gray-400">30-45 minutes</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 transition-all group cursor-default">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform flex-shrink-0">
              <Award size={20} />
            </div>
            <div>
              <p className="font-semibold text-white mb-1">Premium Quality</p>
              <p className="text-xs text-gray-400">Chef-crafted meals</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 transition-all group cursor-default">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform flex-shrink-0">
              <ChefHat size={20} />
            </div>
            <div>
              <p className="font-semibold text-white mb-1">Expert Chefs</p>
              <p className="text-xs text-gray-400">Masterful preparation</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 transition-all group cursor-default">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform flex-shrink-0">
              <Shield size={20} />
            </div>
            <div>
              <p className="font-semibold text-white mb-1">Safe & Secure</p>
              <p className="text-xs text-gray-400">Hygiene guaranteed</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 pt-8 pb-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-300 text-sm text-center md:text-left font-medium">
              &copy; {new Date().getFullYear()} CaterHub. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-300">
              <a href="/" className="hover:text-primary transition-colors font-medium" style={{ '--hover-color': '#FF6A28' }}>Terms</a>
              <a href="/" className="hover:text-primary transition-colors font-medium">Privacy</a>
              <a href="/" className="hover:text-primary transition-colors font-medium">Cookies</a>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-300 text-xs">
              Made with <Heart size={12} className="inline mx-1" style={{ color: '#FF6A28' }} /> for food lovers everywhere
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
