import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { generateTestCases } from './agents/testCaseAgent.js';
import { generatePlaywrightCode } from './agents/automationAgent.js';
import { analyzeCoverage } from './agents/coverageAgent.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MEMORY_FILE = path.join(__dirname, 'memory', 'memory.json');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function loadMemory() {
  if (fs.existsSync(MEMORY_FILE)) {
    const data = fs.readFileSync(MEMORY_FILE, 'utf8');
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }
  return [];
}

function saveMemory(memory) {
  const dir = path.dirname(MEMORY_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory, null, 2));
}

async function run() {
  console.log("====================================");
  console.log("🚀 Welcome to TestPilot AI");
  console.log("====================================\n");

  rl.question('Please enter the feature description:\n> ', async (featureDescription) => {
    try {
      const memory = loadMemory();

      // Tool Call: Agent 1 - Requirement Analyzer
      const gherkinTestCases = await generateTestCases(featureDescription);
      
      // Tool Call: Agent 2 - Automation Generator
      const playwrightCode = await generatePlaywrightCode(gherkinTestCases);
      
      // Tool Call: Agent 3 - Coverage Analyzer
      const coverageReport = await analyzeCoverage(featureDescription, gherkinTestCases, playwrightCode);

      // Save to Memory
      const runData = {
        timestamp: new Date().toISOString(),
        featureDescription,
        gherkinTestCases,
        playwrightCode,
        coverageReport
      };
      
      memory.push(runData);
      saveMemory(memory);
      
      console.log("\n📝 Saving results...");
      
      const outputsDir = path.join(process.cwd(), 'tests', 'output');
      if (!fs.existsSync(outputsDir)) fs.mkdirSync(outputsDir, { recursive: true });
      
      fs.writeFileSync(path.join(outputsDir, 'features.feature'), gherkinTestCases);
      fs.writeFileSync(path.join(outputsDir, 'test.spec.js'), playwrightCode);
      fs.writeFileSync(path.join(outputsDir, 'coverage.md'), coverageReport);

      console.log(`\n🎉 Process Complete! Outputs saved to memory at ${MEMORY_FILE}`);
      console.log(`📂 Artifacts saved to: ${outputsDir}`);
      
    } catch (error) {
      console.error("❌ An error occurred:", error.message);
    } finally {
      rl.close();
    }
  });
}

run();
