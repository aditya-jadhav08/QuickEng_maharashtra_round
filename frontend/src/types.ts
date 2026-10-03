export interface DiagnosisResult {
  label: string;
  label_name: string;
  confidence: number;
  evidence: string;
  evidence_verified: boolean;
  reasoning: string;
  alternative: string;
  needs_clarification: boolean;
  attempt_id?: string;
  // Included directly in our backend endpoint even though not in prompt
  hint?: string;
  follow_up_question?: string;
}

export interface HintLevel {
  level: number;
  title: string;
  text: string;
}

export interface ResolveResult {
  resolved: boolean;
  feedback: string;
}
