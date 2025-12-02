// src/pages/About.js
import React from 'react';

const About = () => {
  return (
    <div className="container-main py-12">
      <div className="bg-white rounded-lg p-8 shadow">
        <div className="border-l-4 border-purple-500 pl-4 mb-4">
          <p className="text-xs uppercase tracking-[0.4em] text-purple-400">Story</p>
          <h2 className="text-2xl font-bold text-gray-900">About CaterHub</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">How we started</h3>
            <p className="text-sm text-gray-700 mb-4">
              Born from a love of great food and community gatherings, CaterHub started in a small kitchen with a simple idea: bring restaurant-quality catering to neighbourhood celebrations.
            </p>
            <h3 className="font-semibold text-lg mb-2">Our achievements</h3>
            <ul className="list-disc ml-5 text-sm text-gray-700 mb-4">
              <li>Served 10,000+ meals across celebrations and corporate events</li>
              <li>Top-rated on local platforms for taste and punctuality</li>
              <li>Certified kitchen, HACCP-compliant processes</li>
            </ul>
          </div>

          <div>
            <img src="/images/g6.jpg" alt="Catering team" className="w-full rounded-lg shadow-md mb-4 object-cover max-h-72" onError={(e)=> { e.target.dataset.fallback = '1'; e.target.src = '/images/placeholder.jpg'; }} />
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-semibold">What customers say</h4>
              <p className="text-sm text-gray-600 mt-2">"Amazing food and spotless service — our event was a hit!" — S. Rao</p>
              <p className="text-sm text-gray-600 mt-2">"On-time, professional and delicious — we highly recommend CaterHub." — K. Mehta</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
