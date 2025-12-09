import { generateRoadmapPDF } from './PdfGenerator';
import './app.css';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { detailedRoadmaps, defaultDetailedRoadmap  } from './RoadmapData'; 

export default function RoadmapResult() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [isDownloading, setIsDownloading] = useState(false);

  // Add this state after the existing useState (around line 8)
const [completedWeeks, setCompletedWeeks] = useState(new Set());


// Use filteredPhases instead of roadmap.phases in your map function
  
  const selections = {
    field: searchParams.get('field'),
    role: searchParams.get('role'),
    language: searchParams.get('language')
  };

  // Hyper-specific roadmap generator
  const generateDetailedRoadmap = () => {
    const { field, role, language } = selections;
    

    return detailedRoadmaps[field]?.[role]?.[language] || defaultDetailedRoadmap;
  };

  const roadmap = generateDetailedRoadmap();

  const toggleWeekCompletion = (phaseIndex, weekIndex) => {
    const weekId = `${phaseIndex}-${weekIndex}`;
    setCompletedWeeks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(weekId)) {
        newSet.delete(weekId);
      } else {
        newSet.add(weekId);
      }
      return newSet;
    });
  };



  const getLabel = (category, value) => {
    const options = {
      field: { web: 'Web Development', mobile: 'Mobile Development', data: 'Data Science', ai: 'AI/ML', devops: 'DevOps', game: 'Game Development' },
      role: { frontend: 'Frontend Developer', backend: 'Backend Developer', fullstack: 'Fullstack Developer', 'data-scientist': 'Data Scientist', 'devops-engineer': 'DevOps Engineer', 'mobile-developer': 'Mobile Developer' },
      language: { javascript: 'JavaScript', python: 'Python', java: 'Java', csharp: 'C#', php: 'PHP', ruby: 'Ruby', go: 'Go', rust: 'Rust' }
    };
    
    return options[category]?.[value] || value;
  };

  const downloadRoadmap = async () => {
    setIsDownloading(true);
    
    try {
      await generateRoadmapPDF(roadmap, selections, getLabel);
    } catch (error) {
      console.error('Download error:', error);
      alert('Error generating roadmap. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="wrap">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">AlgoRythm</Link>
          <nav className="nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/roadmap-filter" className="nav-link">Learn</Link>
            <Link to="/projects" className="nav-link">Projects</Link>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎯</div>
          <h1>{roadmap.title}</h1>
          <p>Your hyper-specific learning path to become a {getLabel('role', selections.role)}</p>
          <div style={{ 
            background: 'var(--card)', 
            padding: '15px', 
            borderRadius: '12px', 
            margin: '20px auto',
            maxWidth: '400px',
            border: '1px solid var(--brand)'
          }}>
            <strong>📅 Timeline:</strong> {roadmap.totalDuration} • <strong>⏰ Weekly:</strong> {roadmap.weeklyHours}
          </div>
        </div>
      </section>

    

      {/* Detailed Roadmap Display */}
      <div style={{ maxWidth: '1000px', margin: '40px auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Comprehensive Learning Plan</h2>
        
        {roadmap?.phases?.map((phase, phaseIndex) => (
          <div key={phaseIndex} style={{ marginBottom: '50px' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, var(--brand), var(--ok))',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '25px',
              textAlign: 'center'
            }}>
              <h2 style={{ margin: 0, color: 'var(--brand-ink)' }}>{phase.phase}</h2>
              <p style={{ margin: '5px 0 0 0', color: 'var(--brand-ink)', opacity: 0.9 }}>
                Duration: {phase.duration}
              </p>
            </div>

            <div style={{ display: 'grid', gap: '25px' }}>
                {phase.weeks.map((week, weekIndex) => {
                  const weekId = `${phaseIndex}-${weekIndex}`;
                  const isCompleted = completedWeeks.has(weekId);
                  
                  return (
                    <div key={weekIndex} className="card" style={{
                      border: isCompleted ? '2px solid var(--ok)' : '1px solid #22263b',
                      opacity: isCompleted ? 0.9 : 1,
                      background: isCompleted ? 'rgba(76, 175, 80, 0.05)' : 'var(--card)'
                    }}>
                      {/* ===== NEW: Progress header with button ===== */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                        <h3 style={{ 
                          color: isCompleted ? 'var(--ok)' : 'var(--brand)', 
                          margin: '0 0 15px 0',
                          flex: 1
                        }}>
                          {isCompleted ? '✅ ' : '📅 '}{week.week}
                        </h3>
                        <button
                          onClick={() => toggleWeekCompletion(phaseIndex, weekIndex)}
                          style={{
                            background: isCompleted ? 'var(--ok)' : 'transparent',
                            border: `1px solid ${isCompleted ? 'var(--ok)' : 'var(--muted)'}`,
                            borderRadius: '8px',
                            padding: '8px 16px',
                            cursor: 'pointer',
                            color: isCompleted ? 'white' : 'var(--muted)',
                            fontSize: '0.9rem',
                            whiteSpace: 'nowrap',
                            marginLeft: '15px'
                          }}
                        >
                          {isCompleted ? 'Completed' : 'Mark Complete'}
                        </button>
                      </div>
                 
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    {/* Topics */}
                    <div>
                      <h4 style={{ color: 'var(--muted)', margin: '0 0 10px 0' }}>📚 Topics to Master</h4>
                      <div style={{ display: 'grid', gap: '8px' }}>
                        {week.topics.map((topic, topicIndex) => (
                          <div key={topicIndex} style={{
                            background: 'var(--bg)',
                            padding: '10px',
                            borderRadius: '8px',
                            border: '1px solid #22263b',
                            fontSize: '0.9rem'
                          }}>
                            • {topic}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Resources */}
                    <div>
                      <h4 style={{ color: 'var(--muted)', margin: '0 0 10px 0' }}>🔗 Recommended Resources</h4>
                      <div style={{ display: 'grid', gap: '8px' }}>
                        {week.resources.map((resource, resourceIndex) => (
                          <div key={resourceIndex} style={{
                            background: 'var(--bg)',
                            padding: '10px',
                            borderRadius: '8px',
                            border: '1px solid #22263b',
                            fontSize: '0.9rem',
                            color: 'var(--brand)'
                          }}>
                            • {resource}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Projects */}
                    <div>
                      <h4 style={{ color: 'var(--muted)', margin: '0 0 10px 0' }}>🛠️ Practice Projects</h4>
                      <div style={{ display: 'grid', gap: '8px' }}>
                        {week.projects.map((project, projectIndex) => (
                          <div key={projectIndex} style={{
                            background: 'var(--bg)',
                            padding: '10px',
                            borderRadius: '8px',
                            border: '1px solid #22263b',
                            fontSize: '0.9rem',
                            color: 'var(--ok)'
                          }}>
                            • {project}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>  
              );
            })}
            </div>
          </div>
        ))}
      </div>

      {/* Download Button */}
      <div style={{ textAlign: 'center', margin: '50px 0' }}>
        <button 
          className="btn primary" 
          style={{ 
            padding: '16px 40px', 
            fontSize: '1.2rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            opacity: isDownloading ? 0.7 : 1
          }}
          onClick={downloadRoadmap}
          disabled={isDownloading}
        >
          {isDownloading ? '⏳ Generating Beautiful PDF...' : '📊 Download PDF Roadmap'}
        </button>
        
        <p style={{ color: 'var(--muted)', marginTop: '15px' }}>
          Professional PDF with weekly breakdowns, resources, and projects
        </p>
      </div>

      {/* Next Steps */}
      <div style={{ textAlign: 'center', margin: '60px 0', padding: '40px', background: 'var(--card)', borderRadius: '20px' }}>
        <h2>Ready to Start Your Journey?</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '30px' }}>
          Begin with Week 1 and track your progress regularly
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/learn" className="btn primary">Start Learning Now</Link>
          <Link to="/projects" className="btn">Practice Projects</Link>
          <Link to="/roadmap-filter" className="btn ghost">Adjust Roadmap</Link>
        </div>
      </div>
    </div>
  );
}