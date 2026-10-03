import React, { useRef, useState } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  onDiagnose?: () => void;
  placeholder?: string;
  id?: string;
  rows?: number;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, onDiagnose, placeholder, id, rows = 6 }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const lineCount = value.split('\n').length;
  const lines = Array.from({ length: Math.max(1, lineCount) }, (_, i) => i + 1);

  const handleScroll = () => {
    if (gutterRef.current && textareaRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newValue = value.substring(0, start) + '    ' + value.substring(end);
      onChange(newValue);
      
      // Setup cursor position after React re-renders
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      if (onDiagnose) {
        onDiagnose();
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-0.5">
        <label className="text-xs uppercase tracking-wider font-semibold text-on-surface flex items-center gap-2" htmlFor={id}>
          <span className="w-2 h-2 rounded-full bg-primary"></span>
          <span>Student's Code</span>
        </label>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-on-surface-variant/70">python3</span>
          <button 
            type="button"
            onClick={handleCopy}
            className="px-2 py-0.5 rounded bg-surface-container-high text-xs text-on-surface-variant hover:text-on-surface transition-all flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[13px]">{copied ? 'check' : 'content_copy'}</span>
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
      
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden flex font-mono text-xs">
        <div 
          ref={gutterRef}
          className="select-none py-3 px-2.5 text-on-surface-variant/40 flex flex-col text-right bg-surface-container-high/30 border-r border-outline-variant/20 overflow-hidden"
          style={{ minWidth: '2.5rem' }}
        >
          {lines.map(n => <span key={n}>{n}</span>)}
        </div>
        <textarea
          ref={textareaRef}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          spellCheck={false}
          placeholder={placeholder}
          rows={rows}
          className="w-full bg-transparent text-on-surface font-mono text-xs p-3 leading-relaxed focus:outline-none resize-none"
        />
      </div>
    </div>
  );
};
