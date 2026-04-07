import { useState } from 'react'
import { generateTestCases, convertToCSV } from '../services/generator'

const TestCasePage = ({ story, onBack, onGoToAutomation }) => {
  const [testCases] = useState(() => generateTestCases(story))

  const handleDownload = () => {
    const csvContent = convertToCSV(testCases)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `test_cases_${story.id}.csv`)
    link.click()
  }

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '5rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <button onClick={onBack} style={{ width: 'auto', marginBottom: '1rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem' }}>
            ← Back to Story
          </button>
          <h1 className="title-gradient" style={{ margin: 0 }}>QA Test Suite</h1>
          <p style={{ color: '#94a3b8', margin: '0.5rem 0 0' }}>Comprehensive Scenarios for {story.id}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={onGoToAutomation} style={{ width: 'auto', padding: '1rem 2rem', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', border: '1px solid #6366f1' }}>
            Generate Playwright Automation →
          </button>
          <button onClick={handleDownload} style={{ width: 'auto', padding: '1rem 2rem', background: 'linear-gradient(135deg, #10b981, #059669)', fontSize: '1rem' }}>
            Download CSV Report
          </button>
        </div>
      </header>

      <div className="glass-card" style={{ padding: '0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '1.5rem' }}>Work Key</th>
              <th style={{ padding: '1.5rem' }}>Type</th>
              <th style={{ padding: '1.5rem' }}>Summary</th>
              <th style={{ padding: '1.5rem' }}>Steps</th>
              <th style={{ padding: '1.5rem' }}>Expected Result</th>
            </tr>
          </thead>
          <tbody>
            {testCases.map((tc, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1.5rem', fontWeight: 600, color: '#6366f1' }}>{tc['Work Key']}</td>
                <td style={{ padding: '1.5rem' }}>
                  <span className={`status-badge ${tc['TestCase Type'] === 'Happy Path' ? 'status-done' : 'status-inprogress'}`}>
                    {tc['TestCase Type']}
                  </span>
                </td>
                <td style={{ padding: '1.5rem', fontWeight: 500 }}>{tc.Summary}</td>
                <td style={{ padding: '1.5rem', fontSize: '0.85rem', color: '#94a3b8', whiteSpace: 'pre-wrap' }}>{tc['Step Summary']}</td>
                <td style={{ padding: '1.5rem', fontSize: '0.85rem', color: '#10b981' }}>{tc['Expected Result']}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TestCasePage
