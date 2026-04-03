import React from 'react';

const FILTERS = [
  { label: 'All Posts',       value: 'all' },
  { label: 'Most Liked',      value: 'mostLiked' },
  { label: 'Most Commented',  value: 'mostCommented' },
];

export default function FeedFilter({ activeFilter, onFilterChange }) {
  return (
    <div className="feed-filter-row">
      {FILTERS.map(f => (
        <button
          key={f.value}
          className={`filter-tab ${activeFilter === f.value ? 'active' : ''}`}
          onClick={() => onFilterChange(f.value)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
