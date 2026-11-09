# Body/equipment integration

## Assignment and ownership

Integrator `ses_e43db0377ffeFRjZ89yj2KkFej` is sole production/integration owner
under Director `ses_e43ef7d4effe75r1xU4kjl9h0w`. November 9 dispatch authorizes
complete B01 integration, normal acceptance, research curation and scoped local commit
under the [B01/B02 program](../body-equipment-program.md). B02 was accepted at
`8eaabdfc`; B01 direct193 is complete and frozen. No private native checks are active.
Director owns program/queue/director-cursor and native communication setup.

## Current state — November 9, 2026

- Integration base: `main`, `8eaabdfcea6ffffe7dac6d5e2e4ad47058af9438`.
- Unrelated tracked/untracked work was inspected and is preserved.
- B02 is verified matching C in `src/lib/func_002AAC60.c`: complete 1,176-byte
  owner, preamble included; sole C ownership, exact placement/bytes and all 39
  actual relocations pass. Original assembly remains as fallback/reference.
- CURRENT: `5894EA0E55DBDB41BA76517755F5E8110AC032C4DD35E6313BEB49DD6BE14086`.
  `build/current/state.json` references the authenticated passing verification and
  fresh-compilation proofs. One final `verify.js --target func_002AB810 --require-pure`
  ran for complete B01, with one fresh build and exact complete ROM. B02 and the
  four accepted dependencies remain exact PURE_C in that same report.
  Evidence: `build/integration/body-equipment/b01-acceptance-evidence.json`.
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
- B01 is verified matching C: full 812-byte owner, sole C object `.ob64.r5487`,
  exact linked bytes, canonical 20-relocation contract. `src/lib/func_002AB810.c`
  preserves direct193's union, scope nesting and duplicate-inline workarounds;
  canonical external names resolve to original addresses. B02 calls this C owner
  at RAM `0x8023C0B0`. Full original ASM fallback remains tracked.
- Both private candidates are finished; no native check remains. Preserve the
  old `51174c7c86b20d82b20106f2/build` directory, selected storage, tools/runtime,
  original ASM/ROM and other referenced inputs; none were changed or cleaned.

## Research and next action — B01 verified

Canonical diff is EXACT/PURE_C with relocation MATCH; read-only evidence extraction
authenticated final reports/ROM and reconciled HI/LO/jump addresses to linked symbols.
No declaration-inventory issues for B01/B02. Current intake validates three curated
complete nonmatching controls: direct177 single initializer, direct190 variant-scope
allocation, direct191 wrong-scope scheduling; canonical C supplies the final example.
The shared lesson index remains within its supported 30-entry bound and now includes
B01 controls plus B02's accepted direct27 lifetime lesson; previous evidence remains
reachable. No duplicate final source or routine trial archives.
Scoped source/config/research/cursor commit only, excluding unrelated dirty files.
No tooling/structural changes, push, pin updates or cleanup. Retain sole production
ownership, stop after final native handoff, and await Director acceptance/closeout.
