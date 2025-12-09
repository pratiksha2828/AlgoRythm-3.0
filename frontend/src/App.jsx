// App.js
import './app.css';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function App() {
  const [showDailyChallenge, setShowDailyChallenge] = useState(false);
  const [username, setUsername] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Get username from URL params or sessionStorage
    const params = new URLSearchParams(location.search);
    const urlUsername = params.get('username');
    const storedUsername = sessionStorage.getItem('github_login_username');
    
    if (urlUsername) {
      setUsername(urlUsername);
      sessionStorage.setItem('github_login_username', urlUsername);
    } else if (storedUsername) {
      setUsername(storedUsername);
    }
  }, [location.search]);
  useEffect(() => {
  // Check if user has completed or exhausted today's challenge
  const challengeStatus = sessionStorage.getItem('dailyChallengeStatus');
  const lastChallengeDate = sessionStorage.getItem('lastChallengeDate');
  const today = new Date().toDateString();
  
  // Parse the status (format: "date:status" where status is "completed" or "exhausted")
  let shouldShowChallenge = true;
  
  if (challengeStatus && lastChallengeDate === today) {
    const status = challengeStatus.split(':')[1];
    if (status === 'completed' || status === 'exhausted') {
      shouldShowChallenge = false;
    }
  }
  
  // Show notification if challenge not completed/exhausted today
  if (shouldShowChallenge) {
    const timer = setTimeout(() => {
      setShowDailyChallenge(true);
    }, 2000); // Show after 2 seconds
    
    return () => clearTimeout(timer);
  }
}, []);
const handleCloseChallenge = () => {
  setShowDailyChallenge(false);
};
const handleStartChallenge = () => {
  setShowDailyChallenge(false);
  // Navigate to streaks page - daily challenge section
  window.location.href = '/streaks';
};

  // Generate animated stars
  useEffect(() => {
    const starsContainer = document.getElementById('starsContainer');
    if (!starsContainer) return;

    // Clear existing stars
    starsContainer.innerHTML = '';

    // Generate regular twinkling stars
    for (let i = 0; i < 60; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.width = `${Math.random() * 2 + 1}px`;
      star.style.height = star.style.width;
      star.style.animationDuration = `${Math.random() * 3 + 2}s`;
      star.style.animationDelay = `${Math.random() * 3}s`;
      starsContainer.appendChild(star);
    }

    // Generate shooting stars
    for (let i = 0; i < 5; i++) {
      const shootingStar = document.createElement('div');
      shootingStar.className = 'shooting-star';
      shootingStar.style.left = `${Math.random() * 100}%`;
      shootingStar.style.top = `${Math.random() * 50}%`;
      shootingStar.style.animationDuration = `${Math.random() * 2 + 1}s`;
      shootingStar.style.animationDelay = `${Math.random() * 5}s`;
      starsContainer.appendChild(shootingStar);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('github_login_token');
    sessionStorage.removeItem('github_login_username');
    sessionStorage.removeItem('github_login_time');
    window.location.href = 'http://localhost:5000/auth/logout';
  };
  const learningPaths = [
    {
      title: "Generate your roadmap",
      buttonText: "Get Started",
      image: "/images/roadmap.png",
      link: "/roadmap-filter"
    },
    {
      title: "Learn Through Real Time Projects",
      buttonText: "Join a Project",
      image: "/images/projects.png", // Add images for all cards
      link: "/projects"
    },
    {
      title: "Trace & Learn Algorithms",
      buttonText: "Start Tracing",
      image: "/images/algorithm.png",
      link: "/trace"
    },
    {
      title: "Refactor Your Code",
      buttonText: "Enhance Now",
      image: "/images/refactor.png",
      link: "/refactor"
    },
    {
      title: "Create Your Test",
      buttonText: "Create Test",
      image: "/images/test.png",
      link: "/create-test"
    },
    {
      title: "Claim Your Streaks",
      buttonText: "Claim Streaks",
      image: "/images/streaks.png",
      link: "/streaks"
    }
  ];

  const footerSections = [
  {
    links: ["FAQ", "Feedback", "Help Center"]
  }
];


  return (
    <div className="wrap">
      <style>
        {`
          @keyframes shooting-star {
            0% {
              transform: translate(0, 0) rotate(-45deg);
              opacity: 1;
            }
            70% {
              opacity: 1;
            }
            100% {
              transform: translate(-300px, 300px) rotate(-45deg);
              opacity: 0;
            }
          }

          @keyframes twinkle {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
          }

          .stars-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
          }

          .star {
            position: absolute;
            background: white;
            border-radius: 50%;
            animation: twinkle linear infinite;
          }

          .shooting-star {
            position: absolute;
            width: 2px;
            height: 2px;
            background: linear-gradient(90deg, #fff, transparent);
            border-radius: 50%;
            animation: shooting-star linear infinite;
          }

          .shooting-star::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 60px;
            height: 2px;
            background: linear-gradient(90deg, rgba(255,255,255,0.8), transparent);
          }

          .shooting-star::after {
            content: '';
            position: absolute;
            top: -1px;
            right: -2px;
            width: 6px;
            height: 6px;
            background: radial-gradient(circle, rgba(255,255,255,1), transparent);
            border-radius: 50%;
          }

          .wrap {
            position: relative;
            z-index: 0;
          }
        `}
      </style>
      {showDailyChallenge && (
  <div className="daily-challenge-notification">
    <div className="challenge-card">
      <div className="challenge-header">
        <div className="challenge-icon">⚡</div>
        <h3>Daily Challenge Awaits!</h3>
        <button className="close-btn" onClick={handleCloseChallenge}>×</button>
      </div>
      
      <div className="challenge-content">
        <p>Sharpen your skills with today's coding challenge!</p>
       
        
        
      </div>
      
      <div className="challenge-actions">
        <button className="btn-remind" onClick={handleCloseChallenge}>
          Remind Later
        </button>
        <button className="btn-start" onClick={handleStartChallenge}>
          Start Challenge 
        </button>
      </div>
      
      <div className="challenge-sparkle"></div>
    </div>
  </div>
)}

      {/* Animated Stars Overlay */}
      <div className="stars-overlay" id="starsContainer"></div>
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">AlgoRythm</Link>
       <nav className="nav">
  <Link to="/" className="nav-link">Home</Link>
  <Link to="/learn-filter" className="nav-link">Learn</Link>
  <Link to="/projects" className="nav-link">Projects</Link>
  <Link to="/news" className="nav-link">News</Link>
  {/* Add this line for Feedback */}
  <Link to="/feedback" className="nav-link">Feedback</Link>
  {username && (
    <div className="user-info">
          <Link to="/profile" className="username">👤 {username}</Link>
      <button onClick={handleLogout} className="logout-btn">Logout</button>
    </div>
  )}
</nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1>Explore Your Coding Journey</h1>
        <p>Code your universe, one algorithm at a time</p>
      </section>

      {/* Symmetric 6-Block Cards Grid */}
      <div className="cards-grid-symmetric">
        {learningPaths.map((path, index) => (
          <div 
            key={index} 
            className="card card-symmetric" 
            style={{
              animationDelay: `${index * 0.1}s`
            }}
          >
            {/* Image Section - Add this */}
            <div className="card-image-container">
              <img 
                src={path.image} 
                alt={path.title}
                className="card-image"
                onError={(e) => {
                  // Fallback if image doesn't load
                  e.target.style.display = 'none';
                  const fallback = e.target.parentElement.querySelector('.card-image-fallback');
                  if (fallback) fallback.style.display = 'block';
                }}
              />
              {/* Fallback emoji if image fails to load */}
              <div className="card-image-fallback" style={{display: 'none'}}>
                {getFallbackEmoji(path.title)}
              </div>
            </div>
            
            <h3>{path.title}</h3>
            <Link to={path.link} className="btn primary card-btn">
              {path.buttonText}
            </Link>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          {footerSections.map(() => (
            <div className="footer-section">
              <ul className="footer-links">
                <li><a href="/faq">FAQ</a></li>
                <li><a href="/feedback">Feedback</a></li>
                <li><a href="/help-center">Help Center</a></li>
              </ul>
            </div>
          ))}
        </div>
        
        <div className="footer-bottom">
          <p>© 2025 AlgoRythm. All rights reserved. Built with passion for developers.</p>
        </div>
      </footer>
    </div>
  );
}

// Helper function for fallback emojis
function getFallbackEmoji(title) {
  const emojiMap = {
    "Learn Coding from Scratch": "📚",
    "Learn Through Real Time Projects": "💻",
    "Trace & Learn Algorithms": "🔍",
    "Refactor Your Code": "🔄",
    "Create Your Test": "✏️",
    "Claim Your Streaks": "🔥"
  };
  return emojiMap[title] || "🚀";
}