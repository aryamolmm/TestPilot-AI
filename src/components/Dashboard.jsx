import { useState } from 'react'
import { fetchUserStory } from '../services/jira'
import { motion, AnimatePresence } from 'framer-motion'
import { Unplug, Zap, Cpu, SearchCode, Database } from 'lucide-react'

const Dashboard = ({ credentials, onUpdateCredentials, onLogout, onGoToGenerator }) => {
  const [formData, setFormData] = useState({
    type: 'story',
    storyId: '',
    featureDescription: '',
    engine: 'gemini',
    aiKey: credentials.geminiKey || ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (formData.type === 'story' && !formData.storyId) return
    if ((formData.type === 'feature' || formData.type === 'document') && !formData.featureDescription) return
    if (!formData.aiKey) return

    try {
      setLoading(true)
      setError(null)
      
      let story;

      if (formData.type === 'story') {
        // Fetch from Jira
        story = await fetchUserStory(
          credentials.baseUrl,
          credentials.email,
          credentials.token,
          formData.storyId
        )
      } else {
        // Build mock story out of pasted feature description
        story = {
          id: `FT-${Math.floor(1000 + Math.random() * 9000)}`,
          key: 'CUSTOM-FEATURE',
          summary: 'User Authored Feature Specification',
          description: formData.featureDescription,
          status: 'In Progress',
          priority: 'High',
          assignee: 'QA Engineer',
          created: new Date().toLocaleDateString(),
          reporter: 'User'
        }
      }

      onUpdateCredentials({
        ...credentials,
        engine: formData.engine,
        geminiKey: formData.aiKey
      })

      onGoToGenerator(story)
    } catch (err) {
      setError(err.message || 'Failed to fetch the story. Check your configuration.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="animate-fade-in"
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', background: 'rgba(30, 41, 59, 0.4)', padding: '1rem 2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)', padding: '0.6rem', borderRadius: '12px' }}>
            <Database size={24} color="white" />
          </div>
          <div>
            <h1 className="title-gradient" style={{ margin: 0, fontSize: '1.5rem' }}>Engine Configuration</h1>
            <p style={{ color: '#94a3b8', margin: '0.2rem 0 0', fontSize: '0.85rem' }}>{credentials.baseUrl}</p>
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onLogout} 
          style={{ width: 'auto', padding: '0.5rem 1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '10px' }}
        >
          <Unplug size={16} /> Disconnect
        </motion.button>
      </header>

      <div className="glass-card" style={{ maxWidth: '650px', margin: '0 auto', borderTop: '4px solid #6366f1' }}>
        <form onSubmit={handleSubmit}>
          
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexDirection: formData.type === 'story' ? 'row' : 'column' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><SearchCode size={14}/> Node Type</label>
              <select 
                value={formData.type} 
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                style={{ width: '100%', padding: '0.9rem', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', marginTop: '0.5rem', outline: 'none' }}
              >
                <option value="story">Jira User Story</option>
                <option value="feature">Custom Feature Input</option>
                <option value="document">Upload Requirement Doc</option>
              </select>
            </div>
            
            {formData.type === 'story' && (
              <div style={{ flex: 2 }}>
                <label>Target ID</label>
                <input 
                  type="text" 
                  placeholder="e.g. KAN-123" 
                  value={formData.storyId}
                  onChange={(e) => setFormData({...formData, storyId: e.target.value})}
                  required
                  style={{ marginTop: '0.5rem' }}
                />
              </div>
            )}

            {formData.type === 'feature' && (
              <div style={{ flex: 1 }}>
                <label>Feature Description</label>
                <textarea 
                  placeholder="Paste your feature specifications and requirements here to generate autonomous tests..." 
                  value={formData.featureDescription}
                  onChange={(e) => setFormData({...formData, featureDescription: e.target.value})}
                  required
                  style={{ 
                    marginTop: '0.5rem', width: '100%', padding: '0.9rem', borderRadius: '12px', 
                    background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', 
                    color: 'white', outline: 'none', resize: 'vertical', minHeight: '120px', 
                    fontFamily: 'inherit' 
                  }}
                />
              </div>
            )}

            {formData.type === 'document' && (
              <div style={{ flex: 1 }}>
                <label>Upload Document (.txt, .md, .csv)</label>
                <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '12px', padding: '1.5rem', marginTop: '0.5rem', textAlign: 'center' }}>
                  <input 
                    type="file" 
                    accept=".txt,.md,.csv"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (evt) => {
                        setFormData({...formData, featureDescription: evt.target.result});
                      };
                      reader.readAsText(file);
                    }}
                    required
                    style={{ background: 'transparent', border: 'none', padding: 0 }}
                  />
                  {formData.featureDescription && (
                     <p style={{ marginTop: '1rem', color: '#10b981', fontSize: '0.85rem' }}>✅ Document Successfully Loaded ({formData.featureDescription.length} chars)</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div style={{ background: 'linear-gradient(to right bottom, rgba(99, 102, 241, 0.05), rgba(168, 85, 247, 0.05))', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(99, 102, 241, 0.2)', marginBottom: '1.5rem', marginTop: '2rem' }}>
            <label style={{ color: '#818cf8', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu size={16} /> Inference Engine
            </label>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <motion.div whileHover={{ y: -2 }} style={{ flex: 1 }}>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, engine: 'gemini'})}
                  style={{ 
                    background: formData.engine === 'gemini' ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'rgba(255,255,255,0.03)',
                    border: formData.engine === 'gemini' ? '1px solid transparent' : '1px solid rgba(255,255,255,0.1)',
                    fontSize: '0.85rem', padding: '0.8rem', borderRadius: '12px'
                  }}
                >
                  🚀 Google Gemini Pro
                </button>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} style={{ flex: 1 }}>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, engine: 'groq'})}
                  style={{ 
                    background: formData.engine === 'groq' ? 'linear-gradient(135deg, #ea580c, #f97316)' : 'rgba(255,255,255,0.03)',
                    border: formData.engine === 'groq' ? '1px solid transparent' : '1px solid rgba(255,255,255,0.1)',
                    fontSize: '0.85rem', padding: '0.8rem', borderRadius: '12px'
                  }}
                >
                  ⚡ Groq LPU Express
                </button>
              </motion.div>
            </div>

            <label style={{ fontSize: '0.8rem' }}>
              {formData.engine === 'gemini' ? 'Gemini API Key' : 'Groq API Key'}
            </label>
            <input 
              type="password" 
              placeholder={`Enter ${formData.engine === 'gemini' ? 'Gemini' : 'Groq'} Secret Key`} 
              value={formData.aiKey}
              onChange={(e) => setFormData({...formData, aiKey: e.target.value})}
              style={{ margin: '0.5rem 0 0', border: 'none', background: 'rgba(0,0,0,0.3)', padding: '0.9rem' }}
              required
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '1rem', borderRadius: '12px', color: '#fca5a5', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>⚠️</span> {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '1.2rem', 
              fontSize: '1.1rem', 
              background: 'linear-gradient(135deg, #059669, #10b981)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
            }}
          >
            {loading ? (
               <><div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px', borderTopColor: 'white', margin: 0 }}></div> Processing...</>
            ) : (
               <><Zap size={20} /> Generate Intelligence</>
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  )
}

export default Dashboard

