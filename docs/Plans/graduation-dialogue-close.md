# Graduation dialogue close, resume and status

The [Editor director](codex://threads/01a1eae5-90a2-7c31-956d-6ed447687e40) reported that an in-place graduation rebuild displays the edited dialogue and issues the name-entry request, then leaves the old frame visible and fails to accept normal confirmation. The original scene with the same dialogue archive advances to the keyboard and birthday. The Editor owns this comparison and the playback fix.

The Editor subsequently reported that an empty scene reaches the keyboard, a single spoken line before release reproduces the failure, and restoring the original timed fade after closing reaches the birthday scene. Testing whether a wait on the specific dialogue window suffices led to the third matching target, command `0x10`.

| Director command | US Rev 0 owner and ROM interval | Bytes | Behavior to compare |
| --- | --- | ---: | --- |
| `0x06` | [func_002A0374](../../asm/original/rev0/lib/func_002A0374.s), `[0x2A0374, 0x2A0390)` | 28 | Passes the low byte of its operand to the window resume routine at RAM `0x8019F2C0`. |
| `0x05` | [func_002A0548](../../asm/original/rev0/lib/func_002A0548.s), `[0x2A0548, 0x2A05DC)` | 148 | Scans up to 28 tracking slots. It frees and clears the first slot whose signed halfword ID equals the full operand. The window-close call at RAM `0x8019F354` receives the low byte even on a scan miss. |
| `0x10` | [func_002A0354](../../asm/original/rev0/lib/func_002A0354.s), `[0x2A0354, 0x2A0374)` | 32 | Passes the window ID’s low byte to the query at RAM `0x8019F174` and returns the low byte of its result. The dispatcher uses that result in scan mode 1. |

The [accepted dispatcher](../../src/lib/func_00284288.c) passes one script word to each handler. The [dialogue-context investigation](../../../docs/Plans/task-logs/classes-rebuild-before-dialogue-context-20261004.md) identifies [window resume](../../asm/original/rev0/lib/func_000fa460.s) and [window close](../../asm/original/rev0/lib/func_000fa4f4.s). The [placement evidence](../../build/integration/grad-close/placement-evidence.json) binds the original call instructions to these two functions in overlay descriptor 4. A separate load slab places `func_0007e2e4` at the same RAM address as window close.

The [original window query](../../asm/original/rev0/lib/func_000fa314.s) returns 0 or 2 when it finds an active record for the requested window. On a miss, a separate flag selects 1 or 3. The graduation script’s test determines which status permits it to continue.

The adjacent commands use two independent fade-state accessors. [func_002839A8](../../asm/original/rev0/lib/func_002839A8.s) sets byte `+7` on the object addressed by `D_8018FC10` when present. [func_002839C4](../../asm/original/rev0/lib/func_002839C4.s) reads the signed halfword at `+0`, or returns zero for an absent object. The [original fade harness](../../../editor/native/tests/scene-fade-mips.cjs) supplies comparison cases. Both accessors have distinct physical owners. Their layout is independent of the dialogue tracking array at scene-root offset `0x1D8`.

The [matching worker](codex://threads/01a1f167-e2ae-7b90-bb98-815dc2c86873) owns all [three prepared handlers](../../build/grad-close-261118-trio-preflight.json) in `build/matching/grad-close-261118`. The [production integrator](codex://threads/01a1f05f-2cc1-7700-88c1-dcf0b0551584) verifies the full trio together. The Director returns the accepted commit and verifier fingerprint to the Editor. [Liedel’s renderer](liedel-dialogue-renderer.md) proceeds independently.
