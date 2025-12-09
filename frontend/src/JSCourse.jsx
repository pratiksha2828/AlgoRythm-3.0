import './app.css';
import { Link } from 'react-router-dom';

export default function JSCourse() {
  const learningResources = {
    concepts: [
      {
        title: "JavaScript Tutorial - GeeksforGeeks",
        description: "Complete JavaScript tutorial with examples and exercises",
        link: "https://www.geeksforgeeks.org/javascript/",
        icon: "📚"
      },
      {
        title: "MDN Web Docs - JavaScript",
        description: "Official Mozilla documentation for JavaScript",
        link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
        icon: "🔍"
      },
      {
        title: "W3Schools JavaScript Tutorial",
        description: "Interactive JavaScript tutorial with try-it-yourself editor",
        link: "https://www.w3schools.com/js/",
        icon: "🎓"
      },
      {
        title: "JavaScript.info - Modern JavaScript",
        description: "From basics to advanced topics with in-depth explanations",
        link: "https://javascript.info/",
        icon: "📖"
      },
      {
        title: "freeCodeCamp - JavaScript Algorithms",
        description: "Comprehensive JavaScript curriculum with projects",
        link: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/",
        icon: "🆓"
      }
    ],
    interactive: [
      {
        title: "SoloLearn - JavaScript",
        description: "Mobile-friendly interactive JavaScript course",
        link: "https://www.sololearn.com/learning/1024",
        icon: "📱"
      },
      {
        title: "Codecademy - JavaScript",
        description: "Hands-on JavaScript course with live coding environment",
        link: "https://www.codecademy.com/learn/introduction-to-javascript",
        icon: "💻"
      },
      {
        title: "Scrimba - JavaScript",
        description: "Interactive coding tutorials with video and code editor",
        link: "https://scrimba.com/learn/learnjavascript",
        icon: "🎥"
      },
      {
        title: "Udemy - Modern JavaScript",
        description: "Complete JavaScript course from beginner to advanced",
        link: "https://www.udemy.com/course/modern-javascript/",
        icon: "🎯"
      },
      {
        title: "JavaScript30 - 30 Day Challenge",
        description: "Build 30 things in 30 days with vanilla JavaScript",
        link: "https://javascript30.com/",
        icon: "⚡"
      }
    ],
    practice: [
      {
        title: "LeetCode - JavaScript Problems",
        description: "Practice JavaScript concepts with coding challenges",
        link: "https://leetcode.com/problemset/all/?topicSlugs=javascript",
        icon: "🧠"
      },
      {
        title: "HackerRank - JavaScript",
        description: "JavaScript domain with practice problems and contests",
        link: "https://www.hackerrank.com/domains/tutorials/10-days-of-javascript",
        icon: "🏆"
      },
      {
        title: "Codewars - JavaScript Katas",
        description: "Code challenges to improve your JavaScript skills",
        link: "https://www.codewars.com/?language=javascript",
        icon: "🥋"
      },
      {
        title: "Edabit - JavaScript Challenges",
        description: "Interactive JavaScript coding challenges",
        link: "https://edabit.com/challenges/javascript",
        icon: "🎯"
      },
      {
        title: "Exercism - JavaScript Track",
        description: "Practice JavaScript with mentor feedback",
        link: "https://exercism.org/tracks/javascript",
        icon: "👨‍💻"
      }
    ],
    projects: [
      {
        title: "Build a Todo List App",
        description: "Create a functional todo app with CRUD operations",
        link: "https://www.freecodecamp.org/news/how-to-build-a-todo-list-app/",
        icon: "✅"
      },
      {
        title: "Weather App with API",
        description: "Build a weather application using weather APIs",
        link: "https://www.youtube.com/watch?v=WZNG8UomjSI",
        icon: "🌤️"
      },
      {
        title: "Calculator Application",
        description: "Create a fully functional calculator",
        link: "https://www.geeksforgeeks.org/how-to-build-a-calculator-app-using-javascript/",
        icon: "🧮"
      },
      {
        title: "Memory Card Game",
        description: "Build a classic memory matching game",
        link: "https://www.youtube.com/watch?v=28VfzEiJgy4",
        icon: "🎴"
      },
      {
        title: "Chat Application",
        description: "Real-time chat app with WebSockets",
        link: "https://www.freecodecamp.org/news/build-a-realtime-chat-app-with-react-express-socketio-and-harperdb/",
        icon: "💬"
      }
    ],
    advanced: [
      {
        title: "ES6+ Features Mastery",
        description: "Learn modern JavaScript features",
        link: "https://www.freecodecamp.org/news/write-less-do-more-with-javascript-es6-5fd4a8e50ee2/",
        icon: "🔥"
      },
      {
        title: "JavaScript Design Patterns",
        description: "Learn common design patterns in JavaScript",
        link: "https://www.patterns.dev/posts/classic-design-patterns/",
        icon: "🏗️"
      },
      {
        title: "Async JavaScript Deep Dive",
        description: "Master promises, async/await, and callbacks",
        link: "https://javascript.info/async",
        icon: "⏳"
      },
      {
        title: "JavaScript Testing with Jest",
        description: "Learn unit testing and test-driven development",
        link: "https://jestjs.io/docs/getting-started",
        icon: "🧪"
      },
      {
        title: "JavaScript Performance Optimization",
        description: "Optimize your JavaScript code for better performance",
        link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Performance",
        icon: "🚀"
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
        <h1>⚡ JavaScript Basics</h1>
        <p>Master the language of the web. Learn to create dynamic, interactive websites and applications!</p>
        <div style={{ 
          background: 'var(--card)', 
          padding: '15px', 
          borderRadius: '12px', 
          margin: '20px auto',
          maxWidth: '500px',
          border: '1px solid var(--brand)'
        }}>
          <strong>📅 Duration:</strong> 3 weeks • <strong>⏰ Level:</strong> Beginner • <strong>🌐 Language:</strong> Web
        </div>
      </section>

      {/* Learning Path */}
      <div style={{ maxWidth: '1000px', margin: '40px auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Your JavaScript Learning Journey</h2>
        
        {/* Concepts Section */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, var(--brand), var(--ok))',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '25px',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: 0, color: 'var(--brand-ink)' }}>Step 1: Learn Core Concepts</h2>
            <p style={{ margin: '5px 0 0 0', color: 'var(--brand-ink)', opacity: 0.9 }}>
              Understand JavaScript fundamentals, syntax, and core principles
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
            background: 'linear-gradient(135deg, var(--ok), var(--warn))',
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
            background: 'linear-gradient(135deg, var(--warn), var(--danger))',
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
            <h2 style={{ margin: 0, color: 'var(--brand-ink)' }}>Step 4: Build Real Projects</h2>
            <p style={{ margin: '5px 0 0 0', color: 'var(--brand-ink)', opacity: 0.9 }}>
              Apply your knowledge by building real-world applications
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

        {/* Advanced Topics */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, var(--brand), var(--ok))',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '25px',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: 0, color: 'var(--brand-ink)' }}>Step 5: Advanced JavaScript</h2>
            <p style={{ margin: '5px 0 0 0', color: 'var(--brand-ink)', opacity: 0.9 }}>
              Master advanced concepts and become a JavaScript expert
            </p>
          </div>

          <div className="cards-grid">
            {learningResources.advanced.map((resource, index) => (
              <div key={index} className="card">
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>{resource.icon}</div>
                <h3>{resource.title}</h3>
                <p style={{ color: 'var(--muted)', marginBottom: '20px' }}>{resource.description}</p>
                <a href={resource.link} target="_blank" rel="noopener noreferrer" className="btn primary">
                  Dive Deeper
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Tracking */}
      <div style={{ textAlign: 'center', margin: '60px 0', padding: '40px', background: 'var(--card)', borderRadius: '20px' }}>
        <h2>Track Your JavaScript Journey</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '30px' }}>
          Complete each section and become a JavaScript master!
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn primary">Concepts Complete</button>
          <button className="btn">Practice Complete</button>
          <button className="btn">Challenges Complete</button>
          <button className="btn">Projects Complete</button>
          <button className="btn">Advanced Complete</button>
        </div>
      </div>

      {/* Next Steps */}
      <div style={{ textAlign: 'center', margin: '60px 0' }}>
        <h3>What's Next After JavaScript?</h3>
        <p style={{ color: 'var(--muted)', marginBottom: '20px' }}>
          Continue your full-stack development journey:
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/learn/react-basics" className="btn primary">React Framework →</Link>
          <Link to="/learn/nodejs-basics" className="btn primary">Node.js Backend →</Link>
          <Link to="/learn" className="btn ghost">← Back to Courses</Link>
        </div>
      </div>
    </div>
  );
}