// src/pages/Contact.jsx
import React, { useMemo, useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Calendar, User, Send } from 'lucide-react';

const infoItems = [
  { icon: MapPin, label: 'Address', value: '123 Food Street, City' },
  { icon: Phone, label: 'Phone', value: '+91 234 567 890', href: 'tel:+91234567890' },
  { icon: Mail, label: 'Email', value: 'info@caterhub.com', href: 'mailto:info@caterhub.com' },
];

const quickActions = [
  { icon: Phone, label: 'Call us', sub: '+91 234 567 890', href: 'tel:+91234567890' },
  { icon: Mail, label: 'Email', sub: 'info@caterhub.com', href: 'mailto:info@caterhub.com' },
  { icon: MessageCircle, label: 'WhatsApp', sub: 'Start a chat with our support', href: 'https://wa.me/91234567890' },
];

export const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    eventType: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || (!form.phone && !form.email)) {
      alert('Please provide your name and at least a phone number or email so we can get back to you.');
      return;
    }
    // simulate success
    alert('Request sent — we will reply soon!');
  };

  const formFields = useMemo(
    () => [
      { name: 'name', label: 'Full name', icon: User, type: 'text', required: true },
      { name: 'phone', label: 'Phone', icon: Phone, type: 'tel' },
      { name: 'email', label: 'Email', icon: Mail, type: 'email' },
      { name: 'date', label: 'Event date (optional)', icon: Calendar, type: 'date' },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-[#F7F7F7] py-12 px-4 md:px-0">
      <div className="container-main">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-gradient-to-r from-[#FF6A28] to-[#FF8B4A] text-white text-sm font-semibold shadow-md">
            Connect
          </div>
          <h1 className="text-3xl font-bold text-[#301b16] mt-3">Contact & Location</h1>
          <p className="text-sm text-[#7b5a4a] mt-1">
            We&apos;d love to help plan your event. Call or email and we&apos;ll get back within a few hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-6 items-start">
          {/* Left column */}
          <section className="rounded-[22px] border border-orange-100 bg-white shadow-[0_24px_70px_rgba(255,106,40,0.08)] p-6 md:p-7">
            <h2 className="text-2xl font-semibold text-[#301b16] mb-2">Get in touch</h2>
            <p className="text-sm text-[#7b5a4a] mb-4">
              Share a few details about your event and our event specialists will reach out with a customised plan.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              {infoItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-xl border border-orange-100 bg-gradient-to-b from-orange-50/70 to-white/60 p-3 shadow-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-b from-[#FF6A28] to-[#FF8B4A] text-white font-semibold shadow">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#7b5a4a] font-semibold">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-sm font-semibold text-[#301b16] hover:text-[#FF6A28]">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm font-semibold text-[#301b16]">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 items-center mb-4">
              <div className="rounded-lg border border-orange-100 bg-orange-50/60 px-3 py-2">
                <p className="text-sm font-semibold text-[#301b16]">Opening Hours</p>
                <p className="text-xs text-[#7b5a4a]">Mon — Sun: 9:00 AM — 8:00 PM</p>
              </div>
              <div className="ml-auto flex gap-2">
                <a
                  className="btn-secondary bg-white text-[#FF6A28] border border-orange-200 hover:bg-orange-50"
                  href="https://wa.me/91234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
                <a className="btn-secondary bg-white text-[#FF6A28] border border-orange-200 hover:bg-orange-50" href="#book">
                  Book
                </a>
              </div>
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-3">
                {formFields.slice(0, 2).map((field) => (
                  <div key={field.name} className="space-y-1">
                    <label className="text-xs font-semibold text-[#7b5a4a]">{field.label}</label>
                    <div className="relative">
                      <field.icon className="absolute left-3 top-3 text-[#FF6A28]" size={18} />
                      <input
                        type={field.type}
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleChange}
                        required={field.required}
                        className="w-full rounded-xl border border-orange-100 bg-white/80 py-2.5 pl-10 pr-3 text-sm text-[#301b16] focus:border-[#FF6A28] focus:ring-2 focus:ring-[#FF6A28]/20"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                {formFields.slice(2).map((field) => (
                  <div key={field.name} className="space-y-1">
                    <label className="text-xs font-semibold text-[#7b5a4a]">{field.label}</label>
                    <div className="relative">
                      <field.icon className="absolute left-3 top-3 text-[#FF6A28]" size={18} />
                      <input
                        type={field.type}
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-orange-100 bg-white/80 py-2.5 pl-10 pr-3 text-sm text-[#301b16] focus:border-[#FF6A28] focus:ring-2 focus:ring-[#FF6A28]/20"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#7b5a4a]">Event type</label>
                <select
                  name="eventType"
                  value={form.eventType}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-orange-100 bg-white/80 py-2.5 px-3 text-sm text-[#301b16] focus:border-[#FF6A28] focus:ring-2 focus:ring-[#FF6A28]/20"
                >
                  <option value="">Select event type</option>
                  <option>Wedding</option>
                  <option>Corporate</option>
                  <option>Birthday</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#7b5a4a]">Message — guest count, preferences, budget</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-orange-100 bg-white/80 py-2.5 px-3 text-sm text-[#301b16] min-h-[120px] focus:border-[#FF6A28] focus:ring-2 focus:ring-[#FF6A28]/20"
                />
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <button type="submit" className="btn-primary inline-flex items-center gap-2 bg-[#FF6A28] hover:bg-[#E85A1F]">
                  <Send size={16} />
                  Talk to us
                </button>
                <button
                  type="button"
                  className="btn-secondary bg-white text-[#FF6A28] border border-orange-200 hover:bg-orange-50"
                  onClick={() => setForm({ name: '', phone: '', email: '', date: '', eventType: '', message: '' })}
                >
                  Clear
                </button>
                <p className="text-xs text-[#7b5a4a]">We usually reply within a few hours during business hours.</p>
              </div>
            </form>

            <div className="flex gap-3 overflow-x-auto mt-5 pb-1">
              {[
                'CaterHub made our reception a breeze — on time, delicious and beautiful.',
                'Professional team and flawless execution. Highly recommend for corporate events.',
              ].map((t, i) => (
                <div
                  key={i}
                  className="min-w-[240px] rounded-xl border border-orange-100 bg-gradient-to-b from-orange-50/60 to-white/70 p-3 text-sm text-[#7b5a4a] shadow-sm"
                >
                  <p className="font-semibold text-[#FF6A28] mb-1">★★★★★</p>
                  <p>{t}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 mt-4 text-xs text-[#7b5a4a]">
              <span>Fast Delivery: 30-45 minutes • Quality Food • Fresh ingredients</span>
              <span>© 2025 CaterHub</span>
            </div>
          </section>

          {/* Right column */}
          <aside className="space-y-3 lg:sticky lg:top-24">
            <div className="rounded-xl border border-orange-100 bg-white shadow-md overflow-hidden min-h-[260px]">
              <iframe
                title="CaterHub location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019094415669!2d-122.41941548468197!3d37.77492977975916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085818d2b3d8f5b%3A0x6b42d3b2f1f4d6b9!2sSan%20Francisco!5e0!3m2!1sen!2sin!4v1610000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '260px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div className="rounded-xl border border-orange-100 bg-white shadow-sm p-4 space-y-3">
              {quickActions.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition"
                  target={item.label === 'WhatsApp' ? '_blank' : undefined}
                  rel={item.label === 'WhatsApp' ? 'noopener noreferrer' : undefined}
                >
                  <div className="h-11 w-11 rounded-lg bg-gradient-to-b from-[#FF6A28] to-[#FF8B4A] text-white flex items-center justify-center font-semibold">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#301b16]">{item.label}</p>
                    <p className="text-xs text-[#7b5a4a]">{item.sub}</p>
                  </div>
                </a>
              ))}
            </div>

            <div className="rounded-xl border border-orange-100 bg-gradient-to-b from-orange-50/70 to-white/80 p-4 shadow-sm">
              <p className="font-semibold text-[#301b16] mb-2">Why contact us?</p>
              <ul className="list-disc pl-5 text-sm text-[#7b5a4a] space-y-1">
                <li>Free consultation & sample menus</li>
                <li>Custom quotes and portion planning</li>
                <li>Event coordination & on-site staff</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Contact;
