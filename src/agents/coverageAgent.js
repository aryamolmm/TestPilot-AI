import Anthropic from '@anthropic-ai/sdk';
import 'dotenv/config';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY || 'dummy_key_if_not_set',
});

export async function analyzeCoverage(featureDescription, gherkinTestCases, playwrightScripts) {
  console.log("🤖 Agent 3: Analyzing test coverage and identifying gaps...");
  
  const prompt = `
You are a QA test coverage expert.
Analyze Gherkin scenarios and identify missing test coverage.

## REQUIREMENTS
Return:
1. Total Scenario Count
2. Missing Edge Cases
3. Improvement Suggestions

## CONTEXT
Application: https://www.saucedemo.com/
Focus areas:
- Login
- Cart
- Checkout

## RULES
* Be specific
* Mention real edge cases
* No generic answers

Feature Description:
${featureDescription}

Generated Test Cases (Gherkin):
${gherkinTestCases}

Generated Automation Scripts:
${playwrightScripts}

Output: Return a clean textual summary exactly following the requirements.
`;

  try {
    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }]
    });

    console.log("✅ Agent 3: Coverage analysis complete.");
    return msg.content[0].text;
  } catch (error) {
    if(error.message.toLowerCase().includes("api-key") || error.message.toLowerCase().includes("api key") || error.status === 401) {
         console.warn("\n⚠️  Mocking Agent 3 due to missing/invalid API key.");
         return "## Coverage Analysis (Mock)\n\n* No missing scenarios due to mock.\n* Coverage is 100%.";
    }
    throw error;
  }
}
