// src/pages/Gallery.jsx
import React, { useMemo, useState } from 'react';
import { X } from 'lucide-react';

const GALLERY_ITEMS = [
  { src: '/images/g1.jpg', title: 'Wedding Reception Buffet', sub: 'Elegant plated service for 200 guests', featured: true },
  { src: '/images/g2.jpg', title: 'Corporate Lunch Spread', sub: 'Buffet + boxed lunches' },
  { src: '/images/g3.jpg', title: 'Dessert Table', sub: 'Cakes, tarts and more' },
  { src: '/images/g4.jpg', title: 'Live Chef Station', sub: 'Interactive live cooking' },
  { src: '/images/g5.jpg', title: 'Outdoor Buffet', sub: 'Garden party setup' },
  { src: '/images/g6.jpg', title: "Chef's Special Platter", sub: 'Signature sharing platter' },
];

const fallbackImg = '/images/placeholder.jpg';

export const Gallery = () => {
  const [lightbox, setLightbox] = useState({ open: false, item: null });

  const items = useMemo(() => GALLERY_ITEMS, []);

  const openLightbox = (item) => setLightbox({ open: true, item });
  const closeLightbox = () => setLightbox({ open: false, item: null });

  return (
    <div className="min-h-screen bg-[#F7F7F7] py-12 px-4 md:px-0">
      <div className="container-main">
        <div className="bg-gradient-to-b from-orange-50/70 to-white/80 border border-orange-100 rounded-[26px] p-6 md:p-8 shadow-[0_24px_80px_rgba(255,106,40,0.08)]">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="flex items-start gap-3 flex-1">
              <div className="px-3 py-1 bg-gradient-to-r from-[#FF6A28] to-[#FF8B4A] text-white text-sm font-bold rounded-xl shadow-md">
                Gallery
              </div>
              <div>
                <h2 className="text-3xl font-bold text-[#301b16] leading-tight">Gallery & Celebrations</h2>
                <p className="text-sm text-[#7b5a4a] mt-1">A few moments from our events — plated with love.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 md:ml-auto">
              <a
                href="/contact"
                className="btn-secondary bg-white text-[#FF6A28] border border-orange-200 hover:bg-orange-50 hover:border-[#FF6A28]"
              >
                Talk to us
              </a>
              <a
                href="/#menu"
                className="btn-primary bg-[#FF6A28] hover:bg-[#E85A1F]"
              >
                View menu
              </a>
            </div>
          </header>

          {/* Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {items.map((item) => (
              <article
                key={item.src}
                className={`relative group overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 ${
                  item.featured ? 'lg:col-span-2 lg:row-span-2 min-h-[360px]' : 'min-h-[220px]'
                }`}
                tabIndex={0}
                role="button"
                onClick={() => openLightbox(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(item);
                  }
                }}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105"
                  onError={(e) => {
                    if (!e.target.dataset.fallback) {
                      e.target.dataset.fallback = '1';
                      e.target.src = fallbackImg;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/0 to-black/55 pointer-events-none" />
                <div className="relative z-10 p-4 md:p-5 flex items-end h-full">
                  <div className="bg-white/85 backdrop-blur-sm rounded-xl p-3 md:p-4 w-full shadow-md transition translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-sm font-semibold text-[#FF6A28] uppercase tracking-wide">{item.sub}</div>
                        <div className="text-lg font-bold text-[#301b16]">{item.title}</div>
                      </div>
                      <button
                        className="text-sm font-semibold text-[#FF6A28] hover:text-[#E85A1F] transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          openLightbox(item);
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox.open && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 shadow hover:bg-white"
              onClick={closeLightbox}
              aria-label="Close"
            >
              <X size={18} className="text-gray-700" />
            </button>
            {lightbox.item?.src && (
              <img
                src={lightbox.item.src}
                alt={lightbox.item.title}
                className="w-full h-[60vh] object-contain bg-black"
                onError={(e) => {
                  if (!e.target.dataset.fallback) {
                    e.target.dataset.fallback = '1';
                    e.target.src = fallbackImg;
                  }
                }}
              />
            )}
            <div className="p-4 flex items-center justify-between gap-3 bg-orange-50 border-t border-orange-100">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-[#FF6A28] font-semibold">CaterHub</p>
                <p className="text-base font-semibold text-[#301b16]">{lightbox.item?.title}</p>
                <p className="text-sm text-[#7b5a4a]">{lightbox.item?.sub}</p>
              </div>
              <div className="flex gap-2">
                <a
                  href="/contact"
                  className="btn-secondary bg-white text-[#FF6A28] border border-orange-200 hover:bg-orange-50"
                >
                  Talk to us
                </a>
                <a
                  href="/#menu"
                  className="btn-primary bg-[#FF6A28] hover:bg-[#E85A1F]"
                >
                  View menu
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
