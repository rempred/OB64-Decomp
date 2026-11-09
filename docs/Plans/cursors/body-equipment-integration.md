# Body/equipment integration

## Assignment and ownership

Integrator `ses_e43db0377ffeFRjZ89yj2KkFej` is sole production/integration owner
under Director `ses_e43ef7d4effe75r1xU4kjl9h0w`. November 9 dispatch authorizes
complete B02 integration, normal acceptance, research curation and scoped local commit
under the [B01/B02 program](../body-equipment-program.md). B01 stays unfinished;
its original assembly fallback remains. Initial checks were drained; Director has
since released only B01's selected-input private checks.
Director owns program/queue/director-cursor and native communication setup.

## Current state — November 9, 2026

- Integration base: `main`, `0b972a783252620b587cc623f16551444dd9f7d1`.
- Unrelated tracked/untracked work was inspected and is preserved.
- B02 is verified matching C in `src/lib/func_002AAC60.c`: complete 1,176-byte
  owner, preamble included; sole C ownership, exact placement/bytes and all 39
  actual relocations pass. Original assembly remains as fallback/reference.
- CURRENT: `47B539D6F0D7839A25990E52C797196B41EAB5ECE8F5D5D031A5099DFF16D3DC`.
  `build/current/state.json` references the authenticated passing verification and
  fresh-compilation proofs. One final `verify.js --target func_002AAC60 --require-pure`
  ran, with one fresh build and exact complete ROM; no redundant pre-build/repeat.
  Evidence: `build/integration/body-equipment/b02-acceptance-evidence.json`.
- Required environment for every canonical/preparation invocation:
  `OB64_WORK_ROOT=C:/Users/Joe/.codex/ob64-descriptor-20261026`; prepend
  `.toolchains/node-v24.13.1-win-x64` to process-local PATH and invoke its exact
  `node.exe` (SHA-256 `E3BE0545990C90995D7BF3A7AF5D64AF1F2E0FC1BBD9B79C27F7ABC1E9676E50`).
- Full configured host tuple independently authenticated, including pinned
  PowerShell executable/automation DLL/version; evidence:
  `build/integration/body-equipment/pinned-host-authentication.json`.
- Active v1 live-tool manifest:
  `build/body-equipment-inputs-20261108-pinned/manifest.json`, SHA-256
  `8E1EB1FB4A1D32820D64932387EA551D858399C30E5C80C7B6ECE9FA116FCFA2`.
  Input-set ID: `C60413BAAA88B813BA13FC6586D69810D6F52BF4CD2D667875210EE971671D50`.
- B01 remains ASM at `.ob64.r5487`, original `objects/assembly/chunk_042.o`;
  B02's call resolves to accepted RAM `0x8023C0B0`. No dependency on unfinished C.
  The four previously accepted family members remain exact PURE_C in this run.
- B01 selected-input private checks may run under Director's release. Preserve the
  old `51174c7c86b20d82b20106f2/build` directory, selected storage, tools/runtime,
  original ASM/ROM and other referenced inputs; none were changed or cleaned.

## Research and next action

Conservative comments/unused-only cleanup preserved direct57's active lifetimes.
Canonical linked diff is EXACT with relocation MATCH. HI/LO and jump destinations
were independently reconciled to linked symbols, including `D_801CEAB0`; ABI views
remain local and partial. Shared declaration inventory reports no issues.
Curated [direct27 counterexample](../../dossiers/func_002AAC60-b390f0a1ac.md)
compares natural indexing before the lifetime fix against canonical C; current intake
validates its reference closure. No redundant final-source archive or routine trials.
Scoped source/config/research/cursor commit only; unrelated files remain excluded.
No structural/tooling changes, pin updates, push or cleanup. Retain sole production
ownership and await Director's next complete-wave integration assignment.
