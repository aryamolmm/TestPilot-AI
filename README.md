# TestPilot AI 🚀

**TestPilot AI** is a state-of-the-art, multi-agent autonomous testing platform. It streamlines the entire Quality Assurance lifecycle by transforming raw requirements—whether from Jira tickets or manual entry—into high-quality BDD scenarios, production-ready Playwright scripts, and comprehensive coverage reports.

---

## ✨ Features

- 🤖 **Intelligence Orchestration**: Employs multiple specialized AI agents (Gherkin, Test, Coverage, and Rework).
- 🎨 **Premium UI/UX**: Modern Dashboard built with React, Vite, Framer Motion, and Lucide.
- 🔗 **Jira Integration**: Native support for fetching and processing Atlassian Jira stories.
- 🧠 **Hybrid AI Engine**: Switch between **Google Gemini 1.5 Pro** and **Groq (Llama 3)** for optimized performance.
- 🛠️ **Auto-Healing**: Integrated "Rework Agent" to automatically debug and fix failing test scripts.
- 📊 **Coverage Insights**: Deep analysis of test scenarios to identify edge cases and logical gaps.

---

## 🏗️ Multi-Agent Architecture

The system orchestrates specialized agents to ensure precision at every step:

1.  **Gherkin Agent**: Analyzes requirements and generates professional BDD / Gherkin scenarios.
2.  **Test Agent**: Translates Gherkin scenarios into executable Playwright TypeScript code.
3.  **Coverage Agent**: Performs static analysis on scenarios to detect missing boundary conditions.
4.  **Rework Agent**: Analyzes execution logs of failed tests and provides corrected code blocks.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Vanilla CSS (Premium Design System)
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend & AI
- **Runtime**: Node.js / TypeScript
- **Server**: Express.js
- **Models**: Google Gemini 1.5 Pro, Llama 3.3 (via Groq)
- **API**: Jira REST API

### Automation
- **Framework**: Playwright
- **Language**: TypeScript

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- A Groq API Key or Google Gemini API Key
- Atlassian Jira API Token (optional, for Jira integration)

### 2. Installation
```bash
# Install dependencies
npm install
```

### 3. Configuration
Create a `.env` file in the root directory:
```env
# AI API Keys
GROQ_API_KEY=your_groq_key
GEMINI_API_KEY=your_gemini_key

# Jira Integration
JIRA_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=your_jira_token
```

### 4. Running the Application

**Run Frontend & Backend (Development):**
```bash
# Terminal 1: Start the Backend Server
npm run server

# Terminal 2: Start the Frontend UI
npm run dev
```

**Run CLI Pipeline:**
```bash
# Process a manual description
npm start "Verify user login with MFA"

# Process a Jira Story
npm start KAN-101
```

---

## 📂 Project Structure

```text
├── api/                # Express Backend & AI Proxy
├── src/                # Frontend & Core Logic
│   ├── ai/             # Specialized AI Agents
│   ├── components/     # Premium React Components
│   ├── App.jsx         # Application Entry
│   └── tools.ts        # File I/O Utilities
├── tests/              # Generated Playwright Scripts
├── docs/               # Generated Gherkin & Reports
└── playwright.config.ts # Automation Configuration
```

---

## 🎥 Workflow Demonstration

1.  **Input**: Feed a Jira ID or a raw feature description into the Dashboard.
2.  **BDD Generation**: The **Gherkin Agent** expands requirements into detailed scenarios.
3.  **Code Generation**: The **Test Agent** produces a Playwright `.spec.ts` file.
4.  **Execution**: Run tests directly from the UI or CLI.
5.  **Analytics**: The **Coverage Agent** provides a feedback loop for continuous improvement.

---

## 📄 License
TestPilot AI is research-grade software. All rights reserved.

