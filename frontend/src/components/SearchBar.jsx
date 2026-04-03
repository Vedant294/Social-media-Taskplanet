import React, { useState, useEffect } from 'react';

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState('');

  // 300ms debounce
  useEffect(() => {
    const timer = setTimeout(() => onSearch(value.trim()), 300);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="search-bar-wrapper">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        className="search-input"
        placeholder="Search posts or users..."
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      {value && (
        <button className="search-clear" onClick={() => setValue('')}>✕</button>
      )}
    </div>
  );
}
