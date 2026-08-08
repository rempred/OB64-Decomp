# Retail dialect Phase 3 independent critical review

Completed. Verdict: `accepted-with-notes`. Phase 3 safely removes only p3063's local macro and retains exact `PURE_C` retail output.

This matters because the accepted dialect adapter now has one independently verified production transformation. The Director may freeze this review and accept Phase 3.

The Director must preserve the coherent 36-target overlay. The function queue remains paused until the Director records its decision.

Review status: `accepted-with-notes`.

## Frozen subject and effective state

The frozen attributable result is commit `48f93cb1031b139fda2848882deac2db7c4d338c` on `main`.

Its parent is the accepted Phase 2 review commit `8b35468b82f2e0b0afd7aa9729926b064b9ba328`.

The effective state also includes the recorded dirty 36-target overlay. That overlay supplies p3062 and accepted slab placement.

The review used only reviewer-owned external copies for mutations and verification. No reviewed code, configuration, worker record, or generated evidence changed.

## Verdict basis

No admissible correction finding emerged.

The frozen source diff removes only p3063's local assembler macro statement. It changes no other source or assembly file.

Independent source policy reports `PURE_C` with no reasons. The current source begins at `src/lib/func_0019554C.c:1`.

Raw KMC output contains exactly fourteen supported numeric-register moves. Only those fourteen statements change through adaptation.

All six explicit numeric-register OR statements remain byte-identical. Every other assembly line also remains byte-identical.

The linked function retains exact placement, ownership, relocations, symbols, target bytes, and complete retail ROM bytes.

All 32 hybrid targets remain byte-identical passthroughs. The protected memset words remain unchanged.

Two clean roots reproduce all proofs, objects, target slices, relocation sets, reports, and major linked outputs.

The heavyweight audit belongs to the recomputed Phase 3 fingerprint and the same coherent build.

Reviewer-owned strict verification passed and reproduced the worker report byte-for-byte.

## Claims reviewed

| Assigned question | Result | Independent basis |
|---|---|---|
| Frozen source diff removes only the p3063 macro | Pass | Direct parent-to-result path and source diff |
| Source policy classifies p3063 as assembler-free `PURE_C` | Pass | Authenticated preprocessor and direct classification |
| Raw KMC output contains fourteen supported moves | Pass | Line-preserving raw assembly scan |
| Adapted output differs only at those statements | Pass | Exact line and line-ending comparison |
| Six explicit OR statements remain unchanged | Pass | Direct raw-to-adapted byte comparison |
| p3063 target remains the exact 644-byte retail slice | Pass | Direct ROM extraction and SHA-256 |
| Section, RAM placement, ROM range, and owner remain exact | Pass | Link map, readelf, and strict verification |
| Relocations and symbols remain exact | Pass | Direct GNU readelf plus normalized contract comparison |
| `func_0002CD70` remains exact `HYBRID_C` | Pass | Raw/adapted comparison and direct ROM word reads |
| All hybrid outputs remain unchanged | Pass | Independent scan of all 32 hybrid artifacts |
| Two clean roots reproduce every required artifact | Pass | Independent byte and hash comparison |
| Heavyweight audit belongs to the current fingerprint | Pass | Fingerprint recomputation and artifact identity chain |
| Toolchain, adapter, metadata, placement, and queue remain unchanged | Pass | Frozen path audit and identity recomputation |
| Dirty baseline and p3062 remain preserved | Pass | Stable inventory and p3062 SHA-256 |

Each accepted material claim retains the worker's `Verified` evidence grade. Independent review status is now `accepted-with-notes`.

## Independent evidence

### Source change and policy

The commit changes six paths. Five are frozen worker records.

The only source or assembly path is `src/lib/func_0019554C.c`.

The parent source SHA-256 is `284DC9EC2BF1ACBC31DE8E81F33B85393B89CEBE15309B162A39540C5302DA5D`.

The result source SHA-256 is `4FBF235DB64C85E84A2AD7DF7118346749587FBB2986EE00DF613EF9C8D3E121`.

Direct classification returned an empty reasons list. Its digest is `2C6797CC30FD718E72CD967FB82C312366586F31C99F20E4B21C4241646FF7D4`.

The authenticated KMC compiler SHA-256 is `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6`.

The authenticated GNU assembler SHA-256 is `D237475181458118BF964C369748ACF144394583C5DC24293F53F1C9119E8697`.

The dialect manifest SHA-256 remains `FD87D6E56A9285D7D37A6FCFCE972787FDED7C7B5A4C8536EF50A5408F1D0331`.

The adapter implementation SHA-256 remains `224E12F01B28E30C1402E0C6A6524529DA21C26E6BD62CDF953FF198A8229B12`.

### Assembly transformation

The raw assembly SHA-256 is `291C3F051CF0263FFA881399836C94082738F0AC974F1D4D3FF09EDB6938EBC7`.

The adapted assembly SHA-256 is `5CE7979849B8EC8D0FCC29E146C46538ABBA8E8A014D27F402E4F8976E9C0FBE`.

The fourteen changed one-based lines are:

`25, 27, 29, 31, 104, 121, 130, 161, 175, 184, 203, 220, 280, 292`.

Every raw changed line matches `move $N,$M`. Every adapted line is exactly `addu $N,$M,$0`.

No line ending changed. No unsupported move form appeared.

The six explicit numeric-register OR statements occur at lines `39, 166, 194, 214, 223, 254`.

All six OR lines remain byte-identical. All unchanged lines retain their original bytes.

### Placement, ownership, and relocations

| Semantic name | Game meaning | Address | Address space | Evidence role |
|---|---|---:|---|---|
| p3063 ROM start | First migrated function byte | `0x0019554C` | z64 ROM offset | Pins placement start |
| p3063 ROM end | First byte after the function | `0x001957D0` | z64 ROM offset | Pins the 644-byte extent |
| p3063 runtime entry | Relocated function entry | `0x802150BC` | RAM virtual address | Pins runtime placement |
| memset OR word one | First protected encoding | `+0x004` | Function-relative offset | Detects hybrid rewriting |
| memset OR word two | Second protected encoding | `+0x028` | Function-relative offset | Detects hybrid rewriting |

The target section is `.ob64.r3063`. The sole linked owner is `objects/c/func_0019554C.o`.

The target contains 644 bytes. Its SHA-256 is `5985A5DFC866D4EFFB58C0E412AA76A8E0AE8DA0EF19BB8E44A6BF278C2A5E2B`.

The linker map contains one matching contribution from the C object. The fallback does not own p3063.

Direct GNU readelf reported 31 physical `.rel.ob64.r3063` records and one `.rel.pdr` record.

The accepted model normalizes the target relocation section to `.rel.text`. The normalization is implemented at `tools/lib/phase8_matching_c.js:328`.

All 32 normalized offsets, types, sections, and symbols match the accepted relocation contract.

The relocation symbols are `.text`, the function symbol, five globals, and six external functions.

### Clean-root reproduction

The clean root is:

`C:\Users\Joe\AppData\Local\Temp\ob64-phase3-clean-e3f4795a61a64f8889d1b8669224f1f5`

The reviewer independently matched 36 proofs, 36 objects, 36 target slices, and 36 relocation sets across run A and run B.

The reviewer also matched all raw, adapted, and section-adjusted assembly artifacts.

The derived corpus contains four pure targets and 32 hybrid targets. Only p3063 is transformed.

The derived totals are one transformed target and fourteen transformations. All 32 hybrid outputs are byte-identical.

| Artifact | Independently observed SHA-256 |
|---|---|
| Build report | `F9A211F3E15BC483149D92BB71E342BED4082AAF9E8D3E19BAC22EB90F3799C5` |
| Strict verification report | `9BAEB36BDBB588EB99C765BC9D4352A7E585BC85DD1A500C042AAF5E45199813` |
| Reproducibility report | `AB0FCA84A0FF26D49F3D9580F2E4A644B63465F76F4A9D91707AD7A352E833FD` |
| Phase 8 ELF | `D7D27A84287557F020B264D9F10D03CDE83CEFE0D9F930D6060EDFEC3F16F03B` |
| Link map | `56D405EB7C2050856394C9D6C73826D0E7A3F01B8AF6F33BAB90B0652662E427` |
| Layout | `964AC5ACBFEDE2E499AA9A017FB845228B9C7D30A3C21387966FEFEB3A4A92BB` |
| Object manifest | `ADBA23FAB2242F53EF21E7656157F68581CF21223F663328A6E0ADE09C495F48` |
| Full ROM | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |

### Hybrid preservation and memset

Every hybrid proof records zero transformations. Every hybrid raw and adapted file shares identical bytes.

`func_0002CD70` remains `HYBRID_C`. Its target SHA-256 remains `9842231309587A8F054CE82E257F9DC0FD864608CF90266F53AFF570E37E1ADF`.

Direct big-endian ROM reads returned `0x00801025` at both protected function-relative offsets.

### Audit identity

The audit report SHA-256 is `B3D02E36F29247A96289549139609655C59B23282E6AC36ECD4312373334FA22`.

Independent recomputation produced current fingerprint `F344A83DD10D3002966172C7F179EA1D8A88B8ED2A5A331003DFDDF44A75005F`.

The audit build report, verification, ROM, ELF, map, layout, readelf report, and object manifest match clean run A.

The audit fresh-compilation report matches all 36 source, object, assembly, class, decision, and relocation identities.

The structural report assembled 6,184 tracked real-assembly owners. Its code-region SHA-256 is `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.

No concrete identity conflict justified repeating the 10,703-second audit.

### Reviewer-owned strict verification

The reviewer-owned effective tree is `C:\Users\Joe\AppData\Local\Temp\p3r-45007de0\e`.

It recomputed the same Phase 3 fingerprint before verification. Its copied run-A root is `C:\Users\Joe\AppData\Local\Temp\p3r-45007de0\r`.

`node tools/verify_phase8_matching_c.js` passed in 215.8 seconds.

The reviewer report is `C:\Users\Joe\AppData\Local\Temp\p3r-45007de0\strict-verification-review.json`.

Its SHA-256 is `9BAEB36BDBB588EB99C765BC9D4352A7E585BC85DD1A500C042AAF5E45199813`.

The exact report identity matches both worker strict reports and the heavyweight audit.

## Admissible findings

None.

## Adversarial-test admissibility

The source and assembly checks use the accepted compiler-output producer path. A failure could have changed linked retail instructions.

The clean-root scanner uses accepted build outputs. It checks the smallest complete set that can expose cross-run or preservation drift.

The strict verifier consumes an ordinary copied build root. It independently recreates derived assembly and dialect proofs.

Each acceptance test remained inside the assigned static and build evidence grade. No hostile concurrency or forged metadata was used.

## Reused frozen evidence

The review reused the accepted Phase 2 adapter contract. Frozen commit inspection proved Phase 3 did not change that contract.

The multi-hour audit result was reused only after fingerprint and artifact authentication. Every current build identity matched both clean roots.

## Setup failures

Five reviewer setup failures occurred. None tested the Phase 3 result.

- One scanner initially parsed decimal offsets as hexadecimal.
- One audit lookup used the wrong root.
- One audit script passed a ROM identity object instead of its path.
- One external clone reached a Windows filename limit.
- One external fingerprint attempt lacked machine-local tool configuration.

Each retry corrected one named cause. All corrected checks passed.

## Notes and evidence limits

The frozen commit depends on the recorded dirty 36-target overlay. The Director must preserve that overlay during intake.

The physical p3063 relocation section is `.rel.ob64.r3063`. The accepted proof model normalizes it to `.rel.text`.

The mutable `build/source-policy/report.json` path held a focused p3063 report before review activation.

Both clean build reports retain the full-corpus source-policy records. Reviewer-owned strict verification recomputed all 36 classifications.

Exact retail bytes prove output equivalence. They do not prove the original developers' pseudoinstruction spelling.

The review did not repeat the heavyweight audit. It authenticated the audit and reran strict verification on an independent copy.

## Preservation result

The frozen commit changes no configuration, tool, placement, metadata, queue, or other source path.

All accepted adapter and workflow hashes match the Phase 3 evidence record.

The pre-existing p3062 source remains 1,901 bytes with SHA-256 `4E9A6866EAFD8CC3DBCF88556CCDD2474FBD8CA7DC19B7C93518761E9CF53876`.

No new unexplained repository change appeared during review.

## Documentation consequences

No canonical documentation change is required for acceptance.

Future audit tooling can version full-corpus source-policy reports by fingerprint. That improvement is outside this review result.

## Exact route

The Director may freeze this review and accept Phase 3 with notes. No worker correction is required.

The Director must preserve the coherent 36-target effective state. The Director controls any later function-queue resumption.
