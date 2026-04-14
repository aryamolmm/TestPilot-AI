# TestPilot AI 🚀

TestPilot AI is a multi-agent, AI-driven test automation system designed to autonomously transform feature descriptions or Jira tickets into executable Playwright test scripts, BDD Gherkin scenarios, and detailed coverage reports.

## 🏗️ Multi-Agent Architecture

The system consists of three specialized AI agents working in sequence:

1.  **Gherkin Agent** (`gherkinAgent.ts`): Transforms raw feature descriptions or Jira ticket data into professional BDD Gherkin syntax.
2.  **Test Agent** (`testAgent.ts`): Translates Gherkin scenarios into production-ready Playwright TypeScript code without any unnecessary explanations.
3.  **Coverage Agent** (`coverageAgent.ts`): Analyzes the generated Gherkin to identify logical gaps, count scenarios, and provide improvement recommendations.

## 🧠 Memory & Tools

-   **Memory** (`memory.json`): Persistent JSON storage that records every execution, including inputs, Gherkin outputs, test code, and coverage analysis.
-   **Tools** (`tools.ts`): File management helpers that automatically save generated assets:
    -   Test scripts save to `./tests/generated.spec.ts`
    -   Gherkin text saves to `./docs/gherkin.txt`

## 🛠️ Tech Stack

-   **Runtime**: Node.js (TypeScript)
-   **AI**: Groq SDK (Llama3-70b-8192)
-   **Automation**: Playwright
-   **Integration**: Jira REST API
-   **Configuration**: Dotenv

## 🚀 Setup & Usage

### 1. Installation

```bash
npm install
```

### 2. Configuration (`.env`)

Add your credentials to the `.env` file:

```env
GROQ_API_KEY=your_groq_key
JIRA_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=your_jira_token
```

### 3. Running the Pipeline

**From Feature Description:**
```bash
npm start "User authentication and profile management"
```

**From Jira Ticket:**
```bash
npm start KAN-123
```

### 4. Running Tests

```bash
npx playwright test
```

## 🎥 Demo Steps

1.  **Extraction**: Provide a Jira ID (e.g., `KAN-123`) to fetch live story data.
2.  **Gherkin Generation**: Watch the Gherkin Agent output scenarios to the console and `./docs/gherkin.txt`.
3.  **Test Generation**: Observe the Test Agent producing Playwright code in `./tests/generated.spec.ts`.
4.  **Coverage Analysis**: Review the Coverage Report for scenario counts and missing edge cases.
5.  **Memory persistence**: Check `memory.json` to see the full historical log of the run.
