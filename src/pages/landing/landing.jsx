import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();
  const infoRef = useRef(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right')
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-page-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="main-title fade-in">Welcome to Sprout!</h1>
        </div>

        <div ref={infoRef} className="journey-section-wrapper">
          <h2 className="journey-title fade-in">Your Path To Flourishing</h2>

          <div className="features-layout">
            <div className="feature-item fade-in-left">
              <div className="glass-box">
                <h3 className="feature-name">Routine</h3>
                <p className="feature-desc">Structure your day with intent.</p>
              </div>
            </div>

            <div className="feature-item fade-in">
              <div className="glass-box">
                <h3 className="feature-name">Healing</h3>
                <p className="feature-desc">A space for reflection.</p>
              </div>
            </div>

            <div className="feature-item fade-in-right">
              <div className="glass-box">
                <h3 className="feature-name">Growth</h3>
                <p className="feature-desc">Watch yourself flourish.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="excerpt-wrapper fade-in">
          <p className="mission-statement">
            "Self-care should be as natural as watering a plant. At Sprouts,
            we believe in the power of <strong>'pouring into yourself'</strong>{' '}
            every single day. Our platform blends the calming rhythm of nature
            with modern routine tracking, creating a sanctuary where you can
            practice healing, stay organized, and watch yourself flourish."
          </p>
        </div>

        <div className="bottom-nav-container fade-in">
          <button className="start-adventure-btn" onClick={() => navigate('/login')}>
            Start Your Healing Adventure
          </button>
          <button className="jump-top-link" onClick={scrollToTop}>
            Jump to Top
          </button>
        </div>
      </section>
    </div>
  );
};

export default Landing;