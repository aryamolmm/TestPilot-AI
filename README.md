# Jira Story Fetcher

A premium, modern web dashboard to connect to Jira Cloud and fetch User Stories from your projects.

## Features
- **Secure Connection**: Uses Jira API Tokens with Basic Auth.
- **Dynamic Fetching**: Automatically filters for "Story" issue types via JQL.
- **Premium UI**: Glassmorphism design with real-time status badges.
- **Responsive**: Works on desktop and mobile.

## How to use
1. **Get a Jira API Token**: Go to [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens) and create a new token.
2. **Launch the App**: Run `npm run dev` in the terminal.
3. **Connect**:
   - **Jira URL**: e.g., `https://yourdomain.atlassian.net`
   - **Email**: Your Atlassian email address.
   - **Token**: The API Token you generated.
   - **Project Key**: e.g., `PROJ` or `SCRUM`.
4. **View Stories**: The dashboard will automatically fetch and display all User Stories.

## CORS Note
Jira API does not allow direct CORS requests from browsers to `atlassian.net` by default for security. 
To run this locally, you may need:
- A CORS browser extension (like "Allow CORS: Access-Control-Allow-Origin").
- Or use a local proxy if deploying to production.

## Tech Stack
- React 18
- Vite
- Axios
- Vanilla CSS (Premium Design System)
