// src/pages/Home.js
import React, { useContext, useEffect, useState, useRef } from 'react';
import { MenuItem } from '../components/MenuItem';
import { CartContext } from '../context/CartContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Alert } from '../components/Alert';
import { menuAPI } from '../utils/api';
import { useLocation, Link } from 'react-router-dom';
import { Search, Filter, Menu as MenuIcon, X as CloseIcon, ShoppingCart } from 'lucide-react';

// tiny inline SVG fallback (data URL) used when images missing
const SVG_PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'><rect fill='#f3f4f6' width='100%' height='100%'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='28' fill='#9ca3af'>Image unavailable</text></svg>`
  );

// --------------------
// Inline Toasts component (self-contained)
// --------------------
const Toasts = ({ toasts = [], removeToast = () => { } }) => {
  const getToastStyles = (type) => {
    if (type === 'error') {
      return {
        container: 'bg-red-50 border-red-200 text-red-900',
        iconBg: 'bg-red-100 text-red-700',
        message: 'text-red-800',
      };
    }
    if (type === 'success') {
      return {
        container: 'bg-emerald-50 border-emerald-200 text-emerald-900',
        iconBg: 'bg-emerald-100 text-emerald-700',
        message: 'text-emerald-800',
      };
    }
    return {
      container: 'bg-white border-orange-200 text-[#301b16]',
      iconBg: 'bg-orange-100 text-[#FF6A28]',
      message: 'text-[#301b16]',
    };
  };

  return (
    <div aria-live="polite" className="fixed right-2 sm:right-4 bottom-20 sm:bottom-24 z-50 flex flex-col gap-3 pointer-events-none max-w-[calc(100vw-1rem)]">
      {toasts.slice(0, 1).map((t) => {
        const styles = getToastStyles(t.type);
        return (
          <div
            key={t.id}
            className={`pointer-events-auto w-full max-w-[calc(100vw-2rem)] sm:min-w-[280px] sm:max-w-sm rounded-2xl shadow-[0_14px_40px_rgba(0,0,0,0.15)] overflow-hidden border-2 animate-slide-in ${styles.container}`}
          >
            <div className="flex items-start gap-3 p-4">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${styles.iconBg} font-bold text-base shrink-0`}>
                {t.type === 'error' ? '!' : t.type === 'success' ? '✓' : 'ℹ'}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${styles.message}`}>
                  {t.message}
                </p>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="p-1 rounded-lg hover:bg-black/5 transition-colors shrink-0"
                aria-label="dismiss toast"
              >
                <span className="text-lg leading-none">×</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// --------------------
// Local-first hero assets
// --------------------
const HERO_BACKGROUND = '/images/hero2.jpg';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Menu', to: '#menu' },
  { label: 'Order History', to: '/orders' },
  { label: 'Order Tracking', to: '/tracking' },
  { label: 'About', to: '/about' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact', to: '/contact' },
];

const TESTIMONIALS = [
  { quote: 'Amazing food and spotless service — our event was a hit!', name: 'S. Rao', image: '/images/test1.jpg' },
  { quote: 'On-time, professional and delicious — we highly recommend CaterHub.', name: 'K. Mehta', image: '/images/test2.jpg' },
  { quote: 'The menu matched our theme perfectly. Guests couldn’t stop complimenting the food!', name: 'R. Singh', image: '/images/test3.jpg' },
];


const LOCAL_MENU_IMAGES = ['/images/pasta.jpg'];

const BIRYANI_FEATURES = [
  {
    id: 'biryani-classic',
    name: 'Hyderabadi Dum Biryani',
    description: 'Layered basmati rice, saffron, and slow-cooked chicken sealed in dum.',
    price: 499,
    servings: 4,
    rating: 4.9,
    image: '/images/hyderabadi-biryani.jpg',
    preparation_time: 60,
    is_available: true,
    badge: 'Chef’s Pick',
  },
  {
    id: 'biryani-ambur',
    name: 'Ambur Mutton Biryani',
    description: 'Short-grain seeraga samba rice with tender mutton and spice-laced broth.',
    price: 549,
    servings: 4,
    rating: 4.8,
    image: '/images/ambur-biryani.jpg',
    preparation_time: 70,
    is_available: true,
  },
  {
    id: 'biryani-veg',
    name: 'Royal Veg Biryani',
    description: 'Seasonal vegetables tossed with caramelized onions and cashews.',
    price: 459,
    servings: 4,
    rating: 4.7,
    image: '/images/veg-biryani.jpg',
    preparation_time: 55,
    is_available: true,
  },
  {
    id: 'biryani-paneer',
    name: 'Paneer Tikka Biryani',
    description: 'Smoky paneer tikka cubes layered with fragrant rice and mint.',
    price: 479,
    servings: 4,
    rating: 4.8,
    image: '/images/veg-biryani.jpg',
    preparation_time: 58,
    is_available: true,
  },
];

const MANDHI_FEATURES = [
  {
    id: 'mandhi-chicken',
    name: 'Smoked Chicken Mandhi',
    description: 'Yemeni-style mandi rice with charcoal-smoked chicken and roasted nuts.',
    price: 639,
    servings: 5,
    rating: 4.9,
    image: '/images/chicken-mandhi.jpg',
    preparation_time: 75,
    is_available: true,
    badge: 'Most Loved',
  },
  {
    id: 'mandhi-mutton',
    name: 'Mutton Mandhi',
    description: 'Tender mutton slow-cooked over pit fire, served atop spiced rice.',
    price: 699,
    servings: 5,
    rating: 5,
    image: '/images/mutton-mandhi.jpg',
    preparation_time: 90,
    is_available: true,
  },
  {
    id: 'mandhi-fish',
    name: 'Coastal Fish Mandhi',
    description: 'Coastal marinated fish, lemon zest, and light mandhi spices.',
    price: 619,
    servings: 5,
    rating: 4.6,
    image: '/images/fish-mandhi.jpg',
    preparation_time: 65,
    is_available: true,
  },
  {
    id: 'mandhi-mixed',
    name: 'Family Mixed Mandhi',
    description: 'Chicken + mutton portions with generous toppings, perfect for gatherings.',
    price: 799,
    servings: 6,
    rating: 4.9,
    image: '/images/chicken-mandhi.jpg',
    preparation_time: 85,
    is_available: true,
  },
];

export const Home = () => {
  const { addItem } = useContext(CartContext);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const location = useLocation();

  // hero nav/menu (menu is now handled by SharedHeader in MainLayout)

  // testimonials slider
  const [testIndex, setTestIndex] = useState(0);
  const testTimerRef = useRef(null);

  // Toasts stack
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    fetchCategories();
    startTestimonialTimer();
    return () => {
      stopTestimonialTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle scrolling to sections (menu, hero, etc.)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scrollTo = params.get('scrollTo');

    // Also check for hash in URL
    const hash = window.location.hash.substring(1); // Remove the '#'
    const targetSection = scrollTo || hash;

    if (targetSection) {
      // Use multiple attempts with increasing delays to ensure content is loaded
      const scrollAttempts = [100, 300, 600];

      scrollAttempts.forEach((delay, index) => {
        setTimeout(() => {
          const el = document.getElementById(targetSection);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Clear URL parameters after successful scroll on first attempt
            if (index === 0) {
              window.history.replaceState(null, null, window.location.pathname);
            }
          }
        }, delay);
      });
    }
  }, [location.search, location.hash]);

  useEffect(() => {
    fetchMenuItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, searchTerm]);

  // Testimonials timer
  const startTestimonialTimer = () => {
    stopTestimonialTimer();
    testTimerRef.current = setInterval(() => {
      setTestIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, 5500);
  };
  const stopTestimonialTimer = () => {
    if (testTimerRef.current) clearInterval(testTimerRef.current);
  };

  const fetchCategories = async () => {
    try {
      const response = await menuAPI.getCategories();
      setCategories(response.data.categories || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const getBasename = (p) => {
    if (!p) return '';
    return p.replace(/\\/g, '/').replace(/\/+$/, '').split('/').pop();
  };

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await menuAPI.getMenuItems({
        category_id: selectedCategory,
        search: searchTerm,
        page: 1,
        limit: 200,
      });

      const serverItems = response?.data?.items || [];

      const withImages = serverItems.map((it, index) => {
        const chooseLocal = () => {
          if (it.image) return it.image;
          if (typeof it.id === 'number') return LOCAL_MENU_IMAGES[it.id % LOCAL_MENU_IMAGES.length];
          return LOCAL_MENU_IMAGES[index % LOCAL_MENU_IMAGES.length];
        };

        const raw = it.image || chooseLocal() || LOCAL_MENU_IMAGES[0];

        if (!raw) return { ...it, image: '' };

        if (/^https?:\/\//i.test(raw)) return { ...it, image: raw };

        // Handle /uploads/images/ paths - replace with /images/
        if (raw.startsWith('/uploads/images/')) {
          const filename = raw.replace('/uploads/images/', '');

          // Handle timestamped filenames (e.g., 1764570850911-choco-pie.jpg)
          // Extract the actual name after the timestamp
          const timestampMatch = filename.match(/^\d+-(.+)$/);
          if (timestampMatch) {
            const actualName = timestampMatch[1]; // e.g., "choco-pie.jpg"
            // Try to find a similar image
            const baseName = actualName.replace(/\.(jpg|jpeg|png|gif|webp)$/i, ''); // "choco-pie"

            // Map common variations to existing images
            const imageMap = {
              'choco-pie': 'choco-pie.jpg',
              'chocolate-pie': 'chocolate-cake.jpg',
              'choco-cake': 'chocolate-cake.jpg',
              'vanilla-cake': 'cheesecake.jpg',
              'strawberry-cake': 'cheesecake.jpg',
            };

            const mappedImage = imageMap[baseName] || actualName;
            return { ...it, image: `/images/${mappedImage}` };
          }

          return { ...it, image: `/images/${filename}` };
        }

        if (raw.startsWith('/')) return { ...it, image: raw };
        if (/^[A-Za-z]:\\/.test(raw) || raw.includes('\\')) {
          const name = getBasename(raw);
          return { ...it, image: name ? `/images/${name}` : '' };
        }
        const name = getBasename(raw);
        return { ...it, image: name ? `/images/${name}` : '' };
      });

      setItems(withImages);
    } catch (err) {
      console.error('fetchMenuItems error:', err);
      setError('Failed to load menu items');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const biryaniShowcase = React.useMemo(() => {
    const filtered = items.filter((it) => {
      const name = (it?.name || '').toLowerCase();
      const category = (it?.category_name || '').toLowerCase();
      return name.includes('biryani') || category.includes('biryani');
    });
    return filtered.length ? filtered.slice(0, 4) : BIRYANI_FEATURES;
  }, [items]);

  const mandhiShowcase = React.useMemo(() => {
    const filtered = items.filter((it) => {
      const name = (it?.name || '').toLowerCase();
      const category = (it?.category_name || '').toLowerCase();
      return name.includes('mandhi') || category.includes('mandhi');
    });
    return filtered.length ? filtered.slice(0, 4) : MANDHI_FEATURES;
  }, [items]);

  // Toast helpers - only show one toast at a time
  const showToast = (message, type = 'success', duration = 3200) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    // Replace existing toast with new one
    setToasts([{ id, message, type }]);
    setTimeout(() => removeToast(id), duration);
  };
  const removeToast = (id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  };

  // Home.js — improved handleAddToCart (resolve menu id before adding)
  const handleAddToCart = async (item) => {
    try {
      // helper to try server-side resolution
      const tryResolveMenuId = async (nameOrItem) => {
        try {
          // 1) server-side "findMatch"
          if (menuAPI.findMatch) {
            try {
              const fm = await menuAPI.findMatch(nameOrItem);
              if (fm?.data?.item && (typeof fm.data.item.id === 'number' || typeof fm.data.item.id === 'string')) {
                return Number(fm.data.item.id);
              }
            } catch (e) {
              // ignore and continue
            }
          }

          // 2) search API
          const res = await menuAPI.getMenuItems({ search: nameOrItem, limit: 12 });
          const list = res?.data?.items || [];
          if (!list.length) return null;

          // prefer exact normalized match
          const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
          const sName = norm(nameOrItem);
          const exact = list.find((it) => norm(it.name) === sName);
          if (exact) return Number(exact.id);

          // fallback: choose best token-match candidate
          const tokens = sName.split(' ').filter(Boolean);
          let best = null;
          let bestScore = -Infinity;
          for (const cand of list) {
            const cn = norm(cand.name);
            let score = 0;
            if (cn.includes(sName)) score += 5;
            for (const t of tokens) if (cn.includes(t)) score += 1;
            if (score > bestScore) {
              bestScore = score;
              best = cand;
            }
          }
          if (best && bestScore > 0) return Number(best.id);
        } catch (err) {
          console.error('tryResolveMenuId error', err);
        }
        return null;
      };

      // prefer numeric id if already present
      let menuItemId = Number(item.id);
      if (!Number.isFinite(menuItemId) || menuItemId <= 0) {
        const resolved = await tryResolveMenuId(item.name ?? item.id);
        if (resolved && Number.isFinite(resolved) && resolved > 0) menuItemId = resolved;
      }

      // If resolved to numeric id — add numeric item to cart
      if (Number.isFinite(menuItemId) && menuItemId > 0) {
        addItem(
          {
            id: Number(menuItemId),
            name: item.name,
            price: Number(item.price) || 0,
            image: item.image,
          },
          1
        );
        setSuccessMessage(`${item.name} added to cart!`);
        showToast(`${item.name} added to cart!`, 'success', 3200);
        setTimeout(() => setSuccessMessage(''), 3000);
        return;
      }

      // fallback: keep local-preview behavior (unchanged)
      const fallbackId = String(item.id ?? item.name ?? `local-${Date.now()}`);
      addItem(
        {
          id: fallbackId,
          name: item.name,
          price: Number(item.price) || 0,
          image: item.image,
          _isLocalShowcase: true,
        },
        1
      );
      setSuccessMessage(`${item.name} added to cart!`);
      showToast(`${item.name} added to cart`, 'success', 4200);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('handleAddToCart error:', err);
      showToast('Could not add item to cart. Please try again.', 'error', 4500);
    }
  };



  // shared image error handler: swap to SVG placeholder if local image missing or blocked
  const handleImgError = (e) => {
    const t = e?.target;
    if (t && !t.dataset.fallback) {
      t.dataset.fallback = '1';
      t.src = SVG_PLACEHOLDER;
    }
  };



  return (
    <div className="min-h-screen bg-bg-warm text-gray-900 w-full">
      {/* Toasts container */}
      <Toasts toasts={toasts} removeToast={removeToast} />


      {/* HERO */}
      <section id="hero" className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_BACKGROUND}
            alt="Chef plating dishes"
            onError={handleImgError}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/65" />
        </div>


        <div className="relative z-20 flex items-center justify-center text-center min-h-[60vh] sm:min-h-[70vh] px-4 sm:px-6 py-12 sm:py-0">
          <div className="space-y-3 sm:space-y-4 max-w-3xl text-white">
            <p className="text-xs sm:text-sm md:text-base uppercase tracking-[0.25em] sm:tracking-[0.35em] text-white/80 px-2">Fine food... with a passion!</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-tight px-2">Serving delicious</h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 px-4 sm:px-0 max-w-2xl mx-auto leading-relaxed">
              Crafted menus and warm service for gatherings, celebrations, and every meal in between.
            </p>
          </div>
        </div>

      </section>

      {/* page content */}
      <div className="container-main py-6 sm:py-8 md:py-12 text-gray-900 px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-2xl mx-auto mb-8">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[#FF6A28]" size={18} />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for dishes..."
            className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg text-gray-800 border border-primary-200/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white/80"
          />
        </div>
        {successMessage && <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />}
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {/* Quick features */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-8 sm:mb-10 md:mb-12">
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-5 sm:p-6 text-center border border-primary-200 shadow-md hover:shadow-lg transition-all hover:scale-[1.02]">
            <h3 className="font-bold text-base sm:text-lg mb-2 gradient-text">Fresh Ingredients</h3>
            <p className="text-xs sm:text-sm text-body leading-relaxed" style={{ color: 'oklch(0.42 0.010 260)' }}>Sourcing local produce and preparing dishes to order.</p>
          </div>
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-5 sm:p-6 text-center border border-primary-200 shadow-md hover:shadow-lg transition-all hover:scale-[1.02]">
            <h3 className="font-bold text-base sm:text-lg mb-2 gradient-text">Custom Menus</h3>
            <p className="text-xs sm:text-sm text-body leading-relaxed" style={{ color: 'oklch(0.42 0.010 260)' }}>Vegan, gluten-free, or party platters — we create a menu that fits you.</p>
          </div>
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-5 sm:p-6 text-center border border-primary-200 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] sm:col-span-2 lg:col-span-1">
            <h3 className="font-bold text-base sm:text-lg mb-2 gradient-text">Trusted Service</h3>
            <p className="text-xs sm:text-sm text-body leading-relaxed" style={{ color: 'oklch(0.42 0.010 260)' }}>On-time delivery, professional presentation, and friendly staff.</p>
          </div>
        </section>

        {/* Biryani section */}
        <section className="mb-8 sm:mb-10 md:mb-12">
          <div className="flex flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6 pl-3 sm:pl-4 relative">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 sm:w-1 bg-primary rounded-full"></div>
            <div className="flex-1 min-w-0 pr-2">
              <p className="text-xs sm:text-sm uppercase tracking-wide text-primary font-semibold mb-1">Signature Feast</p>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold gradient-text leading-tight">Biryani & Dum Delights</h2>
              <p className="text-xs sm:text-sm text-body mt-1.5 sm:mt-2 leading-relaxed" style={{ color: 'oklch(0.42 0.010 260)' }}>Hand-layered rice, saffron aromas, and slow-cooked proteins ready for gatherings.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 xs:gap-4 sm:gap-4 md:gap-5 lg:gap-5 xl:gap-6">
            {biryaniShowcase.map((item) => (
              <MenuItem key={`biryani-${item.id}`} item={item} onAddToCart={handleAddToCart} onImgError={handleImgError} />
            ))}
          </div>
        </section>

        {/* Mandhi section */}
        <section className="mb-8 sm:mb-10 md:mb-12">
          <div className="flex flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6 pl-3 sm:pl-4 relative">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 sm:w-1 bg-[#FF6A28] rounded-full"></div>
            <div className="flex-1 min-w-0 pr-2">
              <p className="text-xs sm:text-sm uppercase tracking-wide text-primary font-semibold mb-1">Arabic Table</p>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold gradient-text leading-tight">Mandhi & Smoky Platters</h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1.5 sm:mt-2 leading-relaxed">Pit-roasted meats over spiced rice, topped with roasted nuts and caramelized onions.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 xs:gap-4 sm:gap-4 md:gap-5 lg:gap-5 xl:gap-6">
            {mandhiShowcase.map((item) => (
              <MenuItem key={`mandhi-${item.id}`} item={item} onAddToCart={handleAddToCart} onImgError={handleImgError} />
            ))}
          </div>
        </section>

        {/* Menu */}
        <section id="menu" className="mb-8 sm:mb-10 md:mb-12">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6 pl-3 sm:pl-4 relative">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 sm:w-1 bg-primary rounded-full"></div>
            <Filter size={18} className="text-primary shrink-0 hidden sm:block" />
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-primary">Signature List</p>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold gradient-text leading-tight">Our Menu</h2>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8 sm:mb-10 min-h-[80px] items-center">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`relative group px-6 py-2.5 rounded-full font-bold text-sm sm:text-base transition-all duration-300 flex items-center focus:outline-none focus:ring-0 ${selectedCategory === null
                ? 'text-[#FF6A28]'
                : 'text-gray-500 hover:text-primary'
                }`}
            >
              All Items
              {/* Hand Logo Animation */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 z-10 pointer-events-none transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) ${selectedCategory === null
                  ? '-top-6 opacity-100 scale-100'
                  : 'top-1/2 opacity-0 scale-0 group-hover:-top-6 group-hover:opacity-100 group-hover:scale-100'
                  }`}
              >
                <img
                  src="/images/hand-logo.png"
                  alt=""
                  className="w-full h-full object-contain drop-shadow-md transform scale-110"
                  style={{ filter: 'brightness(0) saturate(100%) invert(56%) sepia(34%) saturate(3014%) hue-rotate(336deg) brightness(100%) contrast(101%)' }}
                />
              </div>
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`relative group px-6 py-2.5 rounded-full font-bold text-sm sm:text-base transition-all duration-300 flex items-center focus:outline-none focus:ring-0 ${selectedCategory === c.id
                  ? 'text-[#FF6A28]'
                  : 'text-gray-500 hover:text-primary'
                  }`}
              >
                {c.name}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 z-10 pointer-events-none transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) ${selectedCategory === c.id
                    ? '-top-6 opacity-100 scale-100'
                    : 'top-1/2 opacity-0 scale-0 group-hover:-top-6 group-hover:opacity-100 group-hover:scale-100'
                    }`}
                >
                  <img
                    src="/images/hand-logo.png"
                    alt=""
                    className="w-full h-full object-contain drop-shadow-md transform scale-110"
                    style={{ filter: 'brightness(0) saturate(100%) invert(56%) sepia(34%) saturate(3014%) hue-rotate(336deg) brightness(100%) contrast(101%)' }}
                  />
                </div>
              </button>
            ))}
          </div>



          {loading ? (
            <div className="py-12">
              <LoadingSpinner size="lg" text="Loading delicious items..." />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-8 border border-primary-200">
              <p className="text-2xl gradient-text font-semibold">No items found</p>
              <p className="text-gray-600 mt-2">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 xs:gap-4 sm:gap-4 md:gap-5 lg:gap-5 xl:gap-6">
              {items.map((item) => (
                <div key={item.id}>
                  <MenuItem item={item} onAddToCart={handleAddToCart} onImgError={handleImgError} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Testimonials slider */}
        <section className="mb-8 sm:mb-10 md:mb-12">
          <div className="pl-3 sm:pl-4 mb-4 sm:mb-5 relative">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 sm:w-1 bg-primary rounded-full"></div>
            <p className="text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-primary">Voices</p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold gradient-text leading-tight">Testimonials</h2>
          </div>
          <div
            className="relative bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 sm:p-6 shadow-lg border border-orange-200 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 overflow-hidden"
            onMouseEnter={stopTestimonialTimer}
            onMouseLeave={startTestimonialTimer}
          >
            <button
              aria-label="previous testimonial"
              onClick={() => setTestIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              className="absolute left-2 sm:relative sm:left-0 px-3 py-2 text-primary hover:text-primary-dark text-2xl sm:text-3xl z-10 sm:z-auto"
            >
              ‹
            </button>

            <div className="flex-1 text-center sm:text-left w-full sm:w-auto px-2 sm:px-0">
              <p className="text-base sm:text-lg md:text-xl italic leading-relaxed">"{TESTIMONIALS[testIndex].quote}"</p>
              <div className="flex items-center justify-center sm:justify-start gap-3 mt-4">
                <img src={TESTIMONIALS[testIndex].image} alt={TESTIMONIALS[testIndex].name} onError={handleImgError} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shrink-0" />
                <div>
                  <p className="font-semibold text-sm sm:text-base">{TESTIMONIALS[testIndex].name}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Satisfied Customer</p>
                </div>
              </div>
            </div>

            <button
              aria-label="next testimonial"
              onClick={() => setTestIndex((i) => (i + 1) % TESTIMONIALS.length)}
              className="absolute right-2 sm:relative sm:right-0 px-3 py-2 text-primary hover:text-primary-dark text-2xl sm:text-3xl z-10 sm:z-auto"
            >
              ›
            </button>

            {/* Mobile indicator dots */}
            <div className="flex gap-2 sm:hidden mt-2">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setTestIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${idx === testIndex ? 'bg-primary w-6' : 'bg-primary/30'
                    }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-12 sm:mb-16 md:mb-24 text-center bg-gradient-to-r from-primary to-primary-light rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 shadow-xl mx-2 sm:mx-0">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 text-white leading-tight px-2">Ready to delight your guests?</h3>
          <p className="text-white/90 mb-5 sm:mb-6 text-sm sm:text-base md:text-lg px-2">Contact us for a custom quote and menu tasting.</p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
            <button
              onClick={() => {
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else window.location.href = '/contact';
              }}
              className="bg-white text-[#FF6A28] px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base w-full sm:w-auto"
            >
              Request a Quote
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('menu');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-white/20 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base w-full sm:w-auto"
            >
              Browse Menu
            </button>
          </div>
        </section>
      </div >


    </div >
  );
};

export default Home;
