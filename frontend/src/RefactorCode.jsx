import './RefactorCode.css'; 
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Editor from '@monaco-editor/react';

export default function RefactorCode() {
  const [showInfo, setShowInfo] = useState(false);
  const [code, setCode] = useState('');
  const [refactoredCode, setRefactoredCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [refactoringTips, setRefactoringTips] = useState([]);

  const getMonacoLanguage = (lang) => {
    const mapping = {
      'javascript': 'javascript',
      'python': 'python',
      'java': 'java',
      'c++': 'cpp',
      'c#': 'csharp',
      'typescript': 'typescript',
      'php': 'php',
      'ruby': 'ruby',
      'go': 'go',
      'rust': 'rust',
      'swift': 'swift',
      'kotlin': 'kotlin',
      'html': 'html',
      'css': 'css',
      'sql': 'sql'
    };
    return mapping[lang] || 'plaintext';
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCode(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const refactorCode = async () => {
    if (!code.trim()) return;
    
    setIsLoading(true);
    setRefactoredCode('');
    setRefactoringTips([]);

    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'codellama:7b',
          prompt: `Refactor this ${language} code to make it more efficient, readable, and maintainable. Provide only the refactored code with explanations:\n\n${code}`,
          stream: false,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setRefactoredCode(data.response);
        
        const tipsResponse = await fetch('http://localhost:11434/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'codellama:7b',
            prompt: `List 3-5 specific improvements made in this refactoring of ${language} code. Be concise and focus on best practices:\n\nOriginal:\n${code}\n\nRefactored:\n${data.response}`,
            stream: false,
          }),
        });

        if (tipsResponse.ok) {
          const tipsData = await tipsResponse.json();
          setRefactoringTips(tipsData.response.split('\n').filter(tip => tip.trim()));
        }
      } else {
        throw new Error('Failed to refactor code');
      }
    } catch (error) {
      console.error('Error:', error);
      setRefactoredCode('Error: Could not refactor code. Please make sure Ollama is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadRefactoredCode = () => {
    const element = document.createElement('a');
    const file = new Blob([refactoredCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `refactored-${fileName || 'code'}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const languages = [
    'javascript', 'python', 'java', 'c++', 'c#', 'typescript', 'php', 'ruby',
    'go', 'rust', 'swift', 'kotlin', 'html', 'css', 'sql'
  ];

  return (
    <div className="algorhythm-refactor-wrap">
      {/* Header */}
      <header className="algorhythm-refactor-header">
        <div className="algorhythm-refactor-header-content">
          <Link to="/" className="algorhythm-refactor-logo">AlgoRythm</Link>
          <nav className="algorhythm-refactor-nav">
            <Link to="/" className="algorhythm-refactor-nav-link">Home</Link>
            <Link to="/learn" className="algorhythm-refactor-nav-link">Learn</Link>
            <Link to="/projects" className="algorhythm-refactor-nav-link">Projects</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="algorhythm-refactor-hero">
        <div className="algorhythm-refactor-hero-title">
          <h1> Code Refactoring Assistant</h1>
          <button
            aria-label="Refactor tips"
            onClick={() => setShowInfo(s => !s)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowInfo(s => !s); } }}
            tabIndex={0}
            className="algorhythm-refactor-info-btn"
          >
            <span className="algorhythm-refactor-info-icon">i</span>
          </button>
        </div>

        <p className="algorhythm-refactor-hero-subtitle">Upload your code file and get AI-powered refactoring suggestions to improve code quality, readability, and performance</p>
        
        <div className="algorhythm-refactor-benefits">
          <strong> Benefits:</strong> Cleaner Code • Better Performance • Improved Readability • Best Practices
        </div>
      </section>

      {/* Main Content */}
      <div className="algorhythm-refactor-main-grid">
        
        {/* Input Section */}
        <div className="algorhythm-refactor-input-section">
          <div className="algorhythm-refactor-upload-card">
            <h3 className="algorhythm-refactor-card-title">Upload Your Code</h3>
            
            <div className="algorhythm-refactor-form-group">
              <label className="algorhythm-refactor-form-label">
                Programming Language:
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="algorhythm-refactor-select"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                ))}
              </select>
            </div>

            <div className="algorhythm-refactor-form-group">
              <label className="algorhythm-refactor-form-label">
                Upload File:
              </label>
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".js,.py,.java,.cpp,.cs,.ts,.php,.rb,.go,.rs,.swift,.kt,.html,.css,.sql,.txt"
                className="algorhythm-refactor-file-input"
              />
              {fileName && (
                <p className="algorhythm-refactor-file-name">
                  📄 Selected: {fileName}
                </p>
              )}
            </div>

            <div className="algorhythm-refactor-form-group">
              <label className="algorhythm-refactor-form-label">
                Or Paste Code:
              </label>
              <Editor
                height="300px"
                language={getMonacoLanguage(language)}
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
                className="algorhythm-refactor-monaco-editor"
              />
            </div>

            <button
              onClick={refactorCode}
              disabled={isLoading || !code.trim()}
              className="algorhythm-refactor-primary-btn"
            >
              {isLoading ? '🔄 Refactoring...' : ' Refactor Code'}
            </button>
          </div>

          {/* Tips Section */}
          {refactoringTips.length > 0 && (
            <div className="algorhythm-refactor-tips-card">
              <h3 className="algorhythm-refactor-card-title">📋 Refactoring Improvements</h3>
              <ul className="algorhythm-refactor-tips-list">
                {refactoringTips.map((tip, index) => (
                  <li key={index} className="algorhythm-refactor-tip-item">{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Output Section */}
        <div className="algorhythm-refactor-output-section">
          <div className="algorhythm-refactor-output-card">
            <div className="algorhythm-refactor-output-header">
              <h3 className="algorhythm-refactor-card-title">Refactored Code</h3>
              {refactoredCode && (
                <button onClick={downloadRefactoredCode} className="algorhythm-refactor-download-btn">
                  ⬇️ Download
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="algorhythm-refactor-loading-state">
                <div className="algorhythm-refactor-loading-icon">⚡</div>
                <p>AI is refactoring your code...</p>
                <p className="algorhythm-refactor-loading-subtext">
                  Analyzing patterns, optimizing logic, and applying best practices
                </p>
              </div>
            ) : refactoredCode ? (
              <Editor
                height="400px"
                language={getMonacoLanguage(language)}
                value={refactoredCode}
                theme="vs-dark"
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
                className="algorhythm-refactor-monaco-editor"
              />
            ) : (
              <div className="algorhythm-refactor-empty-state">
                <div className="algorhythm-refactor-empty-icon">📝</div>
                <p>Your refactored code will appear here</p>
                <p className="algorhythm-refactor-empty-subtext">
                  Upload a file or paste code to get AI-powered refactoring suggestions
                </p>
              </div>
            )}
          </div>

          {/* Best Practices */}
          <div className="algorhythm-refactor-practices-card">
            <h3 className="algorhythm-refactor-card-title">🎯 Code Refactoring Best Practices</h3>
            <ul className="algorhythm-refactor-practices-list">
              <li>Keep functions small and focused on single responsibility</li>
              <li>Use meaningful variable and function names</li>
              <li>Remove duplicate code through abstraction</li>
              <li>Simplify complex conditional logic</li>
              <li>Improve error handling and validation</li>
              <li>Optimize algorithms and data structures</li>
              <li>Add proper comments and documentation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="algorhythm-refactor-features">
        <h2 className="algorhythm-refactor-features-title">What Our Refactoring Tool Does</h2>
        <div className="algorhythm-refactor-features-grid">
          {[
            { icon: '🚀', title: 'Performance Optimization', desc: 'Improve code efficiency and speed' },
            { icon: '📖', title: 'Readability Enhancement', desc: 'Make code easier to understand and maintain' },
            { icon: '🔧', title: 'Bug Prevention', desc: 'Identify and fix potential issues' },
            { icon: '🏗️', title: 'Architecture Improvement', desc: 'Better structure and organization' },
            { icon: '📊', title: 'Best Practices', desc: 'Apply industry standards and patterns' },
            { icon: '⚡', title: 'Quick Analysis', desc: 'Instant feedback and suggestions' }
          ].map((feature, index) => (
            <div key={index} className="algorhythm-refactor-feature-card">
              <div className="algorhythm-refactor-feature-icon">{feature.icon}</div>
              <h4 className="algorhythm-refactor-feature-title">{feature.title}</h4>
              <p className="algorhythm-refactor-feature-desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Modal for refactoring tips */}
      {showInfo && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setShowInfo(false)}
          className="algorhythm-refactor-modal-overlay"
        >
          <div onClick={(e) => e.stopPropagation()} className="algorhythm-refactor-modal-content">
            <div className="algorhythm-refactor-modal-header">
              <h3 className="algorhythm-refactor-modal-title">Need help with specific refactoring?</h3>
              <button onClick={() => setShowInfo(false)} aria-label="Close" className="algorhythm-refactor-modal-close">✕</button>
            </div>
            <div className="algorhythm-refactor-modal-body">
              <p className="algorhythm-refactor-modal-text">Try these common improvements:</p>
              <ul className="algorhythm-refactor-modal-list">
                <li>Extract methods from large functions</li>
                <li>Replace magic numbers with constants</li>
                <li>Use proper design patterns</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="algorhythm-refactor-footer">
        <div className="algorhythm-refactor-footer-content">
          <div className="algorhythm-refactor-footer-section">
            {/* Footer intentionally minimal */}
          </div>
        </div>
        
        <div className="algorhythm-refactor-footer-bottom">
          <p>© 2025 AlgoRythm. Transform your code with AI-powered refactoring.</p>
        </div>
      </footer>
    </div>
  );
}