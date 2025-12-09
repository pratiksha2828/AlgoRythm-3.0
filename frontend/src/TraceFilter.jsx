import './app.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function TraceFilter() {
  const [showInfo, setShowInfo] = useState(false);
  const navigate = useNavigate();
  
  const tracingOptions = [
    {
      id: 'coding',
      name: 'Learn coding through games',
      description: 'Step through code execution and understand how programs work line by line',
      image: '/images/generate an amazing .png', // Add image path
      features: []
    },
    {
      id: 'algorithms',
      name: 'Algorithm Tracing', 
      description: 'Visualize how algorithms work with animated step-by-step execution',
      image: '/images/generate a more comp.png', // Add image path
      features: []
    }
  ];

  const handleOptionSelect = (optionId) => {
    navigate(`/trace/${optionId}`);
  };

  return (
    <div className="wrap">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">AlgoRythm</Link>
          <nav className="nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/learn" className="nav-link">Learn</Link>
            <Link to="/projects" className="nav-link">Projects</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}}>
          <h1 style={{margin: 0}}>Trace & Learn</h1>
          <button
            aria-label="Trace info"
            onClick={() => setShowInfo(s => !s)}
            style={{
              width: '34px',
              height: '34px',
              minWidth: '34px',
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: '2px solid rgba(46,230,255,0.98)',
              background: 'linear-gradient(180deg, rgba(46,230,255,0.18), rgba(46,230,255,0.08))',
              boxShadow: '0 8px 22px rgba(46,230,255,0.12)',
              marginLeft: '8px',
              zIndex: 99999,
              position: 'relative',
              pointerEvents: 'auto'
            }}
          >
            <span style={{
              color: 'rgba(46,230,255,0.98)',
              textShadow: '0 0 6px rgba(46,230,255,0.9), 0 0 14px rgba(46,230,255,0.55)',
              fontWeight: 900,
              fontSize: '14px',
              lineHeight: 1
            }}>i</span>
          </button>
        </div>

        <p>Choose what you want to trace and understand through visual step-by-step execution</p>
      </section>

      {/* Options Grid */}
      <div className="cards-grid" style={{maxWidth: '900px', margin: '0 auto'}}>
        {tracingOptions.map(option => (
          <div 
            key={option.id} 
            className="card"
            style={{cursor: 'pointer'}}
            onClick={() => handleOptionSelect(option.id)}
          >
            {/* Image Container */}
            <div className="card-image-container">
              {option.image ? (
                <img 
                  src={option.image} 
                  alt={option.name}
                  className="card-image"
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : null}
              {/* Fallback icon if image not available */}
              <span 
                className="card-image-fallback" 
                style={{display: option.image ? 'none' : 'block'}}
              >
                {option.icon || '🔍'}
              </span>
            </div>
            
            <h3>{option.name}</h3>
            <p>{option.description}</p>
            
            <div style={{margin: '20px 0'}}>
              <h4 style={{margin: '0 0 12px', color: 'var(--muted)', fontSize: '1rem'}}>
             
              </h4>
              <div style={{display: 'grid', gap: '8px'}}>
                {option.features.map(feature => (
                  <span key={feature} style={{
                    background: 'var(--bg)',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    color: 'var(--muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{color: 'var(--brand)'}}>✓</span>
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            
            <button className="btn primary card-btn">
              Start Tracing {option.name}
            </button>
          </div>
        ))}
      </div>

      {/* Modal for trace info (opened by the 'i' button) */}
      {showInfo && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setShowInfo(false)}
          style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999999}}
        >
          <div onClick={(e) => e.stopPropagation()} style={{maxWidth: '720px', width: '92%', background: 'rgba(255,255,255,0.92)', borderRadius: '12px', padding: '20px', boxShadow: '0 12px 40px rgba(0,0,0,0.4)', color: 'rgba(10,10,10,0.95)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <h3 style={{margin: 0, textShadow: 'none'}}>Not sure which to choose?</h3>
              <button onClick={() => setShowInfo(false)} aria-label="Close" style={{border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem'}}>✕</button>
            </div>
            <div style={{marginTop: '12px', color: 'rgba(50,50,50,0.85)'}}>
              <p style={{margin: '6px 0'}}><strong>Learn Coding through games</strong> is great for understanding specific code execution.</p>
              <p style={{margin: '6px 0'}}><strong>Algorithm Tracing</strong> is perfect for learning how algorithms work.</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          {/* Footer intentionally minimal; trace guidance shown via info icon */}
        </div>

        <div className="footer-bottom">
          <p>© 2025 AlgoRythm. Master coding through visual learning.</p>
        </div>
      </footer>
    </div>
  );
}