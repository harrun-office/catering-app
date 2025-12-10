// src/pages/Gallery.jsx
import React from 'react';

const GALLERY_IMAGES = [
  '/images/g1.jpg',
  '/images/g2.jpg',
  '/images/g3.jpg',
  '/images/g4.jpg',
  '/images/g5.jpg',
  '/images/g6.jpg',
];

export const Gallery = () => {

  return (
    <div className="container-main py-12">
      <div className="pl-4 mb-4 relative">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></div>
        <p className="text-xs uppercase tracking-[0.4em] text-[#FC4300]">Highlights</p>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Gallery & Celebrations</h2>
      </div>

      <p className="text-sm text-gray-600 mb-4">A few moments from our events — plated with love.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {GALLERY_IMAGES.map((src, idx) => (
          <div key={src} className="block w-full overflow-hidden rounded-lg">
            <img src={src} alt={`gallery-${idx}`} className="w-full h-64 object-cover rounded-lg transform hover:scale-105 transition" onError={(e) => { e.target.dataset.fallback = '1'; e.target.src = '/images/placeholder.jpg'; }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
