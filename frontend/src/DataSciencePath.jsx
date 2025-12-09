import './app.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function DataSciencePath() {
  const [feedbacks, setFeedbacks] = useState([]);

  const learningPath = {
    fundamentals: [
      {
        title: "Python for Data Science",
        description: "Master Python programming fundamentals for data analysis",
        duration: "3 weeks",
        level: "Beginner",
        resources: [
          {
            name: "Python Official Documentation",
            link: "https://docs.python.org/3/",
            type: "documentation"
          },
          {
            name: "DataCamp Python Course",
            link: "https://www.datacamp.com/courses/intro-to-python-for-data-science",
            type: "interactive"
          },
          {
            name: "Real Python Tutorials",
            link: "https://realpython.com/",
            type: "tutorials"
          }
        ],
        projects: ["Data Analysis Script", "CSV File Processor", "Basic Data Visualization"],
        icon: "🐍"
      },
      {
        title: "Statistics & Mathematics",
        description: "Learn essential statistical concepts for data analysis",
        duration: "3 weeks",
        level: "Beginner",
        resources: [
          {
            name: "Khan Academy Statistics",
            link: "https://www.khanacademy.org/math/statistics-probability",
            type: "courses"
          },
          {
            name: "StatQuest YouTube Channel",
            link: "https://www.youtube.com/c/joshstarmer",
            type: "video"
          },
          {
            name: "Introduction to Statistical Learning",
            link: "https://www.statlearning.com/",
            type: "book"
          }
        ],
        projects: ["Statistical Analysis Report", "Probability Simulations", "Hypothesis Testing"],
        icon: "📈"
      }
    ],
    coreTools: [
      {
        title: "Pandas & NumPy",
        description: "Data manipulation and numerical computing with Python",
        duration: "3 weeks",
        level: "Intermediate",
        resources: [
          {
            name: "Pandas Documentation",
            link: "https://pandas.pydata.org/docs/",
            type: "documentation"
          },
          {
            name: "NumPy User Guide",
            link: "https://numpy.org/doc/stable/user/",
            type: "documentation"
          },
          {
            name: "Kaggle Pandas Course",
            link: "https://www.kaggle.com/learn/pandas",
            type: "interactive"
          }
        ],
        projects: ["Data Cleaning Pipeline", "Financial Data Analysis", "Sports Statistics"],
        icon: "📊"
      },
      {
        title: "Data Visualization",
        description: "Create compelling visualizations with Matplotlib & Seaborn",
        duration: "2 weeks",
        level: "Intermediate",
        resources: [
          {
            name: "Matplotlib Tutorials",
            link: "https://matplotlib.org/stable/tutorials/index.html",
            type: "tutorials"
          },
          {
            name: "Seaborn Gallery",
            link: "https://seaborn.pydata.org/examples/index.html",
            type: "examples"
          },
          {
            name: "Python Graph Gallery",
            link: "https://www.python-graph-gallery.com/",
            type: "inspiration"
          }
        ],
        projects: ["Interactive Dashboard", "Business Report Visualizations", "Exploratory Data Analysis"],
        icon: "🎨"
      }
    ],
    machineLearning: [
      {
        title: "Machine Learning Fundamentals",
        description: "Introduction to ML algorithms and concepts",
        duration: "4 weeks",
        level: "Intermediate",
        resources: [
          {
            name: "Scikit-learn Documentation",
            link: "https://scikit-learn.org/stable/",
            type: "documentation"
          },
          {
            name: "Google ML Crash Course",
            link: "https://developers.google.com/machine-learning/crash-course",
            type: "course"
          },
          {
            name: "Machine Learning Mastery",
            link: "https://machinelearningmastery.com/",
            type: "tutorials"
          }
        ],
        projects: ["Predictive Model", "Classification System", "Recommendation Engine"],
        icon: "🤖"
      },
      {
        title: "Advanced ML & Deep Learning",
        description: "Deep learning with TensorFlow and PyTorch",
        duration: "5 weeks",
        level: "Advanced",
        resources: [
          {
            name: "TensorFlow Tutorials",
            link: "https://www.tensorflow.org/tutorials",
            type: "tutorials"
          },
          {
            name: "PyTorch Tutorials",
            link: "https://pytorch.org/tutorials/",
            type: "tutorials"
          },
          {
            name: "Fast.ai Practical Deep Learning",
            link: "https://www.fast.ai/",
            type: "course"
          }
        ],
        projects: ["Neural Network Model", "Image Classification", "NLP Application"],
        icon: "🧠"
      }
    ],
    advanced: [
      {
        title: "Big Data & Cloud Computing",
        description: "Work with large datasets using Spark and cloud platforms",
        duration: "3 weeks",
        level: "Advanced",
        resources: [
          {
            name: "Apache Spark Guide",
            link: "https://spark.apache.org/docs/latest/",
            type: "documentation"
          },
          {
            name: "AWS Machine Learning",
            link: "https://aws.amazon.com/machine-learning/",
            type: "platform"
          },
          {
            name: "Google Cloud AI",
            link: "https://cloud.google.com/products/ai",
            type: "platform"
          }
        ],
        projects: ["Big Data Processing", "Cloud Deployment", "Scalable ML Pipeline"],
        icon: "☁️"
      },
      {
        title: "MLOps & Deployment",
        description: "Deploy and maintain machine learning models in production",
        duration: "3 weeks",
        level: "Advanced",
        resources: [
          {
            name: "MLflow Documentation",
            link: "https://mlflow.org/docs/latest/index.html",
            type: "documentation"
          },
          {
            name: "Kubeflow Guide",
            link: "https://www.kubeflow.org/docs/",
            type: "documentation"
          },
          {
            name: "Full Stack Deep Learning",
            link: "https://fullstackdeeplearning.com/",
            type: "course"
          }
        ],
        projects: ["Model Deployment", "Monitoring System", "CI/CD Pipeline for ML"],
        icon: "🚀"
      }
    ]
  };

  // Fetch feedbacks from MongoDB for data-science section
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/feedback');
        if (response.ok) {
          const data = await response.json();
          // Filter for data-science section only
          const dataScienceFeedbacks = data.filter(feedback => feedback.section === 'data-science');
          setFeedbacks(dataScienceFeedbacks);
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
        <h1>Data Science Path</h1>
        <p>Master data analysis, machine learning, and AI. Transform raw data into actionable insights and build intelligent systems!</p>
        <div style={{ 
          background: 'var(--card)', 
          padding: '15px', 
          borderRadius: '12px', 
          margin: '20px auto',
          maxWidth: '600px',
          border: '1px solid var(--brand)'
        }}>
          <strong>Total Duration:</strong> 14-18 weeks • <strong>Level:</strong> Beginner to Advanced • <strong>Goal:</strong> Data Scientist
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
              Essential building blocks for data science
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
                    ⏱️ {topic.duration} • {topic.level}
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

        {/* Core Tools */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{ 
            background: 'transparent',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '25px',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: 0, color: 'white' }}>Core Tools</h2>
            <p style={{ margin: '5px 0 0 0', color: 'white', opacity: 0.9 }}>
              Essential libraries and frameworks for data work
            </p>
          </div>

          <div className="cards-grid">
            {learningPath.coreTools.map((topic, index) => (
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

        {/* Machine Learning */}
        <div style={{ marginBottom: '50px' }}>
          <div style={{ 
            background: 'transparent',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '25px',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: 0, color: 'white' }}>Machine Learning</h2>
            <p style={{ margin: '5px 0 0 0', color: 'white', opacity: 0.9 }}>
              Build intelligent systems and predictive models
            </p>
          </div>

          <div className="cards-grid">
            {learningPath.machineLearning.map((topic, index) => (
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
              Scale your skills to production-level data science
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