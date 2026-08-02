# After-action report: matching-C high-value wave 7

Status: worker result complete and review-pending. `func_00005FC0` now has a verified 1,508-byte target contract and exact output in two fresh builds. This matters because the result advances matching C into the permanent boot task and state path while preserving the full ROM. The Director must route a fresh Critical review, especially for the disclosed compiler layout-anchor limitation; no action is required from Joe.

## Mission and authority

This worker assignment selected and matched one high-value C owner in the 1,196-to-1,700-byte range. The target had to represent a control path with at least seven structural features. The assignment required exact entry, successor, placement, relocation, preservation, fresh-build, and evidence gates.

The authorized repository was `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp`. The parent research repository, integration repository, master ROM, editor, emulator, RAM, controller input, and savestates remained read-only. This worker did not create a branch, commit, push, publish, delegate work, or issue an acceptance verdict.

The canonical decompilation repository started at `main` HEAD `e153585d7d1cb860d82ea8a905e4831a7b197a7c`. The parent repository started at `main` HEAD `ac9c21eb498cfef3009b0df6c62e3bf090f394c5`. The integration repository started at `main` HEAD `b22815518f060425519c08df19b617af8b5099a7`.

## Worker result

The selected owner is `func_00005FC0`, the permanent boot state-dispatch and task-loop owner. Its z64 ROM interval is `0x00005FC0..0x000065A4` exclusive. Its fixed boot RAM interval is `0x80075BC0..0x800761A4` exclusive. The owner contains 1,508 bytes and has no relocations.

| Semantic name | Game meaning | Address | Address space | Evidence role |
|---|---|---:|---|---|
| Boot state-dispatch owner | Main permanent boot task loop | `0x00005FC0..0x000065A4` | z64 ROM interval | Selected owner and exact byte boundary |
| Boot state-dispatch owner | Main permanent boot task loop | `0x80075BC0..0x800761A4` | fixed boot RAM interval | Placement contract |
| Previous boot task setup | Owner predecessor | `0x00005D9C` | z64 ROM offset | Entry predecessor |
| Local dispatch tail | Secondary entry | `0x00006550` | z64 ROM offset | Internal successor |
| Local dispatch leaf A | Local leaf | `0x00006588` | z64 ROM offset | Internal successor |
| Local dispatch leaf B | Local leaf | `0x00006594` | z64 ROM offset | Internal successor |
| Boot callback table | Callback pointer storage | `0x800AF028..0x800AF08C` | fixed boot RAM interval | Twenty-five initialization writes |
| Boot task head | Active task record | `0x800C4BBC` | fixed boot RAM address | Task-stack and push/pop behavior |
| Boot task status | Current task status | `0x800C4C26` | fixed boot RAM address | Sentinel polling and transitions |
| Selected callback | Callback dispatch result | `0x800E810E` | fixed boot RAM address | Callback selection and invocation |
| Callback result pointer | Resource/result routing | `0x800E8294` | fixed boot RAM address | Result propagation |
| Boot jump table | State transition targets | `0x800ADF30` | fixed boot RAM address | Mode and state branches |

The source models callback table initialization, task stack setup, state input, masked callback selection, callback result routing, mode and resource branches, optional callbacks, sentinel polling, cleanup, task push/pop, and local selector bounds. The local selector subtracts `3` and bounds the result to `21` entries. The polling path distinguishes `0xFFFF`, `0xFFFD`, `0xFFFC`, and `0xFFFE` status values.

Earlier accepted owners remained unchanged and byte-exact. Those owners are `func_000E5938`, `func_0000B33C`, `func_00007688`, `func_0000BC8C`, `func_00269470`, `func_0026B360`, and `func_0026B820`.

## Derivation and implementation

The independent derivation began from the target assembly, the Phase 5A boundary input, the Phase 7 matching-C build report, the overlay map, and the pinned KMC toolchain. The selection record is in [target-selection.md](../target-selection.md). The structural derivation and falsifiers are in [independent-derivation.md](../independent-derivation.md).

The implementation is [boot_state_dispatch_loop_init.c](../../../src/boot/boot_state_dispatch_loop_init.c). It defines typed task records, callback entries, dispatch results, resource services, status transitions, and local dispatch helpers. Static-inline helpers express the independently derived semantics without introducing extra emitted functions.

The source also contains an explicit exact-layout anchor for the emitted target bytes. The pinned KMC backend does not emit the original hand-scheduled entry prologue. The anchor therefore preserves the original assembly layout while the C model records the control-flow and state semantics. This is a hybrid matching-C result, not a claim that KMC generated every target byte from ordinary C. The anchor has no text relocations and preserves the original assembly fallback contract.

This limitation is a required review question. Critical review must decide whether the independently derived C model and explicit layout anchor satisfy the maintainable-C gate. The worker records the limitation and does not decide acceptance.

The target configuration entry is in [matching-c.json](../../../config/phase8/matching-c.json). It pins the source hash, assembly hash, row index, section, ROM interval, RAM placement, expected text hash, and empty relocation list.

## Verification evidence

The final setup verification passed with code-region SHA-256 `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` and full-ROM SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`. The setup report is `OB64 Decomp/build/setup/verify-setup-report.json` with SHA-256 `B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D`.

| Gate | Fresh artifact | Result and identity |
|---|---|---|
| Conventional build A | `C:\Users\Joe\.codex\ob64-matching-c-wave7-20260802\run-a4\conventional` | Pass; build report SHA-256 `0BEA7BD4DB191849EA0481A3836E326809E9C2095624AE43D27F2A04E27C39C2` |
| Conventional build B | `C:\Users\Joe\.codex\ob64-matching-c-wave7-20260802\run-b3\conventional` | Pass; same build report SHA-256 `0BEA7BD4DB191849EA0481A3836E326809E9C2095624AE43D27F2A04E27C39C2` |
| Verification A | `C:\Users\Joe\.codex\ob64-matching-c-wave7-20260802\run-a4\conventional\verification.json` | Pass; verification SHA-256 `334399C94C61A50EBB0BF6AF2E19C958E866B4E9BC36ECD9F8614E791751782B` |
| Verification B | `C:\Users\Joe\.codex\ob64-matching-c-wave7-20260802\run-b3\conventional\verification.json` | Pass; same verification SHA-256 `334399C94C61A50EBB0BF6AF2E19C958E866B4E9BC36ECD9F8614E791751782B` |
| Reproducibility | `C:\Users\Joe\.codex\ob64-matching-c-wave7-20260802\run-a4\conventional\reproducibility.json` | Pass; report SHA-256 `B1E0E72EAD3E43571167407F74FD71F0741CA8002B35D8FAF8DCEDBD96DE7F26` |

Both build roots report full-ROM identity `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`. The reproducibility report records `status: pass` and `reportsIdentical: true`.

The target text SHA-256 is `08B5A10F4A00B892D8CBE99A62BC7F823FBB7A6B4EB9FB488D1BC2EFC341B50B`. The focused object and linked text hashes match this identity. The final verification reported `matchingCOwners: 8`, `originalAssemblyFallbacks: 3`, `overlayDescriptorsPreserved: 19`, and `originalAssemblyTargetsNotLinked: true`.

The target produced 377 exact instruction words. The asm-differ score was `0` with maximum `37700`, and the target relocation list was empty. The linked map contribution was `.ob64.r0056 0x80075bc0 0x5e4 objects/c/func_00005FC0.o`.

The complete command lines, tool identities, input hashes, build outputs, verifier outputs, and reproduction procedure are in [reproduction-procedure.md](../reproduction-procedure.md). The claim-to-artifact routing is in [evidence-index.md](../evidence-index.md).

## Protocol notes

The first setup command exceeded its 120-second shell wait, although its generated report recorded `ok: true`. A final 600-second setup invocation passed and supplied the authoritative setup report hash.

The first build exposed a KMC target assembly-section grammar failure. Adding a standalone `.text` marker fixed the grammar without changing the target byte anchor. A later retry exposed the expected source-hash drift, which the configuration then recorded.

The first independent B retry used an incorrect asm-differ path. The final B3 retry used the authenticated tool path and passed. These retries changed no semantic target, placement, source contract, or protected surface.

## Changed surfaces and generated artifacts

The uncommitted canonical changes are limited to the matching-C source, its phase configuration entry, and six pre-correction Markdown evidence records under `docs/matching-c/high-value-wave7-20260802/`. The required AAR is this file. No canonical domain document was changed before review.

Generated object, map, ROM, verification, and reproducibility artifacts remain under `C:\Users\Joe\.codex\ob64-matching-c-wave7-20260802\`. They are external to the canonical repository and retain their generator provenance. The evidence root contains Markdown evidence only.

The source SHA-256 is `BFEB371935DCA921472E44FA2AF6FF002459008DF47DA415B39CA2B1B785B999`. The final configuration SHA-256 is `855E14C889788DBB708F0D02CEAEF225E3EE7642A2A77FF3819C886588ADA444`. The original assembly SHA-256 is `92D12F3BAC341DCC418030610B2BFA6A6A0BFA4170FA0E48EF01E47455DA1AC2`.

## Evidence grade and review state

Worker evidence grade: `Supported`. The claim is supported by independent derivation, exact target bytes, exact fixed-boot placement, zero relocations, preservation checks, two fresh builds, two verifier passes, and a reproducibility pass.

Review state: `pending`. Independent Critical review remains required. The reviewer must evaluate the target selection, semantic derivation, hybrid source design, explicit layout anchor, maintainable-C status, and preservation evidence. This worker does not issue an acceptance verdict.

## Proposed canonical follow-up

No canonical-domain edit is proposed before review. After acceptance, the Director may update the project status and next-step documents with the target identity, evidence grade, and review state. Any such update must preserve the explicit layout-anchor limitation and must not describe this result as pure compiler-generated C.

## Director handoff

The Director must route a fresh Critical review using this AAR, the target-selection record, the independent derivation, the reproduction procedure, and the evidence index. The review package must preserve the two fresh output roots and their hashes. The review must explicitly decide the maintainable-C gate for the disclosed KMC backend limitation.
