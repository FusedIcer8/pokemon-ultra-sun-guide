'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function SpoilerBlock({ children, label = 'Click to reveal spoiler' }: { children: React.ReactNode; label?: string }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div
      className="relative rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 cursor-pointer transition-all"
      onClick={() => setRevealed(!revealed)}
    >
      <div className={revealed ? 'spoiler-revealed' : 'spoiler-hidden'}>
        {children}
      </div>
      {!revealed && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-gray-100/60 dark:bg-gray-900/60">
          <span className="flex items-center gap-2 text-sm font-medium text-gray-500 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
            <Eye size={14} /> {label}
          </span>
        </div>
      )}
      {revealed && (
        <button
          className="absolute top-2 right-2 text-xs text-gray-400 flex items-center gap-1 hover:text-gray-600"
          onClick={(e) => { e.stopPropagation(); setRevealed(false); }}
        >
          <EyeOff size={12} /> Hide
        </button>
      )}
    </div>
  );
}
