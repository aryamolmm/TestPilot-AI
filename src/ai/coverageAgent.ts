import { groq, GROQ_MODEL } from "./groqClient.ts";

/**
 * Coverage Analysis Agent
 * 
 * Compares Gherkin scenarios with test cases to identify coverage gaps.
 */
export async function analyzeCoverage(gherkin: string, testCode: string): Promise<{
  coverage_status: "complete" | "incomplete",
  missing_cases: string[],
  quality_score: number
}> {
  const systemPrompt = `
    You are a Coverage Analysis Agent.
    
    Inputs:
    - Gherkin scenarios
    - Test cases (Playwright code)
    
    Your task:
    - Compare both and identify missing or weak coverage
    
    Rules:
    - Be strict
    - Identify edge cases not covered by the test code but present in Gherkin OR common logic gaps
    - Do not assume completeness
    - Return ONLY valid JSON:
    {
      "coverage_status": "complete" | "incomplete",
      "missing_cases": ["case1", "case2"],
      "quality_score": 0-100
    }
  `;

  const userPrompt = `Gherkin scenarios:\n${gherkin}\n\nTest Code:\n${testCode}`;

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

    const content = response.choices[0]?.message?.content || '{"coverage_status": "incomplete", "missing_cases": [], "quality_score": 0}';
    return JSON.parse(content);
  } catch (error: any) {
    console.error(`❌ Coverage Agent Error: ${error.message}`);
    throw error;
  }
}
