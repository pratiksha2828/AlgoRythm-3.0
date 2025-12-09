import './app.css';
import { Link } from 'react-router-dom';

export default function GitCourse() {
  const learningResources = {
    concepts: [
      {
        title: "Git Tutorial - GeeksforGeeks",
        description: "Complete Git tutorial with examples and exercises",
        link: "https://www.geeksforgeeks.org/git/",
        icon: "📚"
      },
      {
        title: "Official Git Documentation",
        description: "Comprehensive Git documentation and reference",
        link: "https://git-scm.com/doc",
        icon: "📖"
      },
      {
        title: "Atlassian Git Tutorial",
        description: "In-depth Git tutorials and best practices",
        link: "https://www.atlassian.com/git/tutorials",
        icon: "🎓"
      },
      {
        title: "GitHub Guides",
        description: "Official GitHub tutorials and guides",
        link: "https://guides.github.com/",
        icon: "🐙"
      },
      {
        title: "freeCodeCamp - Git & GitHub",
        description: "Comprehensive Git and GitHub curriculum",
        link: "https://www.freecodecamp.org/news/git-and-github-for-beginners/",
        icon: "🆓"
      }
    ],
    interactive: [
      {
        title: "GitHub Learning Lab",
        description: "Interactive GitHub courses with instant feedback",
        link: "https://lab.github.com/",
        icon: "🔬"
      },
      {
        title: "Codecademy - Git",
        description: "Hands-on Git course with live coding environment",
        link: "https://www.codecademy.com/learn/learn-git",
        icon: "💻"
      },
      {
        title: "Udemy - Git Complete",
        description: "Comprehensive Git course from beginner to advanced",
        link: "https://www.udemy.com/course/git-complete/",
        icon: "🎯"
      },
      {
        title: "Visual Git Guide",
        description: "Interactive visual guide to Git commands",
        link: "https://git-school.github.io/visualizing-git/",
        icon: "📊"
      },
      {
        title: "GitKatas - Interactive Practice",
        description: "Practical Git exercises and katas",
        link: "https://github.com/eficode/git-katas",
        icon: "🥋"
      }
    ],
    practice: [
      {
        title: "GitHub Skills",
        description: "Interactive GitHub practice with real repositories",
        link: "https://skills.github.com/",
        icon: "🏆"
      },
      {
        title: "Learn Git Branching",
        description: "Interactive visual Git branching tutorial",
        link: "https://learngitbranching.js.org/",
        icon: "🌿"
      },
      {
        title: "Git Exercises",
        description: "Practical Git exercises with solutions",
        link: "https://gitexercises.fracz.com/",
        icon: "💪"
      },
      {
        title: "Oh My Git! Game",
        description: "Learn Git through interactive gameplay",
        link: "https://ohmygit.org/",
        icon: "🎮"
      },
      {
        title: "Git Challenge",
        description: "Daily Git challenges and exercises",
        link: "https://git Challenge.com/",
        icon: "⚡"
      }
    ],
    workflows: [
      {
        title: "GitHub Flow Guide",
        description: "Learn the standard GitHub workflow",
        link: "https://guides.github.com/introduction/flow/",
        icon: "🔄"
      },
      {
        title: "Git Branching Strategies",
        description: "Master different Git branching models",
        link: "https://www.atlassian.com/git/tutorials/comparing-workflows",
        icon: "🌳"
      },
      {
        title: "Pull Request Best Practices",
        description: "Learn to create effective pull requests",
        link: "https://www.freecodecamp.org/news/how-to-make-your-first-pull-request-on-github/",
        icon: "🔀"
      },
      {
        title: "Code Review Guidelines",
        description: "Best practices for code reviews",
        link: "https://github.com/thoughtbot/guides/tree/main/code-review",
        icon: "👀"
      },
      {
        title: "GitHub Actions CI/CD",
        description: "Automate workflows with GitHub Actions",
        link: "https://github.com/features/actions",
        icon: "⚙️"
      }
    ],
    collaboration: [
      {
        title: "GitHub Collaboration Guide",
        description: "Learn to collaborate effectively on GitHub",
        link: "https://docs.github.com/en/get-started/quickstart/hello-world",
        icon: "👥"
      },
      {
        title: "Open Source Contribution",
        description: "Guide to contributing to open source projects",
        link: "https://opensource.guide/how-to-contribute/",
        icon: "❤️"
      },
      {
        title: "Forking Workflow",
        description: "Master the forking workflow for open source",
        link: "https://www.atlassian.com/git/tutorials/comparing-workflows/forking-workflow",
        icon: "🍴"
      },
      {
        title: "GitHub Issues Guide",
        description: "Effective issue tracking and management",
        link: "https://guides.github.com/features/issues/",
        icon: "🐛"
      },
      {
        title: "Project Management with GitHub",
        description: "Manage projects using GitHub Projects",
        link: "https://docs.github.com/en/issues/planning-and-tracking-with-projects",
        icon: "📋"
      }
    ],
    advanced: [
      {
        title: "Git Advanced Techniques",
        description: "Master advanced Git commands and techniques",
        link: "https://git-scm.com/book/en/v2",
        icon: "🔥"
      },
      {
        title: "Git Hooks Guide",
        description: "Automate tasks with Git hooks",
        link: "https://www.atlassian.com/git/tutorials/git-hooks",
        icon: "🪝"
      },
      {
        title: "Git Submodules",
        description: "Work with multiple repositories using submodules",
        link: "https://git-scm.com/book/en/v2/Git-Tools-Submodules",
        icon: "📦"
      },
      {
        title: "Git Bisect Debugging",
        description: "Find bugs using Git bisect",
        link: "https://git-scm.com/docs/git-bisect",
        icon: "🔍"
      },
      {
        title: "Git Reflog Recovery",
        description: "Recover lost commits and branches",
        link: "https://www.atlassian.com/git/tutorials/rewriting-history/git-reflog",
        icon: "🔄"
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
        <h1>📦 Git & GitHub Essentials</h1>
        <p>Master version control and collaboration. Learn to track changes, work with teams, and contribute to projects like a pro!</p>
        <div style={{ 
          background: 'var(--card)', 
          padding: '15px', 
          borderRadius: '12px', 
          margin: '20px auto',
          maxWidth: '500px',
          border: '1px solid var(--brand)'
        }}>
          <strong>📅 Duration:</strong> 1 week • <strong>⏰ Level:</strong> Beginner • <strong>👥 Focus:</strong> Collaboration
        </div>
      </section>

      {/* Learning Path */}
      <div style={{ maxWidth: '1000px', margin: '40px auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Your Git & GitHub Learning Journey</h2>
        
        {/* Concepts Section */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #24292e, #3F51B5)',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '25px',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: 0, color: 'white' }}>Step 1: Learn Core Concepts</h2>
            <p style={{ margin: '5px 0 0 0', color: 'white', opacity: 0.9 }}>
              Understand version control fundamentals and Git basics
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
            background: 'linear-gradient(135deg, #3F51B5, #2196F3)',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '25px',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: 0, color: 'white' }}>Step 2: Interactive Practice</h2>
            <p style={{ margin: '5px 0 0 0', color: 'white', opacity: 0.9 }}>
              Hands-on Git exercises and interactive tutorials
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

        {/* Practice Exercises */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #2196F3, #00BCD4)',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '25px',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: 0, color: 'white' }}>Step 3: Practice Exercises</h2>
            <p style={{ margin: '5px 0 0 0', color: 'white', opacity: 0.9 }}>
              Reinforce your skills with practical Git challenges
            </p>
          </div>

          <div className="cards-grid">
            {learningResources.practice.map((resource, index) => (
              <div key={index} className="card">
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>{resource.icon}</div>
                <h3>{resource.title}</h3>
                <p style={{ color: 'var(--muted)', marginBottom: '20px' }}>{resource.description}</p>
                <a href={resource.link} target="_blank" rel="noopener noreferrer" className="btn primary">
                  Start Practicing
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Workflows */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #00BCD4, #009688)',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '25px',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: 0, color: 'white' }}>Step 4: Git Workflows</h2>
            <p style={{ margin: '5px 0 0 0', color: 'white', opacity: 0.9 }}>
              Learn professional Git workflows and best practices
            </p>
          </div>

          <div className="cards-grid">
            {learningResources.workflows.map((resource, index) => (
              <div key={index} className="card">
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>{resource.icon}</div>
                <h3>{resource.title}</h3>
                <p style={{ color: 'var(--muted)', marginBottom: '20px' }}>{resource.description}</p>
                <a href={resource.link} target="_blank" rel="noopener noreferrer" className="btn primary">
                  Learn Workflows
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Collaboration */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #009688, #4CAF50)',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '25px',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: 0, color: 'white' }}>Step 5: Collaboration</h2>
            <p style={{ margin: '5px 0 0 0', color: 'white', opacity: 0.9 }}>
              Master team collaboration and open source contributions
            </p>
          </div>

          <div className="cards-grid">
            {learningResources.collaboration.map((resource, index) => (
              <div key={index} className="card">
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>{resource.icon}</div>
                <h3>{resource.title}</h3>
                <p style={{ color: 'var(--muted)', marginBottom: '20px' }}>{resource.description}</p>
                <a href={resource.link} target="_blank" rel="noopener noreferrer" className="btn primary">
                  Collaborate Now
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Advanced Topics */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #4CAF50, #8BC34A)',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '25px',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: 0, color: 'white' }}>Step 6: Advanced Git</h2>
            <p style={{ margin: '5px 0 0 0', color: 'white', opacity: 0.9 }}>
              Master advanced Git techniques and power tools
            </p>
          </div>

          <div className="cards-grid">
            {learningResources.advanced.map((resource, index) => (
              <div key={index} className="card">
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>{resource.icon}</div>
                <h3>{resource.title}</h3>
                <p style={{ color: 'var(--muted)', marginBottom: '20px' }}>{resource.description}</p>
                <a href={resource.link} target="_blank" rel="noopener noreferrer" className="btn primary">
                  Master Advanced Git
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Tracking */}
      <div style={{ textAlign: 'center', margin: '60px 0', padding: '40px', background: 'var(--card)', borderRadius: '20px' }}>
        <h2>Track Your Git & GitHub Journey</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '30px' }}>
          Complete each section and become a version control expert!
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn primary">Concepts Complete</button>
          <button className="btn">Practice Complete</button>
          <button className="btn">Exercises Complete</button>
          <button className="btn">Workflows Complete</button>
          <button className="btn">Collaboration Complete</button>
          <button className="btn">Advanced Complete</button>
        </div>
      </div>

      {/* Next Steps */}
      <div style={{ textAlign: 'center', margin: '60px 0' }}>
        <h3>What's Next After Git & GitHub?</h3>
        <p style={{ color: 'var(--muted)', marginBottom: '20px' }}>
          Apply your version control skills to real projects:
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/learn/html-css-fundamentals" className="btn primary">Web Development →</Link>
          <Link to="/learn/python-for-everyone" className="btn primary">Python Projects →</Link>
          <Link to="/learn/javascript-basics" className="btn primary">JavaScript Projects →</Link>
          <Link to="/learn" className="btn ghost">← Back to Courses</Link>
        </div>
      </div>

      {/* GitHub Stats */}
      <div style={{ textAlign: 'center', margin: '60px 0', padding: '40px', background: 'var(--card)', borderRadius: '20px' }}>
        <h2>🚀 Launch Your GitHub Journey</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '30px' }}>
          Create your GitHub account and start building your portfolio today!
        </p>
        <a href="https://github.com/signup" target="_blank" rel="noopener noreferrer" className="btn primary" style={{padding: '15px 30px', fontSize: '1.1rem'}}>
          Create GitHub Account
        </a>
      </div>
    </div>
  );
}