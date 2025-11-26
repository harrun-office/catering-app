// src/pages/Home.jsx
import React, { useContext, useEffect, useState, useRef } from 'react';
import { MenuItem } from '../components/MenuItem';
import { CartContext } from '../context/CartContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Alert } from '../components/Alert';
import { menuAPI } from '../utils/api';
import { useLocation } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';

/**
 * Home page with:
 * - Hero carousel (auto-advance)
 * - Menu section (with images)
 * - About section
 * - Testimonials slider (auto-advance)
 * - Gallery with lightbox
 * - Contact with Google Map
 *
 * Replace any image URLs with your own hosted images when ready.
 */
// tiny inline SVG fallback (data URL) used when images missing
const SVG_PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'><rect fill='#f3f4f6' width='100%' height='100%'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='36' fill='#9ca3af'>Image unavailable</text></svg>`
  );

// Local-first image arrays (point to public/images). If files don't exist yet, the <img onError> below will show SVG_PLACEHOLDER.
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

  // gallery lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

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

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await menuAPI.getMenuItems({
        category_id: selectedCategory,
        search: searchTerm,
        page: 1,
        limit: 12,
      });
      // assign placeholder images if menu items don't have images
      const withImages = (response.data.items || []).map((it, idx) => ({
        ...it,
        image: it.image || [
          'https://images.unsplash.com/photo-1543352634-8b6b2d0f94b6?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=800&q=80',
        ][idx % 3],
      }));
      setItems(withImages);
    } catch (err) {
      setError('Failed to load menu items');
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <section id="hero" className="relative overflow-hidden">
        <div className="relative h-[420px] md:h-[520px]">
          {HERO_IMAGES.map((h, i) => (
            <div
              key={h.src}
              aria-hidden={i !== heroIndex}
              className={`absolute inset-0 transition-transform duration-700 ease-in-out transform ${
                i === heroIndex ? 'translate-x-0 opacity-100 z-10' : i < heroIndex ? '-translate-x-full opacity-0 z-0' : 'translate-x-full opacity-0 z-0'
              }`}
            >
              <img src={h.src} alt={h.alt} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/35 flex items-center">
                <div className="container-main text-white">
                  <h1 className="text-3xl md:text-5xl font-bold drop-shadow-lg">{h.caption}</h1>
                  <p className="mt-3 max-w-2xl text-sm md:text-lg text-white/90">
                    Fresh, flavour-first meals, customizable menus, and a friendly team that cares about every detail.
                  </p>

                  <div className="mt-6 flex gap-3">
                    <a href="#menu" onClick={(e) => { e.preventDefault(); const el = document.getElementById('menu'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="btn-primary">
                      Browse Menu
                    </a>
                    <a href="#contact" onClick={(e) => { e.preventDefault(); const el = document.getElementById('contact'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="btn-secondary">
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
                onClick={() => { setHeroIndex(i); startHeroTimer(); }}
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

        {/* Menu */}
        <section id="menu" className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <Filter size={20} />
            <h2 className="text-2xl font-bold">Our Menu</h2>
          </div>

          <div className="flex gap-3 flex-wrap mb-6">
            <button onClick={() => setSelectedCategory(null)} className={`px-4 py-2 rounded-lg font-semibold ${selectedCategory === null ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'bg-white border'}`}>All Items</button>
            {categories.map((c) => (
              <button key={c.id} onClick={() => setSelectedCategory(c.id)} className={`px-4 py-2 rounded-lg font-semibold ${selectedCategory === c.id ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'bg-white border'}`}>{c.name}</button>
            ))}
          </div>

          <div className="relative max-w-2xl mb-6">
            <Search className="absolute left-4 top-3 text-gray-400" size={20} />
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search for dishes..." className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-800 border" />
          </div>

          {loading ? (
            <div className="py-12"><LoadingSpinner size="lg" text="Loading delicious items..." /></div>
          ) : items.length === 0 ? (
            <div className="text-center py-12"><p className="text-2xl text-gray-600">No items found</p><p className="text-gray-500 mt-2">Try adjusting your search or filters</p></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((item) => (
                <div key={item.id}>
                  <MenuItem item={item} onAddToCart={handleAddToCart} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* About */}
        <section id="about" className="mb-12 bg-white rounded-lg p-8 shadow">
          <h2 className="text-2xl font-bold mb-4">About CaterHub</h2>
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
              <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80" alt="Catering team" className="w-full rounded-lg shadow-md mb-4 object-cover max-h-72" />
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
          <h2 className="text-2xl font-bold mb-4">Testimonials</h2>
          <div
            className="relative bg-white rounded-lg p-6 shadow flex items-center gap-6 overflow-hidden"
            onMouseEnter={stopTestimonialTimer}
            onMouseLeave={startTestimonialTimer}
          >
            <button aria-label="previous testimonial" onClick={() => setTestIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)} className="hidden md:block px-3 py-2">‹</button>

            <div className="flex-1">
              <p className="text-lg italic">“{TESTIMONIALS[testIndex].quote}”</p>
              <div className="flex items-center gap-3 mt-4">
                <img src={TESTIMONIALS[testIndex].image} alt={TESTIMONIALS[testIndex].name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-semibold">{TESTIMONIALS[testIndex].name}</p>
                  <p className="text-sm text-gray-600">Satisfied Customer</p>
                </div>
              </div>
            </div>

            <button aria-label="next testimonial" onClick={() => setTestIndex((i) => (i + 1) % TESTIMONIALS.length)} className="hidden md:block px-3 py-2">›</button>
          </div>
        </section>

        {/* Gallery with lightbox */}
        <section id="gallery" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Gallery & Celebrations</h2>
          <p className="text-sm text-gray-600 mb-4">A few moments from our events — plated with love.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {GALLERY_IMAGES.map((src, idx) => (
              <button key={src} onClick={() => openLightbox(idx)} className="block w-full overflow-hidden rounded-lg focus:outline-none">
                <img src={src} alt={`gallery-${idx}`} className="w-full h-48 object-cover rounded-lg transform hover:scale-105 transition" />
              </button>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="mb-12 bg-white rounded-lg p-8 shadow">
          <h2 className="text-2xl font-bold mb-4">Contact & Location</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Get in touch</h3>
              <p className="text-sm text-gray-700 mb-3">We'd love to help plan your event. Call or email and we'll get back within a few hours.</p>

              <ul className="text-sm text-gray-700 space-y-2">
                <li><strong>Address:</strong> 123 Food Street, City</li>
                <li><strong>Phone:</strong> <a href="tel:+91234567890" className="text-purple-600">+91 234 567 890</a></li>
                <li><strong>Email:</strong> <a href="mailto:info@caterhub.com" className="text-purple-600">info@caterhub.com</a></li>
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
            <button onClick={() => { const el = document.getElementById('contact'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="btn-primary px-6 py-3">Request a Quote</button>
            <button onClick={() => { const el = document.getElementById('menu'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="btn-secondary px-6 py-3">Browse Menu</button>
          </div>
        </section>
      </div>

      {/* Lightbox markup */}
      {lightboxOpen && (
        <div role="dialog" aria-modal="true" className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button aria-label="close" className="lightbox-close" onClick={closeLightbox}>×</button>
            <button aria-label="prev" className="lightbox-nav left" onClick={prevLightbox}>‹</button>
            <img src={GALLERY_IMAGES[lightboxIndex]} alt={`expanded-${lightboxIndex}`} className="max-h-[80vh] object-contain" />
            <button aria-label="next" className="lightbox-nav right" onClick={nextLightbox}>›</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
