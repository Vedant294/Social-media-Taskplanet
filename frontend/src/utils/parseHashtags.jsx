import React from 'react';

/**
 * Converts #hashtags in text to blue styled spans
 */
export const parseHashtags = (text) => {
  if (!text) return null;
  const parts = text.split(/(#\w+)/g);
  return parts.map((part, i) =>
    part.startsWith('#')
      ? <span key={i} className="hashtag">{part}</span>
      : part
  );
};
