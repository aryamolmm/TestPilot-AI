/**
 * Tool Selection Agent
 *
 * Understands the current stage of the pipeline and selects EXACTLY ONE tool.
 * Does NOT generate test data or explanations — only emits a tool call descriptor.
 */

// ── Tool name literals ──────────────────────────────────────────────────────
export type ToolName =
  | "generate_gherkin"
  | "generate_test_cases"
  | "run_playwright_tests"
  | "analyze_coverage"
  | "improve_test_cases";

// ── Input types that can be passed to the agent ─────────────────────────────
export type PipelineStage =
  | "feature_description"   // raw requirement text / Jira description
  | "gherkin"               // BDD .feature file content
  | "test_code"             // Playwright TypeScript spec
  | "coverage_check"        // explicit request to analyze coverage
  | "missing_cases";        // coverage analysis found gaps

export interface ToolSelectionInput {
  stage: PipelineStage;
  input: string;
  /** Optional: required when stage = "missing_cases" */
  missing_cases?: string;
  /** Optional: required when stage = "coverage_check" */
  test_code?: string;
  gherkin?: string;
}

export interface ToolSelectionResult {
  tool_name: ToolName;
  arguments: Record<string, string>;
}

// ── Stage detection heuristics ───────────────────────────────────────────────

/** Returns true if the string looks like Gherkin BDD text */
function isGherkin(text: string): boolean {
  return /^\s*(Feature:|Scenario:|Given |When |Then |And )/im.test(text);
}

/** Returns true if the string looks like TypeScript/Playwright test code */
function isTestCode(text: string): boolean {
  return (
    /import\s+.*playwright|import\s+.*@playwright/i.test(text) ||
    /test\s*\(['"]/i.test(text) ||
    /describe\s*\(['"]/i.test(text) ||
    /page\.(goto|click|fill|expect)/i.test(text)
  );
}

/**
 * Auto-detects the pipeline stage from raw text when no explicit stage is provided.
 */
export function detectStage(text: string): PipelineStage {
  if (isTestCode(text)) return "test_code";
  if (isGherkin(text)) return "gherkin";
  return "feature_description";
}

// ── Tool Selection Logic ─────────────────────────────────────────────────────

/**
 * Selects exactly one tool based on the current pipeline stage.
 *
 * @param input  Structured input describing what we currently have
 * @returns      A JSON-serialisable tool call descriptor
 */
export function selectTool(input: ToolSelectionInput): ToolSelectionResult {
  const { stage, input: rawInput, missing_cases, test_code, gherkin } = input;

  switch (stage) {
    case "feature_description":
      return {
        tool_name: "generate_gherkin",
        arguments: { feature_description: rawInput }
      };

    case "gherkin":
      return {
        tool_name: "generate_test_cases",
        arguments: { gherkin: rawInput }
      };

    case "test_code":
      return {
        tool_name: "run_playwright_tests",
        arguments: { test_code: rawInput }
      };

    case "coverage_check":
      return {
        tool_name: "analyze_coverage",
        arguments: {
          gherkin: gherkin ?? rawInput,
          test_code: test_code ?? ""
        }
      };

    case "missing_cases":
      return {
        tool_name: "improve_test_cases",
        arguments: {
          gherkin: gherkin ?? rawInput,
          test_code: test_code ?? "",
          missing_cases: missing_cases ?? ""
        }
      };

    default:
      // Fallback: auto-detect from raw text
      const detected = detectStage(rawInput);
      return selectTool({ ...input, stage: detected });
  }
}

/**
 * Convenience wrapper: auto-detects stage from raw text and selects the tool.
 * Use this when you don't know the stage explicitly.
 */
export function selectToolAuto(rawInput: string, extras?: Partial<ToolSelectionInput>): ToolSelectionResult {
  const stage = detectStage(rawInput);
  return selectTool({ stage, input: rawInput, ...extras });
}
