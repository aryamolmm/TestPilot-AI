import { groq, GROQ_MODEL } from "./groqClient.ts";

export async function analyzeCoverage(gherkin: string): Promise<string> {
  const systemPrompt = `
    You are a QA test coverage expert.
    Analyze Gherkin scenarios and identify missing test coverage.
    
    REQUIREMENTS
    Return:
    1. Total Scenario Count
    2. Missing Edge Cases
    3. Improvement Suggestions
    
    CONTEXT
    Application: https://www.saucedemo.com/
    Focus areas:
    - Login
    - Cart
    - Checkout
    
    RULES
    * Be specific
    * Mention real edge cases
    * No generic answers
    
    Output: Return a clean textual summary exactly following the requirements.
  `;

  const userPrompt = `Analyze the coverage for these scenarios:\n\n${gherkin}`;

  try {
    const response = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: GROQ_MODEL,
      temperature: 0.3,
    });

    return response.choices[0]?.message?.content || "Coverage analysis failed.";
  } catch (error: any) {
    console.error(`❌ Coverage Agent Error: ${error.message}`);
    throw error;
  }
}
