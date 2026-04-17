# TestPilot AI: Overview

## Project Goal
The primary objective of TestPilot AI is to revolutionize QA automation by leveraging Multi-Agent AI Orchestration. It automates the entire lifecycle of test generation—from understanding high-level feature requirements to producing fully runnable Playwright test scripts and analyzing coverage gaps.

## Multi-Agent Architecture
The system uses a pipeline of specialized agents, each powered by Groq LLMs (Llama 3) for high-speed, high-quality reasoning:
- **Gherkin Agent**: Translates feature descriptions or Jira stories into clean, BDD-style Gherkin scenarios.
- **Test Agent**: Converts Gherkin scenarios into executable Playwright TypeScript code, targeting specific application selectors.
- **Coverage Agent**: Analyzes the generated scenarios to identify edge cases, missing paths, and potential improvements in test coverage.

## Memory Usage
TestPilot AI maintains a `memory.json` file that persists the state of every execution. This enables:
- Contextual continuity between runs.
- Tracking of previous test results and generated artifacts.
- Future enhancements like "Rework Agents" that can fix failing tests based on historical data.

## Tool Calling
The agents interact with the file system using specialized tools:
- **saveGherkin**: Persists BDD scenarios to `/tests/gherkin/`.
- **saveTestFile**: Synchronizes the generated TypeScript code into `tests/generated.spec.ts`.

## End-to-End Pipeline
1. **Input**: User provides a feature description or a Jira ID via CLI.
2. **Fetch**: If Jira ID, the system fetches ticket details.
3. **Generate Scenarios**: Gherkin Agent produces 5+ BDD scenarios.
4. **Generate Code**: Test Agent produces a Playwright spec file.
5. **Coverage Analysis**: Coverage Agent identifies gaps.
6. **Persistence**: Memory is updated, and files are written to disk.
7. **Execution**: User runs `npx playwright test` to execute the generated suite.
