import React from 'react';

interface DemoScenariosProps {
  onSelect: (type: 'print' | 'if' | 'bounds') => void;
  activeScenario: string | null;
}

export const DemoScenarios: React.FC<DemoScenariosProps> = ({ onSelect, activeScenario }) => {
  const getButtonClass = (type: string) => {
    const baseClass = "px-4 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 ";
    if (activeScenario === type) {
      return baseClass + "bg-primary/20 border border-primary/40 text-primary font-semibold shadow-sm";
    }
    return baseClass + "bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface-variant hover:text-on-surface group";
  };

  return (
    <div className="flex flex-col items-center gap-2.5">
      <span className="text-xs uppercase tracking-widest text-on-surface-variant/70 font-mono font-medium">Quick Demo Scenarios</span>
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <button type="button" className={getButtonClass('print')} onClick={() => onSelect('print')}>
          <span className="material-symbols-outlined text-xs text-primary group-hover:scale-110 transition-transform">terminal</span>
          Print vs Return
        </button>
        <button type="button" className={getButtonClass('if')} onClick={() => onSelect('if')}>
          <span className="material-symbols-outlined text-xs text-secondary group-hover:scale-110 transition-transform">equal</span>
          if n = 10
        </button>
        <button type="button" className={getButtonClass('bounds')} onClick={() => onSelect('bounds')}>
          <span className="material-symbols-outlined text-xs text-tertiary group-hover:scale-110 transition-transform">data_array</span>
          Array Boundaries
        </button>
      </div>
    </div>
  );
};
