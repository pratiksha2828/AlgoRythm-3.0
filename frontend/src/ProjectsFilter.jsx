import './app.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function ProjectsFilter() {
  const [showInfo, setShowInfo] = useState(false);
  const navigate = useNavigate();
  
  const projectOptions = [
    {
      id: 'learn-projects',
      name: 'Learn an Existing Project',
      description: 'Study and understand completed projects to learn patterns, architecture, and best practices',
      icon: '',
      image: "/images/existing.png",
      features: [],
      benefits: ''
    },
    {
      id: 'build-projects', 
      name: 'Learn by Building a Project',
      description: 'Build projects from scratch with guided tutorials and step-by-step instructions',
      icon: '',
      image: "/images/make it horizontal.png",
      features: [],
      benefits: ''
    }
  ];

  const handleOptionSelect = (optionId) => {
    // Navigate to the appropriate projects page based on selection
    navigate(`/projects/${optionId}`);
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
          <h1 style={{margin: 0}}>Project-Based Learning</h1>
          {/* Circular info button placed next to the main heading */}
          <button
            aria-label="Project comparison info"
            onClick={() => { console.log('info button clicked'); setShowInfo(s => !s); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowInfo(s => !s); } }}
            tabIndex={0}
            style={{
              width: '34px',
              height: '34px',
              minWidth: '34px',
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: '2px solid rgba(46, 230, 255, 0.98)',
              background: 'linear-gradient(180deg, rgba(46,230,255,0.18), rgba(46,230,255,0.08))',
              color: 'rgba(10,10,10,0.95)',
              fontWeight: 800,
              fontSize: '14px',
              lineHeight: 1,
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

        <p>Choose how you want to learn through real-world projects and build practical experience</p>
      </section>

      {/* Options Grid */}
      <div className="cards-grid" style={{maxWidth: '900px', margin: '0 auto'}}>
        {projectOptions.map(option => (
          <div 
            key={option.id} 
            className="card"
            style={{cursor: 'pointer', textAlign: 'center'}}
            onClick={() => handleOptionSelect(option.id)}
          >
           <div className="card-image-container">
  <img 
    src={option.image} 
    alt={option.name}
    className="card-image"
    onError={(e) => {
      e.target.style.display = 'none';
      // Optional: Show icon if image fails to load
      // const fallback = e.target.parentElement.querySelector('.icon-emoji');
      // if (fallback) fallback.style.display = 'block';
    }}
  />
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

            <div style={{
              background: 'linear-gradient(135deg, var(--brand), var(--brand-dark))',
              padding: '12px',
              borderRadius: '12px',
              margin: '15px 0',
              color: 'white'
            }}>
              <strong> {option.benefits}</strong>
            </div>
            
            <button className="btn primary card-btn">
              Choose This Path
            </button>
          </div>
        ))}
      </div>

  {/* Comparison panel (shown when the hero 'i' is clicked) */}
  <ComparisonPanel showInfo={showInfo} setShowInfo={setShowInfo} />

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            {/* Footer content intentionally left minimal; comparison text is shown via the info icon */}
            <div className="footer-actions" style={{ marginTop: 8 }}>
              <Link to="/faq" className="footer-button"><span className="icon">❓</span>FAQ</Link>
              <Link to="/feedback" className="footer-button"><span className="icon">💬</span>Share Feedback</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 AlgoRythm. Learn by doing, understand by studying.</p>
        </div>
      </footer>
    </div>
  );
}

function ComparisonPanel({ showInfo, setShowInfo }) {
  // Render a modal overlay when showInfo is true so it appears above all content
  if (!showInfo) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={() => setShowInfo(false)}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '920px',
          width: '92%',
          /* semi-transparent white panel for readability */
          background: 'rgba(255,255,255,0.92)',
          borderRadius: '12px',
          padding: '22px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
          color: 'rgba(10,10,10,0.95)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)'
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
          <h3 style={{margin: 0, textShadow: 'none', color: 'rgba(10,10,10,0.95)'}}>Which one is right for you?</h3>
          <button onClick={() => setShowInfo(false)} aria-label="Close" style={{border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem'}}>✕</button>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '8px'}}>
          <div>
            <h4 style={{textShadow: 'none', color: 'rgba(10,10,10,0.9)'}}>Learn Existing Projects</h4>
            <p style={{color: 'rgba(50,50,50,0.85)', textShadow: 'none'}}>
              <strong>Ideal for:</strong> Beginners who want to understand how real applications work, developers looking to learn specific patterns, or those who prefer studying before building.
            </p>
            <ul style={{color: 'rgba(50,50,50,0.85)', paddingLeft: '20px', textShadow: 'none'}}>
              <li style={{textShadow: 'none'}}>See finished products first</li>
              <li style={{textShadow: 'none'}}>Understand architecture decisions</li>
              <li style={{textShadow: 'none'}}>Learn from others' code</li>
              <li style={{textShadow: 'none'}}>Less pressure to create</li>
            </ul>
          </div>

          <div>
            <h4 style={{textShadow: 'none', color: 'rgba(10,10,10,0.9)'}}>Build Projects</h4>
            <p style={{color: 'rgba(50,50,50,0.85)', textShadow: 'none'}}>
              <strong>Ideal for:</strong> Hands-on learners, those who learn by doing, developers who want to build their portfolio, or anyone who enjoys creating.
            </p>
            <ul style={{color: 'rgba(50,50,50,0.85)', paddingLeft: '20px', textShadow: 'none'}}>
              <li style={{textShadow: 'none'}}>Active learning experience</li>
              <li style={{textShadow: 'none'}}>Build muscle memory</li>
              <li style={{textShadow: 'none'}}>Create portfolio pieces</li>
              <li style={{textShadow: 'none'}}>Solve problems in real-time</li>
            </ul>
          </div>
        </div>

        <div style={{marginTop: '18px', color: 'rgba(50,50,50,0.85)'}}>
          <h4 style={{textShadow: 'none'}}>Not sure which to choose?</h4>
          <p style={{textShadow: 'none'}}>
            <strong>Start with Existing Projects</strong> if you're new to programming<br/>
            <strong>Choose Building Projects</strong> if you have some experience and want to practice<br/>
            Many developers use both approaches throughout their learning journey!
          </p>
        </div>
      </div>
    </div>
  );
}