import { groq, GROQ_MODEL } from "./groqClient.ts";

/**
 * Test Improvement Agent
 * 
 * Enhances existing Playwright test cases based on Gherkin and missing coverage areas.
 */
export async function improveTest(
  gherkin: string, 
  existingTestCode: string, 
  missingCases: string[]
): Promise<{ improved_test_code: string }> {
  const systemPrompt = `
    You are a Test Improvement Agent.
    
    Inputs:
    - Gherkin scenarios
    - Existing test cases (Playwright code)
    - Missing coverage areas (List of gaps)
    
    Your task:
    - Improve the existing test cases to cover the missing gaps
    - Add missing scenarios found in the coverage analysis
    - Strengthen assertions for better reliability
    
    Rules:
    - Do not rewrite everything if not needed
    - Only enhance where needed to close the coverage gap
    - Return ONLY valid JSON in this format: { "improved_test_code": "..." }
    - No explanations, no markdown blocks.

    Target Application: https://www.saucedemo.com/
  `;

  const userPrompt = `Gherkin:\n${gherkin}\n\nExisting Code:\n${existingTestCode}\n\nMissing Cases:\n${missingCases.join(", ")}`;

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

    const content = response.choices[0]?.message?.content || '{"improved_test_code": ""}';
    return JSON.parse(content);
  } catch (error: any) {
    console.error(`❌ Improvement Agent Error: ${error.message}`);
    throw error;
  }
}
