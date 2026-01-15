import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="hp-wrapper">
      <div className="hp-glow" aria-hidden="true" />
      
      <nav className="hp-navbar">
        <div className="hp-logo">StoreRate<span>.</span></div>
        <div className="hp-nav-links">
          <Link to="/login" className="hp-nav-text">Sign In</Link>
          <Link to="/signup" className="hp-btn-nav">Get Started</Link>
        </div>
      </nav>

      <main className="hp-container">
        <header className="hp-hero">
          <h1 className="hp-title">
            The Standard for <br />
            <span>Store Feedback</span>
          </h1>
          <p className="hp-subtitle">
            A professional ecosystem for users to rate, owners to grow, and 
            administrators to manage with data-driven insights.
          </p>
        </header>

        <section className="hp-bento-grid">
          <div className="hp-bento-card">
            <h3>Verified Ecosystem</h3>
            <p>Users can submit and modify 1-5 star ratings for any registered store.</p>
            <div className="hp-stars-visual">★★★★★</div>
          </div>
          
          <div className="hp-bento-card">
            <h3>Admin Insights</h3>
            <p>Access high-level dashboards tracking total users, stores, and ratings.</p>
          </div>

          <div className="hp-bento-card">
            <h3>Owner Metrics</h3>
            <p>Store owners can view their overall average rating and customer feedback.</p>
          </div>
        </section>
      </main>

      <footer className="hp-footer">
        &copy; {new Date().getFullYear()} Store Rate App — Professional Edition
      </footer>
    </div>
  );
};

export default HomePage;