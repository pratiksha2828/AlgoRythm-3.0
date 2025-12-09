import './app.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useMemo, useCallback } from 'react';
import TechnicalAssessment from './TechnicalAssessment';

//--removed level
// Compatibility maps: which roles + languages make sense for each field
const fieldToRoles = {
  web: ['frontend', 'backend', 'fullstack'],
  mobile: ['mobile-developer', 'frontend', 'fullstack'],
  data: ['data-scientist'],
  ai: [ 'ml-engineer'],
  devops: ['devops-engineer', 'backend'],
  cybersecurity: ['security-engineer'],
  blockchain: ['blockchain-dev'],
  game: ['game-developer']
};

// field + role → allowed languages
const fieldRoleToLanguages = {
  web: {
    frontend: ['javascript', 'typescript', 'python', 'java', 'php', 'ruby', 'go'],
    backend: ['javascript', 'typescript', 'python', 'php'],
    fullstack: ['javascript', 'python', 'java']
  },

  mobile: {
    frontend: ['javascript', 'typescript', 'csharp'],
    'mobile-developer': ['javascript', 'typescript', 'csharp','java', 'python'],
    fullstack: ['javascript', 'typescript', 'csharp','java']
  },

  data: {
    'data-scientist': ['python']
  },

  ai: {
    'ml-engineer': ['python']  // added new role support
  },

  devops: {
    'devops-engineer': ['python', 'go', 'c', 'cpp'],
    backend: ['python','go', 'c', 'cpp']
  },

  blockchain: {
    'blockchain-dev': ['solidity', 'go', 'rust']
  },

  cybersecurity: {
    'security-engineer': ['python', 'java']
  },

  game: {
  'game-developer': ['csharp', 'javascript', 'python']
  }
};

export default function RoadmapFilter() {
  const navigate = useNavigate();
  const [selections, setSelections] = useState({
    field: '',
    role: '',
    language: ''
  });
  const [showAssessment, setShowAssessment] = useState(false);

  // Base options (unchanged)
// Replace the current options object (around line 15) with:
const options = {
  
  field: [
    { id: 'web', label: 'Web Development', emoji: '🌐' },
    { id: 'mobile', label: 'Mobile Development', emoji: '📱' },
    { id: 'data', label: 'Data Science', emoji: '📊' },
    { id: 'ai', label: 'AI/ML Engineering', emoji: '🤖' },
    { id: 'devops', label: 'DevOps & Cloud', emoji: '⚙️' },
    { id: 'cybersecurity', label: 'Cyber Security', emoji: '🔒' },
    { id: 'blockchain', label: 'Blockchain', emoji: '⛓️' },
    { id: 'game', label: 'Game Development', emoji: '🎮' }
  ],
  role: [
    { id: 'frontend', label: 'Frontend Developer', emoji: '🎨' },
    { id: 'backend', label: 'Backend Developer', emoji: '🔧' },
    { id: 'fullstack', label: 'Fullstack Developer', emoji: '🌟' },
    { id: 'data-scientist', label: 'Data Scientist', emoji: '🔬' },
    { id: 'ml-engineer', label: 'ML Engineer', emoji: '🧠' },
    { id: 'devops-engineer', label: 'DevOps Engineer', emoji: '🔄' },
    { id: 'mobile-developer', label: 'Mobile Developer', emoji: '📲' },
    { id: 'security-engineer', label: 'Security Engineer', emoji: '🛡️' },
    { id: 'blockchain-dev', label: 'Blockchain Developer', emoji: '🔗' },
    { id: 'game-developer', label: 'Game Developer', emoji: '🕹️' }
  ],
  language: [
    { id: 'javascript', label: 'JavaScript', emoji: '💛' },
    { id: 'python', label: 'Python', emoji: '🐍' },
    { id: 'java', label: 'Java', emoji: '☕' },
    { id: 'csharp', label: 'C#', emoji: '🔷' },
    { id: 'php', label: 'PHP', emoji: '🐘' },
    { id: 'ruby', label: 'Ruby', emoji: '💎' },
    { id: 'go', label: 'Go', emoji: '🐹' },
    { id: 'rust', label: 'Rust', emoji: '🦀' },
    { id: 'solidity', label: 'Solidity', emoji: 'Ξ' },
    { id: 'typescript', label: 'TypeScript', emoji: '🔷' }
  ]
};



  // Helper: determine if role option is allowed for current field
  const isRoleAllowed = useCallback((roleId, currentField) => {
    if (!currentField) return true; // if no field yet, allow all to let user pick order they like
    const allowed = fieldToRoles[currentField] || [];
    return allowed.includes(roleId);
  }, []);

  // Helper: determine if language option is allowed for current field
  const isLanguageAllowed = useCallback((langId, currentField, currentRole) => {
 
  if (!currentRole) return true;

  if (currentRole && !currentField) {
    const validLanguages = Object.values(fieldRoleToLanguages)
      .flatMap(roleMap => roleMap[currentRole] || []);
    return validLanguages.includes(langId);
  }
  
  const allowed = fieldRoleToLanguages[currentField]?.[currentRole] || [];
  return allowed.includes(langId);
}, []);



  const handleSelection = (category, value) => {
    setSelections(prev => {
      // When field changes, we must reset dependent selections (role, language) if incompatible
      if (category === 'field') {
        const nextField = value;
        let nextRole = prev.role;
        let nextLanguage = prev.language;

        if (nextRole && !isRoleAllowed(nextRole, nextField)) nextRole = '';
        if (nextLanguage && !isLanguageAllowed(nextLanguage, nextField)) nextLanguage = '';

        return { ...prev, field: value, role: nextRole, language: nextLanguage };
      }

      // When role changes, maybe reset language if incompatible (rare)
      if (category === 'role') {
        let nextLanguage = prev.language;

        // Reset language if newly chosen role does not support it
        if (nextLanguage && !isLanguageAllowed(nextLanguage, prev.field, value)) {
          nextLanguage = '';
        }

        return { ...prev, role: value, language: nextLanguage };
      }
      // Normal set
      return { ...prev, [category]: value };
    });
  };

  // Button state: generate only enabled when combination is valid (field selects role + language supported)
  const isCombinationValid = useMemo(() => {
    const { field, role, language } = selections;
    if ( !field || !role || !language) return false;

    const roleOk = isRoleAllowed(role, field);
    const langOk = isLanguageAllowed(language, field);

    return roleOk && langOk;
  }, [selections, isRoleAllowed, isLanguageAllowed]);

  const generateRoadmap = () => {
    if (!isCombinationValid) {
      alert('Please choose a valid combination. Make sure selected role & language fit the field.');
      return;
    }
    const queryParams = new URLSearchParams(selections).toString();
    navigate(`/roadmap-result?${queryParams}`);
  };

  const startAssessment = () => {
    if (!isCombinationValid) {
      alert('Please complete valid selections before taking the assessment.');
      return;
    }
    setShowAssessment(true);
  };

  const handleAssessmentComplete = (score, total) => {
    setShowAssessment(false);
    console.log(`Assessment completed! Score: ${score}/${total}`);
  };

  const handleAssessmentClose = () => {
    setShowAssessment(false);
  };

  // When showing assessment, render that component (unchanged)
  if (showAssessment) {
    return (
      <TechnicalAssessment 
        onComplete={handleAssessmentComplete}
        onClose={handleAssessmentClose}
        userSelections={selections}
      />
    );
  }
    const SelectionGuide = ({ selections }) => {
    const getNextStep = () => {
      if (!selections.field) return "Choose your field of interest";
      if (!selections.role) return "Select your desired role";
      if (!selections.language) return "Pick your preferred language";
      return "Ready to generate your roadmap! 🚀";
    };

    return (
      <div style={{
        background: 'var(--card)',
        padding: '15px',
        borderRadius: '10px',
        margin: '20px 0',
        border: '1px solid var(--brand)',
        textAlign: 'center'
      }}>
        <p style={{ margin: 0, color: 'var(--brand)' }}>
          💡 {getNextStep()}
        </p>
      </div>
    );
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
        <h1>Create Your Learning Roadmap</h1>
        <p>Customize your learning path based on your goals and preferences</p>
      </section>

      <SelectionGuide selections={selections} />

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* render each category */}
        {Object.entries(options).map(([category, items]) => (
          <div key={category} className="panel" style={{ margin: '30px 0' }}>
            <h2 style={{ margin: '0 0 20px 0', textTransform: 'capitalize' }}>{category}:</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
              {items.map(item => {
                // Determine disabled status for role/language based on field
                let disabled = false;
                if (category === 'role') {
                  disabled = !isRoleAllowed(item.id, selections.field);
                } else if (category === 'language') {
                   disabled = !isLanguageAllowed(item.id, selections.field, selections.role);
                }
                // visual dimming handled by inline style only
                return (
                  <div
                    key={item.id}
                    className={`opt ${selections[category] === item.id ? 'selected' : ''}`}
                    style={{
                      cursor: disabled ? 'not-allowed' : 'pointer',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      opacity: disabled ? 0.45 : 1,
                      pointerEvents: disabled ? 'none' : 'auto'
                    }}
                    onClick={() => handleSelection(category, item.id)}
                  >
                    <span style={{ fontSize: '1.5rem' }}>{item.emoji}</span>
                    <span>{item.label}</span>
                    {disabled && <small style={{ marginLeft: 'auto', color: '#999' }}>not available</small>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Action buttons */}
        <div style={{ textAlign: 'center', margin: '40px 0' }}>
          <button
            className="btn primary"
            style={{
              padding: '16px 40px',
              fontSize: '1.2rem',
              opacity: isCombinationValid ? 1 : 0.6,
              cursor: isCombinationValid ? 'pointer' : 'not-allowed',
              marginBottom: '10px'
            }}
            onClick={generateRoadmap}
            disabled={!isCombinationValid}
          >
            🚀 Generate Roadmap
          </button>

          <div>
            <button
              className="btn"
              onClick={startAssessment}
              style={{
                padding: '14px 30px',
                fontSize: '1.1rem',
                background: 'var(--ok)',
                border: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '10px',
                opacity: isCombinationValid ? 1 : 0.6,
                cursor: isCombinationValid ? 'pointer' : 'not-allowed'
              }}
              disabled={!isCombinationValid}
            >
              🎯 Take a Quick Fun Assessment First
            </button>
            {!isCombinationValid && (
              <p style={{ color: 'var(--muted)', marginTop: '12px' }}>
                Select level, field, a matching role & language to enable generation.
              </p>
            )}
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Need help choosing?</h4>
            <p style={{ color: 'var(--muted)', margin: '10px 0 0' }}>
              <Link to="/learn" style={{ color: 'var(--brand)' }}>
                Browse all learning paths →
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
