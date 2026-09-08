# Standalone analysis packet command

See [usage and limits](../../docs/ANALYSIS_PACKETS.md).

`cli.js` exposes explicit local configuration and packet preparation. `core.js` authenticates accepted inputs, invokes both decompilers and checks cache evidence.
Returned results include fresh shared research intake outside the immutable packet, including
cache hits. `test.js` exports `runIntakeRefresh(config, ignoredOutput)` for the focused real
cache-refresh check; it adds a temporary authored observation after initial preparation and
requires unchanged packet artifacts and zero subsequent decompiler invocations.
`elf.js` constructs exact analysis-only load intervals. `python_runner.py` isolates m2c and records imported dependencies.
`test.js` runs the focused validation with existing local tools and frozen reference packets.

This directory has no entry point in compilation, matching, linking or verification machinery. Do not automatically compile its outputs.
