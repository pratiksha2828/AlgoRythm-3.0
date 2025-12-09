import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RepositoriesList = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const repoToken = localStorage.getItem('github_repo_token');
        
        if (!repoToken) {
          navigate('/projects/learn-projects');
          return;
        }

        // Fetch user repositories from GitHub API
        const response = await fetch('https://api.github.com/user/repos?per_page=100&sort=updated', {
          headers: {
            'Authorization': `token ${repoToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch repositories: ${response.status} ${response.statusText}`);
        }

        const reposData = await response.json();
        setRepos(reposData);
      } catch (err) {
        console.error('Error fetching repositories:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, [navigate]);

  if (loading) {
    return (
      <div className="wrap">
        <header className="header">
          <div className="header-content">
            <Link to="/" className="logo">AlgoRythm</Link>
            <nav className="nav">
              <Link to="/projects/learn-projects" className="nav-link">Back</Link>
            </nav>
          </div>
        </header>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your repositories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wrap">
        <header className="header">
          <div className="header-content">
            <Link to="/" className="logo">Algorythm</Link>
            <nav className="nav">
              <Link to="/projects/learn-projects" className="nav-link">Back</Link>
            </nav>
          </div>
        </header>
        <section className="hero">
          <h1>Error Loading Repositories</h1>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/projects/learn-projects')}
            className="btn primary"
          >
            Try Again
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="wrap">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">Algorythm</Link>
          <nav className="nav">
            <Link to="/projects/learn-projects" className="nav-link">Back to Repository Access</Link>
          </nav>
        </div>
      </header>

      <section className="hero">
        <h1>Your GitHub Repositories</h1>
        <p>Select a repository to analyze and learn from</p>
        <div className="repo-count">
          Found {repos.length} repositories for {localStorage.getItem('github_repo_username')}
        </div>
      </section>

      <div className="repos-grid">
        {repos.map(repo => (
          <div key={repo.id} className="repo-card">
            <h3>{repo.name}</h3>
            <p className="repo-description">
              {repo.description || 'No description available'}
            </p>
            <div className="repo-meta">
              <span className="repo-language">{repo.language || 'Not specified'}</span>
              <span className="repo-stars">⭐ {repo.stargazers_count}</span>
              <span className="repo-forks">🍴 {repo.forks_count}</span>
            </div>
            <div className="repo-actions">
              <button 
                className="btn primary"
                onClick={() => alert(`Analyzing repository: ${repo.name}\nThis feature is coming soon!`)}
              >
                Analyze Repository
              </button>
              <a 
                href={repo.html_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn secondary"
              >
                View on GitHub
              </a>
            </div>
          </div>
        ))}
      </div>

      {repos.length === 0 && !loading && (
        <div className="no-repos">
          <h3>No repositories found</h3>
          <p>It seems you don't have any repositories yet, or there was an issue fetching them.</p>
        </div>
      )}
    </div>
  );
};

export default RepositoriesList;