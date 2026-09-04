import React from 'react';

const PLATFORM_COLORS = {
  twitter: 'var(--accent-twitter)',
  instagram: 'var(--accent-instagram-2)',
  total: 'var(--accent-pulse)',
};

export default function MetricCard({ platform, label, value, delta, formatValue }) {
  const color = PLATFORM_COLORS[platform] || 'var(--accent-pulse)';
  const isUp = delta >= 0;

  return (
    <div className="metric-card">
      <div className="platform-tag">
        <span className="swatch" style={{ background: color }} />
        {platform}
      </div>
      <div className="value">{formatValue ? formatValue(value) : value?.toLocaleString?.() ?? value}</div>
      <div className="label">{label}</div>
      {delta !== undefined && (
        <div className={`delta ${isUp ? 'up' : 'down'}`}>
          {isUp ? '▲' : '▼'} {Math.abs(delta)}% vs last period
        </div>
      )}
    </div>
  );
}
