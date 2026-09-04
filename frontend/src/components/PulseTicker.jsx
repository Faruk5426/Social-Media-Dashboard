import React from 'react';

export default function PulseTicker({ items }) {
  return (
    <div className="pulse-ticker">
      {items.map((item, i) => (
        <div className="pulse-ticker-item" key={i}>
          <span className={`pulse-dot${item.trend === 'down' ? ' negative' : ''}`} />
          <span className="pulse-ticker-label">{item.label}</span>
          <span className={`pulse-ticker-value ${item.trend === 'down' ? 'down' : 'up'}`}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
