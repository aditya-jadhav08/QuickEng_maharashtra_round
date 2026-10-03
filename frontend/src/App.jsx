import { useState } from 'react'
import './App.css'

function App() {
  const [task, setTask] = useState('Write a Python function to check if a number is greater than 100, then print Boiling, if > 50 print Hot, else print Cold.')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleAnalyze = async () => {
    if (!code.trim() || !task.trim()) return
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('http://localhost:3000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: task, studentCode: code })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to analyze code')
      }
      
      setResult(data)
    } catch (error) {
      console.error("Error analyzing code:", error)
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <h1>🧠 Re:Learn Diagnosis Engine</h1>
      <p>Enter the task and the student's code to classify the specific misconception.</p>
      
      <div style={{ marginBottom: '1rem' }}>
        <strong>Task Given to Student:</strong>
        <textarea 
          value={task}
          onChange={(e) => setTask(e.target.value)}
          rows={3} 
          style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem', fontFamily: 'sans-serif', fontSize: '15px', borderRadius: '8px', border: '1px solid #ccc' }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <strong>Student's Code:</strong>
        <textarea 
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={8} 
          style={{ width: '100%', padding: '1rem', marginTop: '0.5rem', fontFamily: 'monospace', fontSize: '16px', borderRadius: '8px', border: '1px solid #ccc' }}
          placeholder="def check_temperature(temp):..."
        />
      </div>
      
      <button 
        onClick={handleAnalyze} 
        disabled={loading}
        style={{ padding: '0.8rem 2rem', fontSize: '16px', cursor: 'pointer', backgroundColor: '#646cff', color: 'white', border: 'none', borderRadius: '8px', width: '100%' }}
      >
        {loading ? 'Running Diagnosis Model...' : 'Diagnose Misconception'}
      </button>

      {result && result.error && (
        <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#991b1b' }}>
          <h3>⚠️ Error</h3>
          <p>{result.error}</p>
        </div>
      )}

      {result && !result.error && (
        <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', color: '#1e3a8a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>🏷️ Label: <strong>{result.label}</strong></h3>
            <span style={{ backgroundColor: '#dbeafe', padding: '4px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
              Confidence: {result.confidence * 100}%
            </span>
          </div>
          
          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>🔍 Evidence (from code):</h4>
          <pre style={{ backgroundColor: '#1e293b', color: '#f8fafc', padding: '1rem', borderRadius: '6px', overflowX: 'auto' }}>
            {result.evidence}
          </pre>
          
          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>🧠 Reasoning:</h4>
          <p style={{ marginTop: 0 }}>{result.reasoning}</p>

          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>🔄 Alternative Consideration:</h4>
          <p style={{ marginTop: 0, fontStyle: 'italic', color: '#475569' }}>{result.alternative}</p>
        </div>
      )}
    </div>
  )
}

export default App
