import { useState } from 'react'
import './App.css'

function App() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleAnalyze = async () => {
    if (!code.trim()) return
    setLoading(true)
    setResult(null)

    try {
      // Call the FastAPI backend on port 3000
      const response = await fetch('http://localhost:3000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentCode: code })
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
      <h1>🧠 Misconception Analyzer</h1>
      <p>Paste the code below to identify underlying misconceptions.</p>
      
      <textarea 
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={10} 
        style={{ width: '100%', padding: '1rem', fontFamily: 'monospace', fontSize: '16px', borderRadius: '8px', border: '1px solid #ccc' }}
        placeholder="function add(a, b) {\n  return a - b;\n}"
      />
      
      <button 
        onClick={handleAnalyze} 
        disabled={loading}
        style={{ marginTop: '1rem', padding: '0.8rem 2rem', fontSize: '16px', cursor: 'pointer', backgroundColor: '#646cff', color: 'white', border: 'none', borderRadius: '8px' }}
      >
        {loading ? 'Analyzing...' : 'Analyze Code'}
      </button>

      {result && result.error && (
        <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#991b1b' }}>
          <h3>⚠️ Error</h3>
          <p>{result.error}</p>
        </div>
      )}

      {result && !result.error && (
        <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', color: '#166534' }}>
          <h3>🎯 Identified Misconception:</h3>
          <p><strong>{result.identified_misconception}</strong></p>
          
          <h3 style={{ marginTop: '1rem' }}>💡 Intervention Hint:</h3>
          <p>{result.intervention_hint}</p>
        </div>
      )}
    </div>
  )
}

export default App
