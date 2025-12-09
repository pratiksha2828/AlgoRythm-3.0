import './app.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function AIMLPath() {
  const [feedbacks, setFeedbacks] = useState([]);

  const learningPath = {
    foundations: [
      {
        title: "Python for Data & ML",
        description: "NumPy, Pandas, plotting, and data manipulation essentials.",
        duration: "2-3 weeks",
        level: "Beginner",
        resources: [
          { name: "Python Docs", link: "https://docs.python.org/3/", type: "documentation" },
          { name: "NumPy", link: "https://numpy.org/learn/", type: "documentation" },
          { name: "Pandas", link: "https://pandas.pydata.org/docs/", type: "documentation" }
        ],
        projects: ["Exploratory Data Analysis", "Data Cleaning Pipeline", "Visualization Dashboard"],
        icon: "🐍"
      },
      {
        title: "ML Fundamentals",
        description: "Supervised/unsupervised learning, model evaluation, and pipelines.",
        duration: "2-3 weeks",
        level: "Beginner",
        resources: [
          { name: "scikit-learn", link: "https://scikit-learn.org/stable/", type: "documentation" },
          { name: "ML Course", link: "https://www.coursera.org/learn/machine-learning", type: "course" },
          { name: "Bias-Variance", link: "https://scikit-learn.org/stable/auto_examples/model_selection/plot_underfitting_overfitting.html", type: "guide" }
        ],
        projects: ["Iris Classifier", "Spam Detection", "Housing Price Regression"],
        icon: "📈"
      }
    ],
    deep: [
      {
        title: "Neural Networks with TensorFlow",
        description: "Build and train DNNs, CNNs, and RNNs with Keras APIs.",
        duration: "3-4 weeks",
        level: "Intermediate",
        resources: [
          { name: "TensorFlow", link: "https://www.tensorflow.org/", type: "documentation" },
          { name: "Keras", link: "https://keras.io/", type: "documentation" },
          { name: "fast.ai", link: "https://course.fast.ai/", type: "course" }
        ],
        projects: ["Image Classifier", "Sentiment Analysis", "Time Series Forecasting"],
        icon: "🧠"
      },
      {
        title: "NLP and LLMs",
        description: "Tokenization, embeddings, transformers, and prompt engineering.",
        duration: "2-3 weeks",
        level: "Intermediate",
        resources: [
          { name: "Hugging Face", link: "https://huggingface.co/docs", type: "documentation" },
          { name: "Transformers", link: "https://huggingface.co/docs/transformers/index", type: "documentation" },
          { name: "spaCy", link: "https://spacy.io/usage", type: "documentation" }
        ],
        projects: ["Text Classifier", "Q&A Bot", "Summarizer"],
        icon: "💬"
      }
    ],
    deployment: [
      {
        title: "MLOps Basics",
        description: "Experiment tracking, model versioning, and reproducible pipelines.",
        duration: "2 weeks",
        level: "Intermediate",
        resources: [
          { name: "MLflow", link: "https://mlflow.org/docs/latest/index.html", type: "documentation" },
          { name: "DVC", link: "https://dvc.org/doc", type: "documentation" },
          { name: "Kubeflow", link: "https://www.kubeflow.org/docs/started/", type: "documentation" }
        ],
        projects: ["ML Pipeline", "Model Registry", "Reproducible Training"],
        icon: "⚙️"
      },
      {
        title: "Serving & Monitoring",
        description: "Model packaging, REST APIs, and drift monitoring.",
        duration: "2 weeks",
        level: "Intermediate",
        resources: [
          { name: "TensorFlow Serving", link: "https://www.tensorflow.org/tfx/guide/serving", type: "documentation" },
          { name: "FastAPI", link: "https://fastapi.tiangolo.com/", type: "documentation" },
          { name: "Evidently", link: "https://docs.evidentlyai.com/", type: "documentation" }
        ],
        projects: ["ML REST API", "Realtime Inference", "Monitoring Dashboard"],
        icon: "📦"
      }
    ]
  };

  // Fetch feedbacks from MongoDB for ai-ml section
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/feedback');
        if (response.ok) {
          const data = await response.json();
          // Filter for ai-ml section only
          const aiMlFeedbacks = data.filter(feedback => feedback.section === 'ai-ml');
          setFeedbacks(aiMlFeedbacks);
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
        <h1>AI & Machine Learning Path</h1>
        <p>Build data-driven applications, train models, and deploy ML systems.</p>
        <div style={{ background: 'var(--card)', padding: '15px', borderRadius: '12px', margin: '20px auto', maxWidth: '600px', border: '1px solid var(--brand)' }}>
          <strong>Total Duration:</strong> 8-12 weeks • <strong>Level:</strong> Beginner to Intermediate • <strong>Goal:</strong> End-to-end ML project
        </div>
      </section>

      <div style={{ maxWidth: '1000px', margin: '40px auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>AI/ML Learning Roadmap</h2>

        <div style={{ marginBottom: '50px' }}>
          <div style={{ background: 'transparent', padding: '20px', borderRadius: '12px', marginBottom: '25px', textAlign: 'center' }}>
            <h2 style={{ margin: 0, color: 'white' }}>Foundations</h2>
            <p style={{ margin: '5px 0 0 0', color: 'white', opacity: 0.9 }}>Python data stack and ML basics</p>
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
            <h2 style={{ margin: 0, color: 'white' }}>Deep Learning & NLP</h2>
            <p style={{ margin: '5px 0 0 0', color: 'white', opacity: 0.9 }}>Neural nets, transformers, and LLM apps</p>
          </div>
          <div className="cards-grid">
            {learningPath.deep.map((topic, index) => (
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
            <h2 style={{ margin: 0, color: 'white' }}>MLOps & Serving</h2>
            <p style={{ margin: '5px 0 0 0', color: 'white', opacity: 0.9 }}>Pipelines, registries, and monitoring</p>
          </div>
          <div className="cards-grid">
            {learningPath.deployment.map((topic, index) => (
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