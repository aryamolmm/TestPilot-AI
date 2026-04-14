import Anthropic from '@anthropic-ai/sdk';
import 'dotenv/config';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY || 'dummy_key_if_not_set',
});

export async function generatePlaywrightCode(gherkinTestCases) {
  console.log("🤖 Agent 2: Translating Gherkin into Playwright automation scripts...");
  
  const prompt = `
You are a senior Node.js full-stack engineer and Playwright expert.
Convert the following Gherkin BDD test cases into a ready-to-run Playwright automation script (JavaScript/TypeScript using ES Modules).
Use clean, production-grade code, robust selectors (getByRole, getByLabel), and include meaningful assertions.

Gherkin Test Cases:
${gherkinTestCases}

Return ONLY the Playwright code block. Do not include markdown formatting like \`\`\`javascript.
`;

  try {
    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }]
    });

    let code = msg.content[0].text;
    code = code.replace(/```javascript/g, '').replace(/```typescript/g, '').replace(/```/g, '').trim();
    console.log("✅ Agent 2: Playwright scripts generated successfully.");
    return code;
  } catch (error) {
     if(error.message.toLowerCase().includes("api-key") || error.message.toLowerCase().includes("api key") || error.status === 401) {
         console.warn("\n⚠️  Mocking Agent 2 due to missing/invalid API key.");
         return "import { test, expect } from '@playwright/test';\n\ntest('mock test', async ({ page }) => {\n  console.log('Mock test');\n});";
    }
    throw error;
  }
}
