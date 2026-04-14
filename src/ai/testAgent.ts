import { groq, GROQ_MODEL } from "./groqClient.ts";

export async function generateTest(gherkin: string): Promise<string> {
  const systemPrompt = `
    You are a Playwright + TypeScript expert.
    Convert Gherkin into FULLY RUNNABLE Playwright test code.

    ## Requirements
    Application: https://www.saucedemo.com/
    Credentials: username: standard_user, password: secret_sauce

    ## Selectors
    #user-name
    #password
    #login-button
    .inventory_list
    .shopping_cart_link
    #checkout
    #continue
    #finish
    .complete-header
    [data-test="error"]

    ## Rules
    * Use @playwright/test
    * Generate MULTIPLE test() blocks
    * Each scenario -> one test()
    * Use correct selectors
    * Ensure code runs without modification
    * No explanations
    - Output: Return ONLY the TypeScript code block. NO markdown code blocks, NO backticks.
  `;

  const userPrompt = `Generate Playwright TypeScript code for these Gherkin scenarios:\n\n${gherkin}`;

  try {
    const response = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: GROQ_MODEL,
      temperature: 0.1,
    });

    let code = response.choices[0]?.message?.content || "";
    // Clean up if the model accidentally includes markdown blocks
    code = code.replace(/```typescript/g, "").replace(/```ts/g, "").replace(/```/g, "").trim();
    
    return code;
  } catch (error: any) {
    console.error(`❌ Test Agent Error: ${error.message}`);
    throw error;
  }
}
