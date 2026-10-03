import React from 'react';

export const StatusError: React.FC<{ errorMsg: string, onRetry: () => void }> = ({ errorMsg, onRetry }) => (
  <div className="p-3 rounded-xl bg-error-container/40 border border-error/20 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-on-error-container font-mono gap-2">
    <span>⚠️ {errorMsg}</span>
    <button onClick={onRetry} className="text-[11px] underline cursor-pointer hover:opacity-80">Retry connection</button>
  </div>
);

export const StatusUnsureLeft: React.FC = () => (
  <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/20 flex items-start gap-3">
    <span className="material-symbols-outlined text-tertiary text-lg mt-0.5">help</span>
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-semibold text-on-surface">Unsure Warning State</span>
      <p className="text-xs text-on-surface-variant leading-relaxed">⚠️ We're not sure what went wrong. Can you clarify what you were trying to do?</p>
    </div>
  </div>
);

export const StatusNoneRight: React.FC<{ reasoning: string }> = ({ reasoning }) => (
  <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/30 flex items-start gap-3 text-on-surface shadow-sm">
    <span className="material-symbols-outlined text-primary text-2xl">check_circle</span>
    <div className="flex flex-col gap-1">
      <span className="text-sm font-bold text-primary tracking-wide">Looks correct. No misconception found.</span>
      <p className="text-sm font-medium text-on-surface leading-relaxed">{reasoning}</p>
    </div>
  </div>
);

export const StatusUnsureRight: React.FC = () => (
  <div className="p-space-lg rounded-2xl bg-surface-container border border-outline-variant/20 flex flex-col items-center justify-center gap-3 text-on-surface-variant shadow-sm min-h-[200px]">
    <span className="material-symbols-outlined text-4xl opacity-50">search_off</span>
    <span className="text-sm font-medium">No confident diagnosis</span>
  </div>
);

export const StatusPlaceholder: React.FC = () => (
  <div className="bg-surface-container rounded-2xl p-space-lg border border-outline-variant/20 flex flex-col items-center justify-center min-h-[300px] text-on-surface-variant opacity-60">
    <span className="material-symbols-outlined text-4xl mb-2">science</span>
    <p className="text-sm font-medium">Your diagnosis will appear here</p>
  </div>
);
