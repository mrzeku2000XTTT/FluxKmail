import React from 'react';
import FluxkmailLogo from './FluxkmailLogo';

export default function Logo({ size = 40, className = '', showWordmark = false, wordmarkClass = '' }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <FluxkmailLogo size={size} />
      {showWordmark && (
        <span className={`font-bold tracking-tight text-white ${wordmarkClass}`} style={{ fontSize: size * 0.45 }}>
          Fluxkmail
        </span>
      )}
    </div>
  );
}