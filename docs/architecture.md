# TestPilot AI Architecture

## System Flow Diagram

The following diagram illustrates the end-to-end flow of the TestPilot AI system:

\`\`\`mermaid
sequenceDiagram
    participant User
    participant CLI
    participant JiraAgent as Jira Reader
    participant Groq as Groq AI (Llama 3)
    participant FS as File System

    User->>CLI: Enters Feature/Jira ID
    CLI->>JiraAgent: Fetch Story (if ID)
    JiraAgent-->>CLI: Feature Details
    CLI->>Groq: Generate Gherkin
    Groq-->>CLI: Gherkin Text
    CLI->>FS: Save docs/gherkin.txt
    CLI->>Groq: Generate Playwright Test
    Groq-->>CLI: TypeScript Code
    CLI->>FS: Save tests/generated.spec.ts
    CLI->>Groq: Analyze Coverage
    Groq-->>CLI: Coverage Report
    CLI->>User: Display Success & Report
\`\`\`

## Component Responsibilities

- **groqClient.ts**: Handles authentication and communication with Groq SDK.
- **jiraReader.ts**: Interacts with Jira Cloud API to extract user story summaries and descriptions.
- **gherkinGenerator.ts**: Engineering prompts for structured BDD output.
- **testGenerator.ts**: Translates Gherkin steps into Playwright action commands.
- **coverageAnalyzer.ts**: Critical analysis of scenario completeness.
