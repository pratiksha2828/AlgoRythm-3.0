import './app.css';
import { Link } from 'react-router-dom';

export default function PythonCourse() {
  const learningResources = {
    concepts: [
      {
        title: "Python Tutorial - GeeksforGeeks",
        description: "Complete Python tutorial with examples and exercises",
        link: "https://www.geeksforgeeks.org/python-programming-language/",
        icon: "📚"
      },
      {
        title: "Official Python Documentation",
        description: "Comprehensive Python documentation and tutorials",
        link: "https://docs.python.org/3/tutorial/",
        icon: "🐍"
      },
      {
        title: "W3Schools Python Tutorial",
        description: "Interactive Python tutorial with try-it-yourself editor",
        link: "https://www.w3schools.com/python/",
        icon: "🎓"
      },
      {
        title: "Real Python Tutorials",
        description: "In-depth Python tutorials and articles",
        link: "https://realpython.com/",
        icon: "📖"
      },
      {
        title: "freeCodeCamp - Python for Everybody",
        description: "Comprehensive Python curriculum with projects",
        link: "https://www.freecodecamp.org/learn/scientific-computing-with-python/",
        icon: "🆓"
      }
    ],
    interactive: [
      {
        title: "SoloLearn - Python",
        description: "Mobile-friendly interactive Python course",
        link: "https://www.sololearn.com/learning/1073",
        icon: "📱"
      },
      {
        title: "Codecademy - Python",
        description: "Hands-on Python course with live coding environment",
        link: "https://www.codecademy.com/learn/learn-python-3",
        icon: "💻"
      },
      {
        title: "DataCamp - Python",
        description: "Python courses focused on data science",
        link: "https://www.datacamp.com/courses/intro-to-python-for-data-science",
        icon: "📊"
      },
      {
        title: "Udemy - Complete Python Bootcamp",
        description: "Comprehensive Python course from beginner to advanced",
        link: "https://www.udemy.com/course/complete-python-bootcamp/",
        icon: "🎯"
      },
      {
        title: "Coursera - Python for Everybody",
        description: "University of Michigan's Python specialization",
        link: "https://www.coursera.org/specializations/python",
        icon: "🎓"
      }
    ],
    practice: [
      {
        title: "LeetCode - Python Problems",
        description: "Practice Python concepts with coding challenges",
        link: "https://leetcode.com/problemset/all/?topicSlugs=python",
        icon: "🧠"
      },
      {
        title: "HackerRank - Python",
        description: "Python domain with practice problems and contests",
        link: "https://www.hackerrank.com/domains/python",
        icon: "🏆"
      },
      {
        title: "Codewars - Python Katas",
        description: "Code challenges to improve your Python skills",
        link: "https://www.codewars.com/?language=python",
        icon: "🥋"
      },
      {
        title: "Exercism - Python Track",
        description: "Practice Python with mentor feedback",
        link: "https://exercism.org/tracks/python",
        icon: "👨‍💻"
      },
      {
        title: "PyBites - Code Challenges",
        description: "Python-specific coding challenges and exercises",
        link: "https://codechalleng.es/",
        icon: "🐍"
      }
    ],
    projects: [
      {
        title: "Build a Web Scraper",
        description: "Create a web scraper using BeautifulSoup and Requests",
        link: "https://realpython.com/beautiful-soup-web-scraper-python/",
        icon: "🕸️"
      },
      {
        title: "Data Analysis with Pandas",
        description: "Analyze datasets using Python's pandas library",
        link: "https://www.youtube.com/watch?v=vmEHCJofslg",
        icon: "📈"
      },
      {
        title: "Build a Discord Bot",
        description: "Create a functional Discord bot with Python",
        link: "https://realpython.com/how-to-make-a-discord-bot-python/",
        icon: "🤖"
      },
      {
        title: "Automate File Management",
        description: "Build scripts to automate file operations",
        link: "https://automatetheboringstuff.com/",
        icon: "📁"
      },
      {
        title: "Build a Flask Web App",
        description: "Create a web application using Flask framework",
        link: "https://www.youtube.com/watch?v=Z1RJmh_OqeA",
        icon: "🌐"
      }
    ],
    advanced: [
      {
        title: "Python OOP Mastery",
        description: "Learn object-oriented programming in Python",
        link: "https://realpython.com/python3-object-oriented-programming/",
        icon: "🏗️"
      },
      {
        title: "Python Design Patterns",
        description: "Learn common design patterns in Python",
        link: "https://refactoring.guru/design-patterns/python",
        icon: "🎨"
      },
      {
        title: "Async Python with Asyncio",
        description: "Master asynchronous programming in Python",
        link: "https://realpython.com/async-io-python/",
        icon: "⚡"
      },
      {
        title: "Python Testing with pytest",
        description: "Learn unit testing and test-driven development",
        link: "https://docs.pytest.org/en/stable/",
        icon: "🧪"
      },
      {
        title: "Python Performance Optimization",
        description: "Optimize your Python code for better performance",
        link: "https://wiki.python.org/moin/PythonSpeed/PerformanceTips",
        icon: "🚀"
      }
    ],
    dataScience: [
      {
        title: "NumPy Tutorials",
        description: "Learn numerical computing with NumPy",
        link: "https://numpy.org/doc/stable/user/quickstart.html",
        icon: "🔢"
      },
      {
        title: "Pandas Tutorials",
        description: "Master data manipulation with pandas",
        link: "https://pandas.pydata.org/docs/getting_started/index.html",
        icon: "🐼"
      },
      {
        title: "Matplotlib Visualization",
        description: "Learn data visualization with Matplotlib",
        link: "https://matplotlib.org/stable/tutorials/index.html",
        icon: "📊"
      },
      {
        title: "Scikit-Learn Machine Learning",
        description: "Introduction to ML with scikit-learn",
        link: "https://scikit-learn.org/stable/tutorial/index.html",
        icon: "🤖"
      },
      {
        title: "Data Science Projects",
        description: "End-to-end data science project tutorials",
        link: "https://www.kaggle.com/learn/overview",
        icon: "📈"
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
        <h1>Python for Everyone</h1>
        <p>Learn the world's most versatile programming language. From automation to AI, Python powers it all!</p>
        <div style={{ 
          background: 'var(--card)', 
          padding: '15px', 
          borderRadius: '12px', 
          margin: '20px auto',
          maxWidth: '500px',
          border: '1px solid var(--brand)'
        }}>
          <strong> Duration:</strong> 3 weeks • <strong> Level:</strong> Beginner • <strong> Versatility:</strong> High
        </div>
      </section>

      {/* Learning Path */}
      <div style={{ maxWidth: '1000px', margin: '40px auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Your Python Learning Journey</h2>
        
        {/* Concepts Section */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{ 
            background: 'transparent',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '25px',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: 0, color: 'var(--brand-ink)' }}>Step 1: Learn Core Concepts</h2>
            <p style={{ margin: '5px 0 0 0', color: 'var(--brand-ink)', opacity: 0.9 }}>
              Understand Python fundamentals, syntax, and core principles
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
            background: 'transparent',
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
            background: 'transparent',
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
            background: 'transparent',
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

        {/* Data Science Focus */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{ 
            background: 'transparent',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '25px',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: 0, color: 'var(--brand-ink)' }}>Step 5: Data Science & AI</h2>
            <p style={{ margin: '5px 0 0 0', color: 'var(--brand-ink)', opacity: 0.9 }}>
              Explore Python's powerful data science and machine learning ecosystem
            </p>
          </div>

          <div className="cards-grid">
            {learningResources.dataScience.map((resource, index) => (
              <div key={index} className="card">
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>{resource.icon}</div>
                <h3>{resource.title}</h3>
                <p style={{ color: 'var(--muted)', marginBottom: '20px' }}>{resource.description}</p>
                <a href={resource.link} target="_blank" rel="noopener noreferrer" className="btn primary">
                  Explore Data Science
                </a>
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
            <h2 style={{ margin: 0, color: 'var(--brand-ink)' }}>Step 6: Advanced Python</h2>
            <p style={{ margin: '5px 0 0 0', color: 'var(--brand-ink)', opacity: 0.9 }}>
              Master advanced concepts and become a Python expert
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

 

      {/* Next Steps */}
      <div style={{ textAlign: 'center', margin: '60px 0' }}>
        <h3>What's Next After Python?</h3>
        <p style={{ color: 'var(--muted)', marginBottom: '20px' }}>
          Continue your programming journey with these paths:
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/learn/data-science-path" className="btn primary">Data Science →</Link>
          <Link to="/learn/web-development" className="btn primary">Web Development →</Link>
          <Link to="/learn/automation" className="btn primary">Automation →</Link>
          <Link to="/learn" className="btn ghost">← Back to Courses</Link>
        </div>
      </div>
    </div>
  );
}