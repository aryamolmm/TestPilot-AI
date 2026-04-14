import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LayoutDashboard, History as HistoryIcon, Beaker, Code2, LogOut } from 'lucide-react'

import Login from './components/Login'
import Dashboard from './components/Dashboard'
import TestCasePage from './components/TestCasePage'
import PlaywrightPage from './components/PlaywrightPage'
import History from './components/History'

function App() {
  const [credentials, setCredentials] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard') // dashboard, history, qa, automation
  const [currentStory, setCurrentStory] = useState(null)
  const [historyList, setHistoryList] = useState([])

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('testpilot_history')
    if (saved) setHistoryList(JSON.parse(saved))
  }, [])

  const handleLogin = (creds) => {
    setCredentials(creds)
    setActiveTab('dashboard')
  }

  const handleLogout = () => {
    setCredentials(null)
    setCurrentStory(null)
    setActiveTab('login')
  }

  const goToQA = (story) => {
    setCurrentStory(story)
    setActiveTab('qa')
    
    // Save to history
    const newEntry = {
      story,
      timestamp: new Date().toISOString(),
      engine: credentials.engine
    };
    
    // Check if it already exists, overwrite if so to prevent huge dupes, or just prepend
    setHistoryList(prev => {
      const filtered = prev.filter(p => (p.story.id || p.story.key) !== (story.id || story.key))
      const updated = [newEntry, ...filtered]
      localStorage.setItem('testpilot_history', JSON.stringify(updated))
      return updated
    })
  }

  const goToAutomation = () => setActiveTab('automation')
  const backToDashboard = () => setActiveTab('dashboard')
  const backToQA = () => setActiveTab('qa')

  const viewFromHistory = (story) => {
    setCurrentStory(story)
    setActiveTab('qa')
  }

  if (!credentials) {
    return (
      <div className="app-container">
        <Login onLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', maxWidth: '100vw' }}>
      {/* SIDEBAR NAVIGATION */}
      <motion.aside 
        initial={{ x: -250 }} 
        animate={{ x: 0 }}
        style={{
          width: '260px',
          background: 'rgba(11, 15, 25, 0.95)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          padding: '2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          backdropFilter: 'blur(10px)',
          position: 'fixed',
          top: 0, left: 0, bottom: 0,
          zIndex: 50
        }}
      >
        <div style={{ paddingBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '1.5rem' }}>
          <h2 className="title-gradient-primary" style={{ margin: 0, fontSize: '1.6rem' }}>TestPilot AI</h2>
          <p style={{ color: '#64748b', fontSize: '0.75rem', margin: '0.2rem 0 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Autonomous QA Studio</p>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <SidebarButton 
            active={activeTab === 'dashboard'} 
            icon={<LayoutDashboard size={18} />} 
            label="Engine Config" 
            onClick={() => setActiveTab('dashboard')} 
          />
          <SidebarButton 
            active={activeTab === 'history'} 
            icon={<HistoryIcon size={18} />} 
            label="Generation History" 
            onClick={() => setActiveTab('history')} 
          />
          
          <div style={{ margin: '1.5rem 0 0.5rem', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Active Session</div>
          
          <SidebarButton 
            active={activeTab === 'qa'} 
            disabled={!currentStory}
            icon={<Beaker size={18} />} 
            label="Gherkin Test Cases" 
            onClick={() => currentStory && setActiveTab('qa')} 
          />
          <SidebarButton 
            active={activeTab === 'automation'} 
            disabled={!currentStory}
            icon={<Code2 size={18} />} 
            label="Playwright Scripts" 
            onClick={() => currentStory && setActiveTab('automation')} 
          />
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button onClick={handleLogout} style={{ background: 'transparent', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.1)', padding: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', borderRadius: '10px' }}>
            <LogOut size={16} /> Disconnect Session
          </button>
        </div>
      </motion.aside>

      {/* MAIN CONTENT AREA */}
      <main style={{ marginLeft: '260px', flex: 1, padding: '2rem', maxWidth: 'calc(100% - 260px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          {activeTab === 'dashboard' && (
            <Dashboard 
              credentials={credentials} 
              onUpdateCredentials={setCredentials}
              onLogout={handleLogout} 
              onGoToGenerator={goToQA} 
            />
          )}

          {activeTab === 'history' && (
             <History 
               historyList={historyList} 
               onViewStory={viewFromHistory} 
             />
          )}

          {activeTab === 'qa' && currentStory && (
            <TestCasePage 
              story={currentStory} 
              credentials={credentials}
              onBack={backToDashboard}
              onGoToAutomation={goToAutomation}
            />
          )}

          {activeTab === 'automation' && currentStory && (
            <PlaywrightPage 
              story={currentStory} 
              credentials={credentials}
              onBack={backToQA}
              onGoToDashboard={backToDashboard}
            />
          )}
        </div>
      </main>
    </div>
  )
}

// Helper specific to Sidebar links
const SidebarButton = ({ active, disabled, icon, label, onClick }) => {
  return (
    <button 
      onClick={!disabled ? onClick : null}
      style={{ 
        display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem', 
        background: active ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
        color: active ? '#c084fc' : (disabled ? '#475569' : '#94a3b8'),
        border: '1px solid',
        borderColor: active ? 'rgba(139, 92, 246, 0.3)' : 'transparent',
        borderRadius: '12px',
        boxShadow: 'none',
        fontWeight: active ? 600 : 500,
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        textAlign: 'left'
      }}
      onMouseEnter={(e) => { 
        if(!active && !disabled) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
          e.currentTarget.style.color = 'white'
        }
      }}
      onMouseLeave={(e) => { 
        if(!active && !disabled) {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = '#94a3b8'
        }
      }}
    >
      {icon} {label}
    </button>
  )
}

export default App
