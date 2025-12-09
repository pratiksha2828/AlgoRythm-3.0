import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../app.css';
import './Profile.css';
import { milestoneDefs } from '../data/milestones';

export default function Profile() {
  const [username, setUsername] = useState('');
  const [, setBadges] = useState([]);
  const [projectProgress, setProjectProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    totalProjectsStarted: 0,
    totalProjectsCompleted: 0,
    completionRate: 0
  });

  const API_BASE =
    (typeof import.meta !== 'undefined' &&
      import.meta.env &&
      import.meta.env.VITE_API_BASE) ||
    'http://localhost:5000';

  useEffect(() => {
    const stored = sessionStorage.getItem('github_login_username');
    if (stored) setUsername(stored);

    // Fetch real project progress from database
    fetchProjectProgress();
    
    // Build badges from milestone definitions and persisted highest streaks
    const raw = sessionStorage.getItem('highestStreaks');
    let highest = {};
    if (raw) {
      try {
        highest = JSON.parse(raw) || {};
      } catch (err) {
        console.warn('Failed parsing highestStreaks:', err);
        highest = {};
      }
    }

    const hsValues = Object.values(highest).map(v => Number(v || 0));
    const built = milestoneDefs.map((m, idx) => {
      const earned = hsValues.some(x => x >= m.days);
      return {
        id: idx + 1,
        name: m.name,
        label: m.label,
        earned,
        gradient: m.gradient,
        glow: m.glow,
      };
    });
    setBadges(built);
  }, []);

  // Fetch real project progress from database
  const fetchProjectProgress = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/project-progress/me`, {
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to fetch project progress');
      const data = await response.json();

      if (data.progress && data.progress.projects) {
        // Transform database projects to profile format
        const transformedProjects = data.progress.projects.map(project => {
          const progressPercentage = project.steps?.length > 0 
            ? Math.round((project.completedSteps?.length || 0) / project.steps.length * 100)
            : project.completed ? 100 : 0;

          return {
            id: project.projectId,
            name: project.projectTitle,
            progress: progressPercentage,
            status: project.completed ? 'completed' : 
                   (project.completedSteps?.length > 0 ? 'in-progress' : 'not-started'),
            type: getProjectType(project.projectTitle),
            startedAt: project.startedAt,
            completedAt: project.completedAt,
            currentStep: project.currentStep,
            totalSteps: project.steps?.length || 0,
            completedSteps: project.completedSteps?.length || 0
          };
        });

        setProjectProgress(transformedProjects);

        // Calculate user stats
        const totalStarted = data.progress.totalProjectsStarted || transformedProjects.length;
        const totalCompleted = data.progress.totalProjectsCompleted || transformedProjects.filter(p => p.status === 'completed').length;
        const completionRate = totalStarted > 0 ? Math.round((totalCompleted / totalStarted) * 100) : 0;

        setUserStats({
          totalProjectsStarted: totalStarted,
          totalProjectsCompleted: totalCompleted,
          completionRate: completionRate
        });
      }
    } catch (error) {
      console.error('Error fetching project progress:', error);
      // Fallback to mock data if API fails
      const mockProjects = [
        { name: 'Web Development', progress: 75, status: 'in-progress', type: 'Frontend' },
        { name: 'Machine Learning', progress: 30, status: 'in-progress', type: 'AI/ML' },
        { name: 'Mobile App', progress: 100, status: 'completed', type: 'React Native' },
        { name: 'Blockchain', progress: 0, status: 'not-started', type: 'Web3' },
        { name: 'DevOps', progress: 45, status: 'in-progress', type: 'Infrastructure' }
      ];
      setProjectProgress(mockProjects);
      setUserStats({
        totalProjectsStarted: 5,
        totalProjectsCompleted: 1,
        completionRate: 20
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine project type based on title
  const getProjectType = (projectTitle) => {
    const title = projectTitle.toLowerCase();
    if (title.includes('web') || title.includes('portfolio') || title.includes('weather')) return 'Web Development';
    if (title.includes('mobile') || title.includes('app')) return 'Mobile App';
    if (title.includes('game')) return 'Game Development';
    if (title.includes('data') || title.includes('machine') || title.includes('learning')) return 'Data Science';
    if (title.includes('api')) return 'API Development';
    if (title.includes('automation') || title.includes('script')) return 'Automation';
    return 'General Programming';
  };

  // Generate animated stars
  useEffect(() => {
    const starsContainer = document.getElementById('starsContainer');
    if (!starsContainer) return;

    // Clear existing stars
    starsContainer.innerHTML = '';

    // Generate regular twinkling stars
    for (let i = 0; i < 60; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.width = `${Math.random() * 2 + 1}px`;
      star.style.height = star.style.width;
      star.style.animationDuration = `${Math.random() * 3 + 2}s`;
      star.style.animationDelay = `${Math.random() * 3}s`;
      starsContainer.appendChild(star);
    }

    // Generate shooting stars
    for (let i = 0; i < 5; i++) {
      const shootingStar = document.createElement('div');
      shootingStar.className = 'shooting-star';
      shootingStar.style.left = `${Math.random() * 100}%`;
      shootingStar.style.top = `${Math.random() * 50}%`;
      shootingStar.style.animationDuration = `${Math.random() * 2 + 1}s`;
      shootingStar.style.animationDelay = `${Math.random() * 5}s`;
      starsContainer.appendChild(shootingStar);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('github_login_token');
    sessionStorage.removeItem('github_login_username');
    sessionStorage.removeItem('github_login_time');
    sessionStorage.removeItem('highestStreaks');
    sessionStorage.removeItem('user_feedbacks');
    window.location.href = 'http://localhost:5000/auth/logout';
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'not-started': return 'Not Started';
      default: return status;
    }
  };

  // Calculate progress breakdown for the chart
  const getProgressBreakdown = () => {
    const completed = projectProgress.filter(p => p.status === 'completed').length;
    const inProgress = projectProgress.filter(p => p.status === 'in-progress').length;
    const notStarted = projectProgress.filter(p => p.status === 'not-started').length;
    return { completed, inProgress, notStarted };
  };

  // Calculate progress distribution across projects
  const getProgressDistribution = () => {
    const progressRanges = {
      'Starting': 0,      // 0-25%
      'Building': 0,      // 26-50% 
      'Advanced': 0,      // 51-75%
      'Finishing': 0      // 76-100%
    };

    projectProgress.forEach(project => {
      if (project.progress <= 25) progressRanges['Starting']++;
      else if (project.progress <= 50) progressRanges['Building']++;
      else if (project.progress <= 75) progressRanges['Advanced']++;
      else progressRanges['Finishing']++;
    });

    return progressRanges;
  };

  const progressBreakdown = getProgressBreakdown();
  const progressDistribution = getProgressDistribution();
  const distributionValues = Object.values(progressDistribution);
  const maxCount = Math.max(...distributionValues, 1);

  return (
    <div className="wrap">
      <style>
        {`
          @keyframes shooting-star {
            0% {
              transform: translate(0, 0) rotate(-45deg);
              opacity: 1;
            }
            70% {
              opacity: 1;
            }
            100% {
              transform: translate(-300px, 300px) rotate(-45deg);
              opacity: 0;
            }
          }

          @keyframes twinkle {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
          }

          .stars-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
          }

          .star {
            position: absolute;
            background: white;
            border-radius: 50%;
            animation: twinkle linear infinite;
          }

          .shooting-star {
            position: absolute;
            width: 2px;
            height: 2px;
            background: linear-gradient(90deg, #fff, transparent);
            border-radius: 50%;
            animation: shooting-star linear infinite;
          }

          .shooting-star::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 60px;
            height: 2px;
            background: linear-gradient(90deg, rgba(255,255,255,0.8), transparent);
          }

          .shooting-star::after {
            content: '';
            position: absolute;
            top: -1px;
            right: -2px;
            width: 6px;
            height: 6px;
            background: radial-gradient(circle, rgba(255,255,255,1), transparent);
            border-radius: 50%;
          }

          .wrap {
            position: relative;
            z-index: 0;
          }
        `}
      </style>

      {/* Animated Stars Overlay */}
      <div className="stars-overlay" id="starsContainer"></div>
      
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">AlgoRythm</Link>
          <nav className="nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/learn-filter" className="nav-link">Learn</Link>
            <Link to="/projects" className="nav-link">Projects</Link>
            <Link to="/news" className="nav-link">News</Link>
            <Link to="/feedback" className="nav-link">Feedback</Link>
            {username && (
              <div className="user-info">
                <Link to="/profile" className="username">👤 {username}</Link>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Profile Content */}
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <h2>Developer Profile</h2>
          <div className="header-actions">
          
         
          </div>
        </div>

        <section className="profile-content">
          {/* Left Column - Progress Charts */}
          <div className="profile-section">
            <h3>Progress Analytics</h3>
            <p className="charts-description">
              Comprehensive overview of your learning journey and project contributions
            </p>
            
            <div className="charts-grid-main">
              <div className="chart-card">
                <h4>Project Progress Distribution</h4>
                <div className="chart-placeholder-large">
                  <div className="chart-content">
                    {loading ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
                        <div>Loading project data...</div>
                      </div>
                    ) : (
                      <svg viewBox="0 0 400 250" style={{ width: '100%', height: '200px' }}>
                        {/* X Axis */}
                        <line 
                          x1="30" y1="200" x2="370" y2="200" 
                          stroke="rgba(255,255,255,0.3)" 
                          strokeWidth="1"
                        />
                        {/* Y Axis */}
                        <line 
                          x1="30" y1="30" x2="30" y2="200" 
                          stroke="rgba(255,255,255,0.3)" 
                          strokeWidth="1"
                        />
                        
                        {/* Grid Lines */}
                        <line x1="30" y1="160" x2="370" y2="160" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                        <line x1="30" y1="120" x2="370" y2="120" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                        <line x1="30" y1="80" x2="370" y2="80" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                        <line x1="30" y1="40" x2="370" y2="40" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                        
                        {/* X Axis Labels */}
                        <text x="80" y="220" fill="rgba(255,255,255,0.6)" fontSize="10" textAnchor="middle">Starting</text>
                        <text x="160" y="220" fill="rgba(255,255,255,0.6)" fontSize="10" textAnchor="middle">Building</text>
                        <text x="240" y="220" fill="rgba(255,255,255,0.6)" fontSize="10" textAnchor="middle">Advanced</text>
                        <text x="320" y="220" fill="rgba(255,255,255,0.6)" fontSize="10" textAnchor="middle">Finishing</text>
                        
                        {/* Y Axis Labels */}
                        <text x="15" y="40" fill="rgba(255,255,255,0.6)" fontSize="10" textAnchor="end">{maxCount}</text>
                        <text x="15" y="80" fill="rgba(255,255,255,0.6)" fontSize="10" textAnchor="end">{Math.round(maxCount * 0.75)}</text>
                        <text x="15" y="120" fill="rgba(255,255,255,0.6)" fontSize="10" textAnchor="end">{Math.round(maxCount * 0.5)}</text>
                        <text x="15" y="160" fill="rgba(255,255,255,0.6)" fontSize="10" textAnchor="end">{Math.round(maxCount * 0.25)}</text>
                        <text x="15" y="200" fill="rgba(255,255,255,0.6)" fontSize="10" textAnchor="end">0</text>
                        
                        {/* Y Axis Title */}
                        <text x="10" y="10" fill="rgba(255,255,255,0.7)" fontSize="8" textAnchor="middle" transform="rotate(-90,10,10)">Projects</text>
                        
                        {/* Main Line - Using real progress distribution data */}
                        <polyline 
                          points={`80,${200 - (distributionValues[0] / maxCount * 160)} 
                                   160,${200 - (distributionValues[1] / maxCount * 160)} 
                                   240,${200 - (distributionValues[2] / maxCount * 160)} 
                                   320,${200 - (distributionValues[3] / maxCount * 160)}`} 
                          fill="none" 
                          stroke="url(#lineGradient)" 
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        
                        {/* Data Points */}
                        <circle cx="80" cy={200 - (distributionValues[0] / maxCount * 160)} r="4" fill="#2193b0" />
                        <circle cx="160" cy={200 - (distributionValues[1] / maxCount * 160)} r="4" fill="#2193b0" />
                        <circle cx="240" cy={200 - (distributionValues[2] / maxCount * 160)} r="4" fill="#2193b0" />
                        <circle cx="320" cy={200 - (distributionValues[3] / maxCount * 160)} r="4" fill="#2193b0" />
                        
                        {/* Area Fill */}
                        <defs>
                          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6dd5ed" />
                            <stop offset="100%" stopColor="#2193b0" />
                          </linearGradient>
                          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#6dd5ed" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#6dd5ed" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        
                        {/* Area under the line */}
                        <polygon 
                          points={`80,${200 - (distributionValues[0] / maxCount * 160)} 
                                   160,${200 - (distributionValues[1] / maxCount * 160)} 
                                   240,${200 - (distributionValues[2] / maxCount * 160)} 
                                   320,${200 - (distributionValues[3] / maxCount * 160)} 
                                   320,200 80,200`} 
                          fill="url(#areaGradient)" 
                          stroke="none"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              <div className="chart-card">
                <h4>Project Completion Rate</h4>
                <div className="chart-placeholder-large">
                  <div className="chart-content">
                    {loading ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
                        <div>Loading completion data...</div>
                      </div>
                    ) : (
                      <div className="completion-stats">
                        <div className="completion-circle">
                          <div 
                            className="circle-progress" 
                            style={{ 
                              background: `conic-gradient(#a8ff78 0% ${userStats.completionRate}%, #333 ${userStats.completionRate}% 100%)` 
                            }}
                          >
                            <div className="circle-inner">
                              <span>{userStats.completionRate}%</span>
                            </div>
                          </div>
                        </div>
                        <div className="completion-breakdown">
                          <div className="breakdown-item">
                            <span className="dot completed"></span>
                            <span>Completed: {progressBreakdown.completed}</span>
                          </div>
                          <div className="breakdown-item">
                            <span className="dot in-progress"></span>
                            <span>In Progress: {progressBreakdown.inProgress}</span>
                          </div>
                          <div className="breakdown-item">
                            <span className="dot not-started"></span>
                            <span>Not Started: {progressBreakdown.notStarted}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="account-info-compact">
              <h4>Account Information</h4>
              <div className="account-details">
                <div className="account-field">
                  <label>Username:</label>
                  <span>{username || 'Guest'}</span>
                </div>
                <div className="account-field">
                  <label>Member Since:</label>
                  <span>January 2024</span>
                </div>
                <div className="account-field">
                  <label>Projects Started:</label>
                  <span>{userStats.totalProjectsStarted}</span>
                </div>
                <div className="account-field">
                  <label>Projects Completed:</label>
                  <span>{userStats.totalProjectsCompleted}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Progress & Badges */}
          <aside className="progress-section">
            <h3>Learning Progress</h3>

            <div className="progress-item">
              <div className="progress-label">
                <span>Project Completion</span>
                <span>{userStats.completionRate}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${userStats.completionRate}%`,
                    background: 'linear-gradient(90deg, #a8ff78, #78ffd6)'
                  }} 
                />
              </div>
              <div className="progress-percentage">
                {userStats.totalProjectsCompleted} of {userStats.totalProjectsStarted} projects completed
              </div>
            </div>

            {/* Project Types Section */}
            <div className="project-types">
              <h4>Project Progress</h4>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div>Loading projects...</div>
                </div>
              ) : projectProgress.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#bbb' }}>
                  No projects started yet. <Link to="/projects">Start building!</Link>
                </div>
              ) : (
                <div className="project-list">
                  {projectProgress.map((project, index) => (
                    <div key={project.id || index} className="project-item">
                      <div>
                        <div className="project-name">{project.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#bbb' }}>
                          {project.type} • {project.completedSteps}/{project.totalSteps} steps
                        </div>
                      </div>
                      <div className={`project-status ${project.status}`}>
                        {getStatusText(project.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Badges Section */}
        {/* Project Achievements Section */}
<div className="badges-section-compact">
  <h4>Project Achievements</h4>
  <div className="badges-grid-compact">
    {[
      {
        id: 1,
        name: 'First Project',
        icon: '🚀',
        earned: userStats.totalProjectsCompleted >= 1,
        description: 'Complete your first project',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        glow: 'rgba(102, 126, 234, 0.5)'
      },
      {
        id: 2,
        name: 'Project Explorer', 
        icon: '🏆',
        earned: userStats.totalProjectsCompleted >= 3,
        description: 'Complete 3 projects',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        glow: 'rgba(245, 87, 108, 0.5)'
      },
      {
        id: 3,
        name: 'Code Master',
        icon: '👑',
        earned: userStats.totalProjectsCompleted >= 5,
        description: 'Complete 5 projects',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        glow: 'rgba(79, 172, 254, 0.5)'
      },
      {
        id: 4,
        name: 'Web Wizard',
        icon: '🌐',
        earned: projectProgress.some(p => p.type === 'Web Development' && p.status === 'completed'),
        description: 'Complete a web project',
        gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        glow: 'rgba(67, 233, 123, 0.5)'
      },
      {
        id: 5,
        name: 'Mobile Maestro',
        icon: '📱', 
        earned: projectProgress.some(p => p.type === 'Mobile App' && p.status === 'completed'),
        description: 'Complete a mobile app',
        gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        glow: 'rgba(250, 112, 154, 0.5)'
      },
      {
        id: 6,
        name: 'Data Guru',
        icon: '📊',
        earned: projectProgress.some(p => p.type === 'Data Science' && p.status === 'completed'),
        description: 'Complete a data project',
        gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        glow: 'rgba(168, 237, 234, 0.5)'
      },
      {
        id: 7,
        name: 'Completionist',
        icon: '💎',
        earned: userStats.completionRate >= 80,
        description: '80% completion rate',
        gradient: 'linear-gradient(135deg, #cd9cf2 0%, #f6f3ff 100%)',
        glow: 'rgba(205, 156, 242, 0.5)'
      },
      {
        id: 8,
        name: 'Versatile Dev',
        icon: '🎯',
        earned: new Set(projectProgress.map(p => p.type)).size >= 3,
        description: '3 project types',
        gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        glow: 'rgba(252, 182, 159, 0.5)'
      }
    ].map(badge => (
      <div
        key={badge.id}
        className={`badge-card-compact ${badge.earned ? 'earned sparkle' : 'locked'}`}
        style={{
          background: badge.earned ? badge.gradient : 'linear-gradient(135deg, #2a2f3e 0%, #1a1f2e 100%)',
          boxShadow: badge.earned ? 
            `0 8px 25px ${badge.glow}, 0 0 0 1px rgba(255,255,255,0.1)` : 
            '0 4px 12px rgba(0,0,0,0.3)',
          transform: badge.earned ? 'translateY(-2px)' : 'none',
          border: badge.earned ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.1)'
        }}
        title={badge.description}
      >
        <div className="badge-icon" style={{ 
          fontSize: badge.earned ? '1.8rem' : '1.5rem',
          filter: badge.earned ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' : 'grayscale(100%) brightness(0.5)'
        }}>
          {badge.icon}
        </div>
        <div className="badge-name-compact" style={{
          color: badge.earned ? 'white' : '#666',
          fontWeight: badge.earned ? '600' : '400',
          textShadow: badge.earned ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'
        }}>
          {badge.name}
        </div>
        <div className="badge-status" style={{
          background: badge.earned ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
          color: badge.earned ? '#fff' : '#444',
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '0.7rem',
          marginTop: '4px'
        }}>
          {badge.earned ? 'Unlocked!' : 'Locked'}
        </div>
      </div>
    ))}
  </div>
</div>
          </aside>
        </section>
      </div>
    </div>
  );
}