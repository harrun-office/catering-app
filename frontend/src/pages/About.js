// src/pages/About.js
import React from 'react';
import {
  Compass,
  Eye,
  Target,
  Star,
  Clock3,
  ShieldCheck,
  Users,
  CheckCircle2,
  MapPin,
  Sparkles,
  HeartHandshake,
  Award,
  CalendarHeart,
} from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-bg-cream">
      <div className="container-main py-12 space-y-12">
        {/* Hero / Intro */}
        <section className="bg-white/80 border border-[#f1dac4] rounded-3xl p-8 shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
          <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8 items-center">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[#FF6A28] font-semibold">Our Story</p>
              <h1 className="text-3xl md:text-4xl font-bold text-[#301b16]">About CaterHub</h1>
              <p className="text-[#7b5a4a] max-w-2xl">
                Born from a love of great food and community gatherings, CaterHub brings restaurant-quality catering to homes, offices, and venues with a focus on taste, punctuality, and hassle-free service.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="/contact"
                  className="btn-primary inline-flex items-center justify-center px-5 py-3 rounded-full text-white"
                  style={{ background: 'linear-gradient(135deg, #FF6A28, #FF8B4A)' }}
                >
                  Plan Your Event
                </a>
                <a
                  href="#team"
                  className="inline-flex items-center justify-center px-5 py-3 rounded-full border border-[#FF6A28] text-[#FF6A28] hover:bg-[#fff0e6] transition"
                >
                  Meet the Team
                </a>
              </div>
              <div className="flex flex-wrap gap-3">
                {[
                  { value: '10,000+', label: 'Meals Served' },
                  { value: '500+', label: 'Events Catered' },
                  { value: '4.8★', label: 'Average Rating' },
                ].map((stat) => (
                  <div
                    key={stat.value}
                    className="bg-white border border-[#f1dac4] rounded-xl px-4 py-3 shadow-sm min-w-[120px]"
                  >
                    <span className="block text-lg font-bold text-[#301b16]">{stat.value}</span>
                    <span className="text-xs text-[#7b5a4a]">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#ffe3c4] border border-[#f3c29b] rounded-2xl p-6 shadow-[0_12px_32px_rgba(156,80,35,0.14)]">
              <h2 className="text-xl font-semibold text-[#301b16] mb-3">How we started</h2>
              <p className="text-[#7b5a4a] mb-3">
                CaterHub began in a small, family-run kitchen with one simple idea: <strong>make every celebration feel special</strong> with flavour-packed food, thoughtful presentation, and reliable service.
              </p>
              <p className="text-[#7b5a4a]">
                What started as weekend catering for neighbourhood gatherings quickly grew into a full-service catering partner for birthdays, weddings, festivals, and corporate events across the city.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="grid md:grid-cols-2 gap-6 bg-white rounded-3xl border border-[#f1dac4] p-8 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Compass size={20} className="text-[#FF6A28]" />
              <h2 className="text-2xl font-bold text-[#301b16]">Our Mission</h2>
            </div>
            <p className="text-[#7b5a4a]">
              To make every gathering memorable with fresh, flavourful food and seamless, stress-free catering experiences.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Eye size={20} className="text-[#FF6A28]" />
              <h2 className="text-2xl font-bold text-[#301b16]">Our Vision</h2>
            </div>
            <p className="text-[#7b5a4a]">
              To be the most trusted catering partner for celebrations and corporate events, known for quality, reliability, and warmth in every interaction.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="bg-[#ffe9d9] rounded-3xl border border-[#f3c29b] p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Target size={22} className="text-[#FF6A28]" />
            <h2 className="text-2xl font-bold text-[#301b16]">What we stand for</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: 'Freshness First', text: 'We cook with fresh ingredients and prepare dishes close to your event time for maximum flavour.', icon: Star },
              { title: 'On-Time, Every Time', text: 'Obsessed with punctuality so you never worry about late arrivals.', icon: Clock3 },
              { title: 'Hygiene & Safety', text: 'Certified kitchen with HACCP-compliant processes and strict food safety standards.', icon: ShieldCheck },
              { title: 'Customer-First', text: 'From custom menus to last-minute changes, we adapt to your needs.', icon: HeartHandshake },
              { title: 'Transparent Pricing', text: 'No hidden charges—clear, upfront pricing tailored to your event size.', icon: CheckCircle2 },
              { title: 'Thoughtful Details', text: 'From plating to portion planning, we focus on details that make events special.', icon: Sparkles },
            ].map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="bg-white border border-[#f1dac4] rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={18} className="text-[#FF6A28]" />
                    <h3 className="font-semibold text-[#301b16]">{v.title}</h3>
                  </div>
                  <p className="text-sm text-[#7b5a4a]">{v.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Achievements & Events */}
        <section className="grid md:grid-cols-2 gap-8 bg-white rounded-3xl border border-[#f1dac4] p-8 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Award size={20} className="text-[#FF6A28]" />
              <h2 className="text-2xl font-bold text-[#301b16]">Our achievements</h2>
            </div>
            <ul className="space-y-2 text-[#7b5a4a]">
              <li className="flex items-start gap-2">
                <span className="text-[#FF6A28] mt-[2px]">✓</span>
                <span>Served <strong>10,000+ meals</strong> across celebrations and corporate events</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF6A28] mt-[2px]">✓</span>
                <span>Top-rated for <strong>taste</strong> and <strong>punctuality</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF6A28] mt-[2px]">✓</span>
                <span><strong>Certified kitchen</strong> with HACCP-compliant processes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF6A28] mt-[2px]">✓</span>
                <span>Trusted by <strong>startups, SMEs, and large corporates</strong></span>
              </li>
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CalendarHeart size={20} className="text-[#FF6A28]" />
              <h2 className="text-2xl font-bold text-[#301b16]">Events we specialise in</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                'Birthday Parties',
                'Weddings & Receptions',
                'Housewarming',
                'Corporate Lunches',
                'Team Meetings',
                'Festivals & Puja',
                'Baby Showers',
                'Community Events',
              ].map((pill) => (
                <span
                  key={pill}
                  className="px-3 py-2 rounded-full border border-dashed border-[#FF6A28]/60 bg-[#FF6A28]/8 text-sm text-[#301b16]"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section id="team" className="bg-[#ffe9d9] rounded-3xl border border-[#f3c29b] p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Users size={20} className="text-[#FF6A28]" />
            <h2 className="text-2xl font-bold text-[#301b16]">Meet our catering team</h2>
          </div>
          <p className="text-[#7b5a4a] max-w-2xl mb-6">
            Behind every successful event is a dedicated team. At CaterHub, chefs, planners, and service staff work together to deliver a smooth and delightful experience.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { initials: 'SC', name: 'Chef Sanjay', role: 'Head Chef', desc: '15+ years in multi-cuisine restaurants; specialises in North Indian and fusion menus.' },
              { initials: 'AR', name: 'Anita Rao', role: 'Event Coordinator', desc: 'Keeps every event on schedule, from prep to the final plate.' },
              { initials: 'TM', name: 'Service Crew', role: 'Catering Team', desc: 'Trained staff focused on polite service, clean setups, and quick refills.' },
            ].map((member) => (
              <div key={member.name} className="bg-white border border-[#f1dac4] rounded-2xl p-4 shadow-sm">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF6A28] to-[#FFC2A3] flex items-center justify-center text-white font-bold mb-3">
                  {member.initials}
                </div>
                <h3 className="font-semibold text-[#301b16] mb-1">{member.name}</h3>
                <p className="text-sm text-[#7b5a4a] mb-2">{member.role}</p>
                <p className="text-sm text-[#7b5a4a]">{member.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-white rounded-3xl border border-[#f1dac4] p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <HeartHandshake size={20} className="text-[#FF6A28]" />
            <h2 className="text-2xl font-bold text-[#301b16]">What customers say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { quote: '“Amazing food and spotless service — our event was a hit!”', author: '— S. Rao' },
              { quote: '“On-time, professional and delicious — we highly recommend CaterHub.”', author: '— K. Mehta' },
              { quote: '“Handled our corporate lunch for 150+ flawlessly. Great feedback from everyone.”', author: '— HR Manager, Tech Firm' },
            ].map((t) => (
              <div key={t.author} className="bg-[#fff8f3] border border-[#f1dac4] rounded-2xl p-5 shadow-sm relative">
                <span className="absolute text-4xl text-[#FF6A28]/30 top-2 left-3">“</span>
                <p className="text-[#301b16] mt-4">{t.quote}</p>
                <p className="text-sm text-[#7b5a4a] mt-3">{t.author}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-3xl p-8 shadow-[0_16px_40px_rgba(0,0,0,0.1)]" style={{ background: 'linear-gradient(135deg, #ffb48a, #ffe3c4)' }}>
          <div className="grid md:grid-cols-[2fr_1fr] items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#301b16] mb-2">Planning an event?</h2>
              <p className="text-[#7b5a4a] max-w-2xl">
                Share your guest count, cuisine preferences, and date — we’ll suggest the perfect menu and send a custom quote.
              </p>
            </div>
            <div className="flex md:justify-end">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full text-white font-semibold shadow-lg gap-2"
                style={{ background: 'linear-gradient(135deg, #FF6A28, #FF8B4A)' }}
              >
                <Sparkles size={18} />
                Get a Free Quote
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
