import './app.css';
import { Link } from 'react-router-dom';

export default function HTMLCourse() {
  const learningResources = {
    concepts: [
      {
        title: "HTML Basics - GeeksforGeeks",
        description: "Complete HTML tutorial with examples and exercises",
        link: "https://www.geeksforgeeks.org/html-tutorial/",
        icon: "📚"
      },
      {
        title: "MDN Web Docs - HTML",
        description: "Official Mozilla documentation for HTML",
        link: "https://developer.mozilla.org/en-US/docs/Web/HTML",
        icon: "🔍"
      },
      {
        title: "W3Schools HTML Tutorial",
        description: "Interactive HTML tutorial with try-it-yourself editor",
        link: "https://www.w3schools.com/html/",
        icon: "🎓"
      }
    ],
    interactive: [
      {
        title: "SoloLearn - HTML",
        description: "Mobile-friendly interactive HTML course",
        link: "https://www.sololearn.com/learning/1014",
        icon: "📱"
      },
      {
        title: "Codecademy - HTML",
        description: "Hands-on HTML course with live coding environment",
        link: "https://www.codecademy.com/learn/learn-html",
        icon: "💻"
      },
      {
        title: "freeCodeCamp - HTML",
        description: "Free interactive HTML tutorial with projects",
        link: "https://www.freecodecamp.org/learn/responsive-web-design/",
        icon: "🆓"
      }
    ],
    practice: [
      {
        title: "LeetCode - HTML Questions",
        description: "Practice HTML concepts with coding challenges",
        link: "https://leetcode.com/problemset/all/?topicSlugs=html",
        icon: "⚡"
      },
      {
        title: "HackerRank - HTML",
        description: "HTML domain with practice problems and contests",
        link: "https://www.hackerrank.com/domains/tutorials/10-days-of-html",
        icon: "🏆"
      },
      {
        title: "Frontend Mentor - HTML Projects",
        description: "Real-world HTML projects with designs",
        link: "https://www.frontendmentor.io/",
        icon: "🎨"
      }
    ],
    projects: [
      {
        title: "Build a Portfolio Website",
        description: "Create your personal portfolio using HTML & CSS",
        link: "https://www.freecodecamp.org/news/how-to-build-a-developer-portfolio-website/",
        icon: "🌟"
      },
      {
        title: "Create a Restaurant Website",
        description: "Build a responsive restaurant landing page",
        link: "https://www.youtube.com/watch?v=5RIFrZEjURA",
        icon: "🍔"
      },
      {
        title: "HTML5 Game Development",
        description: "Simple games using HTML5 Canvas",
        link: "https://developer.mozilla.org/en-US/docs/Games",
        icon: "🎮"
      }
    ]
  };

  return (
    <div className="wrap">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <Link to="/learn" className="logo">AlgoRythm</Link>
          <nav className="nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/learn" className="nav-link">Learn</Link>
            <Link to="/projects" className="nav-link">Projects</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1>HTML & CSS Fundamentals</h1>
        <p>Master the building blocks of web development. Learn to create beautiful, responsive websites from scratch!</p>
        <div style={{ 
          background: 'var(--card)', 
          padding: '15px', 
          borderRadius: '12px', 
          margin: '20px auto',
          maxWidth: '500px',
          border: '1px solid var(--brand)'
        }}>
          <strong>Duration:</strong> 2 weeks • <strong> Level:</strong> Beginner
        </div>
      </section>

      {/* Learning Path */}
      <div style={{ maxWidth: '1000px', margin: '40px auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Your Learning Journey</h2>
        
        {/* Concepts Section */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, var(--brand), var(--ok))',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '25px',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: 0, color: 'var(--brand-ink)' }}>Step 1: Learn Concepts</h2>
            <p style={{ margin: '5px 0 0 0', color: 'var(--brand-ink)', opacity: 0.9 }}>
              Understand the fundamentals with comprehensive tutorials
            </p>
          </div>

          <div className="cards-grid">
            {learningResources.concepts.map((resource, index) => (
              <div key={index} className="card">
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>{resource.icon}</div>
                <h3>{resource.title}</h3>
                <p style={{ color: 'var(--muted)', marginBottom: '20px' }}>{resource.description}</p>
                <a href={resource.link} target="_blank" rel="noopener noreferrer" className="btn primary">
                  Start Learning
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Learning */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, var(--ok), var(--brand))',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '25px',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: 0, color: 'var(--brand-ink)' }}>Step 2: Interactive Practice</h2>
            <p style={{ margin: '5px 0 0 0', color: 'var(--brand-ink)', opacity: 0.9 }}>
              Hands-on coding exercises to reinforce your learning
            </p>
          </div>

          <div className="cards-grid">
            {learningResources.interactive.map((resource, index) => (
              <div key={index} className="card">
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>{resource.icon}</div>
                <h3>{resource.title}</h3>
                <p style={{ color: 'var(--muted)', marginBottom: '20px' }}>{resource.description}</p>
                <a href={resource.link} target="_blank" rel="noopener noreferrer" className="btn primary">
                  Practice Now
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Coding Practice */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, var(--warn), var(--brand))',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '25px',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: 0, color: 'var(--brand-ink)' }}>Step 3: Coding Challenges</h2>
            <p style={{ margin: '5px 0 0 0', color: 'var(--brand-ink)', opacity: 0.9 }}>
              Solve problems and improve your skills with coding platforms
            </p>
          </div>

          <div className="cards-grid">
            {learningResources.practice.map((resource, index) => (
              <div key={index} className="card">
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>{resource.icon}</div>
                <h3>{resource.title}</h3>
                <p style={{ color: 'var(--muted)', marginBottom: '20px' }}>{resource.description}</p>
                <a href={resource.link} target="_blank" rel="noopener noreferrer" className="btn primary">
                  Solve Problems
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, var(--danger), var(--brand))',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '25px',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: 0, color: 'var(--brand-ink)' }}>Step 4: Build Projects</h2>
            <p style={{ margin: '5px 0 0 0', color: 'var(--brand-ink)', opacity: 0.9 }}>
              Apply your knowledge by building real-world projects
            </p>
          </div>

          <div className="cards-grid">
            {learningResources.projects.map((resource, index) => (
              <div key={index} className="card">
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>{resource.icon}</div>
                <h3>{resource.title}</h3>
                <p style={{ color: 'var(--muted)', marginBottom: '20px' }}>{resource.description}</p>
                <a href={resource.link} target="_blank" rel="noopener noreferrer" className="btn primary">
                  Start Building
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Tracking */}
      <div style={{ textAlign: 'center', margin: '60px 0', padding: '40px', background: 'var(--card)', borderRadius: '20px' }}>
        <h2>Track Your Progress</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '30px' }}>
          Complete each section and mark your progress as you go!
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <button className="btn primary">Mark Concepts Complete</button>
          <button className="btn">Mark Practice Complete</button>
          <button className="btn">Mark Challenges Complete</button>
          <button className="btn">Mark Projects Complete</button>
        </div>
      </div>

      {/* Next Steps */}
      <div style={{ textAlign: 'center', margin: '60px 0' }}>
        <h3>What's Next?</h3>
        <p style={{ color: 'var(--muted)', marginBottom: '20px' }}>
          After completing HTML & CSS, continue your learning journey:
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/learn/javascript" className="btn primary">JavaScript Basics →</Link>
          <Link to="/learn" className="btn ghost">← Back to Courses</Link>
        </div>
      </div>
    </div>
  );
}