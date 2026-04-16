import { groq, GROQ_MODEL } from "./groqClient.ts";

/**
 * Playwright Test Generation Agent
 * 
 * Converts Gherkin scenarios into Playwright TypeScript test scripts.
 */
export async function generateTest(gherkin: string): Promise<{ test_code: string }> {
  const systemPrompt = `
    You are a Playwright Test Generation Agent.
    
    Your task:
    - Convert Gherkin scenarios into Playwright TypeScript test scripts
    
    Rules:
    - Use proper Playwright syntax (@playwright/test)
    - Include assertions (expect)
    - Cover all scenarios provided
    - Return ONLY valid JSON in this format: { "test_code": "..." }
    - No explanations, no markdown blocks.

    Target Application: https://www.saucedemo.com/
    Credentials: username: standard_user, password: secret_sauce
  `;

  const userPrompt = `Gherkin scenarios:\n\n${gherkin}`;

  try {
    const response = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: GROQ_MODEL,
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content || '{"test_code": ""}';
    return JSON.parse(content);
  } catch (error: any) {
    console.error(`❌ Test Agent Error: ${error.message}`);
    throw error;
  }
}
