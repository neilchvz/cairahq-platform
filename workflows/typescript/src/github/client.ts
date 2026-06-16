import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';

dotenv.config();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const OWNER = process.env.GITHUB_OWNER || '';
const REPO = process.env.GITHUB_REPO || '';
const CSV_PATH = process.env.CSV_PATH || '';

export async function getCSV(): Promise<{ content: string; sha: string }> {
  const response = await octokit.repos.getContent({
    owner: OWNER,
    repo: REPO,
    path: CSV_PATH,
  });

  const data = response.data as { content: string; sha: string };
  const content = Buffer.from(data.content, 'base64').toString('utf-8');

  return { content, sha: data.sha };
}

export async function createPR(
  branchName: string,
  updatedCSV: string,
  sha: string,
  userName: string,
  action: 'Onboard' | 'Offboard'
): Promise<string> {
  // Get main branch SHA
  const mainRef = await octokit.git.getRef({
    owner: OWNER,
    repo: REPO,
    ref: 'heads/main',
  });

  const mainSHA = mainRef.data.object.sha;

  // Create new branch
  await octokit.git.createRef({
    owner: OWNER,
    repo: REPO,
    ref: `refs/heads/${branchName}`,
    sha: mainSHA,
  });

  // Commit updated CSV to new branch
  await octokit.repos.createOrUpdateFileContents({
    owner: OWNER,
    repo: REPO,
    path: CSV_PATH,
    message: `feat: ${action.toLowerCase()} ${userName}`,
    content: Buffer.from(updatedCSV).toString('base64'),
    sha,
    branch: branchName,
  });

  // Open PR
  const pr = await octokit.pulls.create({
    owner: OWNER,
    repo: REPO,
    title: `${action}: ${userName}`,
    head: branchName,
    base: 'main',
    body: `Automated ${action.toLowerCase()} request for **${userName}**.\n\nReview the CSV change and merge to trigger Terraform provisioning.`,
  });

  return pr.data.html_url;
}