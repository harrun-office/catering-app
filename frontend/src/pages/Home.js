// src/pages/Home.js
import React, { useContext, useEffect, useState, useRef } from 'react';
import { MenuItem } from '../components/MenuItem';
import { CartContext } from '../context/CartContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Alert } from '../components/Alert';
import { menuAPI } from '../utils/api';
import { useLocation, Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';

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
  return (
    <div aria-live="polite" className="fixed right-4 bottom-6 z-50 flex flex-col gap-3">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`min-w-[200px] max-w-sm rounded-lg shadow-lg overflow-hidden border ${t.type === 'error' ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'
            }`}
        >
          <div className="flex items-start gap-3 p-3">
            <div className="flex-1">
              <p className={`text-sm font-medium ${t.type === 'error' ? 'text-red-700' : 'text-gray-900'}`}>
                {t.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="p-1 rounded hover:bg-gray-100"
              aria-label="dismiss toast"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// --------------------
// Local-first image arrays (point to public/images)
// --------------------
const HERO_IMAGES = [
  { src: '/images/hero1.jpg', alt: 'Beautiful catering spread', caption: 'Memorable events start with great food' },
  { src: '/images/hero2.jpg', alt: 'Chef plating dishes', caption: 'Crafted by chefs who care' },
  { src: '/images/hero3.jpg', alt: 'Elegant buffet', caption: 'Perfect for weddings & corporate events' },
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

  // hero carousel
  const [heroIndex, setHeroIndex] = useState(0);
  const heroTimerRef = useRef(null);

  // testimonials slider
  const [testIndex, setTestIndex] = useState(0);
  const testTimerRef = useRef(null);

  // Toasts stack
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    fetchCategories();
    const params = new URLSearchParams(location.search);
    const scrollTo = params.get('scrollTo');
    if (scrollTo) {
      setTimeout(() => {
        const el = document.getElementById(scrollTo);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 180);
    }

    startHeroTimer();
    startTestimonialTimer();
    return () => {
      stopHeroTimer();
      stopTestimonialTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchMenuItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, searchTerm]);

  // HERO timer
  const startHeroTimer = () => {
    stopHeroTimer();
    heroTimerRef.current = setInterval(() => {
      setHeroIndex((i) => {
        const nextIndex = (i + 1) % HERO_IMAGES.length;
        return nextIndex;
      });
    }, 3500);
  };
  const stopHeroTimer = () => {
    if (heroTimerRef.current) clearInterval(heroTimerRef.current);
  };

  // Swipe support
  const touchStart = useRef(null);
  const touchEnd = useRef(null);

  const onTouchStart = (e) => {
    touchEnd.current = null;
    touchStart.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const distance = touchStart.current - touchEnd.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setHeroIndex((i) => (i + 1) % HERO_IMAGES.length);
      startHeroTimer();
    }
    if (isRightSwipe) {
      setHeroIndex((i) => (i - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
      startHeroTimer();
    }
  };

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

  // Toast helpers
  const showToast = (message, type = 'success', duration = 3200) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setToasts((t) => [...t, { id, message, type }]);
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
    <div className="min-h-screen bg-[#F7F7F7] pt-0">
      {/* Toasts container */}
      <Toasts toasts={toasts} removeToast={removeToast} />

      {/* HERO */}
      <section
        id="hero"
        className="relative container-main px-0 mt-0 max-w-6xl mx-auto"
      >
        <div
        className="relative h-[360px] md:h-[460px] overflow-hidden rounded-3xl shadow-[0_12px_32px_rgba(0,0,0,0.16)] bg-white/30 backdrop-blur-[6px] group"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {HERO_IMAGES.map((h, i) => (
            <div
              key={h.src}
              aria-hidden={i !== heroIndex}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out transform rounded-[32px] ${i === heroIndex
                ? 'translate-x-0 opacity-100 z-10 scale-100'
                : 'opacity-0 z-0 scale-95'
                }`}
            >
              <img src={h.src} alt={h.alt} onError={handleImgError} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center">
                <div className="container-main text-white pl-8 md:pl-16">
                  <h1 className={`text-4xl md:text-6xl font-bold drop-shadow-lg transform transition-all duration-500 delay-75 ${i === heroIndex ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    {h.caption}
                  </h1>
                  <p className={`mt-4 max-w-2xl text-lg md:text-xl text-white/90 transform transition-all duration-500 delay-150 ${i === heroIndex ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    Fresh, flavour-first meals, customizable menus, and a friendly team that cares about every detail.
                  </p>

                  <div className={`mt-8 flex gap-4 transform transition-all duration-500 delay-200 ${i === heroIndex ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <a
                      href="#menu"
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById('menu');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="btn-primary text-lg px-8 py-3 hover:-translate-y-0.5"
                    >
                      Browse Menu
                    </a>
                    <Link to="/contact" className="btn-secondary text-lg px-8 py-3 hover:-translate-y-0.5">
                      Contact Us
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={() => {
              setHeroIndex((i) => (i - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
              startHeroTimer();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/70 text-[#FF6A28] hover:bg-white shadow-lg backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <button
            onClick={() => {
              setHeroIndex((i) => (i + 1) % HERO_IMAGES.length);
              startHeroTimer();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/70 text-[#FF6A28] hover:bg-white shadow-lg backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
          </button>

          {/* Hero controls & Progress */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4 z-20">
            <div className="flex gap-3">
              {HERO_IMAGES.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => {
                    setHeroIndex(i);
                    startHeroTimer();
                  }}
                  className={`relative h-1.5 rounded-full transition-all duration-300 overflow-hidden ${i === heroIndex ? 'w-12 bg-white/30' : 'w-6 bg-white/30 hover:bg-white/50'}`}
                >
                  {i === heroIndex && (
                    <div className="absolute inset-0 bg-white animate-[progress_3.5s_linear_infinite]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* page content */}
      <div className="container-main py-12">
        {successMessage && <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />}
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {/* Quick features */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 text-center border border-orange-200 shadow-md hover:shadow-lg transition-all">
            <h3 className="font-bold text-lg mb-2 bg-gradient-to-r from-[#FF6A28] to-[#FF8B4A] bg-clip-text text-transparent">Fresh Ingredients</h3>
            <p className="text-sm text-gray-600">Sourcing local produce and preparing dishes to order.</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 text-center border border-orange-200 shadow-md hover:shadow-lg transition-all">
            <h3 className="font-bold text-lg mb-2 bg-gradient-to-r from-[#FF6A28] to-[#FF8B4A] bg-clip-text text-transparent">Custom Menus</h3>
            <p className="text-sm text-gray-600">Vegan, gluten-free, or party platters — we create a menu that fits you.</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 text-center border border-orange-200 shadow-md hover:shadow-lg transition-all">
            <h3 className="font-bold text-lg mb-2 bg-gradient-to-r from-[#FF6A28] to-[#FF8B4A] bg-clip-text text-transparent">Trusted Service</h3>
            <p className="text-sm text-gray-600">On-time delivery, professional presentation, and friendly staff.</p>
          </div>
        </section>

        {/* Biryani section */}
        <section className="mb-12">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pl-4 relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF6A28] rounded-full"></div>
            <div>
              <p className="text-sm uppercase tracking-wide text-[#FF6A28] font-semibold">Signature Feast</p>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#FF6A28] to-[#FF8B4A] bg-clip-text text-transparent">Biryani & Dum Delights</h2>
              <p className="text-sm text-gray-600 mt-1">Hand-layered rice, saffron aromas, and slow-cooked proteins ready for gatherings.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {biryaniShowcase.map((item) => (
              <MenuItem key={`biryani-${item.id}`} item={item} onAddToCart={handleAddToCart} onImgError={handleImgError} />
            ))}
          </div>
        </section>

        {/* Mandhi section */}
        <section className="mb-12">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pl-4 relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF6A28] rounded-full"></div>
            <div>
              <p className="text-sm uppercase tracking-wide text-[#FF6A28] font-semibold">Arabic Table</p>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#FF6A28] to-[#FF8B4A] bg-clip-text text-transparent">Mandhi & Smoky Platters</h2>
              <p className="text-sm text-gray-600 mt-1">Pit-roasted meats over spiced rice, topped with roasted nuts and caramelized onions.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mandhiShowcase.map((item) => (
              <MenuItem key={`mandhi-${item.id}`} item={item} onAddToCart={handleAddToCart} onImgError={handleImgError} />
            ))}
          </div>
        </section>

        {/* Menu */}
        <section id="menu" className="mb-12">
          <div className="flex items-center gap-4 mb-6 pl-4 relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF6A28] rounded-full"></div>
            <Filter size={20} className="text-[#FF6A28]" />
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[#FF6A28]">Signature List</p>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#FF6A28] to-[#FF8B4A] bg-clip-text text-transparent">Our Menu</h2>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap mb-6">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedCategory === null ? 'bg-[#FF6A28] text-white shadow-lg' : 'bg-white border border-orange-200 text-gray-700 hover:border-[#FF6A28] hover:bg-orange-50'}`}
            >
              All Items
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedCategory === c.id ? 'bg-[#FF6A28] text-white shadow-lg' : 'bg-white border border-orange-200 text-gray-700 hover:border-[#FF6A28] hover:bg-orange-50'}`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="relative max-w-2xl mb-6">
            <Search className="absolute left-4 top-3 text-[#FF6A28]" size={20} />
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search for dishes..." className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-800 border border-orange-100 focus:border-[#FF6A28] focus:ring-2 focus:ring-[#FF6A28]/20 transition-all bg-white/80" />
          </div>

          {loading ? (
            <div className="py-12">
              <LoadingSpinner size="lg" text="Loading delicious items..." />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-8 border border-orange-200">
              <p className="text-2xl bg-gradient-to-r from-[#FF6A28] to-[#FF8B4A] bg-clip-text text-transparent font-semibold">No items found</p>
              <p className="text-gray-600 mt-2">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((item) => (
                <div key={item.id}>
                  <MenuItem item={item} onAddToCart={handleAddToCart} onImgError={handleImgError} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Testimonials slider */}
        <section className="mb-12">
          <div className="pl-4 mb-4 relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF6A28] rounded-full"></div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#FF6A28]">Voices</p>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#FF6A28] to-[#FF8B4A] bg-clip-text text-transparent">Testimonials</h2>
          </div>
          <div
            className="relative bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 shadow-lg border border-orange-200 flex items-center gap-6 overflow-hidden"
            onMouseEnter={stopTestimonialTimer}
            onMouseLeave={startTestimonialTimer}
          >
            <button
              aria-label="previous testimonial"
              onClick={() => setTestIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              className="hidden md:block px-3 py-2 text-[#FF6A28] hover:text-[#E85A1F]"
            >
              ‹
            </button>

            <div className="flex-1">
              <p className="text-lg italic">“{TESTIMONIALS[testIndex].quote}”</p>
              <div className="flex items-center gap-3 mt-4">
                <img src={TESTIMONIALS[testIndex].image} alt={TESTIMONIALS[testIndex].name} onError={handleImgError} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-semibold">{TESTIMONIALS[testIndex].name}</p>
                  <p className="text-sm text-gray-600">Satisfied Customer</p>
                </div>
              </div>
            </div>

            <button
              aria-label="next testimonial"
              onClick={() => setTestIndex((i) => (i + 1) % TESTIMONIALS.length)}
              className="hidden md:block px-3 py-2 text-[#FF6A28] hover:text-[#E85A1F]"
            >
              ›
            </button>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-24 text-center bg-gradient-to-r from-[#FF6A28] to-[#ff8a4c] rounded-2xl p-8 md:p-12 shadow-xl">
          <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white">Ready to delight your guests?</h3>
          <p className="text-white/90 mb-6 text-lg">Contact us for a custom quote and menu tasting.</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={() => {
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else window.location.href = '/contact';
              }}
              className="bg-white text-[#FF6A28] px-8 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Request a Quote
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('menu');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#FF6A28] text-white border-0 px-8 py-3 rounded-xl font-semibold hover:bg-[#E85A1F] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Browse Menu
            </button>
          </div>
        </section>
      </div>


    </div>
  );
};

export default Home;
