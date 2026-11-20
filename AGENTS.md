# CodeSync project instructions

## Purpose

Build a real-time collaborative code editor as a first-year computer engineering
student's learning and internship portfolio project. Deliver small, working parts;
do not generate the whole system at once.

## Communication and collaboration

- Explain complete processes and component interactions in plain language.
- Briefly define unfamiliar tools and technical terms when introducing them.
- Avoid explanations of every variable, method, or incidental implementation detail.
- Explain what changed, how parts interact, how to try it, and what was verified.
- Stop at meaningful milestone boundaries so the user can understand the work.
- At appropriate commit points, provide exact Git staging and commit commands with
  a descriptive commit message. Stage relevant paths, avoiding unrelated changes.
- The user runs commits; do not commit or push unless explicitly asked.

## Six required engineering objectives

1. Cloud infrastructure: Docker, cloud deployment, database and object storage,
   load balancing, horizontal scaling, infrastructure configuration.
2. Distributed systems: independent backend instances, Redis Pub/Sub,
   cross-instance synchronization, failure recovery, document consistency.
3. Concurrency: Yjs CRDT editing, prevention of lost updates, Java execution
   coordinator with bounded thread pools, resource management and isolation.
4. Testing and CI/CD: Jest, integration tests, Playwright, JUnit, GitHub Actions,
   and test-gated deployment when cloud hosting is introduced.
5. Performance: k6 load tests, synchronization latency, throughput, capacity,
   memory and recovery measurements; document actual improvements.
6. Architecture: modular responsibilities, REST and events, explicit trade-offs,
   structured logging, errors, and monitoring.

## Development principles

- Local development first, with zero cloud spending. Cloud deployment is near the
  end; provider selection is deferred. AWS was the original target, but free
  alternatives may be reviewed. Do not provision paid resources without approval.
- Prefer React/TypeScript, Monaco, Node/Express/TypeScript, WebSockets, Yjs,
  PostgreSQL, Redis, Java, Docker, GitHub Actions, Jest/JUnit/Playwright, k6,
  Prometheus and Grafana. Explain a proposed technology change before making it.
- Use a modular Node backend initially; isolate code execution in a separate service.
- Prioritize security, reliability, readability and maintainability. Avoid unused
  frameworks, speculative services and unnecessary dependencies.
- Add meaningful tests with each behavior. Never fabricate features, test results,
  deployment status, benchmarks, or resume accomplishments.
- Never expose arbitrary code execution publicly before adequate isolation and
  resource limits have been established and verified.
- Redis Pub/Sub is not durable storage. Saved edits require durable acknowledgment;
  cross-instance recovery needs a durable log/outbox and reconciliation.
- Keep README.md, ARCHITECTURE.md, ROADMAP.md, AGENTS.md and BENCHMARKS.md current.

## Current milestone and commands

Milestone 1: browser-local, single-file Monaco editor. No backend or persistence.
Use Node.js 24 and npm workspaces. Run commands from the repository root:

```powershell
npm ci
npm run dev
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Build includes TypeScript checking. Jest tests workspace behavior with a substitute
editor; Playwright tests real Monaco in desktop and mobile Chromium. Do not treat
the substitute editor tests as proof that Monaco or its workers work.
