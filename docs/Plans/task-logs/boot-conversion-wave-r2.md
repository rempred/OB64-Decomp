# Boot conversion wave R2

Active worker /root/boot_materializer_reasoning; launch BOOT-CONVERSION-WAVE-20260907-02, local. Main baseline b3b97c7dbf2023562b5c683faa37e7d3b4b58880, containing ready release 070bc6d and frozen R1 ded4167. Disjoint shared-dispatch records were already untracked. Sole production source/build writer; no other sources or tooling may change.

Plan: preserve fallback, inspect current pure compiler output and allocation behavior; test ordinary source expressions that preserve memory/call behavior but create a distinct final value pseudo. Canonical raw linked bytes falsify each candidate; normalized instruction scores do not prove exactness. If exact, run the single complete verifier for all original three members. Otherwise preserve bounded failures, restore fallback and report the missing evidence. No new semantic claims.

## Current-toolchain reasoning

The frozen plain source was recompiled diagnostically using the authenticated pinned cc1 and unchanged production flags, with pass-dump flags only. The normal workbench probe rejected target resolution before compilation; no tooling was edited. The direct diagnostic command and generated files remain under build/boot-conversion-wave-r2/. The production verifyCompiler check passed.

Plain schedule1 has separate pointer pseudo 90 and output pseudo 89. Pointer 90 dies at the final field load. Local allocation assigns both to register 2; global allocation preserves that choice. Thus the residual is a live-range allocation result, not a missing source field or relocation.

The task-local probes.js records sixteen independently derived source shapes. Pointer locals/address forms, cancellation arithmetic, signed storage, union/aggregate/array copies and pointer-typed reads retain the residual. Widening emits unwanted moves; byte-copy emits unaligned operations. Duplicated early-return control flow changes the larger tail; the inline form does not supply the desired final allocation. These are diagnostic observations, not canonical matching claims.

The conditional variant reads context once, reads field 08 once, then puts the same output store in both arms of an ordinary pointer condition. It preserves the final pointer live range through register allocation. Global allocation uses register 2 for the pointer and register 3 for the loaded value. schedule2 retains the condition; late-jump removes it and merges the identical stores. Final compiler assembly has the desired two register fields with one unconditional load and one store, and no added runtime effect. The condition provides no null protection; the field read still precedes it.

Canonical command: node tools/diff.js --profile func_00009EFC, log conditional.diff.log. This is the only production candidate so far. Raw linked bytes and exact relocation/source gates remain pending.

The canonical conditional candidate is EXACT PURE_C, 220 bytes, zero differing bytes, relocation MATCH; linked SHA-256 0EC181DF69EEE883C0C0BC6963D1B1D5B62E21F2D05A1CC6C947819862C91BD6. The final source only expands store-arm braces and adds the measured compiler-workaround explanation. Reset and recursive-clear source hashes still equal frozen R1. All three are now ready for the complete-wave gate. Command: node tools/verify.js; no preceding build or per-function verifier.
## Complete-wave mechanical result

Completed. The single final `node tools/verify.js` invocation exited 0 and reported `RESULT: EXACT BASELINE` at 2026-09-07T01:56:39.091Z. It passed baserom identity, authenticated toolchain, source policy, sole C ownership, placement, relocations, target bytes, complete ROM, and fresh source-to-object identity. No independent ordinary review or unchanged-input verifier repeat is required.

The final source keeps the original calls, accesses, ABI and nested guards. All assembler escapes are removed. Only the materializer source changed during R2; reset and recursive clear retain their exact R1 source identities. The original materializer assembly reference remains available and is excluded from the accepted link.

| Target | Source class | Owner section | ROM start (z64) | RAM start | Bytes | Relocations | Differing bytes |
|---|---|---|---|---|---|---|---|
| State reset, func_00003798 | PURE_C | .ob64.r0025 | 0x00003798 | 0x80073398 | 96 | 17 | 0 |
| Context materializer, func_00009EFC | PURE_C | .ob64.r0089 | 0x00009EFC | 0x80079AFC | 220 | 19 | 0 |
| Recursive payload clear, func_0000A1F8 | PURE_C | .ob64.r0093 | 0x0000A1F8 | 0x80079DF8 | 88 | 4 | 0 |

Each target has its corresponding `objects/c/<symbol>.o` as sole map contributor and no retained original-assembly slice. Every linked relocation word matches. The existing legacy relocation contracts are unchanged. The normal verifier independently confirmed the accepted placement and full owner bytes.

### Exact evidence identities

The complete report, state, fresh compilation, source-policy report, build report and three source-object proofs are preserved under ignored `build/boot-conversion-wave-r2/`. `final-evidence.json` binds their hashes, final source identities, map ownership, accepted placement and linked target hashes. `collect.js` asserts the three requested source classes and byte gates, checks source identities against the live files, and copies the evidence. It is a task-local evidence collector, not a substitute verifier.

- CURRENT fingerprint: `B5C6D8C3CC53B6B5E114285FF47E18807CFA884E84CF25D39981AD5A9B078661`.
- Complete normalized 41,943,040-byte ROM SHA-256: `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
- Final verifier SHA-256: `2C9202DFE5FDC058B856BD63192D00A4F0259821F6ABD3739A08CEF9D803EBCC`.
- Fresh compilation SHA-256: `B96E9893E33787E9D61E3E247327AF941B6D190DA5A8BE5935A5614B33EEDD5C`.
- Final source-policy SHA-256: `860F1D35199910E5AF89EE05F68FBB60621EDFFD2ADA76A3D29F92EE1437AABE`.
- Build report SHA-256: `A61A702410F1F4651B1DCAF9F36C8D360845E3382326A4F072182840B82A6872`.

| Final authored source | SHA-256 |
|---|---|
| src/boot/boot_resource_state_reset.c | 7DA5612547A5F8C14395BF65EE47C98A028E0EDF02FE7FB23FBFD2BD01AC3B97 |
| src/boot/boot_resource_node_lzss_context_materialize.c | E11968569AE0AFBD6F9465282BAB5595F258F0C64BAE3B1A113C43A5BF2BB25B |
| src/boot/boot_resource_node_recursive_payload_clear.c | B60D012400C5054F0874B93F34B0C5271E6BF5B93B8923E7D7FFB9A29AA82DDF |

The matching result is mechanical evidence at these exact inputs. It adds no stronger function/field meaning, no inherent-assembly claim, and no general compiler recipe. R1's four failed variants remain frozen negative evidence; the successful later-lifetime source form resolves that bounded blocker.

No shared tool, compiler identity/flags, linker rule, owner, overlay, boundary, source-policy rule or target/linkage registry changed. No external decomp source, runtime operation, agents, branch/worktree, staging, commit or push was used. Disjoint Director, selector input-copy and dispatch-review records remain untouched.
## Terminal handoff

`node tools/status.js` exited 0; its generated output is preserved in `status.log`. `git diff --check` passed. Final tracked production scope is only the materializer source; the two R1 sources remain unchanged. The task evidence root remains ignored. `final-evidence.json` SHA-256 is `223A351D3062629A62670756FD9C4D34DEEEA1952237969110156C03FD1AECF7`.

Main at terminal inventory is `ecc15179e6c24089fb2a2481ec96822a7d256766`; intervening Director records were disjoint from production inputs. The complete claim still matches the launch identity. Disjoint training-capture retrieval records observed at terminal inventory were preserved.

This report is complete and frozen on terminal handoff. All production source/build and owned record writes are released to `/root`. No command remains running. The Director can record the complete three-target wave using this exact-input proof; unchanged intake requires no repeated verifier. No further correction or semantic-document change is proposed.
