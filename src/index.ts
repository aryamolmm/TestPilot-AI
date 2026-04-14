import { fetchJiraIssue } from "./jira/jiraReader.ts";
import { generateGherkin } from "./ai/gherkinAgent.ts";
import { generateTest } from "./ai/testAgent.ts";
import { analyzeCoverage } from "./ai/coverageAgent.ts";
import { saveMemory } from "./memory.ts";
import { saveTestFile, saveGherkin } from "./tools.ts";

async function runPipeline() {
  const input = process.argv[2];

  if (!input) {
    console.error("\n❌ Error: Missing input.");
    console.log("Usage: npx ts-node src/index.ts \"Some feature description\"");
    console.log("   OR: npx ts-node src/index.ts KAN-123");
    process.exit(1);
  }

  let featureDescription = input;

  // 1. Jira Integration (if input looks like a Jira ID)
  if (/^[A-Z]+-\d+$/.test(input)) {
    console.log(`\n📡 Fetching Jira ticket: ${input}...`);
    try {
      const issue = await fetchJiraIssue(input);
      featureDescription = `Summary: ${issue.summary}\nDescription: ${issue.description}`;
      console.log(`✅ Jira Data Retrieved: ${issue.summary}`);
    } catch (error: any) {
      console.error(`❌ Jira Error: ${error.message}`);
      process.exit(1);
    }
  }

  // 2. Gherkin Agent
  console.log("\n🤖 [Gherkin Agent] Generating BDD scenarios...");
  const gherkin = await generateGherkin(featureDescription);
  const gherkinPath = saveGherkin(gherkin);
  console.log(`✅ [Tool] Gherkin saved to: ${gherkinPath}`);

  // 3. Test Agent
  console.log("\n🚀 [Test Agent] Translating Gherkin to Playwright...");
  const testCode = await generateTest(gherkin);
  const testFile = saveTestFile(testCode);
  console.log(`✅ [Tool] Test script saved to: ${testFile}`);

  // 4. Coverage Agent
  console.log("\n📊 [Coverage Agent] Analyzing scenario gaps...");
  const coverage = await analyzeCoverage(gherkin);
  console.log("\n--- COVERAGE REPORT ---");
  console.log(coverage);
  console.log("------------------------");

  // 5. Memory Storage
  console.log("\n🧠 Storing execution in memory...");
  saveMemory({
    input,
    gherkin,
    testCode,
    coverage,
    timestamp: new Date().toISOString()
  });

  console.log("\n✨ TestPilot AI: Full pipeline successfully completed!");
}

runPipeline().catch((err) => {
  console.error("\n❌ Fatal Error in TestPilot AI:", err);
  process.exit(1);
});
