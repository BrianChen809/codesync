# Benchmarks

No performance benchmarks have been run. Functional tests and build duration are
not capacity or synchronization measurements. There is no server or shared editor yet.

## Planned methodology

Record hardware, OS, container limits, software versions, network conditions, commit,
document size, active documents, users/workspace, edit rate, warmup, duration and
load-generator placement. Local services sharing a machine are not independent hosts.

Use k6 for protocol load and real-browser tests for editor behavior. Generate valid
Yjs updates rather than treating arbitrary WebSocket frames as collaborative edits.
Measure remote edit visibility independently from durable-save acknowledgment.

| Metric | Initial hypothesis (not achieved) |
| --- | --- |
| Remote edit visibility | p95 below 200 ms at 25 active clients under documented conditions |
| Durable save acknowledgment | p95 below 500 ms under the same workload |
| Backend-failure recovery | Within 10 seconds in a controlled local test |
| Durability | Zero acknowledged edits lost in defined failure scenarios |
| Overload behavior | Bounded queues; explicit rejection or reconnection instead of unbounded growth |

Test 10, 25, 50 and 100 clients; compare one vs. two backends under equal and increased
resource budgets. Report throughput, p50/p95/p99 latency, errors, CPU, memory,
database connections and recovery time. Repeat runs and report variability.

Choose optimizations from observed bottlenecks. Document before/after conditions,
raw results and trade-offs, including unsuccessful changes. Synthetic load results
must not be described as real-user adoption.
