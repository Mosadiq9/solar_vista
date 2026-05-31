'use client';
import { ArrowRight, BookOpen, Receipt, User, Calendar, Clock, BatteryCharging, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import DynamicIcon from '@/shared/components/DynamicIcon';

export default function Blog({ initialBlogs = [] }) {
  // Use the server-fetched blogs, or fallback to empty array
  const blogs = initialBlogs;

  return (
    <section id="blog" className="blog-section" aria-label="Solar resources and blog">
      <div className="container">
        <div className="section-header" data-animate>
          <span className="section-badge"><BookOpen /> Knowledge Hub</span>
          <h2>Solar <span>Resources</span></h2>
          <p className="section-subtitle">Stay informed with the latest solar insights, guides, and industry news curated by our energy experts.</p>
        </div>

        <div id="blog-grid" className="blog-grid">
          {blogs.length > 0 ? (
            blogs.map((blog, index) => {
              const iconName = blog.icon || (index % 3 === 0 ? 'sun' : index % 3 === 1 ? 'battery-charging' : 'bar-chart');
              return (
                <article key={blog.id} className="blog-card" data-animate>
                  <div className="blog-image">
                    <div style={{position:'absolute',inset:0,background:'var(--gradient-solar)',opacity:0.8}}></div>
                    <DynamicIcon name={iconName} style={{position:'relative',zIndex:2,color:'white',width:'48px',height:'48px'}} />
                  </div>
                  <div className="blog-content">
                    <span className="blog-category">{blog.category || 'News'}</span>
                    <h3 className="blog-title">{blog.title}</h3>
                    <p className="blog-excerpt">{blog.excerpt || ''}</p>
                    <a href="#" className="btn-text">Read More <ArrowRight /></a>
                  </div>
                </article>
              );
            })
          ) : (
            // Static Fallbacks
            <>
              <article className="blog-card" data-animate>
                <div className="blog-image blog-gradient-1">
                  <Receipt className="blog-placeholder-icon" />
                </div>
                <div className="blog-content">
                  <span className="blog-category">Tax Credits</span>
                  <h3 className="blog-title">Federal Solar Tax Credit: Complete Guide for 2025</h3>
                  <p className="blog-excerpt">The Investment Tax Credit (ITC) allows homeowners to deduct 30% of solar installation costs from federal taxes. Learn how to maximize your savings and navigate the application process step by step.</p>
                  <div className="blog-meta">
                    <span className="blog-author"><User /> Dr. Elena Rivera</span>
                    <span className="blog-date"><Calendar /> May 15, 2025</span>
                    <span className="blog-read-time"><Clock /> 8 min read</span>
                  </div>
                </div>
              </article>

              <article className="blog-card" data-animate>
                <div className="blog-image blog-gradient-2">
                  <BatteryCharging className="blog-placeholder-icon" />
                </div>
                <div className="blog-content">
                  <span className="blog-category">Technology</span>
                  <h3 className="blog-title">How Solar Battery Storage Works</h3>
                  <p className="blog-excerpt">Discover how lithium-ion battery systems store excess solar energy for nighttime use and power outages. We break down the technology, costs, and top brands to help you make an informed decision.</p>
                  <div className="blog-meta">
                    <span className="blog-author"><User /> Marcus Chen</span>
                    <span className="blog-date"><Calendar /> May 8, 2025</span>
                    <span className="blog-read-time"><Clock /> 6 min read</span>
                  </div>
                </div>
              </article>

              <article className="blog-card" data-animate>
                <div className="blog-image blog-gradient-3">
                  <TrendingUp className="blog-placeholder-icon" />
                </div>
                <div className="blog-content">
                  <span className="blog-category">Savings</span>
                  <h3 className="blog-title">Solar ROI: When Will Your Panels Pay For Themselves?</h3>
                  <p className="blog-excerpt">Most solar installations reach payback in 5–8 years, then generate free electricity for decades. Explore the key factors that affect your return on investment and how to accelerate your breakeven point.</p>
                  <div className="blog-meta">
                    <span className="blog-author"><User /> Sarah Okafor</span>
                    <span className="blog-date"><Calendar /> Apr 28, 2025</span>
                    <span className="blog-read-time"><Clock /> 7 min read</span>
                  </div>
                </div>
              </article>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
