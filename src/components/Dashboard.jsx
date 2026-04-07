import { useState, useEffect } from 'react'
import { fetchUserStory } from '../services/jira'

const Dashboard = ({ credentials, onLogout, onGoToGenerator }) => {
  const [story, setStory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const data = await fetchUserStory(
          credentials.baseUrl,
          credentials.email,
          credentials.token,
          credentials.storyId
        )
        setStory(data)
      } catch (err) {
        setError(err.message || 'Failed to fetch the story. Check your ID and API token.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [credentials])

  return (
    <div className="animate-fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 className="title-gradient" style={{ margin: 0 }}>Story Details</h1>
          <p style={{ color: '#94a3b8', margin: '0.5rem 0 0' }}>Connected to {credentials.baseUrl}</p>
        </div>
        <button onClick={onLogout} style={{ width: 'auto', padding: '0.5rem 1rem', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          Disconnect
        </button>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '10vh' }}>
          <div className="spinner" style={{ border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid #6366f1', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
          <p>Connecting to Jira...</p>
        </div>
      ) : error ? (
        <div className="glass-card" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
          <h3 style={{ color: '#ef4444' }}>Connection Error</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: '1rem', width: 'auto' }}>Retry</button>
        </div>
      ) : (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="glass-card">
            <div className={`status-badge ${story.status.toLowerCase().includes('done') ? 'status-done' : story.status.toLowerCase().includes('progress') ? 'status-inprogress' : 'status-todo'}`}>
              {story.status}
            </div>
            <h2 style={{ fontSize: '2.5rem', margin: '1rem 0', letterSpacing: '-1px' }}>{story.summary}</h2>
            
            <div style={{ background: 'rgba(15, 23, 42, 0.3)', padding: '2rem', borderRadius: '16px', margin: '2rem 0' }}>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Full Description</p>
              <div style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#e2e8f0', whiteSpace: 'pre-wrap' }}>
                {story.description}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div>
                <p style={{ color: '#94a3b8', margin: '0 0 0.5rem', fontSize: '0.8rem' }}>Story Key</p>
                <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>{story.id}</p>
              </div>
              <div>
                <p style={{ color: '#94a3b8', margin: '0 0 0.5rem', fontSize: '0.8rem' }}>Priority</p>
                <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>{story.priority}</p>
              </div>
              <div>
                <p style={{ color: '#94a3b8', margin: '0 0 0.5rem', fontSize: '0.8rem' }}>Assignee</p>
                <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>👤 {story.assignee}</p>
              </div>
              <div>
                <p style={{ color: '#94a3b8', margin: '0 0 0.5rem', fontSize: '0.8rem' }}>Reporter</p>
                <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>👮 {story.reporter}</p>
              </div>
            </div>

            <div style={{ marginTop: '4rem', display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => onGoToGenerator(story)} 
                style={{ 
                  flex: 1, 
                  padding: '1.5rem', 
                  fontSize: '1.2rem', 
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  boxShadow: '0 10px 20px -5px rgba(16, 185, 129, 0.3)'
                }}
              >
                Launch Test Case Generator →
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

export default Dashboard
