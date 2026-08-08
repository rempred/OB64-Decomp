# Phase 3 p3063 pure-C migration task log

Status: completed. p3063 is `PURE_C` after only its local move macro was removed, with exact target and retail ROM bytes. This result proves the adapter's first production rewrite. The Director must intake the uncommitted result and route independent critical review.

## Activation

- Task ID: `ob64-retail-dialect-phase3-p3063-pure-c`.
- Assignment revision: `1`.
- Launch ID: `bdd8a3caac774cf5af0e78182a5680a3`.
- Receiving task ID: `/root/phase2_worker`.
- Director task ID: `ob64-retail-dialect-implementation-director`.
- Director collaboration ID: `/root`.
- Host ID: `codex-desktop-current`.
- Inventory profile: `NORMAL`.
- Human gate: none.
- Claim: `docs/Plans/task-logs/ob64-retail-dialect-phase3-r1-bdd8a3caac774cf5af0e78182a5680a3.claim.json`.
- Claim SHA-256: `9479429840750B9AAA63BC1AA1B34E5B6F878994F11A6C65D8D1273362158D3D`.

## Baseline

- Parent branch and HEAD: `main` at `1ac946fae7fee8e601902da8c3234b8e3b8eef62`.
- Decomp branch and HEAD: `main` at `8b35468b82f2e0b0afd7aa9729926b064b9ba328`.
- Decomp upstream state: `main...origin/main [ahead 6]`.
- Accepted Phase 2 worker commit: `4fc51f3590004fba670b2e3b679d4602bcee2313`.
- Accepted Phase 2 review commit: `8b35468b82f2e0b0afd7aa9729926b064b9ba328`.
- Assignment SHA-256: `0E9F64442D3167284AF9D9CCDCEA714809BFA9EE41D0B6016D3DA8EF01E76D58`.
- Starting p3063 source SHA-256: `284DC9EC2BF1ACBC31DE8E81F33B85393B89CEBE15309B162A39540C5302DA5D`.
- Starting p3063 source diff against HEAD: empty.

The accepted Phase 2 review record has SHA-256
`97008650A257791CBB7A6570B75885469A7EE2609A65A81DF792CBBD3E6BEAA4`.

The initial `NORMAL` inventory contained these pre-existing paths:

- `config/README.md`
- `config/matching-c-targets.json`
- `config/phase7/conventional-build.json`
- `config/phase8/matching-c.json`
- `docs/NEXT_STEPS.md`
- `docs/PLATFORM.md`
- `docs/subsystems/map-ai-eset-runtime.md`
- `tests/phase7_conventional_build.js`
- `tools/build_phase7_conventional.js`
- `tools/lib/current_workflow.js`
- `tools/lib/phase7_conventional.js`
- `docs/Plans/prompts/ob64-retail-dialect-phase3-p3063-pure-c-20260808-r1.md`
- `docs/audit/2026-08-07-func-0019554c-slab-placement-blocker.md`
- `src/lib/func_00195410.c`

The assignment names active external p3063 permuters in isolated roots. They remain outside this workspace and task authority. The worker will not inspect, control, or alter them.

## Mutation boundary

The only authorized source edit is removal of the local `.macro move` block from
`src/lib/func_0019554C.c`.

The worker can add only this claim, this task log, the assigned evidence index, and the assigned AAR.

Infrastructure, configuration, queue, placement, ownership, relocation, target, and other source files are read-only for this assignment.

## Technical plan

1. Record the initial `HYBRID_C` classification and exact source identity.
2. Remove only the translation-unit-local move macro.
3. Prove the source diff contains no other change.
4. Require `PURE_C` with zero assembler mechanisms.
5. Run the canonical diff and target verifier with `--require-pure`.
6. Compare raw and dialect assembly independently.
7. Require fourteen numeric moves, fourteen transformations, and unchanged explicit OR statements.
8. Run two clean external builds and strict verifiers.
9. Compare reports, proofs, objects, targets, relocations, and linked outputs.
10. Run the normal full verifier and heavyweight audit.
11. Write the evidence index and AAR for Director intake.

The strongest risk is an unintended syntax or source change producing the wrong transformation set. Exact source diff and raw-to-dialect statement comparison distinguish that failure.

## Activity

- `2026-08-08T06:55:48.7872865Z`: Created and verified the fresh Phase 3 claim.
- `2026-08-08`: Confirmed both repository baselines and the ready prompt.
- `2026-08-08`: Confirmed the p3063 source matches its required starting SHA-256 and has no tracked diff.
- `2026-08-08`: Read the accepted Phase 2 worker and independent-review records.
- `2026-08-08`: The pre-edit source-policy command reported `HYBRID_C` from one raw and one preprocessed `asm` token.
- `2026-08-08`: The pre-edit source-policy report had SHA-256 `ED0516ACA6EA781081348CFC94C033FFC4CBE978A50346AF82ED7A0045AFBF85`.
- `2026-08-08`: Removed only the four-line C statement that defined the local three-line assembler macro.
- `2026-08-08`: The source diff contains only that macro removal.
- `2026-08-08`: The post-edit source SHA-256 is `4FBF235DB64C85E84A2AD7DF7118346749587FBB2986EE00DF613EF9C8D3E121`.
- `2026-08-08`: The post-edit source-policy command reported `PURE_C` with an empty reasons list.
- `2026-08-08`: The post-edit classification digest is `2C6797CC30FD718E72CD967FB82C312366586F31C99F20E4B21C4241646FF7D4`.
- `2026-08-08`: The post-edit source-policy report had SHA-256 `A932BF0CFDBDE7834F1BF61C49B7ECDC3988A2328734660C4AB19317173ACF76`.
- `2026-08-08`: `node tools/diff.js func_0019554C` reported `PURE_C`, score `0 / 16100`, and exact raw linked bytes.
- `2026-08-08`: The diff target SHA-256 matched `5985A5DFC866D4EFFB58C0E412AA76A8E0AE8DA0EF19BB8E44A6BF278C2A5E2B`.
- `2026-08-08`: The diff report had SHA-256 `0A6A3EB97D7A74DDB4C87DF0C8EF6C286B3AB3C98F0217830A87D7D1FD0850E3`.
- `2026-08-08`: Independent assembly comparison found fourteen numeric moves and only fourteen adapter rewrites.
- `2026-08-08`: All six explicit OR lines and every other assembly line remained byte-identical.
- `2026-08-08`: The focused link retained section `.ob64.r3063`, runtime VMA `0x802150BC`, and z64 range `0x0019554C..0x001957D0`.
- `2026-08-08`: The focused link retained 644 bytes, sole owner `objects/c/func_0019554C.o`, 31 `.rel.text` records, and one `.rel.pdr` record.
- `2026-08-08`: `node tools/verify.js --target func_0019554C --require-pure` passed in 607 seconds.
- `2026-08-08`: The verifier reported exact ownership, placement, relocations, target bytes, and full-ROM bytes.
- `2026-08-08`: The verified census is four `PURE_C` functions and 32 `HYBRID_C` functions with zero `UNKNOWN`.
- `2026-08-08`: `node tools/verify.js --target func_0002CD70` passed in 301.2 seconds.
- `2026-08-08`: The memset target remained `HYBRID_C` with zero transformations and byte-identical raw and dialect assembly.
- `2026-08-08`: Its target SHA-256 remained `9842231309587A8F054CE82E257F9DC0FD864608CF90266F53AFF570E37E1ADF`.
- `2026-08-08`: A Node read of the rebuilt z64 ROM confirmed `0x00801025` at both required function-relative offsets.
- `2026-08-08`: Clean external build A passed in 274.4 seconds at `C:\Users\Joe\AppData\Local\Temp\ob64-phase3-clean-e3f4795a61a64f8889d1b8669224f1f5\run-a`.
- `2026-08-08`: Build A reported 36 proofs, four pure targets, 32 hybrid targets, one transformed target, and fourteen transformations.
- `2026-08-08`: Build A produced exact retail ROM SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
- `2026-08-08`: Build A report SHA-256 is `F9A211F3E15BC483149D92BB71E342BED4082AAF9E8D3E19BAC22EB90F3799C5`.
- `2026-08-08`: Strict verification A passed in 179.5 seconds and recreated all 36 proofs.
- `2026-08-08`: Verification A reported one transformed target, fourteen transformations, and exact retail ROM bytes.
- `2026-08-08`: Verification A report SHA-256 is `9BAEB36BDBB588EB99C765BC9D4352A7E585BC85DD1A500C042AAF5E45199813`.
- `2026-08-08`: Clean external build B passed in 292.3 seconds at `C:\Users\Joe\AppData\Local\Temp\ob64-phase3-clean-e3f4795a61a64f8889d1b8669224f1f5\run-b`.
- `2026-08-08`: Build B reproduced A's census, transformation counts, exact ROM, and build-report SHA-256.
- `2026-08-08`: Strict verification B passed in 191.8 seconds.
- `2026-08-08`: Verification B reproduced A's report SHA-256 `9BAEB36BDBB588EB99C765BC9D4352A7E585BC85DD1A500C042AAF5E45199813`.
- `2026-08-08`: The cross-root reproducibility comparator passed all 36 targets and asm-differ proofs.
- `2026-08-08`: The reproducibility report had SHA-256 `AB0FCA84A0FF26D49F3D9580F2E4A644B63465F76F4A9D91707AD7A352E833FD`.
- `2026-08-08`: The canonical full verifier passed in 332.6 seconds.
- `2026-08-08`: It reported exact baserom, toolchain, source policy, ownership, placement, relocations, target bytes, and full-ROM bytes.
- `2026-08-08`: Its census remained four `PURE_C` functions totaling 772 bytes and 32 `HYBRID_C` functions totaling 6952 bytes.
- `2026-08-08`: The single connected heavyweight audit passed in 10,703.2 seconds.
- `2026-08-08`: The audit reconstructed all 6,184 tracked real-assembly owners before current verification.
- `2026-08-08`: Structural protections and current exact-ROM verification both passed.
- `2026-08-08`: The audit report had SHA-256 `B3D02E36F29247A96289549139609655C59B23282E6AC36ECD4312373334FA22`.
- `2026-08-08`: The final current fingerprint is `F344A83DD10D3002966172C7F179EA1D8A88B8ED2A5A331003DFDDF44A75005F`.
- `2026-08-08`: The audit recorded one transformed target, fourteen transformations, and 32 byte-identical hybrid targets.
- `2026-08-08`: Two registered read-only helpers extracted clean-build and audit identities after all execution gates completed.
- `2026-08-08`: Both helpers made no change and ran no build.
- `2026-08-08`: Final static comparison confirmed fourteen move rewrites, six unchanged OR statements, and zero other assembly-line changes.
- `2026-08-08`: Final source inventory found only the authorized tracked p3063 change under `src/` and `asm/`.
- `2026-08-08`: The pre-existing p3062 source retained its accepted 1,901-byte SHA-256.
- `2026-08-08`: The evidence index had SHA-256 `07263C7EB7E974952B6AB98B9EF5FC5658177451803206EB60E889D5F3537207`.
- `2026-08-08`: The AAR had SHA-256 `8DF3C5AECD28F5B65E0E6E6002B8A8472DD1CD407391F8A0FA4FCBF4FF45E420`.

## Failures and deviations

One read-only diagnostic error occurred.

- A read-only PowerShell big-endian decoder truncated the two memset words to their low byte.
- A direct Node `Buffer.readUInt32BE()` read produced both required `0x00801025` values.
- The incorrect diagnostic changed no file and was not used as game evidence.

## Next action

The Director must inspect attribution and create the Phase 3 worker-result commit.

The Director must then route independent critical review. The function queue remains paused until accepted review.
