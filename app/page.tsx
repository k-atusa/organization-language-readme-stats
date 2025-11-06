'use client';

import { useState } from 'react';

export default function HomePage() {
  const [org, setOrg] = useState('k-atusa');
  const [copied, setCopied] = useState(false);

  const imageUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${org}`;
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
