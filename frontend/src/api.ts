import { DiagnosisResult, HintLevel, ResolveResult } from './types';

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function diagnoseCode(task: string, code: string): Promise<DiagnosisResult> {
  const response = await fetch(`${VITE_API_URL}/diagnose`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task, code })
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || 'Failed to connect to backend');
  }
  return data;
}

export async function fetchHint(label: string, level: number): Promise<HintLevel> {
  const response = await fetch(`${VITE_API_URL}/hint/${label}?level=${level}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to fetch hint');
  return data;
}

export async function resolveMisconception(task: string, code: string): Promise<ResolveResult> {
  const response = await fetch(`${VITE_API_URL}/resolve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task, code })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to evaluate resolution');
  return data;
}
