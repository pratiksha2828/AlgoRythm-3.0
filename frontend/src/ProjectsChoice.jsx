import { Link } from 'react-router-dom'

export default function ProjectsChoice() {
  return (
    <div className="wrap">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">AlgoRythm</Link>
          <nav className="nav">
            <Link to="/projects" className="nav-link">Back</Link>
          </nav>
        </div>
      </header>

      <section className="hero">
        <h1>Projects</h1>
        <p>Choose how you want to learn with live projects.</p>
      </section>

      <div className="cards-grid">
        <div className="card">
          <div className="card-icon"><span className="icon-emoji">🔎</span></div>
          <h3>Learn Through Live Projects</h3>
          <p>Paste a GitHub URL or pick from your repositories to analyze with DeepWiki-open.</p>
          <Link to="/projects/learn-projects" className="btn primary card-btn">Start Learning</Link>
        </div>
        <div className="card">
          <div className="card-icon"><span className="icon-emoji">🛠️</span></div>
          <h3>Build Projects</h3>
          <p>Hands-on practice with guided ideas, resources, and step-by-step tasks.</p>
          <Link to="/projects/build-projects" className="btn card-btn">Explore Builds</Link>
        </div>
      </div>
    </div>
  )
}


