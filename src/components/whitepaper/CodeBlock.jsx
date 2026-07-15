import React from 'react';

export default function CodeBlock({ children, label }) {
  return (
    <div className="my-4 rounded-xl overflow-hidden border border-cyan-500/15 bg-black/60">
      {label && (
        <div className="px-4 py-1.5 bg-gray-900/80 border-b border-white/5 text-[11px] text-gray-400 font-mono uppercase tracking-wider">
          {label}
        </div>
      )}
      <pre className="p-4 overflow-x-auto text-[12px] leading-relaxed font-mono text-gray-300 whitespace-pre">
{children}
      </pre>
    </div>
  );
}