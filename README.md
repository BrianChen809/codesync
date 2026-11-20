# CodeSync

A collaborative code editor built one working milestone at a time. The long-term
goal is shared editing, persistent workspaces, distributed synchronization and
isolated code execution. **Currently implemented: a local, single-file editor.**

## Run locally

Install [Node.js 24 LTS](https://nodejs.org/) (includes npm). From the repository root:

```powershell
npm ci
npm run dev
```

Open **http://127.0.0.1:5173**. Stop the server with Ctrl+C. No cloud account,
database, Docker installation or environment variables are needed for this milestone.
The initial dependency installation requires internet access; editor assets and
language workers are served locally afterward.

## Try the first milestone

1. Edit `main.ts` in the browser. TypeScript highlighting and suggestions use Monaco,
   the editor component from VS Code. Press Ctrl+Space to request suggestions.
2. Use **Download file** to keep a copy of the current text.
3. Use **Reset sample** to discard changes after confirmation.

Changes exist only in this tab. Closing or reloading discards them. The application
requests a browser warning for modified text; browsers may suppress that warning.
Downloading a file does not create a server save. There is no backend, collaboration,
authentication, automatic saving, multi-file management or code execution yet.

## How this part works

React manages the workspace interface. Monaco handles text editing and reports
changes to React, which updates the unsaved status and supplies the download content.
Vite runs the local development server and builds browser assets. TypeScript checks
for inconsistent types before a build. No user code is executed by the application.

## Verify

```powershell
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

- Jest checks edit status, reset confirmation and the leave-page warning using a
  lightweight substitute for Monaco.
- The build includes TypeScript checking.
- Playwright opens real Chromium in desktop and mobile sizes, edits Monaco,
  verifies a downloaded file and resets the sample.
- GitHub Actions runs these checks on pushes and pull requests. It does not deploy.

Verified locally on Windows with Node.js 24: 2 Jest tests, 2 Playwright browser
tests (desktop/mobile Chromium), TypeScript checks and the production build passed.
The GitHub Actions workflow has not yet been run remotely. In a restricted Windows
execution environment, Playwright may require permission to terminate its own
browser/server process trees during cleanup.

The first Playwright run needs a browser download. On Linux, use
`npx playwright install --with-deps chromium` if system libraries are missing.

## Known limitations

Monaco makes the initial browser bundle large; optimization will follow measurement.
The initial online dependency audit reported 2 low-severity advisories through
Monaco's DOMPurify dependency and 18 moderate entries through Jest's tooling.
These are dependency findings, not evidence of an exploit in this application.
Review compatible fixes before accepting untrusted collaborators or deployment;
do not use forced major-version audit fixes without checking behavior. The current
application is for local use only. An offline audit is not a substitute for an
online advisory check.

## Repository

```text
apps/web/             React interface and Monaco editor
tests/                Test setup and real-browser smoke tests
.github/workflows/    Continuous integration checks
```

Backend, database, Docker and Java directories will be added when their milestones
begin. npm workspaces manage the JavaScript/TypeScript applications in this repository.

## Project documents

- [Architecture](ARCHITECTURE.md): current and planned component interactions.
- [Roadmap](ROADMAP.md): milestone scope and acceptance criteria.
- [Agent instructions](AGENTS.md): objectives and development/teaching agreements.
- [Benchmarks](BENCHMARKS.md): measurement plan; no performance results yet.

Local development comes first. Cloud deployment is a later, optional milestone,
with provider and spending decisions deferred. Execution stays private until
adequate isolation and resource limits are verified.
