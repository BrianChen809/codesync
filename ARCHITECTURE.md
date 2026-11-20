# Architecture

## Current: milestone 1

Only the frontend exists. Vite serves the application locally. React displays the
workspace and manages its current text; Monaco handles editing and suggestions.
Editor language workers are bundled locally, with no runtime CDN dependency.

```text
Browser
  React workspace <--> Monaco editor
         |
         +--> Download current text as main.ts
```

Text exists in memory in one browser tab. There is no backend, database,
authentication, shared editing, execution, or automatic saving. Closing/reloading
discards changes; a browser warning is requested for modified text but is not a
durability guarantee. Download provides an explicit way to keep a copy.

## Target architecture (planned, not implemented)

```text
Browser: React + Monaco + Yjs
  | HTTPS REST / authenticated WebSocket
Load balancer
  |                         |
Node backend A         Node backend B
  |                         |
  +------ Redis Pub/Sub ----+
  +------ PostgreSQL -------+
  +------ Object storage ---+
               |
     Durable execution jobs
               |
    Java execution coordinator
               |
       Isolated per-job runner
```

### Responsibilities and communication

- React: workspace UI, file tree, editor, presence and execution output.
- Node modular backend: authentication, workspace permissions, file metadata,
  collaboration, persistence and execution request admission. Keep these as modules
  in one deployment until separation solves a demonstrated problem.
- REST: registration, sessions, workspace membership, file operations and job submission.
- WebSockets: binary Yjs updates, acknowledgments, awareness and job notifications.
- PostgreSQL: users, sessions, memberships, files, durable document updates,
  snapshot metadata, outbox events and execution jobs.
- Redis: cross-server update notifications, temporary presence and rate limiting.
- Object storage: immutable history snapshots, exports and bounded artifacts.
- Java: bounded thread pool coordinates jobs and isolated runners. Threads do not
  isolate untrusted programs. Start with one language and no dependency downloads.

### Document consistency

Each text file has a Yjs document, identified by an immutable file ID. Rename does
not change its identity. Concurrent text edits merge through Yjs; file metadata
uses database transactions and constraints instead of CRDTs.

Clients apply edits locally. Servers validate permissions and size/rate limits,
commit an update plus an outbox event transactionally, then acknowledge durability.
The UI must distinguish local edits, syncing and saved state.

Redis Pub/Sub can lose messages. An outbox relay retries publication; duplicate
updates are safe to reapply. Reconnection and periodic reconciliation recover missing
state from durable storage. Do not promise exactly-once delivery.

Snapshot compaction needs a consistent cutoff and verified upload before update
pruning. Recovery should apply historical content as a new current edit, accounting
for active collaborators. Define transactional ordering and recovery details in the
relevant milestone rather than assuming a database sequence proves commit order.

### Security boundaries

Authorize both REST actions and WebSocket room access/updates. Membership revocation
must invalidate existing connections. Use secure session cookies and CSRF defenses.
Enforce limits on message sizes, documents, connection queues and job submissions.

Execution remains private until isolation has been verified: non-root runners,
no credentials, no outbound network, immutable toolchains, bounded CPU/memory/disk/
process count/output/time, full process-tree termination and reliable cleanup.
Ordinary Docker containers alone are not an adequate public hostile-code boundary.

### Deployment and cost

Build and test locally first. Docker Compose will run multiple backends, Redis,
PostgreSQL and a proxy. Cloud deployment follows local feature and failure testing.
Provider selection is deferred to keep development at zero cloud spending.

Original AWS mapping: CloudFront/S3 frontend, ALB, ECS Fargate backends, RDS,
ElastiCache, private S3 artifacts, isolated execution infrastructure and Terraform.
Other providers can fulfill general cloud objectives but do not establish AWS experience.

### Observability

Later milestones add structured logs with request/document/job correlation, excluding
credentials and source text. Measure durable acknowledgment and remote visibility
separately. Prometheus/Grafana track resource use, failures and recovery. Configure
bounded log retention and document restore/deployment procedures.

## Decisions made

- npm workspaces keep related TypeScript projects in one repository; Java will use
  its own build tool. No monorepo orchestration framework is needed yet.
- Vite provides local development and browser builds; it is not the application backend.
- Integrate Monaco directly to avoid an additional editor wrapper and CDN loader.
- Keep only one file and one tab in milestone 1. Do not add fake presence, saving,
  execution, or sharing controls before their behavior exists.
- Jest checks workspace interactions; Playwright checks actual browser/editor behavior.
- Current dependency advisories are recorded in README.md. Review compatible
  upgrades before public deployment or shared untrusted content; do not equate a
  working local prototype with a completed security review.

## References

- [Vite guide](https://vite.dev/guide/)
- [Monaco integration](https://github.com/microsoft/monaco-editor/blob/main/docs/integrate-esm.md)
- [Yjs document updates](https://docs.yjs.dev/api/document-updates)
- [Redis delivery semantics](https://redis.io/docs/latest/develop/pubsub/)
