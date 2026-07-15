import React from 'react';
import { Mail } from 'lucide-react';

export default function FluxkmailLogo({ size = 32, className = '' }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 480 480" className="absolute inset-0 w-full h-full" fill="white">
        <path d="M480 240a240 240 0 0 0-240 240 240 240 0 0 0 240-240Z" />
        <path d="M240 0A240 240 0 0 0 0 240 240 240 0 0 0 240 0Z" />
        <path d="M480 240A240 240 0 0 0 240 0a240 240 0 0 0 240 240Z" />
        <path d="M240 480A240 240 0 0 0 0 240a240 240 0 0 0 240 240Z" />
      </svg>
      <Mail className="relative z-10 text-black" style={{ width: size * 0.5, height: size * 0.5 }} />
    </div>
  );
}