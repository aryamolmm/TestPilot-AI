import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export interface JiraIssue {
  key: string;
  summary: string;
  description: string;
}

export async function fetchJiraIssue(issueId: string): Promise<JiraIssue> {
  const baseUrl = process.env.JIRA_URL;
  const email = process.env.JIRA_EMAIL;
  const token = process.env.JIRA_API_TOKEN;

  if (!email || !token || !baseUrl) {
    throw new Error("❌ Jira configuration missing in .env (JIRA_URL, JIRA_EMAIL, JIRA_API_TOKEN)");
  }

  const authHeader = Buffer.from(`${email}:${token}`).toString('base64');

  try {
    const response = await axios.get(`${baseUrl}/rest/api/3/issue/${issueId}`, {
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Accept': 'application/json'
      }
    });

    const issue = response.data;
    const summary = issue.fields.summary || "No Summary";
    const description = flattenJiraDescription(issue.fields.description);

    return {
      key: issue.key,
      summary: summary,
      description: description
    };
  } catch (error: any) {
    throw new Error(`Jira API Error: ${error.message}`);
  }
}

function flattenJiraDescription(descriptionObj: any): string {
  if (!descriptionObj) return "No description provided.";
  if (typeof descriptionObj === 'string') return descriptionObj;
  
  let text = "";
  if (descriptionObj.content) {
    descriptionObj.content.forEach((item: any) => {
      if (item.type === 'paragraph' && item.content) {
        item.content.forEach((inner: any) => {
          if (inner.type === 'text') {
            text += inner.text + " ";
          }
        });
        text += "\n";
      }
    });
  }
  return text.trim() || "No detailed description found.";
}
