import React from 'react';
import { GITHUB_URL } from '../config';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 w-full max-w-[80rem] mx-auto px-margin md:px-margin-desktop flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-xl">hub</span>
          </div>
          <span className="text-primary font-headline-lg text-xl font-bold tracking-tight select-none">
            Re:Learn <span className="text-secondary font-medium text-sm px-2 py-0.5 rounded-full bg-surface-container-high ml-1 border border-outline-variant/30">Tutor</span>
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-on-surface-variant">
          <a className="hover:text-on-surface transition-all flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high" href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo(0,0); }}>
            <span className="material-symbols-outlined text-sm">info</span><span>About</span>
          </a>
          <a className="hover:text-on-surface transition-all flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            <span className="material-symbols-outlined text-sm">code</span><span>GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
};
