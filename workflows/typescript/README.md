# TypeScript Onboarding Service

A lightweight Express service that provides a web UI for managing user lifecycle in the Caira HQ platform. Built in TypeScript, hosted on Railway, and integrated with GitHub and Terraform to automate identity provisioning.

**Live:** [cairahq-platform-production.up.railway.app](https://cairahq-platform-production.up.railway.app)

---

## Why This Exists

User provisioning in Caira HQ is managed by Terraform — the `users.csv` file is the source of truth and every change flows through a GitOps pipeline. This service removes the manual steps of editing the CSV locally, creating a branch, and opening a PR. Instead, an admin fills out a form and the service handles everything up to the PR automatically.

The human approval gate is preserved — no user is ever provisioned without a PR review and merge. The automation handles the repetitive mechanics, not the decision.

---

## Architecture

```mermaid
graph TD
    Admin["Admin\nBrowser"]
    Admin -->|"form submission"| Railway["Railway\nHosted Service"]
    Railway -->|"reads CSV"| GitHub["GitHub API\ncairahq-platform"]
    Railway -->|"creates branch + PR"| GitHub
    GitHub -->|"PR merged"| HCP["HCP Terraform\nVCS trigger"]
    HCP -->|"applies changes"| Okta["Okta\nUser provisioned"]
    Okta -->|"user created event"| OW["Okta Workflows\nWelcome email sent"]
```

---

## Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| Runtime | Node.js | Server runtime |
| Language | TypeScript | Type-safe application code |
| Web Framework | Express | HTTP server and routing |
| GitHub Integration | Octokit | GitHub API client |
| Hosting | Railway | Production deployment, auto-deploy on merge to main |
| Auth | Basic Auth | Access control — production upgrade path is Okta SSO |

---

## Structure

```
typescript/
├── public/
│   └── index.html          # Web UI — onboard and offboard forms
├── src/
│   ├── index.ts            # Express server, basic auth middleware
│   ├── routes/
│   │   └── onboard.ts      # POST /onboard/add and /onboard/remove handlers
│   ├── github/
│   │   └── client.ts       # GitHub API — read CSV, create branch, commit, open PR
│   └── csv/
│       └── update.ts       # CSV read/write logic, branch name generation
├── .env.example            # Environment variable template
├── package.json            # Dependencies and scripts
└── tsconfig.json           # TypeScript compiler configuration
```

---

## How It Works

### Onboarding
1. Admin navigates to the live service and authenticates
2. Admin fills out the onboarding form with new hire details
3. Service reads the current `users.csv` from GitHub
4. New user row is appended in the correct CSV format
5. A new branch is created (`feat/onboard-firstname-lastname`)
6. Updated CSV is committed to the branch
7. A PR is opened with the title `Onboard: First Last`
8. Admin reviews and merges the PR
9. HCP Terraform detects the merge via VCS trigger and applies
10. Okta user is created by Terraform
11. Okta Workflows fire — admin notification and welcome email sent

### Offboarding
1. Admin navigates to the live service and authenticates
2. Admin fills out the offboarding form with the user's name and email
3. Service reads the current `users.csv` from GitHub
4. The matching user row is removed
5. A new branch is created (`feat/offboard-firstname-lastname`)
6. Updated CSV is committed to the branch
7. A PR is opened with the title `Offboard: First Last`
8. Admin reviews and merges the PR
9. HCP Terraform detects the merge and applies
10. Okta user is deactivated by Terraform
11. Okta Workflows fire — admin offboard notification sent

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GITHUB_TOKEN` | Personal access token with `repo` scope |
| `GITHUB_OWNER` | GitHub username (`neilchvz`) |
| `GITHUB_REPO` | Repository name (`cairahq-platform`) |
| `CSV_PATH` | Path to users CSV (`terraform/okta/data/users.csv`) |
| `BASIC_AUTH_USER` | Username for basic auth |
| `BASIC_AUTH_PASS` | Password for basic auth |

Copy `.env.example` to `.env` and fill in values for local development. Production variables are managed in Railway.

---

## Deployment

The service is hosted on Railway and connected to this GitHub repository. Every merge to `main` triggers an automatic redeploy — no manual deploy steps required.

**Root directory:** `workflows/typescript`
**Build command:** `npm run build`
**Start command:** `npm run start`

---

## Security Notes

**Basic auth** is the current access control mechanism — credentials are required before any form is accessible. This is enforced at the application layer via Express middleware.

**Production upgrade path:** Replace basic auth with Okta SSO. The service would be registered as an app in Okta, users authenticate via the existing Okta tenant, and only `@cairahq.com` accounts with the appropriate group membership can access it. This closes the loop — the identity platform protects the tool that manages the identity platform.

**PR gate:** Even with auth in place, no user is provisioned without a PR review and merge. The GitHub → Terraform pipeline is the final control. The form cannot bypass the GitOps workflow.

---

*Part of [Caira HQ — Platform](../../README.md) · Neil Chavez · Creator of things.*