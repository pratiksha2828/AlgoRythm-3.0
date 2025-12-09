import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import './GithubAnalysis.css';
const LearnProjects = () => {
      const [showInfo, setShowInfo] = useState(false);
const [repoUrl, setRepoUrl] = useState('');
const [loading, setLoading] = useState(false);
const [showResult, setShowResult] = useState(false);
const [showSuccess, setShowSuccess] = useState(false);
const [analysisResult, setAnalysisResult] = useState('');
const [indexingUrl, setIndexingUrl] = useState('');
const [errorMsg, setErrorMsg] = useState('');
const [isIndexed, setIsIndexed] = useState(null);
const [chatbotUrl, setChatbotUrl] = useState('');
// Chat UI moved to dedicated demo page; inline chat state removed

const validateInputs = () => {
if (!repoUrl) {
setErrorMsg('Please enter a GitHub repository URL');
return false;
}
setErrorMsg('');
return true;
};

useEffect(() => {
  if (repoUrl) {
    // Always set to false - user will see explanation and can click to check/index
    setIsIndexed(false);
    // Parse URL to construct DeepWiki URL
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)(?:\/|$)/i);
    if (match) {
      const owner = match[1];
      const repo = match[2].replace(/\.git$/, '');
      setChatbotUrl(`https://deepwiki.com/${owner}/${repo}`);
    }
  } else {
    setIsIndexed(null);
    setChatbotUrl('');
  }
}, [repoUrl]);

const handleBasicAnalysis = async () => {
if (!validateInputs()) return;
setLoading('basic');
setErrorMsg('');
try {
const response = await fetch('http://localhost:5000/api/analyze/basic', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ repoUrl })
});
const result = await response.json();
if (result.status === 'success' || result.status === 'ok') {
setAnalysisResult(result);
setShowResult(true);
} else {
setErrorMsg(result.error || 'Analysis failed.');
}
} catch {
setErrorMsg('Failed to analyze repository. Please try again.');
} finally {
setLoading(false);
}
};


const handleChatbot = async () => {
  if (!validateInputs()) return;

  // Always show the success screen with explanation
  setLoading('chatbot');
  setErrorMsg('');
  setIsIndexed(false);
  
  // Parse the GitHub URL to construct DeepWiki URL
  try {
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)(?:\/|$)/i);
    if (match) {
      const owner = match[1];
      const repo = match[2].replace(/\.git$/, '');
      const deepwikiUrl = `https://deepwiki.com/${owner}/${repo}`;
      
      setShowSuccess(true);
      setIndexingUrl(deepwikiUrl);
      setAnalysisResult({ data: { indexing_url: deepwikiUrl } });
    } else {
      setErrorMsg('Invalid GitHub URL format.');
    }
  } catch (error) {
    console.error('Error:', error);
    setErrorMsg('Failed to process repository URL.');
  } finally {
    setLoading(false);
  }
};

const handleRepoUrlChange = (event) => {
setRepoUrl(event.target.value);
setErrorMsg('');
setIsIndexed(null);
};

// Chat handled on the dedicated deepwiki demo page; local inline responder removed

return (
<>
      <header className="header">
    <div className="header-content">
      <Link to="/" className="logo">AlgoRythm</Link>
      <nav className="nav">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/learn-filter" className="nav-link">Learn</Link>
        <Link to="/projects" className="nav-link">Projects</Link>
        <Link to="/news" className="nav-link">News</Link>
        <Link to="/feedback" className="nav-link">Feedback</Link>
      </nav>
    </div>
  </header>

<div className="github-analysis-container">
<div className="container">
<h1>GitHub Repository Analysis
  <button
    aria-label="Analysis tips"
    onClick={() => setShowInfo(s => !s)}
    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowInfo(s => !s); } }}
    tabIndex={0}
    className="info-btn"
  >
    <span className="info-icon">i</span>
  </button>
</h1>
<p className="subtitle">Get basic insights or AI-powered chatbots with different explanation styles</p>
      
      <div className="step">
<div className="step-title">

<span>Enter Repository URL</span>
</div>

<div className="form-group">
<label htmlFor="repoUrl">GitHub Repository URL</label>
<input
type="text"
id="repoUrl"
placeholder="https://github.com/username/repository"
value={repoUrl}
onChange={handleRepoUrlChange}
/>
</div>

                <div className="button-group">
<button
id="analyzeBtn"
onClick={handleBasicAnalysis}
>
{loading === 'basic' ? 'Analyzing...' : 'Basic Analysis'}
</button>

<button
id="chatbotBtn"
onClick={() => { handleChatbot(); }}
>
{loading === 'chatbot' ? 'Processing...' : 'Repository Chatbot'}
</button>
                </div>

                <div className="analysis-info">
<h4>What each option provides:</h4>
<ul>
<li><strong>Basic Analysis:</strong> Quick insights about repository health, languages, activity, and basic metrics</li>
<li><strong>Repository Chatbot:</strong> AI chatbot for repository questions. If indexed, access immediately; if not, initiate indexing (10-20 mins).</li>
</ul>
</div>

{errorMsg && (
<div className="result" style={{ color: '#f87171' }}>
{errorMsg}
</div>
)}
</div>

{showResult && analysisResult && !showSuccess && (
<div className="basic-analysis-panel">
<h3 className="font-bold text-lg mb-4">Basic Analysis Results</h3>
{analysisResult?.data?.basicAnalysis ? (
(() => {
const b = analysisResult.data.basicAnalysis;
const t = analysisResult.data.technicalInsights || {};
return (
<div style={{ display: 'grid', gap: 12 }}>
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
<div>
<div style={{ marginBottom: 8, color: '#cfe9ff' }}><strong>Description</strong></div>
<div style={{ color: '#dbeafe', whiteSpace: 'pre-wrap', marginBottom: 12 }}>
{b.description || 'No description provided'}
</div>
<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
<div><strong>Primary:</strong> {b.primaryLanguage || 'Unknown'}</div>
<div><strong>Languages:</strong> {(b.languages || []).slice(0,5).join(', ') || '—'}</div>
</div>
<div style={{ marginTop: 12 }}>
<div><strong>Stars:</strong> {b.stars ?? 0}</div>
<div><strong>Forks:</strong> {b.forks ?? 0}</div>
<div><strong>Watchers:</strong> {b.watchers ?? 0}</div>
</div>
</div>
<div>
<div><strong>Size:</strong> {b.size}</div>
<div><strong>Open issues:</strong> {b.openIssues}</div>
<div><strong>Contributors:</strong> {b.contributors}</div>
<div><strong>Created:</strong> {b.createdAt}</div>
<div><strong>Last updated:</strong> {b.lastUpdated} ({b.daysSinceUpdate} days)</div>
<div style={{ marginTop: 8 }}>
<strong>Health:</strong>{' '}
<span className={
b.healthStatus === 'Excellent' ? 'status-excellent' :
b.healthStatus === 'Inactive' ? 'status-inactive' :
b.healthStatus === 'Stale' ? 'status-stale' : 'status-moderate'
}>{b.healthStatus}</span>
</div>
</div>
</div>
<div style={{ display: 'grid', gap: 8 }}>
<div><strong>License:</strong> {b.license}</div>
<div><strong>Default branch:</strong> {t.defaultBranch || '—'}</div>
<div><strong>Total languages:</strong> {t.totalLanguages ?? Object.keys(t.languageDistribution || {}).length}</div>
</div>
<details style={{ marginTop: 12 }}>
      <summary style={{ cursor: 'pointer', color: '#9fb0cf' }}>View raw JSON</summary>
      <pre className="whitespace-pre-wrap" style={{ marginTop: 8 }}>
            {JSON.stringify(analysisResult, null, 2)}
      </pre>
</details>
</div>
);
})()
) : (
<div style={{ color: '#dbeafe' }}>
No basic analysis available. Run Basic Analysis to view parsed results.
</div>
)}
</div>
)}

{showSuccess && analysisResult && (
<div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
<h3 className="font-bold text-lg text-blue-800 mb-4">🚀 Repository Analysis Started!</h3>

            <div className="mb-4 p-4 bg-white rounded border">
<h4 className="font-semibold text-blue-700 mb-2">📋 Instructions:</h4>
<ol className="list-decimal list-inside space-y-2 text-sm">
<li>Your repository has been analyzed</li>
<li>Click below to access our AI chatbot</li>
<li>Use the chatbot to explore your codebase structure and understand dependencies</li>
<li>Download your conversation as PDF anytime</li>
</ol>
</div><div style={{ marginTop: 24, marginBottom: 24, padding: 12, background: '#f0f9ff', borderRadius: 8, border: '1px solid #bae6fd' }}>
<p style={{ margin: 0, color: '#0369a1', fontWeight: 500 }}>
📖 Repository Chatbot Access
</p>
<p style={{ margin: 0, color: '#0369a1', fontSize: '0.9em', marginTop: 6 }}>
<strong>If your repository is indexed:</strong> You can access the chatbot directly to explore your codebase.<br/>
<strong>If not indexed:</strong> You'll be guided to index your repository. Indexing allows the chatbot to understand your repository structure. This process takes 10-20 minutes and only needs to be done once.
</p>
</div>

{indexingUrl && (
<div className="mt-8">
<a
href={indexingUrl}
target="_blank"
rel="noopener noreferrer"
className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
>
🤖 Access AI Chatbot
</a>
<p className="text-sm text-blue-600 mt-2">
Click above to chat with our AI about your repository and download conversations as PDF
</p>
</div>
)}

{/* Inline Chat UI removed. Use the dedicated chatbot page for interactive conversations. */}
<div style={{ marginTop: 12, padding: 12, background: '#f8fafc', borderRadius: 8 }}>
      <div style={{ color: '#0f172a' }}>
            For interactive conversations use the dedicated chatbot page linked above.
      </div>
</div>

{!indexingUrl && (
<div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
<p className="text-yellow-700">
<strong>Note:</strong> Your repository is being processed. The analysis link will be available shortly.
</p>
</div>
)}
</div>
)}
</div>
</div>
{/* Modal for analysis tips */}
{showInfo && (
  <div
    role="dialog"
    aria-modal="true"
    onClick={() => setShowInfo(false)}
    className="modal-overlay"
  >
    <div onClick={(e) => e.stopPropagation()} className="modal-content">
      <div className="modal-header">
        <h3 className="modal-title">GitHub Repository Analysis Tips</h3>
        <button onClick={() => setShowInfo(false)} aria-label="Close" className="modal-close">✕</button>
      </div>
      <div className="modal-body">
        <p className="modal-text">Get the most out of your repository analysis:</p>
        <ul className="modal-list">
          <li><strong>AI Code Explorer:</strong> Interactive chatbot that provides detailed architectural analysis, code explanations, and dependency mapping with comprehensive documentation insights</li>
          <li>Use public repositories for fastest analysis</li>
          <li>Include the full GitHub URL (https://github.com/username/repo)</li>
        </ul>
      </div>
    </div>
  </div>
)}
</>
);
}



export default LearnProjects;