import React from 'react';

const COLORS = [
  '#1D6AFF', '#10B981', '#F59E0B', '#EF4444',
  '#8B5CF6', '#EC4899', '#06B6D4', '#F97316',
];

// Deterministic color from name string
const getColor = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
};

const getInitials = (name = '') =>
  name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

export default function Avatar({ src, name = '', size = 48 }) {
  const style = { width: size, height: size, borderRadius: '50%', objectFit: 'cover' };

  if (src) {
    return <img src={src} alt={name} style={style} />;
  }

  return (
    <div
      style={{
        ...style,
        background: getColor(name),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        fontWeight: 700,
        fontSize: size * 0.36,
        flexShrink: 0,
      }}
    >
      {getInitials(name)}
    </div>
  );
}
