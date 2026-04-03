import React from 'react';

const TRENDING = [
  { tag: '#WebDev',      count: '2.4k posts' },
  { tag: '#ReactJS',     count: '1.8k posts' },
  { tag: '#OpenSource',  count: '1.2k posts' },
  { tag: '#JavaScript',  count: '980 posts'  },
  { tag: '#NodeJS',      count: '760 posts'  },
  { tag: '#MongoDB',     count: '540 posts'  },
];

const SUGGESTIONS = [
  { name: 'Alex Chen',    username: 'alexchen',   initial: 'A', color: '#1D6AFF' },
  { name: 'Sara Malik',   username: 'saramalik',  initial: 'S', color: '#10B981' },
  { name: 'Dev Kumar',    username: 'devkumar',   initial: 'D', color: '#8B5CF6' },
];

export default function TrendingPanel({ onTagClick }) {
  return (
    <div className="trending-panel">
      {/* Trending hashtags */}
      <div className="panel-card">
        <h3 className="panel-title">🔥 Trending</h3>
        <div className="trending-list">
          {TRENDING.map((t, i) => (
            <div
              key={t.tag}
              className="trending-item"
              onClick={() => onTagClick(t.tag)}
            >
              <div className="trending-left">
                <span className="trending-rank">{i + 1}</span>
                <span className="trending-tag">{t.tag}</span>
              </div>
              <span className="trending-count">{t.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Who to follow */}
      <div className="panel-card mt-3">
        <h3 className="panel-title">👥 Who to Follow</h3>
        <div className="suggestions-list">
          {SUGGESTIONS.map(s => (
            <div key={s.username} className="suggestion-item">
              <div
                className="suggestion-avatar"
                style={{ background: s.color }}
              >
                {s.initial}
              </div>
              <div className="suggestion-info">
                <span className="suggestion-name">{s.name}</span>
                <span className="suggestion-username">@{s.username}</span>
              </div>
              <button className="suggestion-follow-btn">Follow</button>
            </div>
          ))}
        </div>
      </div>

      {/* App info */}
      <p className="panel-footer">TaskPlanet · Share your world</p>
    </div>
  );
}
