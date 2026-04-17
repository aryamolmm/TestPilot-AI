# TestPilot AI: Memory Layer Documentation

This document explains the architecture and operational flow of the **Memory Layer** within the TestPilot AI system. The memory layer enables the system to learn from past executions, improving both speed and quality over time.

### Memory Storage

The system utilizes a local, file-based persistence strategy designed for speed and transparency during development.

*   **Storage Location:** All session data is persisted in `memory.json` located at the project root.
*   **Data Structure:** Each memory entry is stored as a JSON object containing:
    *   `input`: The original feature description or user requirement.
    *   `gherkin`: The generated BDD scenarios.
    *   `testCode`: The functional Playwright TypeScript scripts.
    *   `coverage`: The analysis report identifying gaps and quality scores.
    *   `timestamp`: ISO string of when the execution occurred.
*   **Persistence Trigger:** Memory is automatically updated at the **end of a successful pipeline execution**. The system validates the output before committing it to the local database to ensure only high-quality assets are remembered.

### Memory Retrieval

Before starting any new generation, the **MemoryAgent** performs a semantic scan of the existing database.

*   **Similarity Logic:** The system uses a word-overlap (Jaccard Similarity) algorithm. It tokenizes the new input and compares it against all past entries to calculate a similarity score between 0 and 1.
*   **Decision Thresholds:**
    *   **Score < 0.45 (No Match):** The system treats it as a brand-new requirement and triggers a fresh generation pipeline.
    *   **Score 0.45 - 0.85 (Improve/Evolve):** The system identifies a "Partial Match." It retrieves the past data but treats it as a starting point to be refined or expanded based on the new nuances.
    *   **Score > 0.85 (High Confidence Reuse):** The system identifies a "Direct Match." It can bypass new generation steps and serve the cached assets immediately, significantly reducing execution time.

### Memory Usage in Pipeline

Memory acts as the "Brain" that coordinates the transitions between specialized agents:

1.  **Reuse Previous Outputs:** If a direct match is found, the **Orchestrator** skips the expensive generation phases and presents the verified Gherkin and Test scripts from memory.
2.  **Improve Existing Cases:** In partial matches, the system feeds the remembered test code into the **ReworkAgent**, instructing it to only add the delta (new requirements) rather than rewriting everything from scratch.
3.  **Influence Agent Decisions:** Memory provides context. If a specific testing style or business rule was applied in a previous "remembered" run, the system maintains that consistency in future related tasks.

### Local Execution Flow

Developers can observe the memory layer in action by following these steps:

1.  **Initialize Environment:** Start the backend (`npm run server`) and frontend (`npm run dev`).
2.  **First Run (Empty State):** 
    *   Enter a new feature description in the **Super Agent** terminal.
    *   The `MemoryAgent` will log "No Match found."
    *   The full pipeline runs: **Architect → Automation → Coverage → Rework.**
    *   `memory.json` is created at the root with its first entry.
3.  **Second Run (Similar Task):**
    *   Enter a similar requirement (e.g., changing "login" to "user login flow").
    *   The `MemoryAgent` identifies the match and logs the similarity score.
    *   The **Orchestrator** decides to "Improve" or "Reuse" based on the score.
4.  **Verification:** 
    *   Open `memory.json` in your IDE to see the raw data being captured.
    *   Visit the **AI Memory** page in the UI to view active context rules that influence how memory is prioritized.
