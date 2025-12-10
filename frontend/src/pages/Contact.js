// src/pages/Contact.jsx
import React from 'react';

export const Contact = () => {
  return (
    <div className="container-main py-12">
      <div className="bg-white rounded-lg p-8 shadow">
        <div className="pl-4 mb-4 relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></div>
          <p className="text-xs uppercase tracking-[0.4em] text-[#FC4300]">Connect</p>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Contact & Location</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-lg mb-2 text-[#FC4300]">Get in touch</h3>
            <p className="text-sm text-gray-700 mb-3">We'd love to help plan your event. Call or email and we'll get back within a few hours.</p>

            <ul className="text-sm text-gray-700 space-y-2">
              <li><strong>Address:</strong> 123 Food Street, City</li>
              <li><strong>Phone:</strong> <a href="tel:+91234567890" className="text-[#FC4300] hover:text-orange-600">+91 234 567 890</a></li>
              <li><strong>Email:</strong> <a href="mailto:info@caterhub.com" className="text-[#FC4300] hover:text-orange-600">info@caterhub.com</a></li>
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
      </div>
    </div>
  );
};

export default Contact;
