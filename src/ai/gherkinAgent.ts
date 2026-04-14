import { groq, GROQ_MODEL } from "./groqClient.ts";

export async function generateGherkin(featureDescription: string): Promise<string> {
  const systemPrompt = `
    You are a QA automation expert. 
    Your task is to generate HIGH-QUALITY Gherkin scenarios for a real application based on the feature description.
    
    REQUIREMENTS:
    - Generate at least 4-6 scenarios.
    - Include Positive cases, Negative cases, and Edge cases.
    - Return ONLY valid Gherkin text.
    
    RULES:
    - No explanations
    - No extra text
    - Proper BDD format (Feature, Scenario, Given, When, Then)
    - Multiple scenarios required
    - Do not include markdown code blocks (e.g. no \`\`\`gherkin or \`\`\`)
  `;

  const userPrompt = `Translate the following feature description into Gherkin scenarios:\n\n${featureDescription}`;

  try {
    const response = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: GROQ_MODEL,
      temperature: 0.2,
    });

    return response.choices[0]?.message?.content || "No Gherkin generated.";
  } catch (error: any) {
    console.error(`❌ Gherkin Agent Error: ${error.message}`);
    throw error;
  }
}
