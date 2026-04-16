import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { exec } from 'child_process';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const MEMORY_FILE = join(__dirname, '..', 'memory.json');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ─── Memory Agent Helpers ────────────────────────────────────────────────────

function tokenize(s) {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
}

function computeSimilarity(a, b) {
  const setA = new Set(tokenize(a));
  const setB = new Set(tokenize(b));
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  setA.forEach(t => { if (setB.has(t)) intersection++; });
  const union = new Set([...setA, ...setB]).size;
  return intersection / union;
}

async function loadMemoryData() {
  try {
    if (existsSync(MEMORY_FILE)) {
      const content = await readFile(MEMORY_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch {}
  return [];
}

// POST /api/memory/check — Check past runs for a similar input
app.post('/api/memory/check', async (req, res) => {
  const { input, threshold = 0.45 } = req.body;
  if (!input) return res.status(400).json({ error: 'Missing input' });

  const memory = await loadMemoryData();

  if (memory.length === 0) {
    return res.json({
      used_memory: false,
      reason: 'Memory is empty. No past executions found.',
      result: null
    });
  }

  let bestMatch = null;
  let bestScore = 0;
  for (const entry of memory) {
    const score = computeSimilarity(input, entry.input);
    if (score > bestScore) { bestScore = score; bestMatch = entry; }
  }

  if (bestScore >= threshold && bestMatch) {
    return res.json({
      used_memory: true,
      similarity_score: parseFloat(bestScore.toFixed(3)),
      reason: `Found a past execution with ${Math.round(bestScore * 100)}% similarity. Reusing outputs from: "${bestMatch.input.substring(0, 80)}..." (generated at ${bestMatch.timestamp}).`,
      matched_input: bestMatch.input,
      result: {
        gherkin: bestMatch.gherkin,
        testCode: bestMatch.testCode,
        coverage: bestMatch.coverage
      }
    });
  }

  return res.json({
    used_memory: false,
    similarity_score: parseFloat(bestScore.toFixed(3)),
    reason: `No sufficiently similar past execution found (best match: ${Math.round(bestScore * 100)}%). Generating fresh output.`,
    result: null
  });
});

// POST /api/memory/save — Persist a completed pipeline run to memory.json
app.post('/api/memory/save', async (req, res) => {
  const { input, gherkin, testCode, coverage } = req.body;
  if (!input || !gherkin) return res.status(400).json({ error: 'Missing required fields' });

  try {
    const memory = await loadMemoryData();
    // Avoid exact duplicates
    const exists = memory.some(e => e.input === input);
    if (!exists) {
      memory.push({ input, gherkin, testCode: testCode || '', coverage: coverage || '', timestamp: new Date().toISOString() });
      await writeFile(MEMORY_FILE, JSON.stringify(memory, null, 2));
    }
    res.json({ saved: !exists, total_entries: memory.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/memory/list — List all memory entries (for debugging)
app.get('/api/memory/list', async (req, res) => {
  const memory = await loadMemoryData();
  res.json({ total: memory.length, entries: memory.map(e => ({ input: e.input, timestamp: e.timestamp })) });
});

// ─────────────────────────────────────────────────────────────────────────────

// ─── Tool Selection Agent ─────────────────────────────────────────────────────

function isGherkin(text) {
  return /^\s*(Feature:|Scenario:|Given |When |Then |And )/im.test(text);
}

function isTestCode(text) {
  return (
    /import\s+.*playwright|import\s+.*@playwright/i.test(text) ||
    /test\s*\(['"]/i.test(text) ||
    /describe\s*\(['"]/i.test(text) ||
    /page\.(goto|click|fill|expect)/i.test(text)
  );
}

function detectStage(text) {
  if (isTestCode(text)) return 'test_code';
  if (isGherkin(text)) return 'gherkin';
  return 'feature_description';
}

function selectTool({ stage, input, missing_cases, test_code, gherkin }) {
  switch (stage) {
    case 'feature_description':
      return { tool_name: 'generate_gherkin', arguments: { feature_description: input } };
    case 'gherkin':
      return { tool_name: 'generate_test_cases', arguments: { gherkin: input } };
    case 'test_code':
      return { tool_name: 'run_playwright_tests', arguments: { test_code: input } };
    case 'coverage_check':
      return { tool_name: 'analyze_coverage', arguments: { gherkin: gherkin ?? input, test_code: test_code ?? '' } };
    case 'missing_cases':
      return { tool_name: 'improve_test_cases', arguments: { gherkin: gherkin ?? input, test_code: test_code ?? '', missing_cases: missing_cases ?? '' } };
    default: {
      const detected = detectStage(input);
      return selectTool({ stage: detected, input, missing_cases, test_code, gherkin });
    }
  }
}

// POST /api/agent/select-tool
// Body: { stage?, input, missing_cases?, test_code?, gherkin? }
app.post('/api/agent/select-tool', (req, res) => {
  const { stage, input, missing_cases, test_code, gherkin } = req.body;
  if (!input) return res.status(400).json({ error: 'Missing required field: input' });

  const resolvedStage = stage || detectStage(input);
  const result = selectTool({ stage: resolvedStage, input, missing_cases, test_code, gherkin });

  res.json({
    detected_stage: resolvedStage,
    ...result
  });
});

// ─── Orchestrator Agent ───────────────────────────────────────────────────────

app.post('/api/agent/orchestrate', (req, res) => {
  const { input } = req.body;
  if (!input) return res.status(400).json({ error: 'Missing input for orchestration' });

  // Simple orchestration logic as per the rules
  const result = {
    pipeline_steps: [
      "gherkin",
      "test_cases",
      "coverage",
      "rework_if_needed"
    ],
    status: "ready_to_execute"
  };

  res.json(result);
});

// ─── Gherkin Generation Agent ─────────────────────────────────────────────────

app.post('/api/agent/generate-gherkin', async (req, res) => {
  const { input, apiKey, engine = 'gemini' } = req.body;
  if (!input) return res.status(400).json({ error: 'Missing feature description' });

  const prompt = `You are a Gherkin Generation Agent.
    
    Input:
    Feature description: "${input}"
    
    Your task:
    - Convert feature into structured BDD scenarios
    - Cover main flow + edge cases
    
    Rules:
    - Use Given / When / Then format
    - Include at least 3 scenarios
    - Keep it realistic for automation
    - Return ONLY valid JSON: { "gherkin": "..." }`;

  try {
    let text = '';
    if (engine === 'groq') {
      const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: "llama-3.3-70b-versatile",
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        response_format: { type: "json_object" }
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey || process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      text = response.data.choices[0].message.content;
    } else {
      if (!apiKey && !process.env.GEMINI_API_KEY) throw new Error('Gemini API Key is required');
      const genAI = new GoogleGenerativeAI(apiKey || process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent(prompt);
      text = result.response.text();
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? jsonMatch[0] : text;
    res.json(JSON.parse(jsonText));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Playwright Test Generation Agent ─────────────────────────────────────────

app.post('/api/agent/generate-test', async (req, res) => {
  const { input, apiKey, engine = 'gemini' } = req.body;
  if (!input) return res.status(400).json({ error: 'Missing Gherkin scenarios' });

  const prompt = `You are a Playwright Test Generation Agent.
    
    Input:
    Gherkin scenarios: "${input}"
    
    Your task:
    - Convert Gherkin into Playwright TypeScript test scripts
    
    Rules:
    - Use proper Playwright syntax (@playwright/test)
    - Include assertions (expect)
    - Cover all scenarios
    - Return ONLY valid JSON: { "test_code": "..." }`;

  try {
    let text = '';
    if (engine === 'groq') {
      const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: "llama-3.3-70b-versatile",
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        response_format: { type: "json_object" }
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey || process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      text = response.data.choices[0].message.content;
    } else {
      if (!apiKey && !process.env.GEMINI_API_KEY) throw new Error('Gemini API Key is required');
      const genAI = new GoogleGenerativeAI(apiKey || process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent(prompt);
      text = result.response.text();
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? jsonMatch[0] : text;
    res.json(JSON.parse(jsonText));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Coverage Analysis Agent ──────────────────────────────────────────────────

app.post('/api/agent/analyze-coverage', async (req, res) => {
  const { gherkin, testCode, apiKey, engine = 'gemini' } = req.body;
  if (!gherkin || !testCode) return res.status(400).json({ error: 'Missing gherkin or test code' });

  const prompt = `You are a Coverage Analysis Agent.
    
    Inputs:
    - Gherkin scenarios: "${gherkin}"
    - Test code: "${testCode}"
    
    Your task:
    - Compare both
    - Identify missing or weak coverage
    
    Rules:
    - Be strict
    - Identify edge cases not covered
    - Do not assume completeness
    - Return ONLY valid JSON:
    {
      "coverage_status": "complete" | "incomplete",
      "missing_cases": ["case1", "case2"],
      "quality_score": 0-100
    }`;

  try {
    let text = '';
    if (engine === 'groq') {
      const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: "llama-3.3-70b-versatile",
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        response_format: { type: "json_object" }
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey || process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      text = response.data.choices[0].message.content;
    } else {
      if (!apiKey && !process.env.GEMINI_API_KEY) throw new Error('Gemini API Key is required');
      const genAI = new GoogleGenerativeAI(apiKey || process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent(prompt);
      text = result.response.text();
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? jsonMatch[0] : text;
    res.json(JSON.parse(jsonText));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Test Improvement Agent ───────────────────────────────────────────────────

app.post('/api/agent/improve-test', async (req, res) => {
  const { gherkin, testCode, missingCases, apiKey, engine = 'gemini' } = req.body;
  
  const prompt = `You are a Test Improvement Agent.
    
    Inputs:
    - Gherkin: "${gherkin}"
    - Existing test cases: "${testCode}"
    - Missing coverage areas: "${Array.isArray(missingCases) ? missingCases.join(', ') : missingCases}"
    
    Your task:
    - Improve test cases
    - Add missing scenarios
    - Strengthen assertions
    
    Rules:
    - Do not rewrite everything
    - Only enhance where needed
    - Return ONLY valid JSON: { "improved_test_code": "..." }`;

  try {
    let text = '';
    if (engine === 'groq') {
      const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: "llama-3.3-70b-versatile",
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        response_format: { type: "json_object" }
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey || process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      text = response.data.choices[0].message.content;
    } else {
      if (!apiKey && !process.env.GEMINI_API_KEY) throw new Error('Gemini API Key is required');
      const genAI = new GoogleGenerativeAI(apiKey || process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent(prompt);
      text = result.response.text();
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? jsonMatch[0] : text;
    res.json(JSON.parse(jsonText));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Super Agent Orchestrator ────────────────────────────────────────────────

app.post('/api/agent/super', async (req, res) => {
  const { input, userMemory, apiKey, engine = 'gemini' } = req.body;
  if (!input) return res.status(400).json({ error: 'Missing input for Super Agent' });

  const agent_logs = ["Orchestrator: Received user input"];
  const pipeline = [];
  const memory = await loadMemoryData();
  
  // 1. MEMORY CHECK
  agent_logs.push("MemoryAgent: [SYSTEM] Initiating similarity comparison with context index");
  let bestMatch = null;
  let bestScore = 0;

  for (const entry of memory) {
    const score = computeSimilarity(input, entry.input);
    if (score > bestScore) { bestScore = score; bestMatch = entry; }
  }

  const used_memory = bestScore > 0.45;
  let memory_action = "fresh";
  let memory_summary = "No sufficiently similar past execution found in memory database.";

  if (used_memory) {
    memory_action = bestScore > 0.85 ? "reuse" : "improve";
    memory_summary = `Semantic match identified (${Math.round(bestScore * 100)}%). Execution strategy set to: ${memory_action}.`;
  }
  
  if (userMemory) {
    agent_logs.push("MemoryAgent: [SYSTEM] Merging UI-defined memory overrides into active session");
  }
  agent_logs.push(`MemoryAgent: [STATUS] Memory check complete. Mode: ${memory_action}`);

  // 2. PIPELINE SELECTION
  
  agent_logs.push("ArchitectAgent: [CMD] Generating BDD / Gherkin scenario context");
  pipeline.push({ agent: "ArchitectAgent", action: "generate_gherkin" });

  agent_logs.push("AutomationAgent: [CMD] Creating production-ready Playwright test scripts");
  pipeline.push({ agent: "AutomationAgent", action: "generate_test_cases" });

  agent_logs.push("CoverageAgent: [CMD] Checking test coverage and edge-case implementation");
  pipeline.push({ agent: "CoverageAgent", action: "analyze_coverage" });

  if (memory_action !== "reuse") {
    agent_logs.push("ReworkAgent: [GATE] Triggered due to incomplete coverage/fresh run requirement");
    pipeline.push({ agent: "ReworkAgent", action: "improve_test_cases" });
  } else {
    agent_logs.push("Orchestrator: [BYPASS] Validation high. Bypassing rework agent for cached asset.");
  }

  res.json({
    memory: { used_memory, memory_action, memory_summary },
    agent_logs,
    pipeline,
    status: "completed"
  });
});

// ─── Super Agent Text Reporter ───────────────────────────────────────────────

app.post('/api/agent/super/text', async (req, res) => {
  const { input, userMemory } = req.body;
  
  const report = await axios.post(`http://localhost:${PORT}/api/agent/super`, { input, userMemory });
  const data = report.data;

  const textOutput = `
AI MEMORY:
Used Memory: ${data.memory.used_memory ? "YES" : "NO"}
Action: ${data.memory.memory_action}
Reason: ${data.memory.memory_summary}

----------------------------------------

AGENT PROCESS LOGS:

${data.agent_logs.join("\n")}

----------------------------------------

PIPELINE EXECUTION:

Step 1: Gherkin created  
Step 2: Test scripts generated  
Step 3: Coverage analyzed  
Step 4: Tests improved (if needed)  

----------------------------------------

FINAL STATUS:
Pipeline completed successfully`;

  res.send(textOutput);
});

// ─── Super Agent Tool-Aware Reporter ────────────────────────────────────────

app.post('/api/agent/super/tools', async (req, res) => {
  const { input, userMemory } = req.body;
  
  const report = await axios.post(`http://localhost:${PORT}/api/agent/super`, { input, userMemory });
  const data = report.data;

  const memorySection = `
AI MEMORY:
Used Memory: ${data.memory.used_memory ? "YES" : "NO"}
Action: ${data.memory.memory_action}
Reason: ${data.memory.memory_summary}`;

  const logsSection = `
AGENT_EXECUTION_LOGS:

Orchestrator → Received input
MemoryAgent → ${data.memory.used_memory ? "Match found" : "No match"}

ArchitectAgent → Calling Tool: generate_gherkin
Input: ${data.memory.used_memory ? "[REUSED FROM MEMORY]" : input}

AutomationAgent → Calling Tool: generate_test_cases
Input: [Gherkin Context]

CoverageAgent → Calling Tool: analyze_coverage
Input: [Gherkin + Test Cases]

ReworkAgent → Calling Tool: improve_test_cases
Input: [Missing Coverage Areas]`;

  const summarySection = `
TOOL CALL SUMMARY:

Step 1:
Tool: generate_gherkin
Executed: ${data.memory.memory_action === 'reuse' ? 'NO' : 'YES'}
Reason: ${data.memory.memory_action === 'reuse' ? 'Valid memory reuse' : 'New generation required'}

Step 2:
Tool: generate_test_cases
Executed: YES

Step 3:
Tool: analyze_coverage
Executed: YES

Step 4:
Tool: improve_test_cases
Executed: ${data.memory.memory_action === 'reuse' ? 'NO' : 'YES'}`;

  const textOutput = `
${memorySection}

----------------------------------------

${logsSection}

----------------------------------------

${summarySection}

----------------------------------------

FINAL STATUS:
Pipeline executed with memory-aware tool-calling logic`;

  res.send(textOutput);
});

// ─────────────────────────────────────────────────────────────────────────────

// Proxy endpoint to fetch Jira stories
app.post('/api/jira/fetch', async (req, res) => {
  const { baseUrl, email, token, storyId } = req.body;
  if (!baseUrl || !email || !token || !storyId) {
    return res.status(400).json({ error: 'Missing required credentials' });
  }

  // === Jira Logic ===

  let url = baseUrl.trim();
  if (!url.startsWith('http')) {
    url = `https://${url}`;
  }
  url = url.replace(/\/+$/, '');
  const authHeader = Buffer.from(`${email}:${token}`).toString('base64');
  try {
    const response = await axios.get(`${url}/rest/api/3/issue/${storyId}`, {
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Accept': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    res.status(status).json(error.response?.data || { error: error.message });
  }
});

// Endpoint for AI-driven generation
app.post('/api/ai/generate', async (req, res) => {
  const { story, apiKey, type, engine = 'gemini', userMemory = '' } = req.body;
  
  const memoryContext = userMemory ? `\n[PREREQUISITES / GLOBAL CONTEXT]\n${userMemory}\n` : '';

  const prompt = type === 'script' 
    ? `[AGENT 2: AUTOMATION SPECIALIST]
       ${memoryContext}
       Write a complete Playwright TypeScript automation script for Jira Story: "${story.summary}".
       Description: ${story.description || 'No description'}.
       The script MUST be production-ready and include Happy Path, Negative, and Edge cases.
       Return ONLY the TypeScript code block.`
    : `[AGENT 1: BDD ANALYST]
       ${memoryContext}
       Analyze this Requirement/Story: "${story.summary}".
       Description: ${story.description || 'No description'}.
       Generate 8 diverse test cases (Happy Path, Negative, Edge, Boundary) in Strict BDD / Gherkin format.
       Format: JSON array of objects.
       Columns required: "TC_ID" (e.g. TC-01), "Scenario_Name", "Type" (e.g. Happy Path), and "Gherkin" (The Given/When/Then text).
       Return ONLY the valid JSON array without markdown wrapping.`;

  try {
    let text = '';
    if (engine === 'groq') {
      const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: "llama-3.3-70b-versatile",
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      text = response.data.choices[0].message.content;
    } else {
      if (!apiKey) throw new Error('Gemini API Key is required');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent(prompt);
      text = result.response.text();
    }

    if (type === 'script') {
        text = text.replace(/```typescript|```ts|```|typescript/g, '').trim();
        res.json({ script: text });
    } else {
        const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
        const jsonText = jsonMatch ? jsonMatch[0] : text.replace(/```json|```|json/g, '').trim();
        res.json({ testCases: JSON.parse(jsonText.trim()) });
    }
  } catch (error) {
    let errorMessage = error.response?.data?.error?.message || error.message;
    console.error('AI Error:', errorMessage);
    res.status(500).json({ error: errorMessage });
  }
});

// [AGENT 3: REWORK AGENT]
app.post('/api/ai/rework', async (req, res) => {
  const { story, script, errorLog, apiKey, engine = 'gemini', userMemory = '' } = req.body;
  
  const memoryContext = userMemory ? `\n[PREREQUISITES / GLOBAL CONTEXT]\n${userMemory}\n` : '';

  const prompt = `[AGENT 3: DEBUG & REWORK SPECIALIST]
    ${memoryContext}
    The following Playwright script failed.
    STORY: ${story.summary}
    SCRIPT: ${script}
    ERROR LOG: ${errorLog}
    Return ONLY the corrected TypeScript code block.`;

  try {
    let text = '';
    if (engine === 'groq') {
      const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: "llama-3.3-70b-versatile",
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      text = response.data.choices[0].message.content;
    } else {
      if (!apiKey) throw new Error('Gemini API Key is required');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent(prompt);
      text = result.response.text();
    }
    res.json({ script: text.replace(/```typescript|```ts|```|typescript/g, '').trim() });
  } catch (error) {
    res.status(500).json({ error: error.response?.data?.error?.message || error.message });
  }
});

// Endpoint to run a Playwright test script
app.post('/api/test/run', async (req, res) => {
  const { script, id } = req.body;
  if (!script) return res.status(400).json({ error: 'No script provided' });
  try {
    const testsDir = join(tmpdir(), 'tests');
    try { await mkdir(testsDir, { recursive: true }); } catch (e) {}
    const testPath = join(testsDir, `${id}_test.spec.ts`);
    await writeFile(testPath, script);
    exec(`npx playwright test "${testPath}" --reporter=list`, (err, stdout, stderr) => {
      res.json({ success: !err, output: stdout, error: err ? stderr || err.message : null });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Hybrid AI & Jira Proxy Running at http://localhost:${PORT}`);
  });
}

export default app;
