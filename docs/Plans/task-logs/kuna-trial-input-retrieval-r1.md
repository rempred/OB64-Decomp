# Kuna trial input retrieval r1

Status: completed

## Outcome and scope

A bounded fifth-sample package for `func_001F3C00` is frozen under `build/kuna-trial-input-retrieval-r1/`. It reuses the completed angr inventory for `func_0020BFF8`, `func_001F34B0`, `func_001F197C`, and `func_00215CF0` without repeating archive or database retrieval. The package contains the accepted 3C00 assembly owner and retail bytes, accepted placement metadata, the selected current D037 source and direct headers, the exact selected expanded input/compiler output, focused-only comparison records, and existing relocation/data references.

This retrieval issues no semantic, matching, architecture-adaptation, or trial verdict.

## Baseline and claim

- Activation base: `7fcfae384aed4f006b4b4d2c02d179d39404e75d`.
- Observed branch at claim: `main`.
- Observed HEAD at claim: `ad233ca5a249683d06634bd5281acf1f6e6946a3`; concurrent integration had advanced after activation, while the assigned claim, report, and ignored root were absent.
- Claim: `docs/Plans/task-logs/kuna-trial-input-retrieval-r1.claim.json`, SHA-256 `529244C2FFE8EEF489BBE941F8435ED803DBD8068C7CD7835FD6C8DC70A533C2`.
- Launch: `KUNA-TRIAL-INPUT-RETRIEVAL-20260907-01`.

## Predecessor package

The first four samples and all m2c/Python configuration are incorporated by exact predecessor reference:

- `build/angr-trial-input-retrieval-r1/inventory.json`, SHA-256 `1A4C7FC475C389AA8729953636341CEC0E90802DF49E9425FD9C17E3295114D7`.
- `build/angr-trial-input-retrieval-r1/manifest.json`, SHA-256 `A3A11E6BD63BF9928CE949F856ED9BC147D237909694EC197C3C87620A37D92F`.
- `docs/Plans/task-logs/angr-trial-input-retrieval-r1.md`, SHA-256 `8B4410E73188AE352F42CDC3D7FD12EB8C234A5D032D0202A879E60DB28FD33F`.

Exact copies of those three index records are under `build/kuna-trial-input-retrieval-r1/copies/predecessor/`. The predecessor's source/ASM/proof copies remain the authoritative frozen inputs for its four functions.

## Fifth sample: func_001F3C00

### Accepted owner and placement

- Unique accepted owner row: `3698`, source class `ASM`.
- Original owner: `asm/original/rev0/lib/func_001F3C00.s`, SHA-256 `C31BB4824DF0178D65383897F956F802C0C7CAD14245FD0A74BAB99F5C42C85B`.
- Accepted ROM interval: `[0x001F3C00, 0x001F5654)`.
- Accepted runtime interval: `[0x801B0770, 0x801B21C4)`.
- Extent: `6740` bytes / `1685` words.
- Accepted retail owner bytes: SHA-256 `458A6CB397B154CCC0CBE12CAEF4456A711C676E6B269F32A8DEE2490522925A`.
- Frozen copies: `copies/func_001F3C00/asm/original.s`, `copies/func_001F3C00/asm/accepted-retail.bin`; compact owner record: `metadata/func_001F3C00-owner.json`.

The original source comments use a stale runtime address. The accepted placement above is recorded separately and governs this inventory.

### Selected current D037 source and focused evidence

- Current authored source: `src/lib/func_001F3C00.c`, SHA-256 `D03797FD04EEE60592E0644A837E09308568D3E82448883997A10A85DA7F91F5`.
- Selected expanded input: SHA-256 `7DE6F8E24A17F19CB56105D1C2897C8252710112B1BE96AEE163177C98EC5102`.
- Selected compiler assembly: SHA-256 `989121DC3B9CEAAC90FFD0EF32A8F5FBF3B6218280917B3EC67B1AB103D6608D`.
- Selected diagnostic trace assembly: SHA-256 `A1B38B9C2115556E576E19B6A003A1245855C5466D579D3EF5C294EC61D9A27D`.
- Focused source class: `PURE_C`.
- Candidate extent/frame: `6740` / `504` bytes.
- Focused linked result: linked SHA-256 `2248CF47DF1FC28EC79516412C7BE10E0D0192420C86ECF0938E20720B79651E` versus retail `458A6CB397B154CCC0CBE12CAEF4456A711C676E6B269F32A8DEE2490522925A`; `770` differing bytes, `261` instruction words, and `209` native non-relocation words.

These are focused, nonexact records. The current C is not accepted matching C and is not retail binary truth. The exact selected source/input/assembly and proof records are frozen under `copies/func_001F3C00/{source,asm,focused}/`.

The mutable top-level `build/combat-draw-wave8-r2/func_001F3C00.input.c` was excluded: its observed SHA-256 `3EA60A0F1B96F8F38A7715F442C1FDFF171F6DA01670938BBD0CFF38CD8DA430` belongs to another snapshot and does not equal the selected D037 expanded-input identity. The selected trace copy at `3c00-traces/distinct-primary-packed-endpoint/candidate.c` supplied the authenticated `7DE6...` input.

### Headers and data metadata

The selected policy record binds these direct dependencies, all copied under `copies/func_001F3C00/headers/`:

- `include/game/combat_draw.h`: `DEA4C4DDDEA3D523C088558D41D15EDFCCC28C9467F48DA03E779F4F2F1A0B08`.
- `include/game/combat_draw_commands.h`: `0B78FA9F31CD5980AA803E52E85CDC3A767896D2F943593036CCC2C9E357A31B`.
- `include/game/combat_pose_record.h`: `3ECFF3EEA02A4A2AB76E7E489B00ECDB2FFA2511382E95CD936F376509457815`.
- `include/game/combat_types.h`: `DD2B627C22F084DB4F668D27E8DE3C3F3D8FDFC352F690034FE3E1A5655959D6`.

The selected existing linkage record contains `302` expected candidate relocations: `86 R_MIPS_26`, `108 R_MIPS_HI16`, and `108 R_MIPS_LO16`. Its complete literal offsets/symbols are frozen in `copies/func_001F3C00/focused/linkage.json`; grouped counts and the source's directly spelled absolute addresses are in `metadata/func_001F3C00-data-relocations.json`. These are input metadata only, with no claim about meaning or runtime validity.

## m2c references and bounded absence

The Kuna inventory reuses the predecessor's authenticated m2c checkout/script, adapter, command template, Python runtime, configuration copies, and prior draft manifest. No directly selected 3C00 m2c output was present in the bounded D037 focused set. Per Director instruction, no further history or database search was performed; the fresh Kuna executor owns its new comparison output.

## Claims and evidence grades

- **Observation — fifth-sample identities and placement:** `Verified` identity/placement input, review pending. Supported by the original-ASM manifest, accepted owner records, exact retail-byte copy, and hash readback.
- **Observation — selected D037 focused result:** `Verified` as a preserved focused record, review pending. It establishes only the recorded nonexact comparison and mechanical source class for those inputs.
- **Observation — predecessor reuse:** `Verified` identity reference, review pending. All three predecessor index hashes and their new copies agree.
- **Interpretation:** none.
- **Competing interpretation:** a stale scratch artifact could be mistaken for the selected D037 expanded input. Hash comparison falsifies that substitution.
- **Known limit:** no new tool execution validates program behavior or matching.

## Evidence index

- `build/kuna-trial-input-retrieval-r1/inventory.json`, SHA-256 `8E90EDFE0ECDA3178C9F8B6A4C65CD1817A3D29ECC1C8D2037F61A542850D17E`.
- `build/kuna-trial-input-retrieval-r1/manifest.json`, SHA-256 `1D033CCE1D86E92C5C0421C39B6A12717D1FF7A3FAA511B2518CC9584B4F9471`.
- Manifest entries: `27`; all source/copy pairs were byte-identical at creation.

## Verification summary

The claim was read back before each write phase. The current source matched the assigned D037 hash before copying. All copied inputs matched their observed originals, both JSON indexes parsed, the owner and retail extents were exactly `6740` bytes, and the selected focused JSON bound D037, expanded input `7DE6...`, the `PURE_C` classification, and the nonexact `770`-byte / `261`-word result.

## Changed surfaces

Only these assigned surfaces were written:

- `docs/Plans/task-logs/kuna-trial-input-retrieval-r1.claim.json`;
- `docs/Plans/task-logs/kuna-trial-input-retrieval-r1.md`;
- ignored `build/kuna-trial-input-retrieval-r1/`.

No compilation, m2c/Kuna execution, install, ELF creation, runtime, GUI, database, source/config/tooling, or Git mutation occurred.

## Failed paths and limits

The first evidence-root creation attempt stopped before any root write because the displayed claim hash had been truncated and was transcribed incorrectly. A full read-only hash resolved it; the successful write then required that exact identity. No evidence input was changed.

The broad historical m2c lane was intentionally not searched. No claim of absence beyond the selected direct D037 artifact set is made.

## Protocol deviations

None.

## Proposed canonical-document changes

None.

## Next action

The Kuna executor may consume the frozen manifest and fifth-sample inputs. Retrieval writes are released.
