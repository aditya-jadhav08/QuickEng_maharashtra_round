import React from 'react';

export const Hero: React.FC = () => {
  return (
    <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-space-sm pt-4">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary font-medium mb-1">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>Misconception Diagnostic Engine
      </div>
      <h1 className="text-headline-lg font-bold text-on-surface tracking-tight leading-tight sm:text-4xl">
        Paste your code and let the AI find the root cause of your mistake.
      </h1>
      <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed max-w-2xl">
        Detect underlying programming mental models, syntactic slips, and logic fallacies with real-time Socratic hints designed to spark conceptual mastery.
      </p>
    </div>
  );
};
