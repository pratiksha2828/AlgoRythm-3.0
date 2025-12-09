import './app.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function WebDevelopmentPath() {
  const [feedbacks, setFeedbacks] = useState([]);

  const learningPath = {
    frontend: [
      {
        title: "HTML & CSS Fundamentals",
        description: "Build the structure and style of websites",
        duration: "2 weeks",
        level: "Beginner",
        resources: [
          {
            name: "MDN Web Docs - HTML",
            link: "https://developer.mozilla.org/en-US/docs/Web/HTML",
            type: "documentation"
          },
          {
            name: "CSS-Tricks Guide",
            link: "https://css-tricks.com/guides/",
            type: "tutorials"
          },
          {
            name: "FreeCodeCamp Responsive Web Design",
            link: "https://www.freecodecamp.org/learn/responsive-web-design/",
            type: "interactive"
          }
        ],
        projects: ["Personal Portfolio", "Restaurant Website", "Product Landing Page"],
        icon: "🌐"
      },
      {
        title: "JavaScript Fundamentals",
        description: "Add interactivity and dynamic behavior to websites",
        duration: "3 weeks",
        level: "Beginner",
        resources: [
          {
            name: "JavaScript.info",
            link: "https://javascript.info/",
            type: "tutorials"
          },
          {
            name: "MDN JavaScript Guide",
            link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
            type: "documentation"
          },
          {
            name: "Codecademy JavaScript",
            link: "https://www.codecademy.com/learn/introduction-to-javascript",
            type: "interactive"
          }
        ],
        projects: ["Todo List App", "Weather App", "Calculator"],
        icon: "⚡"
      },
      {
        title: "React.js Framework",
        description: "Build modern user interfaces with React",
        duration: "4 weeks",
        level: "Intermediate",
        resources: [
          {
            name: "React Official Docs",
            link: "https://reactjs.org/docs/getting-started.html",
            type: "documentation"
          },
          {
            name: "Scrimba React Course",
            link: "https://scrimba.com/learn/learnreact",
            type: "interactive"
          },
          {
            name: "React Tutorial by freeCodeCamp",
            link: "https://www.freecodecamp.org/news/react-for-beginners/",
            type: "tutorials"
          }
        ],
        projects: ["E-commerce Site", "Blog Platform", "Task Manager"],
        icon: "⚛️"
      }
    ],
    backend: [
      {
        title: "Node.js & Express",
        description: "Build server-side applications with JavaScript",
        duration: "3 weeks",
        level: "Intermediate",
        resources: [
          {
            name: "Node.js Official Docs",
            link: "https://nodejs.org/en/docs/",
            type: "documentation"
          },
          {
            name: "Express.js Guide",
            link: "https://expressjs.com/en/guide.html",
            type: "documentation"
          },
          {
            name: "The Net Ninja Node.js",
            link: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9gcy9lrvMJ75z9maRw4byYp",
            type: "video"
          }
        ],
        projects: ["REST API", "Authentication System", "Real-time Chat"],
        icon: "🟢"
      },
      {
        title: "Databases & MongoDB",
        description: "Store and manage application data",
        duration: "2 weeks",
        level: "Intermediate",
        resources: [
          {
            name: "MongoDB University",
            link: "https://university.mongodb.com/",
            type: "courses"
          },
          {
            name: "SQL vs NoSQL Guide",
            link: "https://www.mongodb.com/nosql-explained",
            type: "tutorials"
          },
          {
            name: "Mongoose ODM Docs",
            link: "https://mongoosejs.com/docs/",
            type: "documentation"
          }
        ],
        projects: ["User Database", "Product Catalog", "Blog with Comments"],
        icon: "🗄️"
      }
    ],
    tools: [
      {
        title: "Git & GitHub",
        description: "Version control and collaboration",
        duration: "1 week",
        level: "Beginner",
        resources: [
          {
            name: "Git Official Documentation",
            link: "https://git-scm.com/doc",
            type: "documentation"
          },
          {
            name: "GitHub Learning Lab",
            link: "https://lab.github.com/",
            type: "interactive"
          },
          {
            name: "Atlassian Git Tutorials",
            link: "https://www.atlassian.com/git/tutorials",
            type: "tutorials"
          }
        ],
        projects: ["Collaborative Project", "Open Source Contribution"],
        icon: "📦"
      },
      {
        title: "Deployment & DevOps",
        description: "Deploy applications to production",
        duration: "2 weeks",
        level: "Intermediate",
        resources: [
          {
            name: "Vercel Deployment Guide",
            link: "https://vercel.com/docs",
            type: "documentation"
          },
          {
            name: "Netlify Guides",
            link: "https://www.netlify.com/tags/guides/",
            type: "tutorials"
          },
          {
            name: "Docker for Developers",
            link: "https://docker-curriculum.com/",
            type: "tutorials"
          }
        ],
        projects: ["Deploy Full-stack App", "CI/CD Pipeline"],
        icon: "🚀"
      }
    ],
    advanced: [
      {
        title: "TypeScript",
        description: "Add type safety to JavaScript",
        duration: "2 weeks",
        level: "Advanced",
        resources: [
          {
            name: "TypeScript Handbook",
            link: "https://www.typescriptlang.org/docs/",
            type: "documentation"
          },
          {
            name: "TypeScript Course by freeCodeCamp",
            link: "https://www.freecodecamp.org/news/learn-typescript-beginners-guide/",
            type: "tutorials"
          },
          {
            name: "React with TypeScript",
            link: "https://react-typescript-cheatsheet.netlify.app/",
            type: "cheatsheet"
          }
        ],
        projects: ["Type-Safe React App", "Library with Types"],
        icon: "🔷"
      },
      {
        title: "Testing & QA",
        description: "Ensure code quality and reliability",
        duration: "2 weeks",
        level: "Advanced",
        resources: [
          {
            name: "Jest Testing Framework",
            link: "https://jestjs.io/docs/getting-started",
            type: "documentation"
          },
          {
            name: "React Testing Library",
            link: "https://testing-library.com/docs/react-testing-library/intro/",
            type: "documentation"
          },
          {
            name: "Cypress E2E Testing",
            link: "https://docs.cypress.io/guides/overview/why-cypress",
            type: "documentation"
          }
        ],
        projects: ["Test Suite for App", "E2E Testing Setup"],
        icon: "🧪"
      }
    ]
  };

  // Fetch feedbacks from MongoDB for web-dev section
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/feedback');
        if (response.ok) {
          const data = await response.json();
          // Filter for web-dev section only
          const webDevFeedbacks = data.filter(feedback => feedback.section === 'web-dev');
          setFeedbacks(webDevFeedbacks);
        }
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      }
    };

    fetchFeedbacks();
  }, []);

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
            <Link to="/feedback" className="nav-link">Feedback</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1>Web Development Path</h1>
        <p>Become a full-stack developer. Master frontend, backend, and everything in between to build modern web applications!</p>
        <div style={{ 
          background: 'var(--card)', 
          padding: '15px', 
          borderRadius: '12px', 
          margin: '20px auto',
          maxWidth: '600px',
          border: '1px solid var(--brand)'
        }}>
          <strong>Total Duration:</strong> 12-16 weeks • <strong>Level:</strong> Beginner to Advanced • <strong>Goal:</strong> Full-Stack Developer
        </div>
      </section>

      {/* Learning Roadmap */}
      <div style={{ maxWidth: '1000px', margin: '40px auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px' }}></h2>

        {/* Frontend Development */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{ 
            background: 'transparent',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '25px',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: 0, color: 'white' }}>Frontend Development</h2>
            <p style={{ margin: '5px 0 0 0', color: 'white', opacity: 0.9 }}>
              Everything users see and interact with
            </p>
          </div>

          <div className="cards-grid">
            {learningPath.frontend.map((topic, index) => (
              <div key={index} className="card">
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>{topic.icon}</div>
                <h3>{topic.title}</h3>
                <p style={{ color: 'var(--muted)', marginBottom: '15px' }}>{topic.description}</p>
                
                <div style={{ marginBottom: '15px' }}>
                  <span style={{ background: 'var(--bg)', padding: '4px 8px', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--muted)' }}>
                    {topic.duration} • {topic.level}
                  </span>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <h4 style={{ color: 'var(--muted)', margin: '0 0 8px 0', fontSize: '0.9rem' }}>Resources:</h4>
                  <div style={{ display: 'grid', gap: '5px' }}>
                    {topic.resources.slice(0, 3).map((resource, i) => (
                      <a key={i} href={resource.link} target="_blank" rel="noopener noreferrer" style={{ 
                        color: 'white', 
                        fontSize: '0.8rem', 
                        textDecoration: 'none',
                        background: 'transparent',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid var(--brand)'
                      }}>
                        • {resource.name}
                      </a>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 style={{ color: 'var(--muted)', margin: '0 0 8px 0', fontSize: '0.9rem' }}>Projects:</h4>
                  <ul style={{ color: 'var(--muted)', fontSize: '0.8rem', paddingLeft: '15px', margin: 0 }}>
                    {topic.projects.map((project, i) => (
                      <li key={i}>{project}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Backend Development */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{ 
            background: 'transparent',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '25px',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: 0, color: 'white' }}>Backend Development</h2>
            <p style={{ margin: '5px 0 0 0', color: 'white', opacity: 0.9 }}>
              Server-side logic and database management
            </p>
          </div>

          <div className="cards-grid">
            {learningPath.backend.map((topic, index) => (
              <div key={index} className="card">
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>{topic.icon}</div>
                <h3>{topic.title}</h3>
                <p style={{ color: 'var(--muted)', marginBottom: '15px' }}>{topic.description}</p>
                
                <div style={{ marginBottom: '15px' }}>
                  <span style={{ background: 'var(--bg)', padding: '4px 8px', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--muted)' }}>
                    {topic.duration} • {topic.level}
                  </span>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <h4 style={{ color: 'var(--muted)', margin: '0 0 8px 0', fontSize: '0.9rem' }}>Resources:</h4>
                  <div style={{ display: 'grid', gap: '5px' }}>
                    {topic.resources.slice(0, 3).map((resource, i) => (
                      <a key={i} href={resource.link} target="_blank" rel="noopener noreferrer" style={{ 
                        color: 'white', 
                        fontSize: '0.8rem', 
                        textDecoration: 'none',
                        background: 'transparent',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid var(--brand)'
                      }}>
                        • {resource.name}
                      </a>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 style={{ color: 'var(--muted)', margin: '0 0 8px 0', fontSize: '0.9rem' }}>Projects:</h4>
                  <ul style={{ color: 'var(--muted)', fontSize: '0.8rem', paddingLeft: '15px', margin: 0 }}>
                    {topic.projects.map((project, i) => (
                      <li key={i}>{project}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tools & Deployment */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{ 
            background: 'transparent',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '25px',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: 0, color: 'white' }}>Tools & Deployment</h2>
            <p style={{ margin: '5px 0 0 0', color: 'white', opacity: 0.9 }}>
              Essential tools for modern development workflow
            </p>
          </div>

          <div className="cards-grid">
            {learningPath.tools.map((topic, index) => (
              <div key={index} className="card">
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>{topic.icon}</div>
                <h3>{topic.title}</h3>
                <p style={{ color: 'var(--muted)', marginBottom: '15px' }}>{topic.description}</p>
                
                <div style={{ marginBottom: '15px' }}>
                  <span style={{ background: 'var(--bg)', padding: '4px 8px', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--muted)' }}>
                    {topic.duration} • {topic.level}
                  </span>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <h4 style={{ color: 'var(--muted)', margin: '0 0 8px 0', fontSize: '0.9rem' }}>Resources:</h4>
                  <div style={{ display: 'grid', gap: '5px' }}>
                    {topic.resources.slice(0, 3).map((resource, i) => (
                      <a key={i} href={resource.link} target="_blank" rel="noopener noreferrer" style={{ 
                        color: 'white', 
                        fontSize: '0.8rem', 
                        textDecoration: 'none',
                        background: 'transparent',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid var(--brand)'
                      }}>
                        • {resource.name}
                      </a>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 style={{ color: 'var(--muted)', margin: '0 0 8px 0', fontSize: '0.9rem' }}>Projects:</h4>
                  <ul style={{ color: 'var(--muted)', fontSize: '0.8rem', paddingLeft: '15px', margin: 0 }}>
                    {topic.projects.map((project, i) => (
                      <li key={i}>{project}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advanced Topics */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{ 
            background: 'transparent',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '25px',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: 0, color: 'white' }}>Advanced Topics</h2>
            <p style={{ margin: '5px 0 0 0', color: 'white', opacity: 0.9 }}>
              Take your skills to the next level
            </p>
          </div>

          <div className="cards-grid">
            {learningPath.advanced.map((topic, index) => (
              <div key={index} className="card">
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>{topic.icon}</div>
                <h3>{topic.title}</h3>
                <p style={{ color: 'var(--muted)', marginBottom: '15px' }}>{topic.description}</p>
                
                <div style={{ marginBottom: '15px' }}>
                  <span style={{ background: 'var(--bg)', padding: '4px 8px', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--muted)' }}>
                    {topic.duration} • {topic.level}
                  </span>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <h4 style={{ color: 'var(--muted)', margin: '0 0 8px 0', fontSize: '0.9rem' }}>Resources:</h4>
                  <div style={{ display: 'grid', gap: '5px' }}>
                    {topic.resources.slice(0, 3).map((resource, i) => (
                      <a key={i} href={resource.link} target="_blank" rel="noopener noreferrer" style={{ 
                        color: 'white', 
                        fontSize: '0.8rem', 
                        textDecoration: 'none',
                        background: 'transparent',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid var(--brand)'
                      }}>
                        • {resource.name}
                      </a>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 style={{ color: 'var(--muted)', margin: '0 0 8px 0', fontSize: '0.9rem' }}>Projects:</h4>
                  <ul style={{ color: 'var(--muted)', fontSize: '0.8rem', paddingLeft: '15px', margin: 0 }}>
                    {topic.projects.map((project, i) => (
                      <li key={i}>{project}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Section */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{ 
            background: 'transparent',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '25px',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: 0, color: 'white' }}>Resource Feedback</h2>
            <p style={{ margin: '5px 0 0 0', color: 'white', opacity: 0.9 }}>
              See what other learners think about these resources
            </p>
          </div>

          <div style={{ 
            background: 'var(--card)', 
            padding: '30px', 
            borderRadius: '12px',
            border: '1px solid var(--brand)'
          }}>
            {/* Feedback List */}
            <div>
              <h3 style={{ color: 'white', marginBottom: '20px' }}>Community Feedback</h3>
              <div style={{ display: 'grid', gap: '20px' }}>
                {feedbacks.map(feedback => (
                  <div 
                    key={feedback._id}
                    style={{
                      background: 'var(--bg)',
                      padding: '20px',
                      borderRadius: '8px',
                      border: '1px solid var(--muted)'
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '10px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          background: 'var(--brand)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          color: 'white'
                        }}>
                          {feedback.userName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div style={{ color: 'white', fontWeight: 'bold' }}>
                            {feedback.userName}
                          </div>
                          <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                            on <strong>{feedback.resource}</strong>
                          </div>
                        </div>
                      </div>
                      <div style={{ 
                        color: 'gold',
                        fontSize: '0.9rem'
                      }}>
                        {'★'.repeat(feedback.rating)}{'☆'.repeat(5 - feedback.rating)}
                      </div>
                    </div>
                    <p style={{ 
                      color: 'white', 
                      margin: '10px 0',
                      lineHeight: '1.5'
                    }}>
                      {feedback.comment}
                    </p>
                    <div style={{ 
                      color: 'var(--muted)', 
                      fontSize: '0.8rem',
                      textAlign: 'right'
                    }}>
                      {new Date(feedback.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}