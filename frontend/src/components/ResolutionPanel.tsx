import React, { useState, useEffect } from 'react';
import { FEATURES } from '../config';
import { resolveMisconception } from '../api';
import { ResolveResult } from '../types';
import { CodeEditor } from './CodeEditor';

interface ResolutionPanelProps {
  task: string;
  originalCode: string;
  followUpQuestion?: string;
}

export const ResolutionPanel: React.FC<ResolutionPanelProps> = ({ task, originalCode, followUpQuestion }) => {
  const [revisionCode, setRevisionCode] = useState(originalCode);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResolveResult | null>(null);

  // Reset revision code when a new diagnosis arrives
  useEffect(() => {
    setRevisionCode(originalCode);
    setResult(null);
  }, [originalCode]);

  if (!FEATURES.resolution) return null;

  const handleSubmit = async () => {
    if (!revisionCode.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await resolveMisconception(task, revisionCode);
      console.log("Resolution result from backend:", data);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-container rounded-2xl p-space-lg flex flex-col gap-space-md shadow-xl border border-outline-variant/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-lg">history_edu</span>
          <h3 className="text-base font-bold text-on-surface">Resolution Assessment Flow</h3>
        </div>
        <span className="text-xs text-on-surface-variant font-mono px-2 py-0.5 rounded bg-surface-container-high">Interactive Workspace</span>
      </div>

      {followUpQuestion && (
        <div className="p-3.5 rounded-xl bg-surface-container-low border-l-4 border-primary flex flex-col gap-1">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">Follow-Up Question</span>
          <p className="text-xs sm:text-sm text-on-surface font-medium leading-relaxed">{followUpQuestion}</p>
        </div>
      )}

      <CodeEditor 
        id="revision-code-input"
        value={revisionCode}
        onChange={setRevisionCode}
        onDiagnose={handleSubmit}
        rows={5}
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <span className="text-xs text-on-surface-variant flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm text-secondary">autorenew</span>
          Your answer is checked against the same misconception
        </span>
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="w-full sm:w-auto px-7 py-2.5 rounded-xl bg-secondary text-on-secondary font-bold text-xs flex items-center justify-center gap-2 hover:bg-secondary-fixed-dim transition-all shadow-md active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">
          <span className="material-symbols-outlined text-sm">send</span>
          <span>{loading ? 'Verifying...' : 'Submit Revision'}</span>
        </button>
      </div>

      {result && (
        result.resolved === true || 
        result.resolved === 'true' || 
        result.resolved === 'True' || 
        result.Resolved === true || 
        result.Resolved === 'true'
      ) ? (
        <div className="p-3.5 rounded-xl bg-primary/20 border border-primary/40 flex items-center gap-3 text-on-surface shadow-sm">
          <span className="text-xl">🎉</span>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-primary uppercase tracking-wide">Misconception Resolved!</span>
            <p className="text-xs font-medium text-on-surface">Great job! {result.feedback || result.Feedback}</p>
          </div>
        </div>
      ) : result ? (
        <div className="p-3.5 rounded-xl bg-tertiary/20 border border-tertiary/40 flex items-center gap-3 text-on-surface shadow-sm">
          <span className="material-symbols-outlined text-tertiary text-xl">cancel</span>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-tertiary uppercase tracking-wide">Not resolved yet</span>
            <p className="text-xs font-medium text-on-surface">{result.feedback || result.Feedback || 'Keep trying! Re-read the hint above.'}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};
