import fs from 'fs';
import Anthropic from '@anthropic-ai/sdk';
import 'dotenv/config';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY || 'dummy_key_if_not_set',
});

export async function generateTestCases(featureDescription) {
  console.log("🤖 Agent 1: Analyzing requirements and generating BDD test cases...");
  
  const prompt = `
You are a senior QA automation architect. Based on the following feature description, generate comprehensive BDD Gherkin test cases.
Include positive scenarios, negative scenarios, edge cases, and validation cases.

Feature Description:
${featureDescription}

Return ONLY the Gherkin feature file content. Do not include markdown formatting or extra text.
`;

  try {
    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }]
    });

    const gherkin = msg.content[0].text;
    console.log("✅ Agent 1: Test cases generated successfully.");
    return gherkin;
  } catch (error) {
    if(error.message.toLowerCase().includes("api-key") || error.message.toLowerCase().includes("api key") || error.status === 401) {
         console.warn("\n⚠️  Mocking Agent 1 due to missing/invalid API key.");
         return "Feature: Mock Feature\n\n  Scenario: Mock Scenario\n    Given Mock state\n    When Mock action\n    Then Mock result";
    }
    throw error;
  }
}
