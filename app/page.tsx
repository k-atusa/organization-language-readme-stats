'use client';

import { useState } from 'react';

export default function HomePage() {
  const [org, setOrg] = useState('');
  const [excludeLanguages, setExcludeLanguages] = useState('');
  const [maxLanguages, setMaxLanguages] = useState('');
  const [copied, setCopied] = useState(false);

  // URL 생성 (제외할 언어와 최대 개수가 있으면 쿼리 파라미터 추가)
  const getImageUrl = () => {
    const baseUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${org}`;
    const params = new URLSearchParams();
    
    if (excludeLanguages.trim()) {
      params.append('exclude', excludeLanguages.trim());
    }
    
    if (maxLanguages.trim()) {
      const maxNum = parseInt(maxLanguages.trim());
      if (maxNum > 0) {
        params.append('max', maxNum.toString());
      }
    }
    
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
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
            placeholder="Organization name (e.g., k-atusa)"
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
          <small>
            Comma-separated list of languages to exclude from statistics
          </small>
        </div>

        <div className="input-section">
          <label htmlFor="max-input">Max Languages (optional)</label>
          <input
            id="max-input"
            type="number"
            min="1"
            value={maxLanguages}
            onChange={(e) => setMaxLanguages(e.target.value)}
            placeholder="10"
          />
          <small>
            Maximum number of languages to display. Others will be grouped as &quot;ETC&quot;
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
