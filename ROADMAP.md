# Roadmap

Work in manageable parts. After each part: explain the process, show how to try it,
report verification, and provide Git commands at a sensible commit boundary.

## 0. Design and working agreements

- [x] Review architecture and development principles.
- [x] Choose local-first development with cloud hosting deferred.
- [x] Record learning preferences and commit guidance in AGENTS.md.

## 1. Local editor — current delivery

- [x] React/TypeScript workspace with one Monaco document.
- [x] Highlighting and TypeScript suggestions using local editor workers.
- [x] Reset sample and download current text; explicit unsaved status.
- [x] Responsive layout, Jest tests, Playwright smoke test and CI configuration.
- [x] Establish the five required project documents.

Acceptance: edit real Monaco text, download those edits, confirm reset, and pass
type checking, tests and build. CI must run remotely before claiming a green workflow.

## 2. Single-server collaboration

- Add Node/Express/TypeScript server and authenticated access later in milestone 3.
- Add Yjs binding and WebSocket synchronization for one temporary shared document.
- Add cursors/presence, connection status and reconnect behavior.
- Until authorization exists, bind services to localhost and use local testing only.
- Acceptance: two browser contexts edit concurrently and converge; reconnect tested.

## 3. Persistent workspaces

- Add PostgreSQL, migrations, sessions, registration/login and permission checks.
- Add workspaces, folders, files and durable update acknowledgment.
- Add integration tests for persistence, authorization and file-operation races.
- Reassess dependency advisories and update compatible packages before shared
  untrusted content or any deployment.
- Acceptance: saved edits survive server restart; unauthorized access is denied.

## 4. Distributed collaboration

- Run two independent backends with Redis Pub/Sub and a local load balancer.
- Add transactional outbox, duplicate-safe forwarding and reconciliation.
- Add bounded queues, cursor throttling and file/membership event handling.
- Acceptance: cross-instance convergence; backend/Redis interruptions recover all
  acknowledged edits; local processes and Docker Compose reproduce the setup.

## 5. Private code execution

- Introduce Java coordinator, bounded thread pool and durable job lifecycle.
- Start with one language and fixed toolchain, without arbitrary dependencies.
- Establish isolation, resource limits, cancellation, recovery and cleanup.
- Acceptance: timeout/output/memory/process/queue limits and worker failure tested;
  never expose execution publicly before a documented security review.

## 6. History and recovery

- Add immutable snapshots, tested compaction and history restore as a new edit.
- Add backup/restore procedures and tests with active collaborators.
- Acceptance: reconstruct current and historical state without losing concurrent edits.

## 7. Performance and reliability

- Add k6 workloads, structured logs, Prometheus and Grafana.
- Measure 10/25/50/100 clients, one vs. two backends, CPU/memory/throughput/recovery.
- Record reproducible before/after improvements in BENCHMARKS.md.
- Acceptance: measured results and limitations, no invented accomplishments.

## 8. Optional cloud deployment — near the end

- Review free tiers/student credits and choose a provider before provisioning.
- Add infrastructure as code, cloud database/object storage, load balancing and
  test-gated deployment of immutable images; verify rollback and restoration.
- Define budget and availability trade-offs. No cloud spending without approval.
- Acceptance: verified cloud deployment and recovery; document which objectives
  remain local if budget or provider limits prevent the complete topology.

## Final objective evidence

| Objective | Required evidence |
| --- | --- |
| Cloud | Reproducible deployment, containers, load balancer, cloud data/storage, teardown |
| Distributed systems | Cross-instance editing and controlled failure recovery |
| Concurrency | Randomized CRDT convergence and bounded Java scheduling/isolation tests |
| CI/CD | Jest/integration/JUnit/Playwright checks; failed checks block deployment |
| Performance | Reproducible benchmarks and measured improvement from a baseline |
| Architecture | Updated component contracts, trade-offs, correlated logs and restore runbook |
