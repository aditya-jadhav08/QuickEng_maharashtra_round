import { useState } from 'react'
import './App.css'

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [task, setTask] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  const handleDiagnose = async () => {
    if (!code.trim() || !task.trim()) {
        setErrorMsg("Task and code are required.");
        return;
    }
    setLoading(true)
    setResult(null)
    setErrorMsg('')

    try {
      const response = await fetch(`${VITE_API_URL}/diagnose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, code })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to diagnose code')
      }
      
      setResult(data)
    } catch (error) {
      setErrorMsg(error.message)
    } finally {
      setLoading(false)
    }
  }

  const loadExample = (type) => {
    if (type === 'print') {
      setTask("Return the sum of two numbers")
      setCode("def add(a, b):\\n    print(a + b)")
    } else if (type === 'if') {
      setTask("Return True if the number is exactly 10")
      setCode("def is_ten(n):\\n    if n = 10:\\n        return True\\n    return False")
    } else if (type === 'correct') {
      setTask("Return the sum of two numbers")
      setCode("def add(a, b):\\n    return a + b")
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      setCode(code.substring(0, start) + "    " + code.substring(end));
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4;
      }, 0);
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <h1>Re:Learn Diagnosis</h1>
      
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '10px' }}>
        <button onClick={() => loadExample('print')}>Example: Print instead of return</button>
        <button onClick={() => loadExample('if')}>Example: if n = 10</button>
        <button onClick={() => loadExample('correct')}>Example: Correct code</button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{display: 'block', fontWeight: 'bold'}}>Task</label>
        <input 
          value={task}
          onChange={(e) => setTask(e.target.value)}
          style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem' }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{display: 'block', fontWeight: 'bold'}}>Student code</label>
        <textarea 
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={8} 
          style={{ width: '100%', padding: '1rem', marginTop: '0.5rem', fontFamily: 'monospace' }}
        />
      </div>
      
      <button 
        onClick={handleDiagnose} 
        disabled={loading}
        style={{ padding: '0.8rem 2rem', cursor: 'pointer' }}
      >
        {loading ? 'Diagnosing...' : 'Diagnose'}
      </button>

      {errorMsg && (
        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#fee2e2', color: '#991b1b' }}>
          {errorMsg}
        </div>
      )}

      {result && (
        <div style={{ marginTop: '2rem' }}>
          {result.needs_clarification ? (
            <div style={{ padding: '1.5rem', backgroundColor: '#fef3c7', border: '1px solid #fde68a' }}>
              <h3>⚠️ We're not sure what went wrong. Can you tell us what you were trying to do?</h3>
            </div>
          ) : result.label === 'NONE' ? (
            <div style={{ padding: '1.5rem', backgroundColor: '#dcfce7', border: '1px solid #bbf7d0' }}>
              <h3>✅ Looks correct</h3>
            </div>
          ) : (
            <div style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <h3>{result.label_name} <span style={{fontSize: '12px', background: '#eee', padding: '2px 6px', borderRadius: '4px'}}>{result.label}</span></h3>
              
              <div style={{ background: '#e2e8f0', height: '8px', borderRadius: '4px', margin: '1rem 0', width: '100%', overflow: 'hidden' }}>
                <div style={{ background: '#3b82f6', height: '100%', width: `${result.confidence * 100}%` }}></div>
              </div>
              <small>Confidence: {Math.round(result.confidence * 100)}%</small>

              <h4 style={{marginTop: '1rem'}}>Evidence:</h4>
              <pre style={{ background: '#f1f5f9', padding: '1rem' }}>{result.evidence}</pre>
              {!result.evidence_verified && <small style={{color: '#d97706'}}>⚠️ Evidence could not be matched exactly</small>}

              <h4 style={{marginTop: '1rem'}}>Reasoning:</h4>
              <p>{result.reasoning}</p>

              {result.alternative !== 'NONE' && (
                <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>
                  Could also be: {result.alternative}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
