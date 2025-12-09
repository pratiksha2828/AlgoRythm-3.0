import './app.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function CreateTest() {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('main'); // 'main', 'create', 'join'
  const [testId, setTestId] = useState('');
  const [joinTestId, setJoinTestId] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [validTestIds, setValidTestIds] = useState(new Set());
  
  // Load valid test IDs from localStorage on component mount
  useEffect(() => {
    const savedTestIds = localStorage.getItem('validTestIds');
    if (savedTestIds) {
      try {
        const parsedIds = JSON.parse(savedTestIds);
        setValidTestIds(new Set(parsedIds));
      } catch (error) {
        console.error('Error loading saved test IDs:', error);
      }
    }
  }, []);
  
  // Save valid test IDs to localStorage whenever it changes
  useEffect(() => {
    if (validTestIds.size > 0) {
      localStorage.setItem('validTestIds', JSON.stringify([...validTestIds]));
    }
  }, [validTestIds]);
  
  // State for creating test
  const [questions, setQuestions] = useState({
    easy: '',
    medium: '',
    hard: ''
  });

  // Generate unique test ID
  const generateTestId = () => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substr(2, 5);
    return `${timestamp}-${randomStr}`.toUpperCase();
  };

  // Validate test ID format
  const isValidTestIdFormat = (id) => {
    // Test ID format: TIMESTAMP-RANDOM (e.g., "1A2B3C4D-EFGHI")
    const testIdPattern = /^[A-Z0-9]+-[A-Z0-9]{5}$/;
    return testIdPattern.test(id);
  };

  // Check if test ID exists in valid test IDs
  const isTestIdValid = (id) => {
    return validTestIds.has(id.toUpperCase());
  };

  // Handle input change for question counts
  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestions({ ...questions, [name]: value });
  };

  // Handle Create Test
  const handleCreateTest = () => {
    const totalQuestions = parseInt(questions.easy || 0) + 
                          parseInt(questions.medium || 0) + 
                          parseInt(questions.hard || 0);
    
    if (totalQuestions === 0) {
      alert('Please enter at least one question for any difficulty level.');
      return;
    }

    const newTestId = generateTestId();
    setTestId(newTestId);
    
    // Add the new test ID to valid test IDs
    setValidTestIds(prev => new Set([...prev, newTestId]));

    // Create placeholder questions for Preview
    const placeholders = {
      easy: `// Fix this function to properly calculate the sum of an array\nfunction calculateSum(arr) {\n  let sum = 0;\n  for (let i = 0; i <= arr.length; i++) {\n    sum += arr[i];\n  }\n  return sum;\n}`,
      medium: `// Refactor this function to handle async operations properly\nfunction fetchUserData(userId) {\n  return fetch('/api/users/' + userId)\n    .then(response => response.json())\n    .then(data => {\n      console.log(data);\n      return data;\n    })\n    .catch(error => {\n      console.log('Error:', error);\n    });\n}`,
      hard: `// Optimize this React component for performance and best practices\nclass UserList extends React.Component {\n  constructor(props) {\n    super(props);\n    this.state = { users: [], loading: true };\n  }\n  componentDidMount(){ this.fetchUsers(); }\n  fetchUsers(){\n    fetch('/api/users')\n      .then(res => res.json())\n      .then(users => this.setState({ users, loading: false }));\n  }\n  render(){\n    return this.state.loading ? 'Loading...' : this.state.users.map(u => (\n      <div key={u.id}>\n        <h3>{u.name}</h3>\n        <p>{u.email}</p>\n      </div>\n    ));\n  }\n}`
    };

    const created = [];
    const counts = [
      { key: 'easy', count: parseInt(questions.easy || 0) },
      { key: 'medium', count: parseInt(questions.medium || 0) },
      { key: 'hard', count: parseInt(questions.hard || 0) }
    ];
    counts.forEach(({ key, count }) => {
      for (let i = 0; i < count; i++) {
        created.push({ id: `${key}-${i + 1}`, difficulty: key, prompt: placeholders[key] });
      }
    });
    setGeneratedQuestions(created);
    setCurrentView('testCreated');
  };

  // Handle Join Test
  const handleJoinTest = () => {
    const trimmedId = joinTestId.trim().toUpperCase();
    
    if (!trimmedId) {
      alert('Please enter a Test ID.');
      return;
    }
    
    // Check if the test ID has the correct format
    if (!isValidTestIdFormat(trimmedId)) {
      alert('Invalid Test ID format. Please enter a valid Test ID (e.g., 1A2B3C4D-EFGHI).');
      return;
    }
    
    // Check if the test ID exists in our valid test IDs
    if (!isTestIdValid(trimmedId)) {
      alert('Test ID not found. Please make sure you have the correct Test ID from the test creator.');
      return;
    }
    
    // Navigate to test interface with the validated test ID
    navigate('/test-interface', { state: { testId: trimmedId, mode: 'join' } });
  };

  // Copy test ID to clipboard
  const copyTestId = () => {
    navigator.clipboard.writeText(testId);
    alert('Test ID copied to clipboard!');
  };

  // Reset to main view
  const resetView = () => {
    setCurrentView('main');
    setTestId('');
    setJoinTestId('');
    setQuestions({ easy: '', medium: '', hard: '' });
    setGeneratedQuestions([]);
    setShowPreview(false);
  };

  // Main view with Test button
  if (currentView === 'main') {
    return (
      <div className="wrap" style={{ textAlign: 'center', padding: '50px' }}>
        <h1>Test Center</h1>
        <p>Create your own coding assessment or join an existing test</p>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '30px', 
          marginTop: '50px',
          flexWrap: 'wrap'
        }}>
          <button 
            className="btn primary" 
            onClick={() => setCurrentView('create')}
            style={{ 
              padding: '20px 40px', 
              fontSize: '1.2rem',
              minWidth: '200px'
            }}
          >
            📝 Create Test
          </button>
          
          <button 
            className="btn secondary" 
            onClick={() => setCurrentView('join')}
            style={{ 
              padding: '20px 40px', 
              fontSize: '1.2rem',
              minWidth: '200px'
            }}
          >
            🔗 Join Test
          </button>
        </div>

        <div style={{ marginTop: '40px' }}>
          <Link to="/" className="btn secondary">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Create Test view
  if (currentView === 'create') {
    return (
      <div className="wrap" style={{ textAlign: 'center', padding: '50px' }}>
        <h1>Create New Test</h1>
        <p>Configure your test by selecting the number of questions for each difficulty level:</p>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '30px', 
          marginTop: '40px', 
          flexWrap: 'wrap',
          maxWidth: '800px',
          margin: '40px auto'
        }}>
          {/* Easy Difficulty Card */}
          <div style={{
            background: 'var(--card)',
            padding: '25px',
            borderRadius: '12px',
            border: '2px solid #4CAF50',
            minWidth: '200px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🟢</div>
            <h3 style={{ color: '#4CAF50', marginBottom: '15px' }}>Easy</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Basic concepts, simple algorithms
            </p>
            <input
              type="number"
              name="easy"
              value={questions.easy}
              onChange={handleChange}
              placeholder="0"
              className="input-field"
              min="0"
              max="20"
              style={{ 
                width: '80px', 
                textAlign: 'center',
                fontSize: '1.2rem',
                padding: '10px'
              }}
            />
          </div>

          {/* Medium Difficulty Card */}
          <div style={{
            background: 'var(--card)',
            padding: '25px',
            borderRadius: '12px',
            border: '2px solid #FF9800',
            minWidth: '200px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🟡</div>
            <h3 style={{ color: '#FF9800', marginBottom: '15px' }}>Medium</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Intermediate problems, common patterns
            </p>
            <input
              type="number"
              name="medium"
              value={questions.medium}
              onChange={handleChange}
              placeholder="0"
              className="input-field"
              min="0"
              max="20"
              style={{ 
                width: '80px', 
                textAlign: 'center',
                fontSize: '1.2rem',
                padding: '10px'
              }}
            />
          </div>

          {/* Hard Difficulty Card */}
          <div style={{
            background: 'var(--card)',
            padding: '25px',
            borderRadius: '12px',
            border: '2px solid #f44336',
            minWidth: '200px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: "2rem", marginBottom: '10px' }}>🔴</div>
            <h3 style={{ color: '#f44336', marginBottom: '15px' }}>Hard</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Complex algorithms, optimization challenges
            </p>
            <input
              type="number"
              name="hard"
              value={questions.hard}
              onChange={handleChange}
              placeholder="0"
              className="input-field"
              min="0"
              max="20"
              style={{ 
                width: '80px', 
                textAlign: 'center',
                fontSize: '1.2rem',
                padding: '10px'
              }}
            />
          </div>
        </div>

        {/* Summary */}
        <div style={{
          background: 'var(--card)',
          padding: '20px',
          borderRadius: '12px',
          margin: '30px auto',
          maxWidth: '400px',
          border: '1px solid var(--border)'
        }}>
          <h4>Test Summary</h4>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '15px' }}>
            <div>
              <span style={{ color: '#4CAF50' }}>Easy: {questions.easy || 0}</span>
            </div>
            <div>
              <span style={{ color: '#FF9800' }}>Medium: {questions.medium || 0}</span>
            </div>
            <div>
              <span style={{ color: '#f44336' }}>Hard: {questions.hard || 0}</span>
            </div>
          </div>
          <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid var(--border)' }}>
            <strong>Total Questions: {parseInt(questions.easy || 0) + parseInt(questions.medium || 0) + parseInt(questions.hard || 0)}</strong>
          </div>
        </div>

        <div style={{ marginTop: '30px' }}>
          <button className="btn primary" onClick={handleCreateTest} style={{ padding: '15px 30px', fontSize: '1.1rem' }}>
            🚀 Generate Test
          </button>
        </div>

        <div style={{ marginTop: '20px' }}>
          <button className="btn secondary" onClick={resetView}>
            ← Back to Test Center
          </button>
        </div>
      </div>
    );
  }

  // Join Test view
  if (currentView === 'join') {
    return (
      <div className="wrap" style={{ textAlign: 'center', padding: '50px' }}>
        <h1>Join Existing Test</h1>
        <p>Enter the Test ID provided by the test creator to join their assessment</p>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '10px' }}>
          Only valid Test IDs from created tests can be used to join.
        </p>

        <div style={{
          background: 'var(--card)',
          padding: '30px',
          borderRadius: '12px',
          margin: '40px auto',
          maxWidth: '500px',
          border: '1px solid var(--border)'
        }}>
          <h3 style={{ marginBottom: '20px' }}>Enter Test ID</h3>
          <input
            type="text"
            value={joinTestId}
            onChange={(e) => setJoinTestId(e.target.value.toUpperCase())}
            placeholder="Enter Test ID here (e.g., 1A2B3C4D-EFGHI)"
            className="input-field"
            style={{ 
              width: '100%', 
              padding: '15px',
              fontSize: '1.1rem',
              textAlign: 'center',
              marginBottom: '20px',
              textTransform: 'uppercase'
            }}
          />
          <button 
            className="btn primary" 
            onClick={handleJoinTest}
            style={{ padding: '15px 30px', fontSize: '1.1rem' }}
          >
            🔗 Join Test
          </button>
        </div>

        <div style={{ marginTop: '20px' }}>
          <button className="btn secondary" onClick={resetView}>
            ← Back to Test Center
          </button>
        </div>
      </div>
    );
  }

  // Test Created Success view
  if (currentView === 'testCreated') {
    return (
      <div className="wrap" style={{ textAlign: 'center', padding: '50px' }}>
        <h1>✅ Test Created Successfully!</h1>
        <p>Your test has been generated and is ready for participants to join.</p>

        <div style={{
          background: 'var(--card)',
          padding: '30px',
          borderRadius: '12px',
          margin: '40px auto',
          maxWidth: '600px',
          border: '2px solid #4CAF50'
        }}>
          <h3 style={{ color: '#4CAF50', marginBottom: '20px' }}>Your Test ID</h3>
          <div style={{
            background: '#f5f5f5',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #ddd'
          }}>
            <code style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold',
              color: '#333',
              letterSpacing: '2px'
            }}>
              {testId}
            </code>
          </div>
          <button 
            className="btn secondary" 
            onClick={copyTestId}
            style={{ marginBottom: '20px' }}
          >
            📋 Copy Test ID
          </button>
          
          <div style={{ marginTop: '20px', padding: '15px', background: '#e8f5e8', borderRadius: '8px' }}>
            <p style={{ margin: 0, color: '#2e7d32' }}>
              <strong>Share this Test ID with participants so they can join your test!</strong>
            </p>
          </div>
        </div>

        <div style={{ marginTop: '30px' }}>
          <button 
            className="btn primary" 
            onClick={() => navigate('/test-interface', { state: { testId, mode: 'create' } })}
            style={{ padding: '15px 30px', fontSize: '1.1rem', marginRight: '10px' }}
          >
            🚀 Start Test Now
          </button>
          <button 
            className="btn secondary" 
            onClick={() => setShowPreview(true)}
            style={{ padding: '15px 30px', fontSize: '1.1rem', marginRight: '10px' }}
          >
            👀 Preview
          </button>
          <button className="btn secondary" onClick={resetView}>
            ← Back to Test Center
          </button>
        </div>

        {showPreview && (
          <div 
            role="dialog" 
            aria-modal="true"
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              zIndex: 1000
            }}
          >
            <div style={{
              background: 'var(--card)',
              width: 'min(1000px, 95vw)',
              maxHeight: '85vh',
              overflow: 'auto',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h2 style={{ margin: 0 }}>Preview & Edit Questions</h2>
                <button className="btn secondary" onClick={() => setShowPreview(false)}>✖ Close</button>
              </div>
              <p style={{ color: 'var(--muted)' }}>Review the generated questions. You can edit any question before starting the test.</p>

              {generatedQuestions.length === 0 ? (
                <div style={{ padding: '20px', background: 'var(--bg)', borderRadius: '8px', textAlign: 'center', border: '1px dashed var(--border)' }}>
                  No questions generated.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginTop: '16px' }}>
                  {generatedQuestions.map((q, idx) => (
                    <div key={q.id} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <strong>Q{idx + 1} • {q.difficulty.toUpperCase()}</strong>
                        <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{q.id}</span>
                      </div>
                      <textarea
                        value={q.prompt}
                        onChange={(e) => {
                          const updated = [...generatedQuestions];
                          updated[idx] = { ...q, prompt: e.target.value };
                          setGeneratedQuestions(updated);
                        }}
                        rows="10"
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'monospace', fontSize: '14px' }}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button className="btn secondary" onClick={() => setShowPreview(false)}>Done</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}