import React from 'react';
import { DiagnosisResult } from '../types';
import { HintCallout } from './HintCallout';

interface DiagnosisCardProps {
  loading: boolean;
  result: DiagnosisResult | null;
}

export const DiagnosisCard: React.FC<DiagnosisCardProps> = ({ loading, result }) => {
  if (loading) {
    return (
      <div className="bg-surface-container rounded-2xl p-space-lg flex flex-col gap-space-md shadow-xl border border-outline-variant/20 animate-pulse" aria-live="polite">
        <div className="h-6 w-1/3 bg-surface-container-high rounded mb-4"></div>
        <div className="h-4 w-full bg-surface-container-high rounded mb-2"></div>
        <div className="h-4 w-5/6 bg-surface-container-high rounded mb-6"></div>
        <div className="h-20 w-full bg-surface-container-lowest rounded-xl mb-4"></div>
        <div className="h-16 w-full bg-surface-container-lowest rounded-xl"></div>
      </div>
    );
  }

  if (!result || result.label === 'NONE' || result.label === 'UNSURE' || result.needs_clarification) {
    return null;
  }

  const confidencePercent = Math.round(result.confidence * 100);
  const certaintyLabel = confidencePercent >= 80 ? 'High Certainty' : (confidencePercent >= 60 ? 'Medium Certainty' : 'Low Certainty');

  const renderReasoning = (text: string) => {
    const parts = text.split(/`([^`]+)`/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <code key={i} className="font-mono text-secondary bg-surface-container-highest px-1 py-0.5 rounded mx-0.5">{part}</code>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="bg-surface-container rounded-2xl p-space-lg flex flex-col gap-space-md shadow-xl border border-outline-variant/20 relative" aria-live="polite">
      {/* Header & Badge */}
      <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-on-surface-variant font-semibold">Identified Diagnostic Pattern</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-primary/20 text-primary border border-primary/30">{result.label}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-on-surface leading-snug">{result.label_name}</h2>
        </div>
      </div>

      {/* Confidence Meter */}
      <div className="bg-surface-container-lowest/80 rounded-xl p-3 border border-outline-variant/20 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-on-surface-variant font-medium flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-primary">verified</span>AI Confidence Assessment
          </span>
          <span className="font-mono font-bold text-primary">{confidencePercent}% ({certaintyLabel})</span>
        </div>
        <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-secondary to-primary" style={{ width: `${confidencePercent}%` }}></div>
        </div>
      </div>

      {/* Evidence Block */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Flagged Code Evidence</span>
        <div className="bg-surface-container-lowest rounded-xl p-3.5 border border-outline-variant/30 flex items-center justify-between overflow-x-auto">
          <code className="font-mono text-sm text-tertiary font-bold tracking-wide">{result.evidence}</code>
          {!result.evidence_verified && (
            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-mono">
              <span className="material-symbols-outlined text-tertiary text-sm">warning</span>
              <span>Evidence could not be matched exactly in your code</span>
            </div>
          )}
        </div>
      </div>

      {/* AI's Reasoning */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">AI Diagnostic Reasoning</span>
        <p className="text-xs sm:text-sm text-on-surface leading-relaxed">
          {renderReasoning(result.reasoning)}
        </p>
      </div>

      {/* Socratic Hint Callout */}
      <HintCallout label={result.label} initialHint={result.hint} />

      {/* Alternative Consideration Footer */}
      {(result.alternative && result.alternative !== 'NONE') && (
        <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant/60 font-mono mt-2">
          <span>Alternative consideration: {result.alternative}</span>
          {result.attempt_id && <span>Diagnostic Trace ID #{result.attempt_id}</span>}
        </div>
      )}
    </div>
  );
};
