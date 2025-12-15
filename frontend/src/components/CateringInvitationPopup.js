// CateringInvitationPopup.jsx
// React component - Shows invitation popup every time user logs in with empty cart

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * CateringInvitationPopup
 * - Shows a friendly invitation popup every time the user logs in with an empty cart.
 * - Props:
 *    - cartItems: array (your cart items). Popup appears when cartItems is empty.
 *    - userId: number/string (user ID). Used for tracking.
 *    - isAuthenticated: boolean (whether user is logged in).
 *    - onBrowse: function called when user clicks the CTA (optional, defaults to navigate to /menu).
 */
export default function CateringInvitationPopup({ 
  cartItems = [], 
  userId = null,
  isAuthenticated = false,
  onBrowse = null 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(100);
  const modalRef = useRef(null);
  const navigate = useNavigate();
  const hasShownInSessionRef = useRef(false);
  const progressTimerRef = useRef(null);

  // Inject component-scoped CSS once
  useEffect(() => {
    if (document.getElementById('catering-invite-styles')) return;

    const css = `
      .catering-invite-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease-out;
        padding: 20px;
      }
      
      .catering-invite-card {
        width: clamp(340px, 45vw, 560px);
        background: linear-gradient(135deg, #ffffff 0%, #fefefe 100%);
        border-radius: 24px;
        padding: 0;
        box-shadow: 0 25px 80px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 106, 40, 0.08);
        font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
        color: #111;
        animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        overflow: hidden;
        position: relative;
      }
      
      .catering-invite-progress-container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: rgba(255, 106, 40, 0.1);
        z-index: 1;
      }
      
      .catering-invite-progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #FF6A28, #FF8B4A);
        transition: width 0.05s linear;
        box-shadow: 0 0 10px rgba(255, 106, 40, 0.5);
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideUp {
        from { 
          opacity: 0;
          transform: translateY(30px) scale(0.96);
        }
        to { 
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      
      
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-8px); }
      }
      
      .catering-invite-content {
        padding: 32px;
      }
      
      .catering-invite-hero {
        display: flex;
        gap: 20px;
        align-items: flex-start;
        margin-bottom: 24px;
      }
      
      .catering-invite-emoji-wrapper {
        flex-shrink: 0;
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, #FFF4F0 0%, #FFE8E0 100%);
        border-radius: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 20px rgba(255, 106, 40, 0.15);
        animation: float 3s ease-in-out infinite;
        padding: 8px;
        overflow: hidden;
      }
      
      .catering-invite-emoji {
        font-size: 40px;
        line-height: 1;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        display: none;
      }
      
      .catering-invite-logo {
        width: 100%;
        height: 100%;
        object-fit: contain;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
      }
      
      .catering-invite-text-wrapper {
        flex: 1;
      }
      
      .catering-invite-title {
        font-size: 26px;
        margin: 0 0 12px 0;
        font-weight: 800;
        background: linear-gradient(135deg, #FF6A28 0%, #FF8B4A 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        line-height: 1.2;
        letter-spacing: -0.5px;
      }
      
      .catering-invite-copy {
        margin: 0 0 8px 0;
        color: #4a5568;
        line-height: 1.7;
        font-size: 16px;
        font-weight: 400;
      }
      
      .catering-invite-subcopy {
        margin: 0 0 28px 0;
        color: #718096;
        line-height: 1.6;
        font-size: 14px;
        font-weight: 400;
      }
      
      .catering-invite-cta {
        display: flex;
        gap: 12px;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 20px;
      }
      
      .catering-btn {
        background: linear-gradient(135deg, #FF6A28 0%, #FF8B4A 100%);
        color: white;
        border: none;
        padding: 14px 28px;
        border-radius: 12px;
        font-weight: 700;
        font-size: 16px;
        cursor: pointer;
        box-shadow: 0 6px 20px rgba(255, 106, 40, 0.35), 0 2px 8px rgba(255, 106, 40, 0.2);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
      }
      
      .catering-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
        transition: left 0.5s;
      }
      
      .catering-btn:hover::before {
        left: 100%;
      }
      
      .catering-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 28px rgba(255, 106, 40, 0.45), 0 4px 12px rgba(255, 106, 40, 0.25);
      }
      
      .catering-btn:active {
        transform: translateY(0);
        box-shadow: 0 4px 16px rgba(255, 106, 40, 0.3);
      }
      
      .catering-btn:focus {
        outline: 3px solid rgba(255, 106, 40, 0.3);
        outline-offset: 3px;
      }
      
      .catering-link {
        background: transparent;
        border: 2px solid #e2e8f0;
        color: #64748b;
        padding: 12px 20px;
        border-radius: 10px;
        cursor: pointer;
        font-weight: 600;
        font-size: 15px;
        transition: all 0.2s ease;
      }
      
      .catering-link:hover {
        background: #f8fafc;
        border-color: #cbd5e1;
        color: #475569;
        transform: translateY(-1px);
      }
      
      .catering-close-btn {
        position: absolute;
        top: 16px;
        right: 16px;
        background: rgba(0, 0, 0, 0.04);
        border: none;
        color: #94a3b8;
        padding: 8px;
        border-radius: 10px;
        cursor: pointer;
        font-size: 22px;
        line-height: 1;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        z-index: 10;
      }
      
      .catering-close-btn:hover {
        background: rgba(0, 0, 0, 0.08);
        color: #64748b;
        transform: rotate(90deg);
      }
      
      
      @media (max-width: 480px) {
        .catering-invite-backdrop {
          padding: 16px;
        }
        
        .catering-invite-card {
          width: 100%;
          border-radius: 20px;
        }
        
        .catering-invite-content {
          padding: 24px;
        }
        
        .catering-invite-hero {
          gap: 16px;
          margin-bottom: 20px;
        }
        
        .catering-invite-emoji-wrapper {
          width: 64px;
          height: 64px;
          border-radius: 16px;
        }
        
        .catering-invite-emoji {
          font-size: 36px;
        }
        
        .catering-invite-title {
          font-size: 22px;
          margin-bottom: 10px;
        }
        
        .catering-invite-copy {
          font-size: 15px;
          margin-bottom: 6px;
        }
        
        .catering-invite-subcopy {
          font-size: 13px;
          margin-bottom: 24px;
        }
        
        .catering-invite-cta {
          flex-direction: column;
          width: 100%;
        }
        
        .catering-btn,
        .catering-link {
          width: 100%;
          justify-content: center;
        }
      }
    `;

    const style = document.createElement('style');
    style.id = 'catering-invite-styles';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }, []);

  // Track when user logs in to show popup once per login session
  const prevUserIdRef = useRef(userId);
  
  useEffect(() => {
    // Reset session flag when user changes (new login)
    if (userId && userId !== prevUserIdRef.current) {
      hasShownInSessionRef.current = false;
      prevUserIdRef.current = userId;
    }
  }, [userId]);

  useEffect(() => {
    // Only show if user is authenticated and has a valid userId
    if (!isAuthenticated) {
      return;
    }
    
    if (!userId) {
      return;
    }
    
    // Ensure cartItems is an array
    if (!Array.isArray(cartItems)) {
      return;
    }

    // Show popup if cart is empty and we haven't shown it in this session yet
    // Add a small delay to ensure all components are mounted and ready
    if (cartItems.length === 0 && !hasShownInSessionRef.current) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        hasShownInSessionRef.current = true;
      }, 1000); // Delay to ensure everything is loaded
      
      return () => clearTimeout(timer);
    } else if (cartItems.length > 0) {
      // If cart has items, close popup if it's open and reset session flag
      setIsOpen(false);
      hasShownInSessionRef.current = false;
    }
  }, [cartItems, isAuthenticated, userId]);

  function handleClose() {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
    }
    setIsOpen(false);
  }

  function handleBrowse() {
    setIsOpen(false);

    if (onBrowse) {
      try {
        onBrowse();
        return;
      } catch (e) {
        // Swallow errors
      }
    }

    // Always navigate to home page first (this ensures we're on the right page)
    navigate('/');

    // Then scroll to menu section after navigation
    setTimeout(() => {
      const el = document.getElementById('menu');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // Fallback: try scrolling after a longer delay
        setTimeout(() => {
          const el = document.getElementById('menu');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
      }
    }, 500); // Give more time for navigation and content loading
  }

  // Focus management: move focus to first button when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        const btn = modalRef.current?.querySelector('.catering-btn');
        if (btn) btn.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(e) {
      if (e.key === 'Escape') {
        handleClose();
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Auto-close timer with progress bar
  useEffect(() => {
    if (!isOpen) {
      setProgress(100);
      return;
    }

    // Reset progress to 100%
    setProgress(100);
    
    const duration = 3000; // 3 seconds
    const interval = 50; // Update every 50ms for smooth animation
    const decrement = (100 / duration) * interval;
    
    let currentProgress = 100;
    
    progressTimerRef.current = setInterval(() => {
      currentProgress -= decrement;
      
      if (currentProgress <= 0) {
        currentProgress = 0;
        setProgress(0);
        clearInterval(progressTimerRef.current);
        handleClose();
      } else {
        setProgress(currentProgress);
      }
    }, interval);

    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="catering-invite-backdrop" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="catering-invite-title"
      onClick={(e) => {
        // Close when clicking backdrop
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="catering-invite-card" ref={modalRef}>
        <div className="catering-invite-progress-container">
          <div 
            className="catering-invite-progress-bar" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <button 
          onClick={handleClose} 
          aria-label="Close invitation" 
          className="catering-close-btn"
          type="button"
        >
          ×
        </button>
        
        <div className="catering-invite-content">
          <div className="catering-invite-hero">
            <div className="catering-invite-emoji-wrapper">
              <img 
                src="/images/cater-chef-logo.png" 
                alt="CaterHub Logo" 
                className="catering-invite-logo"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className="catering-invite-emoji" aria-hidden="true" style={{ display: 'none' }}>🍽️</div>
            </div>
            <div className="catering-invite-text-wrapper">
              <h3 id="catering-invite-title" className="catering-invite-title">
                Start Your Culinary Journey
              </h3>
              <p className="catering-invite-copy">
                Your cart is empty, but your next delicious meal is just a click away! Explore our premium selection of chef-crafted dishes, perfect for any occasion.
              </p>
              <p className="catering-invite-subcopy">
                From intimate gatherings to grand celebrations, we've got you covered.
              </p>
            </div>
          </div>
          
          <div className="catering-invite-cta">
            <button 
              className="catering-btn" 
              onClick={handleBrowse}
              type="button"
            >
              Explore Our Menu
            </button>
            <button 
              className="catering-link" 
              onClick={handleClose}
              type="button"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

