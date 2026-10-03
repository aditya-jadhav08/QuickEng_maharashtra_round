import React, { useState } from 'react';
import { FEATURES } from '../config';
import { fetchHint } from '../api';

interface HintCalloutProps {
  label: string;
  initialHint?: string;
}

export const HintCallout: React.FC<HintCalloutProps> = ({ label, initialHint }) => {
  const [level, setLevel] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hintText, setHintText] = useState(initialHint || '');
  const [hintTitle, setHintTitle] = useState('The Socratic Hint');

  const handleMoreHelp = async () => {
    if (!FEATURES.hints) return;
    const nextLevel = level + 1;
    if (nextLevel > 3) return;
    
    setLoading(true);
    try {
      const data = await fetchHint(label, nextLevel);
      setHintTitle(data.title);
      setHintText(data.text);
      setLevel(nextLevel);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!hintText && !FEATURES.hints) return null;

  return (
    <div className="bg-surface-container-high/90 border border-primary/30 rounded-xl p-4 flex flex-col gap-3 shadow-md">
      <div className="flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 text-primary">
          <span className="material-symbols-outlined text-xl">lightbulb</span>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1">{hintTitle}</span>
            {FEATURES.hints && level < 3 && (
              <button 
                onClick={handleMoreHelp}
                disabled={loading}
                className="text-[11px] font-mono bg-primary/10 text-primary px-2 py-0.5 rounded hover:bg-primary/20 transition-colors disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'More help'}
              </button>
            )}
          </div>
          <p className="text-xs sm:text-sm text-on-surface leading-relaxed">{hintText}</p>
        </div>
      </div>
    </div>
  );
};
