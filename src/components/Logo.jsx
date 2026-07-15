import React from 'react';

const LOGO_URL = 'https://media.base44.com/images/public/69506fa02c99223b93dc5a26/6405fd605_generated_image.png';

export default function Logo({ size = 40, className = '', withGlow = false, showWordmark = false, wordmarkClass = '' }) {
  const glowStyle = withGlow
    ? { filter: 'drop-shadow(0 0 20px rgba(0,217,255,0.5))' }
    : {};

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <img
        src={LOGO_URL}
        alt="Fluxkmail"
        style={{ width: size, height: size, ...glowStyle }}
        className="object-contain"
      />
      {showWordmark && (
        <span className={`font-bold tracking-tight text-white ${wordmarkClass}`} style={{ fontSize: size * 0.45 }}>
          Fluxkmail
        </span>
      )}
    </div>
  );
}