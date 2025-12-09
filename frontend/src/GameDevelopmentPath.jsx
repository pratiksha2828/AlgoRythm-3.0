import './app.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function GameDevelopmentPath() {
  const [feedbacks, setFeedbacks] = useState([]);

  const learningPath = {
    foundations: [
      {
        title: "Game Dev Foundations with Unity",
        description: "Learn the Unity editor, scenes, prefabs, input, and basic physics.",
        duration: "2-3 weeks",
        level: "Beginner",
        resources: [
          { name: "Unity Learn", link: "https://learn.unity.com/", type: "interactive" },
          { name: "Unity Manual", link: "https://docs.unity3d.com/Manual/index.html", type: "documentation" },
          { name: "Brackeys Beginner", link: "https://www.youtube.com/playlist?list=PLPV2KyIb3jR4JsOygkHOdOeuV-5TgTqCX", type: "video" }
        ],
        projects: ["2D Platformer Prototype", "Top-Down Controller", "Physics Sandbox"],
        icon: "🎮"
      },
      {
        title: "C# for Unity",
        description: "Master C# scripting for components, events, and gameplay logic.",
        duration: "2 weeks",
        level: "Beginner",
        resources: [
          { name: "C# Guide", link: "https://learn.microsoft.com/dotnet/csharp/", type: "documentation" },
          { name: "C# Scripting in Unity", link: "https://docs.unity3d.com/Manual/CreatingAndUsingScripts.html", type: "documentation" },
          { name: "Code Monkey", link: "https://www.youtube.com/c/CodeMonkeyUnity", type: "video" }
        ],
        projects: ["Collectibles System", "Health & Damage", "Power-ups"],
        icon: "#️⃣"
      }
    ],
    design: [
      {
        title: "Game Design Basics",
        description: "Core loops, difficulty balance, level flow, and player feedback.",
        duration: "1-2 weeks",
        level: "Intermediate",
        resources: [
          { name: "Game Design Concepts", link: "https://www.gdcvault.com/", type: "talks" },
          { name: "Extra Credits", link: "https://www.youtube.com/user/ExtraCreditz", type: "video" },
          { name: "Level Design Fundamentals", link: "https://www.youtube.com/playlist?list=PLB9B0BAF0F7C0BE3B", type: "video" }
        ],
        projects: ["One-Level Demo", "Puzzle Mechanics", "Boss Encounter"],
        icon: "🧠"
      }
    ],
    production: [
      {
        title: "2D/3D Graphics & UI",
        description: "Sprites, animations, materials, lighting, and UI canvases.",
        duration: "2 weeks",
        level: "Intermediate",
        resources: [
          { name: "Unity 2D", link: "https://docs.unity3d.com/Manual/Unity2D.html", type: "documentation" },
          { name: "Unity UI Toolkit", link: "https://docs.unity3d.com/Manual/UIToolkit.html", type: "documentation" },
          { name: "Mixamo Animations", link: "https://www.mixamo.com/", type: "assets" }
        ],
        projects: ["Animated Character", "HUD & Menus", "Lighting Presets"],
        icon: "🎨"
      },
      {
        title: "Build & Polish",
        description: "Audio, VFX, optimization, build targets, and distribution.",
        duration: "1-2 weeks",
        level: "Intermediate",
        resources: [
          { name: "Audio in Unity", link: "https://docs.unity3d.com/Manual/Audio.html", type: "documentation" },
          { name: "Profile & Optimize", link: "https://docs.unity3d.com/Manual/BestPracticeGuides.html", type: "guide" },
          { name: "itch.io Publishing", link: "https://itch.io/docs/creators", type: "guide" }
        ],
        projects: ["Playable Demo", "Trailer/GIF", "Release Build"],
        icon: "🚀"
      }
    ]
  };

  // Fetch feedbacks from MongoDB for game-dev section
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/feedback');
        if (response.ok) {
          const data = await response.json();
          // Filter for game-dev section only
          const gameDevFeedbacks = data.filter(feedback => feedback.section === 'game-dev');
          setFeedbacks(gameDevFeedbacks);
        }
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div className="wrap">
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

      <section className="hero">
        <h1>Game Development Path</h1>
        <p>Design, build, and publish engaging 2D/3D games using Unity and C#.</p>
        <div style={{ background: 'var(--card)', padding: '15px', borderRadius: '12px', margin: '20px auto', maxWidth: '600px', border: '1px solid var(--brand)' }}>
          <strong>Total Duration:</strong> 6-9 weeks • <strong>Level:</strong> Beginner to Intermediate • <strong>Goal:</strong> Publish a small game
        </div>
      </section>

      <div style={{ maxWidth: '1000px', margin: '40px auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px' }}></h2>

        <div style={{ marginBottom: '50px' }}>
          <div style={{ background: 'transparent', padding: '20px', borderRadius: '12px', marginBottom: '25px', textAlign: 'center' }}>
            <h2 style={{ margin: 0, color: 'white' }}>Foundations</h2>
            <p style={{ margin: '5px 0 0 0', color: 'white', opacity: 0.9 }}>Unity basics, physics, and C# scripting</p>
          </div>
          <div className="cards-grid">
            {learningPath.foundations.map((topic, index) => (
              <div key={index} className="card">
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>{topic.icon}</div>
                <h3>{topic.title}</h3>
                <p style={{ color: 'var(--muted)', marginBottom: '15px' }}>{topic.description}</p>
                <div style={{ marginBottom: '15px' }}>
                  <span style={{ background: 'var(--bg)', padding: '4px 8px', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--muted)' }}> {topic.duration} • {topic.level}</span>
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
                    {topic.projects.map((project, i) => (<li key={i}>{project}</li>))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '50px' }}>
          <div style={{ background: 'transparent', padding: '20px', borderRadius: '12px', marginBottom: '25px', textAlign: 'center' }}>
            <h2 style={{ margin: 0, color: 'white' }}>Design</h2>
            <p style={{ margin: '5px 0 0 0', color: 'white', opacity: 0.9 }}>Gameplay loops, levels, and progression</p>
          </div>
          <div className="cards-grid">
            {learningPath.design.map((topic, index) => (
              <div key={index} className="card">
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>{topic.icon}</div>
                <h3>{topic.title}</h3>
                <p style={{ color: 'var(--muted)', marginBottom: '15px' }}>{topic.description}</p>
                <div style={{ marginBottom: '15px' }}>
                  <span style={{ background: 'var(--bg)', padding: '4px 8px', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--muted)' }}> {topic.duration} • {topic.level}</span>
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
                    {topic.projects.map((project, i) => (<li key={i}>{project}</li>))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '50px' }}>
          <div style={{ background: 'transparent', padding: '20px', borderRadius: '12px', marginBottom: '25px', textAlign: 'center' }}>
            <h2 style={{ margin: 0, color: 'white' }}>Production</h2>
            <p style={{ margin: '5px 0 0 0', color: 'white', opacity: 0.9 }}>Polish, performance, and launch</p>
          </div>
          <div className="cards-grid">
            {learningPath.production.map((topic, index) => (
              <div key={index} className="card">
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>{topic.icon}</div>
                <h3>{topic.title}</h3>
                <p style={{ color: 'var(--muted)', marginBottom: '15px' }}>{topic.description}</p>
                <div style={{ marginBottom: '15px' }}>
                  <span style={{ background: 'var(--bg)', padding: '4px 8px', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--muted)' }}>{topic.duration} • {topic.level}</span>
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
                    {topic.projects.map((project, i) => (<li key={i}>{project}</li>))}
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