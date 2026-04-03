import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="post-card skeleton-card">
      <div className="d-flex align-items-center gap-3 mb-3">
        <div className="skeleton" style={{ width: 44, height: 44, borderRadius: '50%' }} />
        <div className="flex-grow-1">
          <div className="skeleton mb-2" style={{ height: 14, width: '40%' }} />
          <div className="skeleton" style={{ height: 12, width: '25%' }} />
        </div>
      </div>
      <div className="skeleton mb-2" style={{ height: 14, width: '90%' }} />
      <div className="skeleton mb-2" style={{ height: 14, width: '75%' }} />
      <div className="skeleton mb-3" style={{ height: 14, width: '55%' }} />
      <div className="skeleton mb-3" style={{ height: 180, width: '100%' }} />
      <div className="d-flex gap-3">
        <div className="skeleton" style={{ height: 32, width: 70 }} />
        <div className="skeleton" style={{ height: 32, width: 70 }} />
        <div className="skeleton" style={{ height: 32, width: 70 }} />
      </div>
    </div>
  );
}
