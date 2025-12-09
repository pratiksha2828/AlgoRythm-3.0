import './app.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function DevOpsCloudPath() {
  const [feedbacks, setFeedbacks] = useState([]);

  const learningPath = {
    foundations: [
      {
        title: 'Linux & Shell Basics',
        description: 'Command-line, permissions, processes, and file systems.',
        duration: '1-2 weeks',
        level: 'Beginner',
        resources: [
          { name: 'The Linux Command Line', link: 'https://linuxcommand.org/', type: 'book' },
          { name: 'Bash Manual', link: 'https://www.gnu.org/software/bash/manual/bash.html', type: 'docs' },
          { name: 'Bandit Wargame', link: 'https://overthewire.org/wargames/bandit/', type: 'interactive' }
        ],
        projects: ['Dotfiles Setup', 'Service Logs Triage', 'Backup Script'],
        icon: '🐧'
      },
      {
        title: 'Git & CI Basics',
        description: 'Branching, PRs, CI pipelines and artifacts.',
        duration: '1-2 weeks',
        level: 'Beginner',
        resources: [
          { name: 'Git Docs', link: 'https://git-scm.com/doc', type: 'docs' },
          { name: 'GitHub Actions', link: 'https://docs.github.com/actions', type: 'docs' },
          { name: 'GitLab CI', link: 'https://docs.gitlab.com/ee/ci/', type: 'docs' }
        ],
        projects: ['CI for Node App', 'Release Workflow', 'Semantic Versioning'],
        icon: '🔧'
      }
    ],
    containers: [
      {
        title: 'Docker Essentials',
        description: 'Images, containers, volumes, networks, and Compose.',
        duration: '2 weeks',
        level: 'Intermediate',
        resources: [
          { name: 'Docker Docs', link: 'https://docs.docker.com/', type: 'docs' },
          { name: 'Play with Docker', link: 'https://labs.play-with-docker.com/', type: 'interactive' },
          { name: 'Docker Curriculum', link: 'https://docker-curriculum.com/', type: 'guide' }
        ],
        projects: ['Dockerize App', 'Multi-Container Stack', 'Local Dev Env'],
        icon: '🐳'
      },
      {
        title: 'Kubernetes Fundamentals',
        description: 'Pods, services, deployments, ingress, and Helm.',
        duration: '2-3 weeks',
        level: 'Intermediate',
        resources: [
          { name: 'Kubernetes Docs', link: 'https://kubernetes.io/docs/home/', type: 'docs' },
          { name: 'minikube', link: 'https://minikube.sigs.k8s.io/docs/start/', type: 'guide' },
          { name: 'Helm Docs', link: 'https://helm.sh/docs/', type: 'docs' }
        ],
        projects: ['K8s App Deploy', 'Ingress + TLS', 'Helm Chart'],
        icon: '☸️'
      }
    ],
    cloud: [
      {
        title: 'AWS Core Services',
        description: 'IAM, EC2, S3, VPC, RDS, CloudWatch, basics of architecture.',
        duration: '2-3 weeks',
        level: 'Intermediate',
        resources: [
          { name: 'AWS Docs', link: 'https://docs.aws.amazon.com/', type: 'docs' },
          { name: 'Well-Architected', link: 'https://aws.amazon.com/architecture/well-architected/', type: 'guide' },
          { name: 'IAM Best Practices', link: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html', type: 'guide' }
        ],
        projects: ['VPC + EC2 Setup', 'S3 Static Hosting', 'RDS + App'],
        icon: '☁️'
      },
      {
        title: 'Observability & SRE',
        description: 'Logging, metrics, tracing, SLO/SLIs, incident response.',
        duration: '2 weeks',
        level: 'Intermediate',
        resources: [
          { name: 'Prometheus', link: 'https://prometheus.io/docs/introduction/overview/', type: 'docs' },
          { name: 'Grafana', link: 'https://grafana.com/docs/', type: 'docs' },
          { name: 'OpenTelemetry', link: 'https://opentelemetry.io/docs/', type: 'docs' }
        ],
        projects: ['Dashboards', 'Alerting Rules', 'Runbook'],
        icon: '📈'
      }
    ]
  };

  // Fetch feedbacks from MongoDB for devops section
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/feedback');
        if (response.ok) {
          const data = await response.json();
          // Filter for devops section only
          const devopsFeedbacks = data.filter(feedback => feedback.section === 'devops');
          setFeedbacks(devopsFeedbacks);
        }
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      }
    };

    fetchFeedbacks();
  }, []);

  const Section = ({ title, subtitle, items }) => (
    <div style={{ marginBottom: '50px' }}>
      <div style={{ background: 'transparent', padding: '20px', borderRadius: '12px', marginBottom: '25px', textAlign: 'center' }}>
        <h2 style={{ margin: 0, color: 'white' }}>{title}</h2>
        <p style={{ margin: '5px 0 0 0', color: 'white', opacity: 0.9 }}>{subtitle}</p>
      </div>
      <div className="cards-grid">
        {items.map((topic, index) => (
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
  );

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
        <h1>DevOps & Cloud Path</h1>
        <p>Ship software reliably with CI/CD, containers, Kubernetes, and cloud.</p>
        <div style={{ background: 'var(--card)', padding: '15px', borderRadius: '12px', margin: '20px auto', maxWidth: '600px', border: '1px solid var(--brand)' }}>
          <strong>Total Duration:</strong> 7-10 weeks • <strong>Level:</strong> Beginner to Intermediate • <strong>Goal:</strong> Deploy and operate apps at scale
        </div>
      </section>

      <div style={{ maxWidth: '1000px', margin: '40px auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>DevOps & Cloud Learning Roadmap</h2>
        <Section title="Foundations" subtitle="Linux, Git and CI basics" items={learningPath.foundations} />
        <Section title="Containers & Orchestration" subtitle="Docker, Kubernetes, Helm" items={learningPath.containers} />
        <Section title="Cloud & SRE" subtitle="AWS core, monitoring and reliability" items={learningPath.cloud} />

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