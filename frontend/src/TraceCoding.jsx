import './app.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function TraceCoding() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const codingPlatforms = [
    {
      name: "Codingame",
      description: "Learn coding through games and challenges with visual execution",
      link: "https://www.codingame.com/",
      category: "Gaming",
      features: ["Visual Code Execution", "Game-Based Learning", "Multiplayer Challenges", "Multiple Languages"],
      icon: "🎮",
      level: "All Levels"
    },
    {
      name: "Codingbat",
      description: "Practice coding problems with immediate visual feedback",
      link: "https://codingbat.com/",
      category: "Practice",
      features: ["Instant Feedback", "Python & Java", "Beginner Friendly", "Problem Solving"],
      icon: "🐍",
      level: "Beginner"
    },
    {
      name: "Python Tutor",
      description: "Visualize Python, Java, C, C++, JavaScript, and Ruby code execution",
      link: "http://pythontutor.com/",
      category: "Visualization",
      features: ["Step-by-Step Visualization", "Multiple Languages", "Memory Diagrams", "Educational"],
      icon: "👨‍🏫",
      level: "All Levels"
    },
    {
      name: "Scrimba",
      description: "Interactive coding tutorials with live editing and visual feedback",
      link: "https://scrimba.com/",
      category: "Tutorials",
      features: ["Interactive Tutorials", "Live Code Editing", "Frontend Focus", "Screencast Videos"],
      icon: "🎥",
      level: "Beginner to Intermediate"
    },
    {
      name: "LeetCode",
      description: "Coding challenges with visual test cases and debugging tools",
      link: "https://leetcode.com/",
      category: "Practice",
      features: ["Visual Test Cases", "Debugging Tools", "Interview Prep", "Community Solutions"],
      icon: "💼",
      level: "Intermediate to Advanced"
    },
    {
      name: "Codecademy",
      description: "Interactive learning platform with visual code execution",
      link: "https://www.codecademy.com/",
      category: "Courses",
      features: ["Interactive Lessons", "Visual Output", "Projects", "Multiple Languages"],
      icon: "🏫",
      level: "Beginner to Intermediate"
    },
    {
      name: "JSFiddle",
      description: "Online IDE for web development with live preview",
      link: "https://jsfiddle.net/",
      category: "Playground",
      features: ["Live Preview", "HTML/CSS/JS", "Sharing", "Quick Prototyping"],
      icon: "🔄",
      level: "All Levels"
    },
    {
      name: "CodePen",
      description: "Social development environment with live visual results",
      link: "https://codepen.io/",
      category: "Playground",
      features: ["Live Visual Output", "Community", "Frontend Focus", "Inspiration"],
      icon: "✏️",
      level: "All Levels"
    }
  ];

  const categories = ['All', ...new Set(codingPlatforms.map(platform => platform.category))];
  
  const filteredPlatforms = selectedCategory === 'All' 
    ? codingPlatforms 
    : codingPlatforms.filter(platform => platform.category === selectedCategory);

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
        <h1> Code Tracing Platforms</h1>
        <p>Discover the best platforms for visual code learning and step-by-step execution tracing</p>
        <div style={{ 
          background: 'var(--card)', 
          padding: '15px', 
          borderRadius: '12px', 
          margin: '20px auto',
          maxWidth: '600px',
          border: '1px solid var(--brand)'
        }}>
          
        </div>
      </section>

      {/* Category Filter */}
      <section style={{ maxWidth: '1000px', margin: '40px auto', textAlign: 'center' }}>
        <h3>Filter by Category:</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', margin: '20px 0' }}>
          {categories.map(category => (
            <button 
              key={category}
              className={`btn ${selectedCategory === category ? 'primary' : 'outline'}`}
              style={{ fontSize: '0.9rem' }}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Results count */}
        <p style={{ color: 'var(--muted)', marginTop: '10px' }}>
          Showing {filteredPlatforms.length} of {codingPlatforms.length} platforms
          {selectedCategory !== 'All' && ` in "${selectedCategory}"`}
        </p>
      </section>

      {/* Platforms Grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {filteredPlatforms.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
            <h3>No platforms found in this category</h3>
            <p style={{ color: 'var(--muted)' }}>Try selecting a different category or view all platforms.</p>
            <button 
              className="btn primary"
              onClick={() => setSelectedCategory('All')}
            >
              View All Platforms
            </button>
          </div>
        ) : (
          <div className="cards-grid">
            {filteredPlatforms.map((platform, index) => (
              <div key={index} className="card">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <span className="icon-emoji" style={{ fontSize: '2rem', marginRight: '15px' }}>
                    {platform.icon}
                  </span>
                  <div>
                    <h3 style={{ margin: 0 }}>{platform.name}</h3>
                    <span style={{ 
                      background: 'var(--bg)', 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      fontSize: '0.7rem',
                      color: 'var(--muted)'
                    }}>
                      {platform.category}
                    </span>
                  </div>
                </div>
                
                <p style={{ color: 'var(--muted)', marginBottom: '15px', flexGrow: 1 }}>
                  {platform.description}
                </p>
                
                <div style={{ marginBottom: '15px' }}>
                  <h4 style={{ color: 'var(--muted)', margin: '0 0 8px 0', fontSize: '0.9rem' }}>Features:</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {platform.features.map((feature, i) => (
                      <span key={i} style={{
                        background: 'var(--bg)',
                        padding: '4px 8px',
                        borderRadius: '8px',
                        fontSize: '0.7rem',
                        color: 'var(--muted)'
                      }}>
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '15px'
                }}>
                  <span style={{ 
                    background: 'var(--bg)', 
                    padding: '4px 8px', 
                    borderRadius: '8px', 
                    fontSize: '0.7rem',
                    color: 'var(--muted)'
                  }}>
                    📊 {platform.level}
                  </span>
                </div>

                <a 
                  href={platform.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn primary card-btn"
                  style={{ textDecoration: 'none' }}
                >
                  Visit Website
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <section style={{textAlign: 'center', margin: '60px 0', padding: '40px', background: 'var(--card)', borderRadius: '20px', border: '1px solid #22263b'}}>
        <h2>Ready to Start Tracing?</h2>
        <p style={{color: 'var(--muted)', maxWidth: '500px', margin: '0 auto 30px'}}>
          Choose a platform that matches your learning style and start understanding code execution visually!
        </p>
        <Link to="/trace" className="btn primary" style={{padding: '15px 30px', fontSize: '1.1rem', textDecoration: 'none'}}>
          Back to Tracing Options
        </Link>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Need help choosing?</h4>
            <p style={{color: 'var(--muted)', margin: '10px 0 0'}}>
              Beginners: Start with Codingbat or Codecademy<br/>
              Visual Learners: Try Python Tutor or Codingame<br/>
              Advanced: Explore LeetCode challenges
            </p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2025 AlgoRythm. Learn coding through visual execution.</p>
        </div>
      </footer>
    </div>
  );
}