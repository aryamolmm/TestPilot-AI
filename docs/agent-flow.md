# Agent Flow Diagram

This document delineates the conversational state and step-by-step responsibilities in the TestPilot AI application.

## Flow Pipeline
```mermaid
graph TD;
    User([User CLI Input]) --> Agent1[Agent 1: TestCaseAgent];
    Agent1 --> |Gherkin BDD Scenarios| Agent2[Agent 2: AutomationAgent];
    Agent2 --> |Playwright Test Scripts| Agent3[Agent 3: CoverageAgent];
    
    Agent1 -.-> Agent3;
    User -.-> Agent3;
    
    Agent3 --> |Coverage & Quality Feedback| Memory[(JSON File Memory System)];
    Agent2 --> Memory;
    Agent1 --> Memory;
    
    Memory --> Output([File Outputs -> tests/output/])
```

## Step by Step Execution
1. User provides feature requirements in the standard Node.js terminal app.
2. App invokes **TestCaseAgent** function call directly with requirements. Returns BDD strings.
3. App invokes **AutomationAgent** passing the BDD strings. Returns JS test files.
4. App invokes **CoverageAgent** passing all context.
5. All outputs are synchronized into `memory.json`.
6. Final files are written to the `tests/output/` directory for developer inspection.
