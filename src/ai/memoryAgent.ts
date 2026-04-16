import { loadMemory, MemoryEntry } from "../memory.ts";

/**
 * Computes a simple word-overlap similarity score between two strings.
 * Returns a value between 0 (no overlap) and 1 (identical).
 */
function computeSimilarity(a: string, b: string): number {
  const tokenize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter(Boolean);

  const setA = new Set(tokenize(a));
  const setB = new Set(tokenize(b));
  if (setA.size === 0 || setB.size === 0) return 0;

  let intersection = 0;
  setA.forEach((token) => { if (setB.has(token)) intersection++; });
  const union = new Set([...setA, ...setB]).size;
  return intersection / union;
}

export interface MemoryAgentResult {
  used_memory: boolean;
  similarity_score?: number;
  reason: string;
  matched_entry?: MemoryEntry;
  result: {
    gherkin: string;
    testCode: string;
    coverage: string;
  } | null;
}

/**
 * Memory-aware agent system.
 *
 * Rules:
 * - If a past entry has similarity >= threshold → reuse and return it
 * - Otherwise → return null result so the pipeline generates fresh output
 *
 * @param currentInput  The current user input (feature description or Jira ID)
 * @param threshold     Similarity threshold (default 0.45 — ~45% word overlap)
 */
export async function checkMemory(
  currentInput: string,
  threshold = 0.45
): Promise<MemoryAgentResult> {
  const memory = loadMemory();

  if (memory.length === 0) {
    return {
      used_memory: false,
      reason: "Memory is empty. No past executions found.",
      result: null,
    };
  }

  // Find the most similar past entry
  let bestMatch: MemoryEntry | null = null;
  let bestScore = 0;

  for (const entry of memory) {
    const score = computeSimilarity(currentInput, entry.input);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (bestScore >= threshold && bestMatch) {
    return {
      used_memory: true,
      similarity_score: parseFloat(bestScore.toFixed(3)),
      reason: `Found a past execution with ${Math.round(bestScore * 100)}% similarity to current input. Reusing previous outputs from: "${bestMatch.input.substring(0, 80)}..." (generated at ${bestMatch.timestamp}).`,
      matched_entry: bestMatch,
      result: {
        gherkin: bestMatch.gherkin,
        testCode: bestMatch.testCode,
        coverage: bestMatch.coverage,
      },
    };
  }

  return {
    used_memory: false,
    similarity_score: parseFloat(bestScore.toFixed(3)),
    reason: `No sufficiently similar past execution found (best match score: ${Math.round(bestScore * 100)}%). Generating fresh output.`,
    result: null,
  };
}
