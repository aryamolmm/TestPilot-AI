# TestPilot AI: Architecture & Agent Flow

TestPilot AI is an autonomous, multi-agent test automation platform designed to transform high-level requirements into production-ready test suites. The system utilizes a specialized agentic workflow to ensure high coverage, semantic accuracy, and self-healing capabilities.

## 🏗️ System Architecture

The application is built on a modern **Vite + React** frontend and a **Node.js + Express** backend, orchestrated by a suite of AI agents powered by **Google Gemini 1.5 Pro** and **Groq (Llama 3.3)**.

### 1. UI / Input Layer
The entry point allows users to input feature descriptions manually or fetch stories directly from **Jira**. This layer captures the semantic intent of the requested feature.

### 2. Orchestration & Memory Layer
- **Orchestrator**: Manages the lifecycle of a request, determining which agents to transition through.
- **Memory Agent**: Scans a local `memory.json` index to find similar past executions. It uses semantic similarity to decide whether to reuse cached assets or trigger a fresh generation loop.

### 3. Agentic Pipeline
- **Architect Agent (Gherkin)**: Transforms the input into structured BDD (Behavior Driven Development) scenarios using Given/When/Then syntax.
- **Automation Agent (Test Script)**: Converts Gherkin scenarios into executable **Playwright** TypeScript code, targeting specific application selectors (e.g., SauceDemo).
- **Coverage Agent**: Performs a strict gap analysis between the Gherkin requirements and the generated scripts to identify missing edge cases or weak assertions.
- **Rework Agent**: Acts as a "self-healing" loop, improving the test scripts based on the Coverage Agent's findings.

### 4. Storage & Output
- **Tests**: Final scripts are saved to the `/tests` directory.
- **Reports**: Playwright execution results are stored in `/playwright-report`.

## 🔄 Agent Data Flow

1. **Input** → `User Input / Jira Story`
2. **Memory Check** → `Memory Agent` (Avoids redundant API calls)
3. **Generation** → `Architect Agent` (Creates Gherkin)
4. **Scripting** → `Automation Agent` (Creates Playwright Code)
5. **Validation** → `Coverage Agent` (Identifies gaps)
6. **Refinement** → `Rework Agent` (Fixes gaps)
7. **Finalization** → `Generated Script (.spec.ts) + Memory Update`

---
*This architecture ensures that the generated tests are not just syntactically correct, but semantically complete.*
