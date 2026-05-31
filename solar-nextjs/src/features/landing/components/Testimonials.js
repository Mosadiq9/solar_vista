import { Star, MessageCircle } from 'lucide-react';
export default function Testimonials() {
  const quoteIconSvg = `<svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" opacity="0.15"><path d="M11 7.05V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h3.79a4.77 4.77 0 0 1-1.54 2.83A5.43 5.43 0 0 1 4 14.93a1 1 0 0 0-.27 1.88A12.26 12.26 0 0 0 7.46 18c2.89 0 4.54-1.6 4.54-5V7.05zM21 7.05V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h3.79a4.77 4.77 0 0 1-1.54 2.83A5.43 5.43 0 0 1 14 14.93a1 1 0 0 0-.27 1.88A12.26 12.26 0 0 0 17.46 18c2.89 0 4.54-1.6 4.54-5V7.05z"/></svg>`;

  const testimonials = [
    { text: "SolarVista exceeded every expectation. Our electricity bill dropped by 85% in the first month, and the installation crew was incredibly professional. Best investment we've ever made for our home.", name: 'Michael Johnson', location: 'Sunnyvale, CA', initials: 'MJ', gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
    { text: "As a business owner, ROI is everything. SolarVista's commercial installation paid for itself in under 4 years. Their monitoring app lets me track every kilowatt — the transparency is unmatched.", name: 'Sarah Chen', location: 'Austin, TX', initials: 'SC', gradient: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' },
    { text: "The zero-down financing made going solar a no-brainer. We're paying less monthly for clean energy than we were for our old utility bill. The SolarVista team handled all permits seamlessly.", name: 'David Rodriguez', location: 'Phoenix, AZ', initials: 'DR', gradient: 'linear-gradient(135deg, #10b981, #14b8a6)' },
    { text: "I was skeptical about solar, but SolarVista's team walked me through every detail. Installation took just two days, and now I'm generating more energy than I use. They even helped me with the tax credit paperwork.", name: 'Emily Watson', location: 'Denver, CO', initials: 'EW', gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)' },
    { text: "We installed a 120kW system on our warehouse roof. The energy savings are massive — over $24,000 a year. SolarVista's commercial team managed the entire project without a single hiccup.", name: 'Robert Patel', location: 'Las Vegas, NV', initials: 'RP', gradient: 'linear-gradient(135deg, #f97316, #eab308)' },
    { text: "The custom design for our Victorian home was stunning — the panels complement the architecture perfectly. SolarVista truly understands that solar should enhance your home, not detract from it.", name: 'Lisa Thompson', location: 'Portland, OR', initials: 'LT', gradient: 'linear-gradient(135deg, #6366f1, #a855f7)' },
    { text: "Outstanding customer service from start to finish. The monitoring app is incredible — I can see exactly how much energy I'm producing and saving in real time. Already recommended SolarVista to three neighbors!", name: 'James Mitchell', location: 'San Diego, CA', initials: 'JM', gradient: 'linear-gradient(135deg, #0ea5e9, #06b6d4)' },
    { text: "The battery storage add-on was a game changer. During the last power outage, our neighbors were in the dark while our house ran normally for 18 hours straight. SolarVista gave us true energy independence.", name: 'Angela Kim', location: 'Miami, FL', initials: 'AK', gradient: 'linear-gradient(135deg, #84cc16, #22c55e)' },
  ];

  const renderCard = (t, i) => (
    <div key={i} className="testimonial-card glass-card">
      <div className="testimonial-quote-icon" dangerouslySetInnerHTML={{ __html: quoteIconSvg }} />
      <p className="testimonial-text">{t.text}</p>
      <div className="testimonial-author">
        <div className="testimonial-avatar" style={{ background: t.gradient }}>{t.initials}</div>
        <div className="testimonial-info">
          <span className="testimonial-name">{t.name}</span>
          <span className="testimonial-location">{t.location}</span>
        </div>
      </div>
      <div className="testimonial-rating">
        <Star></Star><Star></Star><Star></Star><Star></Star><Star></Star>
      </div>
    </div>
  );

  return (
    <section id="testimonials" className="testimonials-section" aria-label="Customer testimonials">
      <div className="container">
        <div className="section-header" data-animate>
          <span className="section-badge"><MessageCircle></MessageCircle> Testimonials</span>
          <h2>What Our <span>Customers Say</span></h2>
          <p className="section-subtitle">Don&apos;t just take our word for it — hear from homeowners and businesses who made the switch to SolarVista.</p>
        </div>

        <div className="testimonials-wrapper" data-animate>
          <div className="testimonials-track">
            {testimonials.map((t, i) => renderCard(t, i))}
          </div>
        </div>
      </div>
    </section>
  );
}
