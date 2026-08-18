# Total Resolver R3 Phase 1 Status

Status: **complete; retained as the Phase 1 implementation record**
Started: 2026-08-17

The maintained client lives in `tools/total_resolver/`. At the Phase 1 gate, every public bridge
operation performed an exact `0.7.2` handshake before issuing its command, so a caller could not
bypass protocol identity by omitting an explicit `connect()` call. The active protocol has since
advanced to `0.8.0`; see the subsequent-status note below.

## Implemented

- persistent newline-framed JSON transport;
- three-way `ping`/`status`/`health` protocol validation;
- health, execution, exception, register, emulator-state, and frame queries;
- typed single, batched, and byte-range RAM reads;
- execute, read, and write watches plus one loss-aware globally ordered event drain;
- native PI DMA tracing with event-time destination bytes, range filtering, and per-ID removal;
- explicit pause, resume, frame-step, instruction-step, state, framebuffer, dump, RAM-write, and
  controller methods for later authorized modes;
- normalized z64/v64/n64 ROM identity;
- offline Project64 savestate identity; and
- the repo-local `doctor` and `pj64 health/status` command surface.

Passive startup does not clear bridge-global watches, write RAM, load a state, or send controller
input. Bridge `0.7.2` adds recorder-safe per-ID removal, a script-instance epoch, one monotonic
watch/DMA sequence, and explicit dropped sequence ranges.

## Verification

```text
python -B -m unittest discover -s tools/total_resolver/tests -p "test_*.py" -v
Ran 13 tests
OK
```

The tests cover the accepted handshake, version drift, missing protocol fields, direct-operation
handshake enforcement, observation/control command parity, command injection, byte-order
normalization, savestate identity, and source-freeze policy.

The ordinary decomp verifier also passed after the tool was added:

```text
Baserom identity ........... PASS
Toolchain .................. PASS
Source policy .............. PASS
C linker ownership ......... PASS
Target placement ........... PASS
Relocations ................ PASS
Target bytes ............... EXACT
Full ROM ................... EXACT
RESULT: EXACT BASELINE
```

Verification used the repository's already-audited isolated Windows runtime because the machine's
normal PowerShell directory does not contain the pinned automation assembly.

## Completed Phase 1 gate

The repo-local client was subsequently exercised against the live `ob64-core` runtime and bridge
`0.7.2`. Protocol mismatch tests failed closed, and the bridge harness proved global ordering,
epoch changes, visible loss, and event-time DMA destination-byte handling. The maintained runtime
is now protocol `0.8.0`, adding the ordered execution/input streams and exact-content deduplication
described in `docs/total-resolver/implementation-status.md`.
