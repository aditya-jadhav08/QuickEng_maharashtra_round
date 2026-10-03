import React from 'react';
import { CodeEditor } from './CodeEditor';

interface InputPanelProps {
  task: string;
  setTask: (t: string) => void;
  code: string;
  setCode: (c: string) => void;
  loading: boolean;
  onDiagnose: () => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({ task, setTask, code, setCode, loading, onDiagnose }) => {
  return (
    <div className="bg-surface-container rounded-2xl p-space-lg flex flex-col gap-space-md shadow-xl border border-outline-variant/20">
      <div className="flex flex-col gap-2">
        <label className="text-xs uppercase tracking-wider font-semibold text-on-surface flex items-center justify-between" htmlFor="task-input">
          <span>Task Given to Student</span>
          <span className="text-[11px] font-mono text-on-surface-variant/70 lowercase font-normal">prompt context</span>
        </label>
        <textarea 
          className="w-full bg-surface-container-lowest text-on-surface text-xs font-mono p-3 rounded-xl border border-outline-variant/30 focus:outline-none focus:border-primary transition-all resize-none leading-relaxed" 
          id="task-input" 
          value={task}
          onChange={e => setTask(e.target.value)}
          rows={2} 
        />
      </div>

      <CodeEditor 
        id="student-code-area"
        value={code}
        onChange={setCode}
        onDiagnose={onDiagnose}
      />

      <button 
        type="button"
        onClick={onDiagnose}
        disabled={loading}
        className="w-full py-3.5 px-6 rounded-xl bg-primary text-on-primary font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-fixed-dim transition-all shadow-lg active:scale-95 group disabled:opacity-70 disabled:cursor-not-allowed">
        {loading ? (
          <>
            <span className="material-symbols-outlined text-lg animate-spin">autorenew</span>
            <span>Analyzing AST...</span>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-lg group-hover:rotate-12 transition-transform">psychology</span>
            <span>Diagnose Misconception</span>
          </>
        )}
      </button>
    </div>
  );
};
