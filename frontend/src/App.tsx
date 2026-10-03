import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { DemoScenarios } from './components/DemoScenarios';
import { InputPanel } from './components/InputPanel';
import { DiagnosisCard } from './components/DiagnosisCard';
import { ResolutionPanel } from './components/ResolutionPanel';
import { 
  StatusError, 
  StatusUnsureLeft, 
  StatusUnsureRight, 
  StatusNoneRight, 
  StatusPlaceholder 
} from './components/StatusCard';
import { diagnoseCode } from './api';
import { DiagnosisResult } from './types';
import { DEMO_SCENARIOS } from './demoScenarios';

function App() {
  const [task, setTask] = useState('Write a function check_target(n) that returns True if n equals 10, otherwise False.');
  const [code, setCode] = useState('def check_target(n):\n    if n = 10:\n        return True\n    else:\n        return False');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  const handleDiagnose = async () => {
    if (!code.trim() || !task.trim()) {
      setErrorMsg("Task and code are required.");
      return;
    }
    if (code.length > 3000) {
      setErrorMsg("Code is too long (max 3000 chars).");
      return;
    }
    
    setLoading(true);
    setResult(null);
    setErrorMsg('');

    try {
      const data = await diagnoseCode(task, code);
      setResult(data);
    } catch (error: any) {
      setErrorMsg(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectScenario = (type: 'print' | 'if' | 'bounds') => {
    setActiveScenario(type);
    setTask(DEMO_SCENARIOS[type].task);
    setCode(DEMO_SCENARIOS[type].code);
  };

  const isIdle = !loading && !result && !errorMsg;
  const showUnsure = result && (result.needs_clarification || result.label === 'UNSURE');
  const showNone = result && result.label === 'NONE';
  const showResult = result && !showUnsure && !showNone;

  // Decide if we should show the left edge case tray
  const showLeftStatus = errorMsg || showUnsure;

  return (
    <>
      <Header />
      <main className="w-full flex-1 pt-16 bg-surface">
        <div className="w-full max-w-[80rem] mx-auto px-margin md:px-margin-desktop py-space-xl flex flex-col gap-space-xl">
          <Hero />
          
          <DemoScenarios onSelect={handleSelectScenario} activeScenario={activeScenario} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start flex-col-reverse lg:flex-row">
            {/* On mobile, standard flow is input first then results, standard DOM order does this */}
            
            <section className="lg:col-span-5 flex flex-col gap-space-md order-1">
              <InputPanel 
                task={task} setTask={setTask} 
                code={code} setCode={setCode} 
                loading={loading} onDiagnose={handleDiagnose} 
              />

              {showLeftStatus && (
                <div className="flex flex-col gap-space-sm" aria-live="polite">
                  <span className="text-xs uppercase tracking-wider font-mono text-on-surface-variant/60 font-semibold px-1">System Diagnostics & Edge States</span>
                  {showUnsure && <StatusUnsureLeft />}
                  {errorMsg && <StatusError errorMsg={errorMsg} onRetry={handleDiagnose} />}
                </div>
              )}
            </section>

            <section className="lg:col-span-7 flex flex-col gap-space-lg order-2 mt-8 lg:mt-0">
              {isIdle && <StatusPlaceholder />}
              {loading && <DiagnosisCard loading={true} result={null} />}
              {showUnsure && <StatusUnsureRight />}
              {showNone && <StatusNoneRight reasoning={result!.reasoning} />}
              
              {showResult && (
                <>
                  <DiagnosisCard loading={false} result={result} />
                  <ResolutionPanel 
                    task={task} 
                    originalCode={code} 
                    followUpQuestion={result?.follow_up_question} 
                  />
                </>
              )}
            </section>

          </div>
        </div>
      </main>

      <footer className="w-full bg-surface-container-low py-space-lg">
        <div className="w-full max-w-[80rem] mx-auto px-margin md:px-margin-desktop flex items-center justify-center">
          <p className="text-on-surface-variant text-center opacity-70">Re:Learn Adaptive Intelligence © 2026</p>
        </div>
      </footer>
    </>
  );
}

export default App;
