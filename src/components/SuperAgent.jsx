import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Play, Cpu, CheckCircle2, AlertCircle, Brain, Code2, Beaker } from 'lucide-react';
import axios from 'axios';

const SuperAgent = () => {
  const [task, setTask] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [logs, setLogs] = useState([]);
  const [result, setResult] = useState(null);

  const handleExecute = async () => {
    if (!task.trim()) return;

    setIsExecuting(true);
    setLogs([]);
    setResult(null);

    try {
      // Mocking the real-time log progression for UI feel
      const initialLogs = ["Orchestrator: Analyzing task and planning autonomous pipeline..."];
      setLogs(initialLogs);

      const response = await axios.post('http://localhost:3001/api/agent/super', {
        input: task,
        userMemory: localStorage.getItem('testpilot_ai_memory') || ''
      });

      // Simulate step-by-step logs appearing
      const finalLogs = response.data.agent_logs;
      
      for (let i = 1; i < finalLogs.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setLogs(prev => [...prev, finalLogs[i]]);
      }

      setResult(response.data);
    } catch (error) {
      setLogs(prev => [...prev, `❌ Error: ${error.message}`]);
    } finally {
      setIsExecuting(false);
    }
  };

  const getLogIcon = (log) => {
    if (log.includes('ArchitectAgent')) return <Beaker size={14} className="text-purple-400" />;
    if (log.includes('AutomationAgent')) return <Code2 size={14} className="text-blue-400" />;
    if (log.includes('MemoryAgent')) return <Brain size={14} className="text-pink-400" />;
    if (log.includes('Orchestrator')) return <Cpu size={14} className="text-indigo-400" />;
    if (log.includes('Complete')) return <CheckCircle2 size={14} className="text-green-400" />;
    return <Terminal size={14} className="text-slate-400" />;
  };

  return (
    <div className="animate-fade-in">
      {/* TERMINAL INPUT SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
        style={{ padding: '2rem', marginBottom: '2rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <Cpu size={24} color="#8b5cf6" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Super Agent Terminal</h2>
        </div>
        
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          The Super Agent can perform multi-step tasks autonomously. Try: "Fetch story GEN-1 and generate BDD tests" or "Create tests for a signup flow with password strength validation".
        </p>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <textarea
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Enter your autonomous task description..."
              style={{
                width: '100%',
                minHeight: '100px',
                background: 'rgba(15, 23, 42, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '1rem',
                color: 'white',
                fontSize: '0.95rem',
                resize: 'none',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>
          
          <button 
            onClick={handleExecute}
            disabled={isExecuting || !task.trim()}
            style={{
              width: '180px',
              height: '100px',
              background: 'linear-gradient(135deg, #8b5cf6, #d946ef)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              borderRadius: '12px',
              boxShadow: '0 10px 20px -5px rgba(139, 92, 246, 0.4)',
              transition: 'all 0.3s ease'
            }}
          >
            {isExecuting ? (
              <div className="spinner" style={{ width: '20px', height: '20px', margin: 0 }}></div>
            ) : (
              <>
                <span style={{ fontWeight: 700, fontSize: '1rem' }}>Execute Task →</span>
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* LOGS SECTION */}
      {(logs.length > 0 || isExecuting) && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{
            background: '#020617',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.05)',
            padding: '1.5rem',
            fontFamily: '"JetBrains Mono", monospace',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            overflow: 'hidden'
          }}
        >
          <div style={{ color: '#475569', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Terminal size={12} /> AGENT_PROCESS_LOGS
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <AnimatePresence mode="popLayout">
              {logs.map((log, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}
                >
                  <div style={{ width: '2px', height: '14px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}></div>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {getLogIcon(log)}
                    <span style={{ 
                      color: log.includes('✅') || log.includes('Created') || log.includes('successful') ? '#4ade80' : 
                             log.includes('Orchestrator') ? '#94a3b8' : 
                             log.includes('ArchitectAgent') ? '#c084fc' : 
                             log.includes('AutomationAgent') ? '#60a5fa' : '#f8fafc' 
                    }}>
                      {log}
                    </span>
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isExecuting && (
              <motion.div 
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: '#6366f1' }}
              >
                <div style={{ width: '2px', height: '14px', background: '#6366f1', borderRadius: '10px' }}></div>
                <span>Agent contemplating next move...</span>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* RESULT DRAWER (Simulated completion) */}
      {result && !isExecuting && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: '2rem', textAlign: 'center' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', padding: '0.75rem 1.5rem', borderRadius: '30px', border: '1px solid rgba(34, 197, 94, 0.2)', fontSize: '0.9rem', fontWeight: 600 }}>
            <CheckCircle2 size={16} /> Pipeline Completed Successfully
          </div>
          <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '1rem' }}>
            Check <b>History</b> or <b>Generation History</b> to view files.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default SuperAgent;
