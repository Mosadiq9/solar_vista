'use client';
import { useState } from 'react';
import { Star, MessageCircle } from 'lucide-react';
export default function Testimonials({ initialTestimonials }) {
  const quoteIconSvg = `<svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" opacity="0.15"><path d="M11 7.05V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h3.79a4.77 4.77 0 0 1-1.54 2.83A5.43 5.43 0 0 1 4 14.93a1 1 0 0 0-.27 1.88A12.26 12.26 0 0 0 7.46 18c2.89 0 4.54-1.6 4.54-5V7.05zM21 7.05V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h3.79a4.77 4.77 0 0 1-1.54 2.83A5.43 5.43 0 0 1 14 14.93a1 1 0 0 0-.27 1.88A12.26 12.26 0 0 0 17.46 18c2.89 0 4.54-1.6 4.54-5V7.05z"/></svg>`;

  const defaultTestimonials = [
    { id: '1', text: "After getting three different quotes, SolarVista was the clear winner. They weren't the cheapest, but their engineering team caught a roof shading issue the others missed. My system is overproducing by 12% compared to their estimate!", name: 'Jason T.', location: 'Austin, TX', initials: 'JT', gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)', rating: 5 },
    { id: '2', text: "We installed a 15kW system with two battery backups. When the grid went down during the winter storm, our house was the only one on the block with heat and lights. The peace of mind is priceless.", name: 'Maria Gonzalez', location: 'Denver, CO', initials: 'MG', gradient: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', rating: 5 },
    { id: '3', text: "The commercial installation for our manufacturing facility was flawless. SolarVista's project managers handled all the city permits and utility interconnection. We're on track to save $42,000 in Year 1.", name: 'David Chen, CEO', location: 'Phoenix, AZ', initials: 'DC', gradient: 'linear-gradient(135deg, #10b981, #14b8a6)', rating: 5 },
    { id: '4', text: "I love the monitoring app. It's incredibly satisfying to pull out my phone and see exactly how much power my roof is generating in real-time. Their customer support team even helped me set up the EV charger integration.", name: 'Emily R.', location: 'San Diego, CA', initials: 'ER', gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)', rating: 5 },
    { id: '5', text: "From the initial drone survey to the final inspection, everything was highly professional. The installation crew left my property cleaner than they found it. My electric bill went from $350 to just the $15 connection fee.", name: 'Robert Vance', location: 'Las Vegas, NV', initials: 'RV', gradient: 'linear-gradient(135deg, #f97316, #eab308)', rating: 5 },
    { id: '6', text: "We live in a historic neighborhood and were worried about aesthetics. SolarVista designed a sleek, low-profile array with all-black panels and hidden conduit. It looks incredible and the HOA approved it on the first try.", name: 'Sarah & Tom Jenkins', location: 'Portland, OR', initials: 'SJ', gradient: 'linear-gradient(135deg, #6366f1, #a855f7)', rating: 5 }
  ];

  const allTestimonials = initialTestimonials?.length > 0 ? initialTestimonials : defaultTestimonials;
  const testimonials = allTestimonials.filter(t => !t.video_url);

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

  const [activeVideo, setActiveVideo] = useState(null);

  const defaultVideoTestimonials = [
    {
      id: 'video-1',
      videoId: 'dQw4w9WgXcQ', // Placeholder
      name: 'Michael & Emily Davis',
      location: 'San Jose, CA',
      quote: '"SolarVista completely transformed how we power our home. The whole process was seamless!"',
      gradient: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(239,68,68,0.2))'
    }
  ];

  const videoData = allTestimonials.filter(t => t.video_url);
  const videoTestimonials = videoData.length > 0 ? videoData.map(v => {
    // Extract video ID from youtube URL
    let videoId = v.video_url;
    if (videoId.includes('v=')) videoId = videoId.split('v=')[1].split('&')[0];
    else if (videoId.includes('youtu.be/')) videoId = videoId.split('youtu.be/')[1].split('?')[0];

    return {
      id: v.id,
      videoId: videoId,
      name: v.name,
      location: v.location,
      quote: v.text,
      gradient: v.gradient || 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(239,68,68,0.2))'
    };
  }) : defaultVideoTestimonials;

  return (
    <section id="testimonials" className="testimonials-section" aria-label="Customer testimonials">
      <div className="container">
        <div className="section-header" data-animate>
          <span className="section-badge"><MessageCircle></MessageCircle> Testimonials</span>
          <h2>What Our <span>Customers Say</span></h2>
          <p className="section-subtitle">Don&apos;t just take our word for it — hear from homeowners and businesses who made the switch to SolarVista.</p>
        </div>

        {/* Featured Video Testimonial */}
        <div className="video-testimonial-wrapper" data-animate>
          {videoTestimonials.map(v => (
            <div key={v.id} className="video-testimonial glass-card">
              <div className="video-container" style={{ background: v.gradient }}>
                {activeVideo === v.id ? (
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube-nocookie.com/embed/${v.videoId}?autoplay=1&rel=0`} 
                    title="Customer Testimonial" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen>
                  </iframe>
                ) : (
                  <div className="video-overlay" onClick={() => setActiveVideo(v.id)}>
                    <button className="video-play-btn" aria-label="Play video testimonial">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32"><path d="M8 5v14l11-7z"/></svg>
                    </button>
                    <span className="video-duration">3:14</span>
                  </div>
                )}
              </div>
              <div className="video-customer-info">
                <h3>{v.quote}</h3>
                <p><strong>{v.name}</strong> — {v.location}</p>
                <div className="testimonial-rating" style={{justifyContent: 'center', marginTop: '8px'}}>
                  <Star size={16}></Star><Star size={16}></Star><Star size={16}></Star><Star size={16}></Star><Star size={16}></Star>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="testimonials-wrapper" data-animate>
          <div className="testimonials-grid">
            {testimonials.slice(0, 6).map((t, i) => renderCard(t, i))}
          </div>
        </div>
      </div>
    </section>
  );
}
