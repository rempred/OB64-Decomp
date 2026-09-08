# Standalone analysis packet command

See [usage and limits](../../docs/ANALYSIS_PACKETS.md).

`cli.js` exposes explicit local configuration and packet preparation. `core.js` authenticates accepted inputs, invokes both decompilers and checks cache evidence.
`elf.js` constructs exact analysis-only load intervals. `python_runner.py` isolates m2c and records imported dependencies.
`test.js` runs the focused validation with existing local tools and frozen reference packets.

This directory has no entry point in compilation, matching, linking or verification machinery. Do not automatically compile its outputs.
