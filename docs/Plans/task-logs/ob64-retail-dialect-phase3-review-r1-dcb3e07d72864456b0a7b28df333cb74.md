# Phase 3 p3063 pure-C independent review log

Status: `completed`. Verdict: `accepted-with-notes`.

Phase 3 removes only p3063's local `move` macro and retains exact retail output. The Director may freeze this review and accept Phase 3.

The Director must preserve the coherent 36-target overlay. The function queue remains paused until the Director records the acceptance decision.

## Activation

- Assignment: `docs/Plans/prompts/ob64-retail-dialect-phase3-review-20260808-r1.md`.
- Assignment revision: `1`.
- Launch ID: `dcb3e07d72864456b0a7b28df333cb74`.
- Receiving task ID: `/root/phase3_review`.
- Director task ID: `ob64-retail-dialect-implementation-director`.
- Director collaboration ID: `/root`.
- Host ID: `codex-desktop-current`.
- Inventory profile: `NORMAL`.
- Human gate: none.
- Frozen subject: `48f93cb1031b139fda2848882deac2db7c4d338c`.
- Frozen parent: `8b35468b82f2e0b0afd7aa9729926b064b9ba328`.

The assigned claim path was absent at activation. The reviewer created it atomically at `2026-08-08T11:05:56.5726544Z`.

The claim SHA-256 is `43366EEB85169ABF56AC341B23F007B61B33D19B29B7C45106A60611A46FAEE0`.

## Baseline inventory

- Parent branch and HEAD: `main` at `1ac946fae7fee8e601902da8c3234b8e3b8eef62`.
- Decomp branch and HEAD: `main` at `48f93cb1031b139fda2848882deac2db7c4d338c`.
- Decomp upstream state: `main...origin/main [ahead 7]`.
- Review report and task-log paths were absent.
- No baseline path overlapped the assigned review writes.

The decomp tree retained these pre-existing tracked changes:

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

The tree also retained the review prompt, the placement-blocker report, and `src/lib/func_00195410.c` as untracked baseline paths.

No new unexplained repository path appeared during review.

## Review method

The review inspected the frozen commit directly. Worker prose served only as an artifact index.

The reviewer used these independent checks:

1. Inspect the exact parent-to-result source and path diff.
2. Reclassify p3063 through the accepted source-policy module and authenticated preprocessor.
3. Compare raw and adapted assembly while preserving line endings.
4. Hash and compare every proof, object, target slice, relocation set, report, and major output in both clean roots.
5. Read p3063 section, symbol, and relocation tables with GNU `readelf`.
6. Read placement and ownership directly from the linker map.
7. Recompute the current fingerprint and authenticate the heavyweight audit.
8. Run strict verification on a reviewer-owned copied root.

The reviewer-owned root is `C:\Users\Joe\AppData\Local\Temp\p3r-45007de0`.

## Direct observations

### Frozen change

The commit changes six paths. Five paths are the worker's frozen records.

The only source or assembly change is `src/lib/func_0019554C.c`.

The source diff removes this three-line statement and its following blank line:

```c
asm(".macro move dst,src\n"
    "addu \\dst,\\src,$0\n"
    ".endm\n");
```

The parent source is 4,778 bytes with SHA-256 `284DC9EC2BF1ACBC31DE8E81F33B85393B89CEBE15309B162A39540C5302DA5D`.

The result source is 4,705 bytes with SHA-256 `4FBF235DB64C85E84A2AD7DF7118346749587FBB2986EE00DF613EF9C8D3E121`.

### Source policy and assembly

Direct classification returned `PURE_C`, an empty reasons list, and digest `2C6797CC30FD718E72CD967FB82C312366586F31C99F20E4B21C4241646FF7D4`.

The authenticated preprocessor SHA-256 is `56D276AE66F2F499FAD2454663E8B5B82B20D5D7C44A4116349C096780FFF927`.

The raw KMC assembly contains fourteen `move $N,$M` statements. It contains no other `move` statement.

Exactly those fourteen lines change to `addu $N,$M,$0`. Their one-based line numbers are:

`25, 27, 29, 31, 104, 121, 130, 161, 175, 184, 203, 220, 280, 292`.

The six explicit numeric-register `or` statements remain byte-identical. Every other assembly line also remains byte-identical.

### p3063 placement, ownership, and relocations

| Semantic name | Game meaning | Address | Address space | Evidence role |
|---|---|---:|---|---|
| p3063 ROM start | First migrated function byte | `0x0019554C` | z64 ROM offset | Pins placement start |
| p3063 ROM end | First byte after the function | `0x001957D0` | z64 ROM offset | Pins the 644-byte extent |
| p3063 runtime entry | Relocated function entry | `0x802150BC` | RAM virtual address | Pins runtime placement |

The linked section is `.ob64.r3063`. Its sole owner is `objects/c/func_0019554C.o`.

The linked target is 644 bytes. Its SHA-256 is `5985A5DFC866D4EFFB58C0E412AA76A8E0AE8DA0EF19BB8E44A6BF278C2A5E2B`.

Direct `readelf` inspection found 31 physical `.rel.ob64.r3063` records and one `.rel.pdr` record.

The accepted relocation model normalizes `.rel.ob64.r3063` to `.rel.text`. It also normalizes the local section symbol to `.text`.

That normalization occurs at `tools/lib/phase8_matching_c.js:328`. All 32 normalized records match the accepted offsets, types, and symbols.

### Clean roots and corpus preservation

The authenticated worker root is `C:\Users\Joe\AppData\Local\Temp\ob64-phase3-clean-e3f4795a61a64f8889d1b8669224f1f5`.

The reviewer independently compared these artifact groups between run A and run B:

- 36 dialect proofs;
- 36 C objects;
- 36 raw compiler assemblies;
- 36 adapted assemblies;
- 36 section-adjusted assemblies;
- 36 linked target slices;
- 36 normalized relocation sets;
- both build reports;
- both strict reports; and
- every major linked output.

All comparisons passed. The derived census is four `PURE_C`, 32 `HYBRID_C`, and zero unknown targets.

Only p3063 is transformed. The corpus contains fourteen total transformations.

All 32 hybrid raw and adapted files are byte-identical. Every hybrid proof records zero transformations.

Both ROMs have SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

### Mandatory memset regression

`func_0002CD70` remains exact `HYBRID_C`. Its raw and adapted assemblies are byte-identical.

The linked target SHA-256 remains `9842231309587A8F054CE82E257F9DC0FD864608CF90266F53AFF570E37E1ADF`.

Direct big-endian ROM reads returned `0x00801025` at function-relative offsets `+0x004` and `+0x028`.

### Audit identity

The reviewer did not repeat the multi-hour heavyweight audit. No identity or correctness conflict required another run.

Independent recomputation produced current fingerprint `F344A83DD10D3002966172C7F179EA1D8A88B8ED2A5A331003DFDDF44A75005F`.

The audit report SHA-256 is `B3D02E36F29247A96289549139609655C59B23282E6AC36ECD4312373334FA22`.

Its build report, verification, ROM, ELF, map, layout, readelf report, and object manifest match clean run A byte-for-byte.

The audit's fresh-compilation records match all 36 build records. The structural report retains SHA-256 `984BF75ED781E9E7D9C6B7A228D8AECDA22CBBC38911979157E0793004342D41`.

### Reviewer-owned strict verification

The effective external tree recomputed the required Phase 3 fingerprint before verification.

Command:

```text
node tools/verify_phase8_matching_c.js --output C:\Users\Joe\AppData\Local\Temp\p3r-45007de0\r --compiler C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe --splat-python C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe --splat-split C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py --asm-differ C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ --report C:\Users\Joe\AppData\Local\Temp\p3r-45007de0\strict-verification-review.json
```

The command passed in 215.8 seconds. The report SHA-256 is `9BAEB36BDBB588EB99C765BC9D4352A7E585BC85DD1A500C042AAF5E45199813`.

This hash exactly matches both worker strict reports and the audit's current verification.

## Setup failures

These setup failures did not test the reviewed result:

- The first scanner parsed decimal JSON offsets as hexadecimal. The corrected scanner passed all 36 targets.
- The first audit lookup assumed repository audit files lived under the external current-output root. Schema inspection corrected the location.
- The first audit script passed the ROM identity object instead of its `path` field. The corrected script passed.
- The first external clone reached a Windows filename limit. A fresh shorter root with `core.longpaths=true` completed.
- The external fingerprint check initially lacked machine-local tool configuration. Supplying the accepted read-only configuration completed the check.

No setup failure changed the repository or any worker artifact.

## Notes and limits

The frozen commit is an attributable result, not a standalone 36-target checkout. It depends on the recorded dirty overlay.

The mutable `build/source-policy/report.json` path held a focused p3063 report before review. Its last write preceded review activation.

The full-corpus classification remains embedded in both clean build reports. Reviewer-owned strict verification also recomputed all 36 classifications.

The physical relocation-section name differs from the normalized evidence name. The normalization is stable and unchanged from the accepted contract.

Exact retail bytes prove output equivalence. They do not prove the original developers' pseudoinstruction spelling.

## Verdict and route

No admissible correction finding emerged.

The Director may freeze this review and accept Phase 3 with the notes above. No worker correction is required.

The Director must preserve the coherent 36-target overlay during intake. The Director controls any later queue resumption.
