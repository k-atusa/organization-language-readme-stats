'use client';

import { useState } from 'react';

export default function HomePage() {
  const [org, setOrg] = useState('k-atusa');
  const [excludeLanguages, setExcludeLanguages] = useState('');
  const [copied, setCopied] = useState(false);

  // URL 생성 (제외할 언어가 있으면 쿼리 파라미터 추가)
  const getImageUrl = () => {
    const baseUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${org}`;
    if (excludeLanguages.trim()) {
      const encoded = encodeURIComponent(excludeLanguages.trim());
      return `${baseUrl}?exclude=${encoded}`;
    }
    return baseUrl;
  };

  const imageUrl = getImageUrl();
  const markdownCode = `![Language Stats](${imageUrl})`;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="home-container">
      <div className="home-content">
        <h1>Organization Language Stats</h1>
        <p>Embed language statistics for your GitHub organization in your README!</p>
        
        <div className="input-section">
          <label htmlFor="org-input">GitHub Organization</label>
          <input
            id="org-input"
            type="text"
            value={org}
            onChange={(e) => setOrg(e.target.value)}
            placeholder="organization-name"
          />
        </div>

        <div className="input-section">
          <label htmlFor="exclude-input">Exclude Languages (optional)</label>
          <input
            id="exclude-input"
            type="text"
            value={excludeLanguages}
            onChange={(e) => setExcludeLanguages(e.target.value)}
            placeholder="HTML, CSS, SCSS, Sass"
          />
          <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
            Comma-separated list of languages to exclude from statistics
          </small>
        </div>

        <div className="code-section">
          <h3>Markdown Code</h3>
          <div className="code-box">
            <code>{markdownCode}</code>
            <button onClick={handleCopy} className="copy-btn">
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
