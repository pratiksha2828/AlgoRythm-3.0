import './app.css';
import { Link } from 'react-router-dom';

export default function Learn() {
  // Sample beginner courses data
  const beginnerCourses = [
    {
      id: 1,
      title: "HTML & CSS Fundamentals",
      description: "Learn to build and style your first website with HTML and CSS.",
      duration: "2 weeks",
      level: "Beginner",
      icon: "🌐",
      slug: "html-css-fundamentals" // ADD THIS
    },
    {
      id: 2,
      title: "JavaScript Basics",
      description: "Master the fundamentals of programming with JavaScript.",
      duration: "3 weeks", 
      level: "Beginner",
      icon: "⚡",
      slug: "javascript-basics" // ADD THIS
    },
    {
      id: 3,
      title: "Python for Everyone",
      description: "Start your programming journey with Python's simple syntax.",
      duration: "3 weeks",
      level: "Beginner",
      icon: "🐍",
      slug: "python-for-everyone" // ADD THIS
    },
    {
      id: 4,
      title: "Git & GitHub Essentials",
      description: "Learn version control and collaborate on coding projects.",
      duration: "1 week",
      level: "Beginner", 
      icon: "📦",
      slug: "git-github-essentials" // ADD THIS
    }
  ];

  const learningPaths = [
  {
    title: "Web Development",
    courses: ["HTML", "CSS", "JavaScript", "React"],
    icon: "💻",
    slug: "web-development" // ADD THIS
  },
  {
    title: "Data Science", 
    courses: ["Python", "Pandas", "NumPy", "Data Visualization"],
    icon: "📊",
    slug: "data-science" // ADD THIS (even if route doesn't exist yet)
  },
  {
    title: "Mobile Development",
    courses: ["React Native", "Flutter", "iOS", "Android"], 
    icon: "📱",
    slug: "mobile-development" // ADD THIS
  }
];

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
        <h1>Learn Coding from Scratch</h1>
        <p>Start your programming journey with our beginner-friendly courses. No prior experience needed!</p>
      </section>

      {/* Courses Grid */}
      <section>
        <h2 style={{textAlign: 'center', margin: '40px 0 30px', fontSize: '2rem'}}>Beginner Courses</h2>
        <div className="learn-cards-grid">
  {beginnerCourses.map(course => (
    <div key={course.id} className="card">
      {/* Duration badge - top right */}
      <div style={{ 
        position: 'absolute', 
        top: '15px', 
        right: '15px', 
        background: 'var(--brand)', 
        color: 'white',
        padding: '4px 8px', 
        borderRadius: '12px', 
        fontSize: '0.7rem',
        fontWeight: 'bold'
      }}>
        ⏱️ {course.duration}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <span className="icon-emoji" style={{ fontSize: '2rem', marginRight: '15px' }}>
          {course.icon}
        </span>
        <div>
          <h3 style={{ margin: 0 }}>{course.title}</h3>
          <div style={{ display: 'flex', gap: '8px', marginTop: '5px' }}>
            <span style={{ 
              background: 'var(--bg)', 
              padding: '4px 8px', 
              borderRadius: '12px', 
              fontSize: '0.7rem',
              color: 'var(--muted)'
            }}>
              {course.level}
            </span>
          </div>
        </div>
      </div>
      
      <p style={{ color: 'var(--muted)', marginBottom: '15px', flexGrow: 1 }}>
        {course.description}
      </p>

      {/* Steps badge - bottom right */}
      <div style={{ 
        position: 'absolute', 
        bottom: '15px', 
        right: '15px', 
        color: 'var(--muted)',
        fontSize: '0.9rem'
      }}>
        <span style={{ 
          background: 'var(--bg)', 
          padding: '4px 8px', 
          borderRadius: '12px',
          fontWeight: 'bold'
        }}>
          📝 5 steps
        </span>
      </div>

      <Link to={`/learn/${course.slug}`} className="btn primary card-btn">
        Start Learning
      </Link>
    </div>
  ))}
</div>
      </section>

      {/* Learning Paths */}
      <section style={{margin: '60px 0'}}>
        <h2 style={{textAlign: 'center', margin: '40px 0 30px', fontSize: '2rem'}}>Choose Your Path</h2>
        <div className="learn-cards-grid">
          {learningPaths.map((path, index) => (
            <div key={index} className="card">
              <div className="card-icon">
                <span className="icon-emoji">{path.icon}</span>
              </div>
              <h3>{path.title}</h3>
              <div style={{margin: '15px 0'}}>
                <h4 style={{margin: '0 0 10px', color: 'var(--muted)', fontSize: '1rem'}}>You'll learn:</h4>
                <ul style={{color: 'var(--muted)', paddingLeft: '20px', margin: 0}}>
                  {path.courses.map((course, i) => (
                    <li key={i}>{course}</li>
                  ))}
                </ul>
              </div>
              <Link to={`/learn/${path.slug}`} className="btn primary card-btn">
                Explore Path
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section style={{textAlign: 'center', margin: '60px 0', padding: '40px', background: 'var(--card)', borderRadius: '20px', border: '1px solid #22263b'}}>
        <h2>Ready to Start Your Journey?</h2>
        <p style={{color: 'var(--muted)', maxWidth: '500px', margin: '0 auto 30px'}}>
          Join thousands of students who started with zero experience and are now building amazing projects!
        </p>
        <Link to="/learn-filter" className="btn primary" style={{padding: '15px 30px', fontSize: '1.1rem'}}>
          Get Started Today
        </Link>
      </section>

      <footer className="footer">
  <div className="footer-content">
    <div className="support-links">
      <Link to="/faq" className="support-link">
        <span className="support-link-icon">❓</span>
        <span className="support-link-text">FAQ & Help Center</span>
      </Link>
      <Link to="/feedback" className="support-link">
        <span className="support-link-icon">💬</span>
        <span className="support-link-text">Share Feedback</span>
      </Link>
    </div>
  </div>
  
  <div className="footer-bottom">
    <p>© 2025 AlgoRythm. All rights reserved. Built with passion for developers.</p>
  </div>

  <style jsx>{`
    .footer {
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%);
      border-top: 1px solid rgba(46, 230, 255, 0.2);
      padding: 3rem 1rem 1.5rem;
      margin-top: 4rem;
      position: relative;
      backdrop-filter: blur(10px);
    }

    .footer::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(46, 230, 255, 0.4), transparent);
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2.5rem;
    }

    .support-links {
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .support-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 2rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(46, 230, 255, 0.2);
      border-radius: 16px;
      color: #e2e8f0;
      text-decoration: none;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
      font-family: 'Poppins', system-ui;
    }

    .support-link:hover {
      background: rgba(46, 230, 255, 0.1);
      border-color: rgba(46, 230, 255, 0.4);
      transform: translateY(-3px);
      box-shadow: 
        0 8px 25px rgba(46, 230, 255, 0.15),
        0 0 15px rgba(46, 230, 255, 0.1);
      color: #7ec8ff;
    }

    .support-link-icon {
      font-size: 1.3rem;
      transition: all 0.3s ease;
      filter: drop-shadow(0 0 8px rgba(46, 230, 255, 0.4));
    }

    .support-link:hover .support-link-icon {
      transform: scale(1.2) rotate(10deg);
      filter: drop-shadow(0 0 12px rgba(46, 230, 255, 0.6));
    }

    .support-link-text {
      font-weight: 600;
      font-size: 1rem;
      letter-spacing: 0.3px;
    }

    .footer-bottom {
      text-align: center;
      padding-top: 2rem;
      margin-top: 2rem;
      border-top: 1px solid rgba(46, 230, 255, 0.1);
      width: 100%;
      position: relative;
    }

    .footer-bottom::before {
      content: '';
      position: absolute;
      top: -1px;
      left: 50%;
      transform: translateX(-50%);
      width: 100px;
      height: 2px;
      background: linear-gradient(90deg, transparent, rgba(46, 230, 255, 0.6), transparent);
    }

    .footer-bottom p {
      color: #94a3b8;
      font-size: 0.9rem;
      margin: 0;
      font-family: 'Marhey', 'Poppins', system-ui;
      letter-spacing: 0.5px;
    }

    @media (max-width: 768px) {
      .footer {
        padding: 2rem 1rem 1rem;
      }

      .support-links {
        flex-direction: column;
        gap: 1rem;
        width: 100%;
        max-width: 280px;
      }

      .support-link {
        justify-content: center;
        padding: 1.2rem 1.5rem;
      }

      .footer-content {
        gap: 2rem;
      }
    }

    /* Add twinkling effect to match stars */
    @keyframes gentle-pulse {
      0%, 100% { opacity: 0.8; }
      50% { opacity: 1; }
    }

    .support-link {
      animation: gentle-pulse 4s ease-in-out infinite;
    }

    .support-link:nth-child(2) {
      animation-delay: 1s;
    }
  `}</style>
</footer>
    </div>
  );
}