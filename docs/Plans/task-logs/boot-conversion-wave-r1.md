# Boot conversion wave R1

In progress. Serious pure-C conversion attempts cover all three boot targets in one wave.
Task `boot-conversion-wave`, revision 1, launch `BOOT-CONVERSION-WAVE-20260906-01`, receiver `/root/boot_conversion_preparation`, host local.
The complete fresh claim was created atomically before this write and read back.
Canonical main baseline: `7cee61409400dca6c2d8b69bb654f59f68be09f4`; accepted source commit `81340e1`.
Parent main: `f940a2825ac97453746d3e9cef9c5cabc60a8dd2`.
Only disjoint selector-observer review claim/report paths were untracked at launch.
Required guides were read in this continuing worker context; scoped Git comparisons confirm the canonical/parent rules are unchanged since those reads.
Read the new ready prompt and refreshed the current sequential program and frozen preparation index.
The previous exact proof has CURRENT fingerprint `DB5D230370D66813C424F62AB2AC3AC9AACD0D83DC2D46097EB18952B5455CDF` and verifier hash `265DAFB0D3031DBA41D62545F9B3B976740A72A8B08DF5C8B44B49C4740A22AE`.

Owned production scope: three named boot sources and narrowly necessary existing target/linkage records. Sole source/build writer role is active.
No shared tooling, foundations, external source/comparison excerpts, agents, branches/worktrees, staging, commits or push.
Plan: retest structured ordinary C under KMC/GNU 2.6, classify and diff one target at a time, then run one final verifier only if the full wave is ready.
Leading hypothesis: historical assembler scheduling/move behavior explains some old barriers. Alternative: current compiler allocation still blocks an exact pure source.
Concrete source/object/linked mismatches will distinguish those hypotheses. A blocker will not silently remove another target from the assignment.
Baseline hybrids and every useful attempt remain preserved under ignored `build/boot-conversion-wave-r1/`.

## Reset experiment 1

Rechecked the retail 96-byte owner and current source. All four byte clears execute before the pointer helper body; byte 0 occupies its call slot.
Removed both inline blocks and expressed byte 0 as an ordinary volatile store before the helper call.
Retained the original C declarations, local return value, earlier calls/stores, pointer replacement, and trailing word clear.
Command: `node tools/diff.js --profile func_00003798`.
Candidate and log: `func_00003798.plain.c` and `.log`.

Reset experiment 1: EXACT, PURE_C, zero differing linked bytes, relocation contract MATCH.
The preserved `func_00003798.plain.diff.json` reports SHA-256 `84F0EC20AB3394D1D0427F687176E6986B9EC3E965C1BF8F1CBF0485BF304C75`.
No workaround is needed under the current toolchain. The result remains provisional until the complete wave gate.

## Materializer experiment 1

Rechecked the 220-byte retail owner, including context reloads, zero-size store, and final field-08 copy.
Removed both inline call sequences and every register binding/zero-register addition.
Expressed ordinary calls, assignment-result allocation, nested null guards, a local size and a scoped final output scalar.
Retained existing field/prototype/global declarations without stronger semantics.
Command: `node tools/diff.js --profile func_00009EFC`.
Candidate and log: `func_00009EFC.plain.c` and `.log`.

Materializer experiment 1: PURE_C, 220 bytes, relocation MATCH, two differing bytes at ROM 0x9FBD and 0x9FC5: final field load/store uses v0 instead of v1. Experiment 2 tests unsigned increment/decrement cancellation to change the temporary lifetime without changing its value. Canonical diff follows.

Experiment 2 preserved the identical two-byte residual. Experiment 3 tests a volatile-qualified final field access in scratch C to distinguish load allocation. No access is added; no broader semantic claim about volatility is made.

Optional scratch watch rejected target resolution before compilation. No tooling changes attempted; canonical diff resolves the accepted owner and is used for experiment 3.

Experiment 3 gives the identical 220-byte output and two-byte register residual. Experiment 4 tests the ordinary C register storage hint on the final scalar (no hard-register binding).

Experiment 4 again emits the identical PURE_C residual. Materializer remains blocked on final pseudo lifetime/coalescing: v0 must remain the context base while v1 receives field 08. Four supported source forms did not do that. Smallest next evidence is a bounded KMC pass/lifetime probe identifying when the field-result pseudo coalesces with the context pointer and a source lifetime construct preserving separate pseudos. This is not evidence of inherent assembly. Restored the exact accepted hybrid source byte-for-byte; all pure attempts remain ignored evidence. No acceptance verifier yet, because the requested complete PURE_C wave is not ready.

## Recursive clear experiment 1

Independently rechecked the 88-byte original owner. Test plain node parameter, three ordered recursive calls, conditional payload helper and zero store; remove both hard-register bindings and the empty asm barrier. Preserve field offsets, guards and stores. Canonical linked diff follows.

Recursive clear experiment 1: EXACT PURE_C, 88 bytes, zero differing bytes, relocation MATCH. The old hard-register hints and empty asm barrier are unnecessary under the current authenticated toolchain. Preserved report: func_0000A1F8.plain.diff.json; linked SHA-256 69B7DDC2BBE57502B94FE914DD0D699C58FBA7DA7ACC35997E32C73E4F9767F4.

## Terminal handoff: blocked complete PURE_C wave

All three assigned targets received current-toolchain pure-C attempts, sequentially. Reset and recursive clear remain as exact provisional PURE_C candidates in their owned production sources. Materializer is restored byte-for-byte to its accepted HYBRID_C fallback. Its four failed pure-C candidates, canonical reports and logs are preserved under build/boot-conversion-wave-r1/. None is matching-C acceptance.

No final full-ROM verifier was run: the complete requested PURE_C wave is not ready. No target/linkage records, shared tooling, compiler identity, foundations or external source were changed. No runtime, agents, branches/worktrees, staging, commits or push. No ordinary independent review requested. git diff --check passed. Only the two successful candidate sources differ; disjoint Director/research records were preserved. Current main at terminal inventory: 5400e91245088ba9f273561fecf0e00b248d906d.

The materializer's raw differences are owner-relative 0xC1 and 0xC9 (ROM 0x9FBD and 0x9FC5), selecting v0 instead of v1 in the field-08 load/store. All four candidates produce 220 bytes and SHA-256 AFC7D7E49A58D0741E34EFA5EB02D04A8978CC84334EF52EBFA0A11A0192226F, versus retail 0EC181DF69EEE883C0C0BC6963D1B1D5B62E21F2D05A1CC6C947819862C91BD6. Their relocation contracts match. The decoded-row EXACT summary masks this register residual; raw byte differences are authoritative.

Next bounded research should inspect the final context-pointer and loaded-value pseudo allocation in authenticated KMC pass dumps, identify the coalescing point, and test an ordinary-C lifetime/type expression that keeps the loaded value in a distinct register without changing ABI, memory accesses or emitted instructions. The four failed forms establish only their failure; they do not establish an inherent assembly requirement or impossibility of PURE_C.

### Exact retained identities (SHA-256)

| Artifact | SHA-256 |
|---|---|
| src/boot/boot_resource_state_reset.c | 7DA5612547A5F8C14395BF65EE47C98A028E0EDF02FE7FB23FBFD2BD01AC3B97 |
| src/boot/boot_resource_node_lzss_context_materialize.c (restored baseline) | 46E7B84D3A344BCF23AECE92D2AC81684A43A0593CE72977383431871A19076C |
| src/boot/boot_resource_node_recursive_payload_clear.c | B60D012400C5054F0874B93F34B0C5271E6BF5B93B8923E7D7FFB9A29AA82DDF |
| func_00003798.plain.diff.json | 618AE16C0735EC4F63B0C08C82AB15C20D6192D5D0D7B107889E3BA244214487 |
| func_00009EFC.plain.diff.json | 2468B00C981B961A14D17E9D6F871F0049CE9D66FA3B72BA850343381237B3AD |
| func_00009EFC.cancel.diff.json | AB02635A893586CEAE1170BC1D2B4BB495985C04FDCB9CB19FB01DF4AD8E628A |
| func_00009EFC.volatile-field.diff.json | 68EAA0DDD1A91CB0C6E8634F751804AB946ABD3CB31C756732D84946437CAC2E |
| func_00009EFC.register.diff.json | C029F1E1C306019A5BB0FA5E061585A1AEE6B6426A8C2171D2EAF5CA5A871F37 |
| func_0000A1F8.plain.diff.json | 03024BD68432B0F367DE8FDE04234F6AB1A32E19E4BC0F87E944B7B4622B33F7 |

Report paths in the table without source prefixes are under ignored build/boot-conversion-wave-r1/. Previous accepted complete-ROM proof remains the readability-wave proof recorded above; it does not accept these changed sources.

The claim remains as the immutable launch record. This terminal report returns control to /root and releases all production source/build and owned report writes. No command remains running.
