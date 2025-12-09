import './app.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function MobileDevelopmentPath() {
  const [feedbacks, setFeedbacks] = useState([]);

  const learningPath = {
    fundamentals: [
      {
        title: "Mobile Development Basics",
        description: "Understand mobile platforms, architecture, and development lifecycle",
        duration: "2 weeks",
        level: "Beginner",
        resources: [
          {
            name: "MDN Mobile Web Development",
            link: "https://developer.mozilla.org/en-US/docs/Web/Guide/Mobile",
            type: "documentation"
          },
          {
            name: "Google Mobile Development Guide",
            link: "https://developer.android.com/guide",
            type: "documentation"
          },
          {
            name: "Apple iOS Development",
            link: "https://developer.apple.com/ios/",
            type: "platform"
          }
        ],
        projects: ["Mobile App Research", "Platform Comparison", "Basic App Concept"],
        icon: "📱"
      },
      {
        title: "JavaScript & TypeScript",
        description: "Master the languages powering cross-platform mobile development",
        duration: "3 weeks",
        level: "Beginner",
        resources: [
          {
            name: "JavaScript.info Mobile",
            link: "https://javascript.info/",
            type: "tutorials"
          },
          {
            name: "TypeScript Handbook",
            link: "https://www.typescriptlang.org/docs/",
            type: "documentation"
          },
          {
            name: "Modern JavaScript Tutorial",
            link: "https://javascript.info/",
            type: "tutorials"
          }
        ],
        projects: ["JS Utility Library", "TypeScript Practice App", "API Integration"],
        icon: "⚡"
      }
    ],
    crossPlatform: [
      {
        title: "React Native Fundamentals",
        description: "Build native mobile apps using React and JavaScript",
        duration: "4 weeks",
        level: "Intermediate",
        resources: [
          {
            name: "React Native Official Docs",
            link: "https://reactnative.dev/docs/getting-started",
            type: "documentation"
          },
          {
            name: "React Native Tutorial",
            link: "https://reactnative.dev/docs/tutorial",
            type: "tutorials"
          },
          {
            name: "Expo Documentation",
            link: "https://docs.expo.dev/",
            type: "platform"
          }
        ],
        projects: ["Todo App", "Weather App", "Social Media Clone"],
        icon: "⚛️"
      },
      {
        title: "Flutter & Dart",
        description: "Create beautiful native apps with Google's UI toolkit",
        duration: "4 weeks",
        level: "Intermediate",
        resources: [
          {
            name: "Flutter Documentation",
            link: "https://flutter.dev/docs",
            type: "documentation"
          },
          {
            name: "Dart Language Tour",
            link: "https://dart.dev/guides/language/language-tour",
            type: "tutorials"
          },
          {
            name: "Flutter YouTube Channel",
            link: "https://www.youtube.com/c/flutterdev",
            type: "video"
          }
        ],
        projects: ["E-commerce App", "News Reader", "Fitness Tracker"],
        icon: "🎯"
      }
    ],
    nativeDevelopment: [
      {
        title: "iOS Development with Swift",
        description: "Build native iOS apps using Swift and Xcode",
        duration: "5 weeks",
        level: "Advanced",
        resources: [
          {
            name: "Swift Documentation",
            link: "https://docs.swift.org/swift-book/",
            type: "documentation"
          },
          {
            name: "Apple Developer Academy",
            link: "https://developer.apple.com/tutorials/swiftui",
            type: "tutorials"
          },
          {
            name: "Hacking with Swift",
            link: "https://www.hackingwithswift.com/",
            type: "courses"
          }
        ],
        projects: ["iOS Calculator", "Photo Gallery App", "Location-Based App"],
        icon: "🍎"
      },
      {
        title: "Android Development with Kotlin",
        description: "Create native Android apps using Kotlin and Android Studio",
        duration: "5 weeks",
        level: "Advanced",
        resources: [
          {
            name: "Kotlin Documentation",
            link: "https://kotlinlang.org/docs/",
            type: "documentation"
          },
          {
            name: "Android Developer Guide",
            link: "https://developer.android.com/guide",
            type: "documentation"
          },
          {
            name: "Android Kotlin Fundamentals",
            link: "https://developer.android.com/courses/kotlin-fundamentals/overview",
            type: "course"
          }
        ],
        projects: ["Android Weather App", "Task Manager", "Music Player"],
        icon: "🤖"
      }
    ],
    advanced: [
      {
        title: "Mobile App Architecture",
        description: "Design scalable and maintainable mobile app architectures",
        duration: "3 weeks",
        level: "Advanced",
        resources: [
          {
            name: "Clean Architecture Guide",
            link: "https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html",
            type: "article"
          },
          {
            name: "MVVM Pattern",
            link: "https://developer.android.com/jetpack/guide",
            type: "documentation"
          },
          {
            name: "React Native Architecture",
            link: "https://reactnative.dev/docs/architecture-overview",
            type: "documentation"
          }
        ],
        projects: ["Refactored App Architecture", "Design Pattern Implementation", "State Management System"],
        icon: "🏗️"
      },
      {
        title: "App Deployment & Publishing",
        description: "Publish your apps to Apple App Store and Google Play Store",
        duration: "2 weeks",
        level: "Advanced",
        resources: [
          {
            name: "App Store Connect Guide",
            link: "https://developer.apple.com/app-store-connect/",
            type: "documentation"
          },
          {
            name: "Google Play Console",
            link: "https://developer.android.com/distribute/console",
            type: "platform"
          },
          {
            name: "App Store Guidelines",
            link: "https://developer.apple.com/app-store/review/guidelines/",
            type: "guidelines"
          }
        ],
        projects: ["App Store Submission", "Play Store Deployment", "App Marketing Materials"],
        icon: "🚀"
      }
    ]
  };

  // Fetch feedbacks from MongoDB for mobile-dev section
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/feedback');
        if (response.ok) {
          const data = await response.json();
          // Filter for mobile-dev section only
          const mobileDevFeedbacks = data.filter(feedback => feedback.section === 'mobile-dev');
          setFeedbacks(mobileDevFeedbacks);
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
        <h1>Mobile Development Path</h1>
        <p>Build powerful mobile applications for iOS and Android. Master cross-platform frameworks and native development to create apps millions will love!</p>
        <div style={{ 
          background: 'var(--card)', 
          padding: '15px', 
          borderRadius: '12px', 
          margin: '20px auto',
          maxWidth: '600px',
          border: '1px solid var(--brand)'
        }}>
          <strong>Total Duration:</strong> 14-16 weeks • <strong>Level:</strong> Beginner to Advanced • <strong>Goal:</strong> Mobile Developer
        </div>
      </section>

      {/* Learning Roadmap */}
      <div style={{ maxWidth: '1000px', margin: '40px auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px' }}></h2>

        {/* Fundamentals */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{ 
            background: 'transparent',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '25px',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: 0, color: 'white' }}>Fundamentals</h2>
            <p style={{ margin: '5px 0 0 0', color: 'white', opacity: 0.9 }}>
              Essential concepts for mobile development
            </p>
          </div>

          <div className="cards-grid">
            {learningPath.fundamentals.map((topic, index) => (
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

        {/* Cross-Platform Development */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{ 
            background: 'transparent',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '25px',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: 0, color: 'white' }}>Cross-Platform</h2>
            <p style={{ margin: '5px 0 0 0', color: 'white', opacity: 0.9 }}>
              Build once, deploy everywhere
            </p>
          </div>

          <div className="cards-grid">
            {learningPath.crossPlatform.map((topic, index) => (
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

        {/* Native Development */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{ 
            background: 'transparent',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '25px',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: 0, color: 'white' }}>Native Development</h2>
            <p style={{ margin: '5px 0 0 0', color: 'white', opacity: 0.9 }}>
              Platform-specific development for optimal performance
            </p>
          </div>

          <div className="cards-grid">
            {learningPath.nativeDevelopment.map((topic, index) => (
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
              Professional mobile development practices
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