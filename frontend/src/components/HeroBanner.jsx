import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function HeroBanner({ postCount }) {
  const { user } = useAuth();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const hour = time.getHours();
  const greeting = hour < 12 ? '🌅 Good morning' : hour < 17 ? '☀️ Good afternoon' : '🌙 Good evening';

  return (
    <div className="hero-banner">
      <div className="hero-content">
        <div>
          <p className="hero-greeting">{greeting}, <strong>{user?.name?.split(' ')[0]}</strong></p>
          <p className="hero-sub">What's happening in your world today?</p>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-num">{postCount}</span>
            <span className="hero-stat-label">Posts</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="hero-stat-num">🌐</span>
            <span className="hero-stat-label">Public Feed</span>
          </div>
        </div>
      </div>
      <div className="hero-blob hero-blob-1" />
      <div className="hero-blob hero-blob-2" />
    </div>
  );
}
