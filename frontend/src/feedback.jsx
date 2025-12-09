// Feedback.js
import './app.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Feedback() {
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedResource, setSelectedResource] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userName, setUserName] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  // Get GitHub username from sessionStorage on component mount
  useEffect(() => {
    const storedUsername = sessionStorage.getItem('github_login_username');
    if (storedUsername) {
      setUserName(storedUsername);
    } else {
      const params = new URLSearchParams(window.location.search);
      const urlUsername = params.get('username');
      if (urlUsername) {
        setUserName(urlUsername);
        sessionStorage.setItem('github_login_username', urlUsername);
      }
    }
  }, []);

  // Programming fields data with resources
  const programmingFields = [
    {
      id: 'web-dev',
      name: 'Web Development',
      description: 'Build websites and web applications',
      icon: '💻',
      resources: [
        { name: 'MDN Web Docs - HTML', link: 'https://developer.mozilla.org/en-US/docs/Web/HTML', type: 'Documentation' },
        { name: 'CSS-Tricks Guide', link: 'https://css-tricks.com/guides/', type: 'Tutorials' },
        { name: 'FreeCodeCamp Responsive Web Design', link: 'https://www.freecodecamp.org/learn/responsive-web-design/', type: 'Interactive' },
        { name: 'JavaScript.info', link: 'https://javascript.info/', type: 'Tutorials' },
        { name: 'React Official Docs', link: 'https://reactjs.org/docs/getting-started.html', type: 'Documentation' },
        { name: 'Node.js Official Docs', link: 'https://nodejs.org/en/docs/', type: 'Documentation' },
        { name: 'Express.js Guide', link: 'https://expressjs.com/en/guide.html', type: 'Documentation' },
        { name: 'MongoDB University', link: 'https://university.mongodb.com/', type: 'Courses' }
      ]
    },
    {
      id: 'data-science',
      name: 'Data Science',
      description: 'Analyze data and build machine learning models',
      icon: '📊',
      resources: [
        { name: 'Kaggle Learn', link: 'https://kaggle.com/learn', type: 'Interactive' },
        { name: 'Towards Data Science', link: 'https://towardsdatascience.com', type: 'Blog' },
        { name: 'Fast.ai', link: 'https://fast.ai', type: 'Course' },
        { name: 'Python Data Science Handbook', link: 'https://jakevdp.github.io/PythonDataScienceHandbook/', type: 'Book' },
        { name: 'Coursera ML', link: 'https://coursera.org/learn/machine-learning', type: 'Course' },
        { name: 'TensorFlow Tutorials', link: 'https://tensorflow.org/tutorials', type: 'Tutorials' },
        { name: 'PyTorch Tutorials', link: 'https://pytorch.org/tutorials', type: 'Tutorials' }
      ]
    },
    {
      id: 'mobile-dev',
      name: 'Mobile Development',
      description: 'Create apps for iOS and Android',
      icon: '📱',
      resources: [
        { name: 'React Native Docs', link: 'https://reactnative.dev', type: 'Documentation' },
        { name: 'Flutter Docs', link: 'https://flutter.dev', type: 'Documentation' },
        { name: 'Android Developers', link: 'https://developer.android.com', type: 'Documentation' },
        { name: 'Apple Developer', link: 'https://developer.apple.com', type: 'Documentation' },
        { name: 'Expo Documentation', link: 'https://docs.expo.dev', type: 'Documentation' },
        { name: 'Kotlin Docs', link: 'https://kotlinlang.org/docs/', type: 'Documentation' },
        { name: 'Swift Documentation', link: 'https://docs.swift.org', type: 'Documentation' }
      ]
    },
    {
      id: 'game-dev',
      name: 'Game Development',
      description: 'Design and develop video games',
      icon: '🎮',
      resources: [
        { name: 'Unity Learn', link: 'https://learn.unity.com', type: 'Course' },
        { name: 'Unreal Engine Docs', link: 'https://docs.unrealengine.com', type: 'Documentation' },
        { name: 'GameDev.net', link: 'https://gamedev.net', type: 'Community' },
        { name: 'r/gamedev', link: 'https://reddit.com/r/gamedev', type: 'Community' },
        { name: 'GDC Vault', link: 'https://gdcvault.com', type: 'Video' },
        { name: 'Phaser Framework', link: 'https://phaser.io', type: 'Framework' },
        { name: 'Godot Engine', link: 'https://godotengine.org', type: 'Engine' }
      ]
    },
    {
      id: 'ai-ml',
      name: 'AI & Machine Learning',
      description: 'Build intelligent systems and algorithms',
      icon: '🤖',
      resources: [
        { name: 'TensorFlow Tutorials', link: 'https://tensorflow.org/tutorials', type: 'Tutorials' },
        { name: 'PyTorch Tutorials', link: 'https://pytorch.org/tutorials', type: 'Tutorials' },
        { name: 'Andrew Ng ML Course', link: 'https://coursera.org/learn/machine-learning', type: 'Course' },
        { name: 'Fast.ai', link: 'https://fast.ai', type: 'Course' },
        { name: 'Google AI Education', link: 'https://ai.google/education', type: 'Course' },
        { name: 'OpenAI Cookbook', link: 'https://cookbook.openai.com', type: 'Tutorials' },
        { name: 'Hugging Face Course', link: 'https://huggingface.co/learn', type: 'Course' }
      ]
    },
    {
      id: 'devops',
      name: 'DevOps & Cloud',
      description: 'Manage infrastructure and deployment',
      icon: '☁️',
      resources: [
        { name: 'AWS Training', link: 'https://aws.amazon.com/training', type: 'Course' },
        { name: 'Docker Docs', link: 'https://docs.docker.com', type: 'Documentation' },
        { name: 'Kubernetes Docs', link: 'https://kubernetes.io/docs', type: 'Documentation' },
        { name: 'Linux Journey', link: 'https://linuxjourney.com', type: 'Tutorial' },
        { name: 'Google Cloud Training', link: 'https://cloud.google.com/training', type: 'Course' },
        { name: 'Terraform Docs', link: 'https://developer.hashicorp.com/terraform/docs', type: 'Documentation' },
        { name: 'GitHub Learning Lab', link: 'https://lab.github.com/', type: 'Interactive' }
      ]
    }
  ];

  // Submit feedback to MongoDB
  const submitFeedback = async (e) => {
    e.preventDefault();
    
    if (!selectedSection || !selectedResource || rating === 0 || !comment) {
      alert('Please fill all fields');
      return;
    }

    if (!userName) {
      alert('Please log in with GitHub to submit feedback');
      return;
    }

    setIsSubmitting(true);

    const feedbackData = {
      section: selectedSection,
      resource: selectedResource,
      userName,
      rating,
      comment,
      date: new Date().toISOString()
    };

    try {
      const response = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      if (response.ok) {
        setSelectedSection('');
        setSelectedResource('');
        setRating(0);
        setComment('');
        alert('🎉 Feedback submitted successfully!');
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('❌ Error submitting feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get resources for selected section
  const getResourcesForSection = () => {
    const field = programmingFields.find(field => field.id === selectedSection);
    return field ? field.resources : [];
  };

  return (
    <div className="wrap">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">AlgoRythm</Link>
          <nav className="nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/learn-filter" className="nav-link">Learn</Link>
            <Link to="/projects" className="nav-link">Projects</Link>
            <Link to="/feedback" className="nav-link active">Feedback</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div style={{ textAlign: 'center' }}>
         <h1 style={{ 
          color:'#629ce8',
  fontSize: '3rem', 
  marginBottom: '1rem',
 
  textShadow: '0 2px 10px #4fb5e1'
}}>
  💬 Resource Feedback
</h1>
          <p style={{ 
            fontSize: '1.2rem', 
            maxWidth: '600px', 
            margin: '0 auto',
            color: 'var(--muted)'
          }}>
            Share your learning journey and help the community discover the best resources
          </p>
          {userName && (
            <div style={{ 
              background: 'linear-gradient(135deg, var(--card), rgba(139, 92, 246, 0.1))', 
              padding: '12px 24px', 
              borderRadius: '50px', 
              margin: '20px auto',
              maxWidth: '300px',
              border: '1px solid var(--brand)',
            
            }}>
              <span style={{ color: 'var(--brand)', fontWeight: 'bold' }}>👤</span>
              <span style={{ marginLeft: '8px', color: 'white' }}>{userName}</span>
            </div>
          )}
        </div>
      </section>

      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
        
        {/* Feedback Form */}
        <div style={{ 
          background: 'linear-gradient(135deg, var(--card), rgba(139, 92, 246, 0.05))',
          padding: '40px', 
          borderRadius: '20px',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          marginBottom: '50px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
   
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '30px',
            paddingBottom: '20px',
            borderBottom: '1px solid rgba(139, 92, 246, 0.2)'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, var(--brand), #8B5CF6)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              marginRight: '15px'
            }}>
              ✍️
            </div>
            <div>
              <h2 style={{ color: 'white', margin: 0, fontSize: '1.8rem' }}>Share Your Experience</h2>
              <p style={{ color: 'var(--muted)', margin: '5px 0 0 0' }}>
                Help others by sharing your thoughts on learning resources
              </p>
            </div>
          </div>
          
          {!userName ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 40px',
              background: 'rgba(139, 92, 246, 0.1)',
              borderRadius: '16px',
              border: '1px solid rgba(139, 92, 246, 0.3)'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔐</div>
              <h3 style={{ color: 'white', marginBottom: '15px' }}>Authentication Required</h3>
              <p style={{ color: 'var(--muted)', marginBottom: '25px', fontSize: '1.1rem' }}>
                Please log in with GitHub to share your feedback and help the community
              </p>
              <Link 
                to="/login" 
                style={{
                  background: 'linear-gradient(135deg, var(--brand), #8B5CF6)',
                  color: 'white',
                  padding: '12px 30px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <span>🚀</span>
                Login with GitHub
              </Link>
            </div>
          ) : (
            <form onSubmit={submitFeedback}>
              <div style={{ 
                display: 'grid', 
                gap: '25px',
                gridTemplateColumns: '1fr 1fr',
                marginBottom: '30px'
              }}>
                {/* Section Selection */}
                <div>
                  <label style={{ 
                    color: 'var(--muted)', 
                    display: 'block', 
                    marginBottom: '12px',
                    fontSize: '0.95rem',
                    fontWeight: '600'
                  }}>
                    📚 Learning Section *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select 
                      value={selectedSection}
                      onChange={(e) => {
                        setSelectedSection(e.target.value);
                        setSelectedResource('');
                      }}
                      style={{
                        width: '100%',
                        padding: '15px 15px 15px 15px',
                        borderRadius: '12px',
                        border: '2px solid rgba(139, 92, 246, 0.3)',
                        background: 'var(--bg)',
                        color: 'white',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--brand)';
                        e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.2)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                        e.target.style.boxShadow = 'none';
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = 'rgba(139, 92, 246, 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        if (e.target !== document.activeElement) {
                          e.target.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                        }
                      }}
                      required
                    >
                      <option value="" style={{ color: 'var(--muted)' }}></option>
                      {programmingFields.map(field => (
                        <option key={field.id} value={field.id} style={{ background: 'white', color: 'black' }}>
                          {field.icon} {field.name} - {field.description}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Resource Selection */}
                <div>
                  <label style={{ 
                    color: 'var(--muted)', 
                    display: 'block', 
                    marginBottom: '12px',
                    fontSize: '0.95rem',
                    fontWeight: '600'
                  }}>
                    📖 Resource *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select 
                      value={selectedResource}
                      onChange={(e) => setSelectedResource(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '15px 15px 15px 15px',
                        borderRadius: '12px',
                        border: `2px solid ${!selectedSection ? 'rgba(255, 255, 255, 0.1)' : 'rgba(139, 92, 246, 0.3)'}`,
                        background: !selectedSection ? 'rgba(255, 255, 255, 0.05)' : 'var(--bg)',
                        color: !selectedSection ? 'var(--muted)' : 'white',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        cursor: !selectedSection ? 'not-allowed' : 'pointer',
                        opacity: !selectedSection ? 0.6 : 1
                      }}
                      onFocus={(e) => {
                        if (selectedSection) {
                          e.target.style.borderColor = 'var(--brand)';
                          e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.2)';
                        }
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                        e.target.style.boxShadow = 'none';
                      }}
                      onMouseEnter={(e) => {
                        if (selectedSection) {
                          e.target.style.borderColor = 'rgba(139, 92, 246, 0.5)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedSection && e.target !== document.activeElement) {
                          e.target.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                        }
                      }}
                      required
                      disabled={!selectedSection}
                    >
                      <option value="" style={{ color: 'var(--muted)' }}>
                        {!selectedSection ? 'Select a section first' : ''}
                      </option>
                      {getResourcesForSection().map(resource => (
                        <option key={resource.name} value={resource.name} style={{ background: 'white', color: 'black' }}>
                          {resource.name} • {resource.type} 
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div style={{ marginBottom: '30px' }}>
                <label style={{ 
                  color: 'var(--muted)', 
                  display: 'block', 
                  marginBottom: '15px',
                  fontSize: '0.95rem',
                  fontWeight: '600'
                }}>
                  ⭐ Rating *
                </label>
                <div style={{ 
                  display: 'flex', 
                  gap: '8px',
                  justifyContent: 'center',
                  marginBottom: '10px'
                }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: star <= (hoverRating || rating) ? 'gold' : 'var(--muted)',
                        fontSize: '3rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        transform: star <= (hoverRating || rating) ? 'scale(1.1)' : 'scale(1)',
                        filter: star <= (hoverRating || rating) ? 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))' : 'none'
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <div style={{ 
                  textAlign: 'center', 
                  color: 'var(--muted)', 
                  fontSize: '0.9rem',
                  background: 'rgba(139, 92, 246, 0.1)',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  display: 'inline-block',
                  margin: '0 auto'
                }}>
                  {rating > 0 ? `🎯 ${rating} star${rating > 1 ? 's' : ''} selected` : 'Click stars to rate this resource'}
                </div>
              </div>

              {/* Comment */}
              <div style={{ marginBottom: '35px' }}>
                <label style={{ 
                  color: 'var(--muted)', 
                  display: 'block', 
                  marginBottom: '12px',
                  fontSize: '0.95rem',
                  fontWeight: '600'
                }}>
                  💭 Your Feedback *
                </label>
                <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this resource... ✨
• What did you like about it?
• How did it help your learning?
• What could be improved?
• Would you recommend it to others?"
                  rows="6"
                  style={{
                    width: '100%',
                    padding: '18px',
                    borderRadius: '12px',
                    border: '2px solid rgba(139, 92, 246, 0.3)',
                    background: 'var(--bg)',
                    color: 'white',
                    fontSize: '1rem',
                    resize: 'vertical',
                    transition: 'all 0.3s ease',
                    lineHeight: '1.5'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--brand)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
              </div>

              {/* Submit Button */}
              <div style={{ textAlign: 'center' }}>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    background: isSubmitting 
                      ? 'var(--muted)' 
                      : 'linear-gradient(135deg, var(--brand), #8B5CF6)',
                    color: 'white',
                    border: 'none',
                    padding: '16px 40px',
                    borderRadius: '10px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    opacity: isSubmitting ? 0.7 : 1,
                    transition: 'all 0.3s ease',
                    boxShadow: isSubmitting ? 'none' : '0 4px 15px rgba(139, 92, 246, 0.4)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.6)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.4)';
                    }
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <span style={{ marginRight: '8px' }}>🚀</span>
                      Share Your Feedback
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}