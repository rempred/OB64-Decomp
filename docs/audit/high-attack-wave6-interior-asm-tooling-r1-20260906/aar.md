# Retained interior assembly tooling — worker report

Completed implementation and verification; independent structural review remains pending.
The full audit passes on the unchanged production-source baseline, and isolated actual-C probes exercise the new capability.
No production ownership is activated by this report.

## Assignment and preserved baseline

Assignment `high-attack-wave6-interior-asm-tooling`, revision 1, launch `HA-W6-INTERIOR-ASM-01`.
Worker `01a073b7-2265-7580-a386-0b4bff7e94b3`, local, Astra Medium.
Subject: `C:/Users/Joe/Projects/OgreBattlel64/high-attack-wave-5`, branch `codex/high-attack-wave-5`.
Starting HEAD: `841462eceb640d61f0393b4a60427d1abaf84d23`.
The Director separately activated the assignment after the ready routing freeze `30326c62196005c5dea00f04e312b6b401c64f74`.

The exclusive claim was the first task write and passed complete identity readback.
Current source/configuration bytes were authenticated against the complete r9 evidence index, including Git-normalized source bytes.
The baseline inventory records 7,111 protected files and the original implementation hashes.
Production source, assembly, configuration, boundaries, descriptors, compiler/tool identities, inactive drafts, archives, and prior reports remain protected.

## Implemented contract

`preservedInteriorBefore` explicitly retains one original-assembly interval immediately before a noninitial C auxiliary fragment.
It authenticates source identity, canonical interval bytes, read-only shape, exact ROM/RAM placement, and actual relocation handling.
Ordered coverage requires the interval to start after the preceding C fragment and end at its following fragment.
Missing, overlapping, duplicate, reordered, or contradictory coverage rejects.
The row remains one accepted output section and retains its existing load-segment mapping.

The producer extracts authenticated bytes from the complete original row and creates a uniquely named, alignment-one retained object.
Explicit linker selectors interleave that object with C auxiliary contributions.
The verifier reconstructs bytes from the original fallback and checks the generated binary, object, linked interval, manifest, layout, and source-object proof.
Map checks compare the complete ordered row contribution census, including exact object paths, addresses, and sizes.
Status accounting retains these bytes as assembly, never C replacement bytes.

The bounded capability supports literal, relocation-free original data rows only.
The explicit empty relocation contract is checked against actual original-row REL/RELA sections before extraction.
Any nonempty original-row relocation rejects, including relocations outside the selected interval.
Generated interval objects must also have no nonempty REL/RELA sections or named non-section symbols.
Relocating assembly expressions require separately evidenced support; no live relocation is silently stripped.

Compiler padding remains separate. C entries, occurrence padding, trailing padding, exterior prefixes, and exterior tails retain their existing checks.
No compiler assembly rewrite, C-source injection, fabricated entry, padding substitution, or invented relocation represents retained assembly.

## Isolated row and actual-C evidence

The fixture uses the accepted resource-loader slab, not historical comments or early-boot arithmetic.
Original row `.ob64.r4248` remains ROM `[0x00239EC0,0x0023A3A0)` and RAM `[0x801F6BF0,0x801F70D0)`.

| Contribution | Isolated probe interval | Bytes | Production disposition |
| --- | --- | ---: | --- |
| B06C C table | `0x00239EC0..0x00239EE8` | 40 | Existing accepted table unchanged |
| Retained original assembly | `0x00239EE8..0x00239F28` | 64 | Still part of existing B06C remainder |
| EF50 candidate C table | `0x00239F28..0x00239F48` | 32 | Still assembly-owned |
| Final original assembly | `0x00239F48..0x0023A3A0` | 1112 | Still part of existing B06C remainder |

The interval's canonical SHA-256 is `C06E0C3DE2F47A65DDC68064F08498FC85592F18F24859DB20259D14681F8411`.
Its actual original and generated relocation censuses are both empty.
The isolated retained object SHA-256 is `FE46675A13486DF4C97F6AED7DC39B60F1D0450899DC6EBD8B092084CD69176C`.

The tracked fixture uses symbolic assembly table proxies to test real relocations and linker ordering.
Those proxies are not C implementations or PURE_C evidence.
A separate placement-only variant resolves B06C/D14C/EF50 coverage, including D14C's two occurrences and four-byte compiler alignment gap.
It does not compile or accept D14C. Overlapping a D14C C claim with the retained interval rejects.

The separate actual-C probe uses the unchanged active B06C source and frozen archived EF50 source.
Fresh scratch compilation reproduces the frozen EF50 object identity and its actual 29 text relocations.
The isolated fixture's EF50 relocation contract is derived from that observation, not accepted as a new production contract.
The normal compiler, original-chunk replacement, linker, full-ROM comparison, and source-object proof paths pass for the two-target probe.
Independent fresh compilation reproduces both C objects and compiler assemblies; fresh retained-object generation reproduces the interval object.
Both real sources are mechanically PURE_C within the probe, without establishing new production matching-C acceptance.

The probe's synthetic `build-report.json` exercises CURRENT completeness only and explicitly identifies that scope.
It is not a production build report and must not substitute for full recorded-build acceptance.
Proof, cache, CURRENT, manifest, and layout controls reject omitted or stale interval evidence.
A separate in-memory recorded-build fixture reconstructs the actual artifacts and passes the normal recorded-build validator.
Five mutations reject missing, duplicate, stale-object, omitted compiled, or stale verified interval records.
That fixture remains explicitly isolated rather than claiming accepted production configuration.

## Causal changed-file inventory

| File | Reason |
| --- | --- |
| `tools/lib/auxiliary_interior.js` | Central contract projection, original-row authentication, retained-object generation, and artifact reconstruction |
| `tools/lib/active_targets.js` | Normalize and resolve explicit intervals; require ordered gap-free shared-row coverage |
| `tools/lib/phase8_matching_c.js` | Carry intervals through production, linker order, manifests, layout, map/ELF checks, proofs, and recorded-build validation |
| `tools/build_phase8_matching_c.js` | Record generated interval artifact identities per target |
| `tools/lib/diff_object_cache.js` | Bind the helper identity and independently reconstruct compiled interval metadata |
| `tools/lib/current_workflow.js` | Invalidate stale implementation reuse, authenticate interval artifact closure, and regenerate retained objects during fresh verification |
| `tools/lib/matching/diagnostic_link.js` | Include the causal helper in workbench comparison identity; diagnostic acceptance rules are unchanged |
| `tools/lib/status_accounting.js` | Authenticate interior retained-byte records and keep their bytes in assembly accounting |
| `tests/auxiliary_interior.js` | Original-row linker fixture, D14C placement variant, accounting, and malformed-input controls |
| `tools/test.js` | Include the new fixture in routine regressions |
| `docs/AUXILIARY_INTERIOR_ASSEMBLY.md` | Document the bounded implementation and pending independent review |
| `docs/KMC_GCC_MATCHING_NOTES.md` | Link the separate assembly capability without conflating it with compiler padding |
| This AAR and `evidence-index.md` | Record assignment-specific results, limits, commands, and artifact identities |

The new interval projection has schema version 1 and kind `retained-original-assembly`.
Outer schemas remain unchanged; strict reconstruction requires the new evidence and implementation fingerprints invalidate stale artifacts.
Build records require exact interval lists, including empty lists for targets without intervals.
The C-object cache does not cache retained assembly artifacts; it binds their contract and reconstructs metadata.
CURRENT and full verification authenticate retained artifacts independently.

Broader accepted workflow/source-policy/audit wording was not rewritten before review.
After acceptance, contiguous-only auxiliary wording can describe complete C-plus-explicit-assembly coverage.
Such documentation integration is a Director decision, not an authorization granted here.

## Experiments and limitations

The first fixture failed its map parser after producing correct linked bytes.
Pinned GNU 2.6 emits extra size/format fields and an object-overhead suffix; the initial parser included those fields in the object path.
It also read beyond the row into the discard block.
The narrow correction parses the observed grammar and compares exact paths within the row boundary.

The first expanded D14C fixture failed because its synthetic target omitted the accepted chunk identity.
The fixture now derives that identity from the accepted owner; no gate was relaxed.
Both failed runs and their logs remain preserved.

## Final validation

The final full audit exited zero at `2026-09-06T12:24:00.629Z`.
It passed structural setup, CURRENT ownership/placement/relocation checks, independent proof reconstruction, and fresh compilation of all 547 active sources.
The generated audit records zero UNKNOWN classifications and zero compiler-assembly rewrites.
Existing HYBRID_C classifications remain honest; no class was upgraded by this tooling change.

The canonical, baseline, and CURRENT ROMs are byte-identical, each containing 41,943,040 bytes.
Their SHA-256 is `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
CURRENT fingerprint: `C9CAD79080A3D3AF8EEEC2F3564BC7E82AAEAFA772660DA03F4F7A9F05196EC1`.
Baseline fingerprint: `E448F0A578F3D0F6ABE56F8071BE14FB8CF3CFF44BF18DD62797B6E49BD0DA1E`.
The audit built CURRENT when needed; no redundant full build preceded it.

| Check | Final result |
| --- | --- |
| Interior original-row fixture | Pass; 37 negative controls |
| Actual B06C/EF50 C probe | Exact complete ROM, reconstructed proofs, fresh object parity; fourteen evidence controls |
| Isolated recorded-build reconstruction | Pass; five missing/stale/contradictory record rejections |
| Routine tooling suite | Pass; 14/14 suites |
| Existing diff cache regression | Pass, including stale entries and source identity |
| Existing repeated-table regression | Pass; exterior ownership and occurrence checks preserved |
| Existing internal-padding regression | Pass; 34 negative controls |
| Final Phase 8 recorded-build/proof regression | Pass on new CURRENT, including prefix and source-object-prefix controls |
| B06C generated remainder regression | Pass; unchanged 40-byte table and 1,208-byte assembly remainder |
| Full structural audit | Pass; exact baseline/CURRENT and independent fresh compilation |

The final proof snapshot reauthenticates all 7,111 protected files, exact claim, unchanged HEAD/branch, and all selected artifact identities.
Production has no new interior contracts. EF50, D14C, B1F4, and B438 remain inactive.
All fourteen active Wave 6 source identities are preserved; their final source classes are recorded in the closure evidence.
The evidence index binds twelve changed implementation/documentation surfaces, eleven final report snapshots, command captures, and selected probe artifacts.
`closure.json` records the final exact-scope, staged-change, preservation, and deliverable-hash checks before callback.
No staged changes or commits are part of this handoff.

## Handoff boundary

Files remain uncommitted. No branch, worktree, task, subagent, runtime session, integration, push, or publication was created.
EF50 and D14C remain inactive. No ordinary source was tuned or activated.
The structural audit on the mixed baseline does not complete the original seventeen-owner wave.
Independent review follows Director freezing before this capability may support new production ownership.
