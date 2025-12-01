// src/pages/Home.jsx
import React, { useContext, useEffect, useState, useRef } from 'react';
import { MenuItem } from '../components/MenuItem';
import { CartContext } from '../context/CartContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Alert } from '../components/Alert';
import { menuAPI } from '../utils/api';
import { useLocation, Link } from 'react-router-dom';
import { Search, Filter, ShoppingCart } from 'lucide-react';


// tiny inline SVG fallback (data URL) used when images missing
const SVG_PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'><rect fill='#f3f4f6' width='100%' height='100%'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='28' fill='#9ca3af'>Image unavailable</text></svg>`
  );

// --------------------
// Inline Toasts component (self-contained)
// --------------------
const Toasts = ({ toasts = [], removeToast = () => {} }) => {
  return (
    <div aria-live="polite" className="fixed right-4 bottom-6 z-50 flex flex-col gap-3">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`min-w-[200px] max-w-sm rounded-lg shadow-lg overflow-hidden border ${
            t.type === 'error' ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'
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

const GALLERY_IMAGES = [
  '/images/g1.jpg',
  '/images/g2.jpg',
  '/images/g3.jpg',
  '/images/g4.jpg',
  '/images/g5.jpg',
  '/images/g6.jpg',
];

// Local menu images used when backend doesn't provide photos.
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
    image: '/images/paneer-biryani.jpg',
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
    image: '/images/mixed-mandhi.jpg',
    preparation_time: 85,
    is_available: true,
  },
];

export const Home = () => {
  const { addItem, items: cartItems } = useContext(CartContext);
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

  // gallery lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

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
      setHeroIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, 5000);
  };
  const stopHeroTimer = () => {
    if (heroTimerRef.current) clearInterval(heroTimerRef.current);
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

  /**
   * fetchMenuItems
   * - requests items from backend
   * - normalises the returned `image` value into one of:
   *   - absolute URL (if backend returned it)
   *   - `/images/<basename>` (for bare filenames, Windows paths, server-side uploads)
   *   - local fallback from LOCAL_MENU_IMAGES
   */
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
        limit: 12,
      });

      const serverItems = response.data.items || [];

      const withImages = serverItems.map((it, index) => {
        // choose a local fallback first (deterministic)
        const chooseLocal = () => {
          if (it.image) return it.image;
          if (typeof it.id === 'number') return LOCAL_MENU_IMAGES[it.id % LOCAL_MENU_IMAGES.length];
          return LOCAL_MENU_IMAGES[index % LOCAL_MENU_IMAGES.length];
        };

        const raw = it.image || chooseLocal() || LOCAL_MENU_IMAGES[0];

        if (!raw) return { ...it, image: '' };

        // absolute URL -> keep
        if (/^https?:\/\//i.test(raw)) return { ...it, image: raw };

        // if already starts with '/', treat as app-root relative (good)
        if (raw.startsWith('/')) return { ...it, image: raw };

        // windows path or backslash present -> pick basename and map to /images/<basename>
        if (/^[A-Za-z]:\\/.test(raw) || raw.includes('\\')) {
          const name = getBasename(raw);
          return { ...it, image: name ? `/images/${name}` : '' };
        }

        // bare filename or nested path like 'uploads/menu1.jpg' -> pick basename and map to /images/<basename>
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
    // auto remove
    setTimeout(() => removeToast(id), duration);
  };
  const removeToast = (id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  };

  const handleAddToCart = (item) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
    });
    setSuccessMessage(`${item.name} added to cart!`);
    setTimeout(() => setSuccessMessage(''), 3000);

    // show toast
    showToast(`${item.name} added to cart!`, 'success', 3200);
  };

  // Lightbox helpers
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };
  const prevLightbox = () => setLightboxIndex((i) => (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
  const nextLightbox = () => setLightboxIndex((i) => (i + 1) % GALLERY_IMAGES.length);

  // shared image error handler: swap to SVG placeholder if local image missing or blocked
  const handleImgError = (e) => {
    const t = e?.target;
    if (t && !t.dataset.fallback) {
      t.dataset.fallback = '1';
      t.src = SVG_PLACEHOLDER;
    }
  };

  const cartCount = React.useMemo(
    () => (Array.isArray(cartItems) ? cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0),
    [cartItems]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toasts container */}
      <Toasts toasts={toasts} removeToast={removeToast} />

      {/* HERO */}
      <section id="hero" className="relative px-4 md:px-0">
        <div className="relative h-[420px] md:h-[520px] overflow-hidden rounded-[36px] border-4 border-white/30 shadow-[0_25px_70px_rgba(15,23,42,0.35)] bg-slate-900/30">
          {HERO_IMAGES.map((h, i) => (
            <div
              key={h.src}
              aria-hidden={i !== heroIndex}
              className={`absolute inset-0 transition-transform duration-700 ease-in-out transform rounded-[32px] ${
                i === heroIndex ? 'translate-x-0 opacity-100 z-10' : i < heroIndex ? '-translate-x-full opacity-0 z-0' : 'translate-x-full opacity-0 z-0'
              }`}
            >
              <img src={h.src} alt={h.alt} onError={handleImgError} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/35 flex items-center">
                <div className="container-main text-white">
                  <h1 className="text-3xl md:text-5xl font-bold drop-shadow-lg">{h.caption}</h1>
                  <p className="mt-3 max-w-2xl text-sm md:text-lg text-white/90">
                    Fresh, flavour-first meals, customizable menus, and a friendly team that cares about every detail.
                  </p>

                  <div className="mt-6 flex gap-3">
                    <a
                      href="#menu"
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById('menu');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="btn-primary"
                    >
                      Browse Menu
                    </a>
                    <a
                      href="#contact"
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById('contact');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="btn-secondary"
                    >
                      Contact Us
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Hero controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            {HERO_IMAGES.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => {
                  setHeroIndex(i);
                  startHeroTimer();
                }}
                className={`w-3 h-3 rounded-full ${i === heroIndex ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* page content */}
      <div className="container-main py-12">
        {successMessage && <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />}
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {/* Quick features */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 text-center">
            <h3 className="font-bold text-lg mb-2">Fresh Ingredients</h3>
            <p className="text-sm text-gray-600">Sourcing local produce and preparing dishes to order.</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <h3 className="font-bold text-lg mb-2">Custom Menus</h3>
            <p className="text-sm text-gray-600">Vegan, gluten-free, or party platters — we create a menu that fits you.</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <h3 className="font-bold text-lg mb-2">Trusted Service</h3>
            <p className="text-sm text-gray-600">On-time delivery, professional presentation, and friendly staff.</p>
          </div>
        </section>

        {/* Biryani section */}
        <section className="mb-12">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 border-l-4 border-purple-500 pl-4">
            <div>
              <p className="text-sm uppercase tracking-wide text-purple-500 font-semibold">Signature Feast</p>
              <h2 className="text-2xl font-bold">Biryani & Dum Delights</h2>
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
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 border-l-4 border-orange-400 pl-4">
            <div>
              <p className="text-sm uppercase tracking-wide text-orange-500 font-semibold">Arabic Table</p>
              <h2 className="text-2xl font-bold">Mandhi & Smoky Platters</h2>
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
          <div className="flex items-center gap-4 mb-6 border-l-4 border-purple-500 pl-4">
            <Filter size={20} className="text-purple-500" />
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-purple-400">Signature List</p>
              <h2 className="text-2xl font-bold text-gray-900">Our Menu</h2>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap mb-6">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg font-semibold ${selectedCategory === null ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'bg-white border'}`}
            >
              All Items
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-4 py-2 rounded-lg font-semibold ${selectedCategory === c.id ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'bg-white border'}`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="relative max-w-2xl mb-6">
            <Search className="absolute left-4 top-3 text-gray-400" size={20} />
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search for dishes..." className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-800 border" />
          </div>

          {loading ? (
            <div className="py-12">
              <LoadingSpinner size="lg" text="Loading delicious items..." />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-2xl text-gray-600">No items found</p>
              <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((item) => (
                <div key={item.id}>
                  {/* pass shared image error handler down so both Home & MenuItem use same fallback behavior */}
                  <MenuItem item={item} onAddToCart={handleAddToCart} onImgError={handleImgError} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ... the rest of your Home component (About, Testimonials, Gallery, Contact, Lightbox) remains the same ... */}

        {/* About */}
        <section id="about" className="mb-12 bg-white rounded-lg p-8 shadow">
          <div className="border-l-4 border-purple-500 pl-4 mb-4">
            <p className="text-xs uppercase tracking-[0.4em] text-purple-400">Story</p>
            <h2 className="text-2xl font-bold text-gray-900">About CaterHub</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">How we started</h3>
              <p className="text-sm text-gray-700 mb-4">Born from a love of great food and community gatherings, CaterHub started in a small kitchen with a simple idea: bring restaurant-quality catering to neighbourhood celebrations. Since then we've grown into a trusted catering partner for corporate events, weddings and local festivals.</p>
              <h3 className="font-semibold text-lg mb-2">Our achievements</h3>
              <ul className="list-disc ml-5 text-sm text-gray-700 mb-4">
                <li>Served 10,000+ meals across celebrations and corporate events</li>
                <li>Top-rated on local platforms for taste and punctuality</li>
                <li>Certified kitchen, HACCP-compliant processes</li>
              </ul>
              <h3 className="font-semibold text-lg mb-2">Why choose us?</h3>
              <p className="text-sm text-gray-700">We craft menus with care, personalize to dietary needs, and ensure every platter looks as delightful as it tastes. Our team handles logistics so you can enjoy the event.</p>
            </div>

            <div>
              <img src="/images/g6.jpg" alt="Catering team" onError={handleImgError} className="w-full rounded-lg shadow-md mb-4 object-cover max-h-72" />
              <div className="bg-gray-50 p-4 rounded">
                <h4 className="font-semibold">What customers say</h4>
                <p className="text-sm text-gray-600 mt-2">"Amazing food and spotless service — our event was a hit!" — S. Rao</p>
                <p className="text-sm text-gray-600 mt-2">"On-time, professional and delicious — we highly recommend CaterHub." — K. Mehta</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials slider */}
        <section className="mb-12">
          <div className="border-l-4 border-purple-500 pl-4 mb-4">
            <p className="text-xs uppercase tracking-[0.4em] text-purple-400">Voices</p>
            <h2 className="text-2xl font-bold text-gray-900">Testimonials</h2>
          </div>
          <div
            className="relative bg-white rounded-lg p-6 shadow flex items-center gap-6 overflow-hidden"
            onMouseEnter={stopTestimonialTimer}
            onMouseLeave={startTestimonialTimer}
          >
            <button aria-label="previous testimonial" onClick={() => setTestIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)} className="hidden md:block px-3 py-2">
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

            <button aria-label="next testimonial" onClick={() => setTestIndex((i) => (i + 1) % TESTIMONIALS.length)} className="hidden md:block px-3 py-2">
              ›
            </button>
          </div>
        </section>

        {/* Gallery with lightbox */}
        <section id="gallery" className="mb-12">
          <div className="border-l-4 border-purple-500 pl-4 mb-4">
            <p className="text-xs uppercase tracking-[0.4em] text-purple-400">Highlights</p>
            <h2 className="text-2xl font-bold text-gray-900">Gallery & Celebrations</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">A few moments from our events — plated with love.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {GALLERY_IMAGES.map((src, idx) => (
              <button key={src} onClick={() => openLightbox(idx)} className="block w-full overflow-hidden rounded-lg focus:outline-none">
                <img src={src} alt={`gallery-${idx}`} onError={handleImgError} className="w-full h-48 object-cover rounded-lg transform hover:scale-105 transition" />
              </button>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="mb-12 bg-white rounded-lg p-8 shadow">
          <div className="border-l-4 border-purple-500 pl-4 mb-4">
            <p className="text-xs uppercase tracking-[0.4em] text-purple-400">Connect</p>
            <h2 className="text-2xl font-bold text-gray-900">Contact & Location</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Get in touch</h3>
              <p className="text-sm text-gray-700 mb-3">We'd love to help plan your event. Call or email and we'll get back within a few hours.</p>

              <ul className="text-sm text-gray-700 space-y-2">
                <li>
                  <strong>Address:</strong> 123 Food Street, City
                </li>
                <li>
                  <strong>Phone:</strong>{' '}
                  <a href="tel:+91234567890" className="text-purple-600">
                    +91 234 567 890
                  </a>
                </li>
                <li>
                  <strong>Email:</strong>{' '}
                  <a href="mailto:info@caterhub.com" className="text-purple-600">
                    info@caterhub.com
                  </a>
                </li>
              </ul>

              <div className="mt-6">
                <h4 className="font-semibold mb-2">Opening Hours</h4>
                <p className="text-sm text-gray-700">Mon — Sun: 9:00 AM — 8:00 PM</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Find us on the map</h3>
              <div className="w-full h-64 rounded overflow-hidden shadow">
                <iframe
                  title="CaterHub location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019094415669!2d-122.41941548468197!3d37.77492977975916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085818d2b3d8f5b%3A0x6b42d3b2f1f4d6b9!2sSan+Francisco!5e0!3m2!1sen!2sin!4v1610000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-24 text-center">
          <h3 className="text-2xl font-bold mb-3">Ready to delight your guests?</h3>
          <p className="text-gray-600 mb-6">Contact us for a custom quote and menu tasting.</p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => {
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-primary px-6 py-3"
            >
              Request a Quote
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('menu');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-secondary px-6 py-3"
            >
              Browse Menu
            </button>
          </div>
        </section>
      </div>

      {/* Floating cart button */}
      <Link
        to="/cart"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-2xl rounded-full px-5 py-3 hover:shadow-purple-300/60 hover:-translate-y-1 transition"
        aria-label="Go to cart"
      >
        <ShoppingCart size={20} />
        <span className="text-sm font-semibold">Cart</span>
        <span className="bg-white text-purple-700 text-xs font-bold rounded-full px-2 py-1 min-w-[32px] text-center">
          {cartCount}
        </span>
      </Link>

      {/* Lightbox markup */}
      {lightboxOpen && (
        <div role="dialog" aria-modal="true" className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button aria-label="close" className="lightbox-close" onClick={closeLightbox}>
              ×
            </button>
            <button aria-label="prev" className="lightbox-nav left" onClick={prevLightbox}>
              ‹
            </button>
            <img src={GALLERY_IMAGES[lightboxIndex]} alt={`expanded-${lightboxIndex}`} onError={handleImgError} className="max-h-[80vh] object-contain" />
            <button aria-label="next" className="lightbox-nav right" onClick={nextLightbox}>
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
