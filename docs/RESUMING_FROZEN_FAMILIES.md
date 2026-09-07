# Resume the frozen matching families

Main is the accepted starting point. Commit `497181d8a6ba4bc32c35a465fccd261abe2e0c69` contains the accepted Combat W1–W4 sources and combined tooling.
The donor histories and inactive archive remain frozen.
Current work follows [the sequential matching program](Plans/sequential-main-program.md): Combat, then Squad, then High Attack on `main`.
Use internal agents with one active matching family and one production source/build writer.
Matching implementation and research requiring reasoning use Astra Medium; retrieval/data-seeking or parsing-only work uses Sol High.
Mixed assignments containing implementation or substantive research reasoning use Astra Medium.
Do not resume concurrent development worktrees. Archive contents alone do not authorize activation or establish acceptance.

## What is consolidated

[The inactive archive](archive/matching-c-candidates/resumption-20260906/README.md) retains the useful unfinished inputs from the three frozen donors.
Its [manifest](archive/matching-c-candidates/resumption-20260906/manifest.json) records 67 source origins, 56 distinct byte variants, and 46 original notes.
Fifty-four source variants are copied here; two already exist in the canonical archive. Exact duplicates share one file.
Original source commits, paths, raw hashes, Git blobs, candidate identities, and dependency dispositions remain explicit.
No source was tuned or activated. All copied C sources have no include directives; helper and symbol metadata remain separate from fresh link proof.

| Family | Frozen donor | Accepted boundary | Retained unfinished boundary |
|---|---|---|---|
| Combat body resources | `ef4689d56568ec54918e2cc4a85b2d9068b12d00` | W1–W4 through `e584601`, already canonical | Seven provisional W5 targets and the authored pose-parser candidate; no complete eight-target W5 verifier |
| Squad construction | `4ce520b12cf2fec53411fa4ad620c90fb6dd8eac` | Constructor, loader and dispatcher through canonical `24d0818` | Four provisional continuation targets and the untracked supply draft; no complete continuation proof |
| High Attack | `d818fed6c7adf7a8664bb026bff183b68ad40d50` | Earlier delivered subsets and accepted reusable tools are canonical | B894, fourteen provisional Wave 6 targets, four protected drafts, and preserved research variants; W5/W6 remain incomplete |

The controlling parent manifests are `f95809a` (Combat), `62584ff` (Squad), and `8043869` (High Attack).
The accepted combined intake is documented at parent `3e9f412` and independently accepted at `c3e53c0`, with Director closure `9462524`.
The package records these boundaries without importing provisional activation into main.

## Combat W5

The seven provisional sources are `func_00204EE0`, `func_00204F34`, `func_00205230`, `func_002052D4`, `func_00205378`, `func_00205484`, and `func_00205608`.
Their original target and relocation records are in [combat-metadata.json](archive/matching-c-candidates/resumption-20260906/combat-metadata.json).
The four existing return stubs `func_00204F24`, `func_00204F2C`, `func_00205220`, and `func_00205228` already remain in canonical `src/lib/`.
They are not new work in this archive.

[The pose-parser source](archive/matching-c-candidates/resumption-20260906/sources/func_002050AC-bd72a064f2bf.c) is the frozen authored candidate `D27193C8…`, SHA-256 `BD72A064F2BF152F654FEEC95F83F87D24995B7531E35F390A432A743A0D2971`.
In the frozen standalone experiment, its exact 364-byte body did not cover the accepted 372-byte owner. Ordinary section assignment omitted eight bytes.
Standalone native assembly emitted only four trailing bytes and shifted the entry by four bytes. Extending the art routine's native descriptor is not justified.
The accepted diagnosis is a bounded negative, not matching acceptance or a mixed-ownership design.
Later [five-function grouping research](../../docs/reviews/combat-pose-split-padding-research-r1/research-report.md)
reproduced the complete group in an isolated native link, including the pose tail without moving entries.
That isolated research remains distinct from production source acceptance.
Compilation-group implementation `45904b5` now has [Accepted independent review](Plans/task-logs/compilation-groups-implementation-review-r1.md) at `31dc838`.
Its accepted first mode supplies one native compiler producer for contiguous single-function owners in one placement context.
It preserves every existing owner and public entry, with optional native terminal padding only in the final owner.
It cannot combine art-native, continuation/multi-owner, local-function, auxiliary, or mixed-slice contracts.
Tooling review subject `45904b5` had an empty production group registry; neither that acceptance nor its mixed pose fixture activated the archived sources.

The sequential program must assign complete-group source activation separately under [the group workflow](WORKFLOW.md#compilation-group-workflow).
Edit the group's one translation unit and run `node tools/diff.js <member>`; the canonical diff compiles its whole group once.
The standalone workbench rejects grouped members until it supports complete group candidates.
Preserve entries, boundaries, source class, relocation contracts, sole ownership, and complete owner bytes.
Keep all eight W5 targets within the final completion gate; seven focused exact results do not complete the wave.
The [retained Combat family plan](archive/matching-c-candidates/resumption-20260906/notes/combat-family-plan-f5a2d89a55.txt) supplies the wider inventory as a historical planning record.

## Squad continuation and supply

The provisional continuation inputs are `func_00129068` (`dc27cf9`), `func_001291B4` (`d538c2e`), `func_0012967C` (`06727bd`), and `func_00128E80` (`4ce520b`).
[Squad metadata](archive/matching-c-candidates/resumption-20260906/squad-metadata.json) retains their activation and exact donor relocation records.
Their focused proofs do not establish completion of the continuation wave.

[The supply draft](archive/matching-c-candidates/resumption-20260906/sources/func_00195D9C-2ba44c8df52e.c) is mechanically PURE_C in the frozen report only.
Compilation stopped before object/link comparison. No target-byte equality or production linkage contract exists for it.
The data owner requires a 136-byte original prefix, a 24-byte compiler switch table, and an eight-byte original tail.
Main now contains accepted `preservedPrefix`/`preservedTail` support. Check that mechanism before proposing a new tool change.
The draft's helpers are present in canonical source, the accepted assembly model, or shared-symbol metadata. It is not automatically ready to activate.

Use the [retained Squad family plan](archive/matching-c-candidates/resumption-20260906/notes/squad-family-plan-7df676d7ba.txt) for membership and interface boundaries.
Keep its placement holds for `func_00120BBC`/`func_001307D4`, the two-owner gate for `func_00130E60`, and unnamed route flag `0x00020000` explicit.
The Director must define the authorized continuation boundary; this packaging neither shortens nor completes an existing wave.

## High Attack W5 and W6

[The B894 source](archive/matching-c-candidates/resumption-20260906/sources/func_0021B894-c3de40ce5ed2.c) comes from `3cba02e`.
Its frozen mechanical/full-ROM evidence is preserved, but B438 remains unresolved and W5 is not a completed wave.
Both B438 research variants remain indexed. They must not become accepted by copying the B894 contract or relaxing the wave gate.

Wave 6 has seventeen assigned owners. The fourteen provisional donor-active sources and their contracts appear in [high-attack-metadata.json](archive/matching-c-candidates/resumption-20260906/high-attack-metadata.json).
They are `func_0022257C`, `func_00222604`, `func_0022A280`, `func_0022A414`, `func_0022A4E0`, `func_0022A7B8`, `func_0022A964`,
`func_0022ADFC`, `func_0022B06C`, `func_0022BFF8`, `func_0022C78C`, `func_0022EC08`, `func_0022EDD4`, and `func_0022F2BC`.
B1F4 and D14C remain nonexact. EF50 remains inactive; the later activation task stopped before changes.
All four original B1F4/C78C/D14C/EF50 drafts are preserved separately from their successors.

[The B06C source](archive/matching-c-candidates/resumption-20260906/sources/func_0022B06C-6b0668990ac8.c) and its 40-byte C table/1,208-byte assembly remainder had accepted structural evidence in High Attack.
That is distinct from incomplete ordinary Wave 6 acceptance. Canonical B06C remains inactive; its accepted tool-test fixture is not production activation.
[The EF50 lead](archive/matching-c-candidates/resumption-20260906/sources/func_0022EF50-3d7dc9f4744c.c) retains candidate `F4B3B353…`, source SHA-256 `3D7DC9F4744CF4777E954546498000005943C5E5FB07C394E8E028F4A62BE423`.
The accepted interior mechanism can express the 64-byte assembly interval, EF50's 32-byte table, and final 1,112-byte assembly remainder.
It does not automatically approve that new production partition. Resolve the intended combined ownership under the applicable structural workflow.

The [last source report](archive/matching-c-candidates/resumption-20260906/notes/high-attack-aar-169bb50183.txt) and [evidence index](archive/matching-c-candidates/resumption-20260906/notes/high-attack-evidence-index-2e7f29b8d0.txt) retain measured hypotheses and failed experiments.
Prefer the committed A414 source over the old D75767 variant, which contains unresolved `func_001C8B84` spelling.
The newer source calls `func_0020C014(arg0)`. Preserve prototype uncertainty rather than inventing a linker alias.

## Available capabilities and remaining proposals

Use [the capability map](MATCHING_WORKBENCH.md#accepted-representation-capabilities) before routing a structural/tooling blocker.
Main includes accepted native text, COMMON rejection, auxiliary prefix/occurrence/padding/interior support, the 83-row resource-load placement, and first-mode compilation groups.
The accepted group producer addresses the demonstrated grouped pose representation; standalone art-native widening remains unsupported.
This does not activate inactive sources, finish nonexact candidates, complete a matching wave, or implement pending diagnostic improvements.

The process study proposes reliable per-attempt diff results, clearer context/relocation uncertainty, portable fixtures, and phase timing.
These remain proposals, not implementation assignments or new acceptance gates.
For sequential-program assignments, use current-run linked diffs and source classification, then one final verifier for the complete assigned wave.
Ordinary matching needs no independent source review. Structural or verification changes retain their applicable audit and review.

## What remains outside Git

This archive contains source, causal notes, and inactive metadata. It does not make the ROM/toolchain bootstrap or historical proof corpus portable.
The [README prerequisites](../README.md#local-prerequisites), [toolchain contract](TOOLCHAIN.md), and `config/local-tools.example.json` define setup.
Current local paths below were observed during packaging, without executing or reauthenticating the tools:

| Prerequisite | Current local location / identity |
|---|---|
| Normalized US Rev 0 ROM | `build/baserom.us_rev0.z64`, ignored; 41,943,040 bytes, accepted SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| KMC GCC 2.7.2 compiler | `C:/Users/Joe/.codex/ob64-phase6-kmc-20260801/clean-d/toolchain/kmc-gcc-2.7.2/cc1.exe` |
| Pinned Windows PowerShell | `C:/Users/Joe/.codex/ob64-powershell-runtime-5.1.26100.8972-complete-20260904` |
| Splat Python and source | `C:/Users/Joe/.codex/phase5b-splat-20260801-r4/venv/Scripts/python.exe`; sibling `splat-source/split.py` and snapshot |
| GNU Binutils 2.6 and GCC 12.2 preprocessing bundles | Ignored `.toolchains/gnu-binutils-2.6-mips-kmc-elf-msys2/` and `.toolchains/gcc-toolchain-mips64-win64/` |
| asm-differ | `C:/Users/Joe/Projects/OgreBattlel64/ModderResources/External Decomp Research/ogrebattle64-codeberg/tools/asm-differ` |
| Optional m2c | `../tools/m2c`, commit `3478473441a1e6da75d6bf07629452f410390ef4`; needed for workbench generation/doctor, not ordinary build/diff/verify |
| Ignored local configuration/output | `config/local-tools.json`; configured `workRoot` is `C:/Users/Joe/.codex/ob64-decomp-current` |
| Structural audit only | `phase5aRoot`: `C:/Users/Joe/.codex/ob64-matching-c-worktrees/outputs/lane-c/row565-phase5b-sol-correction-r1/phase5a-cumulative-successor` |

Normal commands must authenticate the existing pinned identities. The host/tool pins and companion data remain required; no ambient-tool fallback is implied.
On a new machine, supply the legitimate ROM, ignored tool bundles, local configuration, and external output directory before rebuilding.

Historical exact-proof artifacts remain in `C:/Users/Joe/.codex/ob64-consolidated-intake-20260906/work` and the review root `C:/Users/Joe/.codex/ob64-consolidated-review-20260906/work`.
Combat scratch/diagnosis evidence remains under `C:/Users/Joe/.codex/ob64-editor-feature-matching-2/work` and the donor's ignored `build/matching` tree.
Squad proof/supply evidence remains under `C:/Users/Joe/.codex/ob64-squad-construction/work`.
High Attack evidence remains under the donor's ignored `build/audit`, `build/matching`, and `build/diff` roots, with exact paths in the retained notes.
These files are needed to inspect old measurements; they do not substitute for new-input verification.
The old compiler-source tree under `C:/Users/Joe/.codex/ob64-phase6-kmc-20260801/clean-d/source/mips-gcc-2.7.2` is needed only to repeat source-level compiler research.
No emulator, Project64 runtime, or new capture is needed for the ordinary matching loop.

All three donor worktrees, their branches, and ignored evidence remain preserved. No rebase, deletion, cleanup, or publication follows from this consolidation.
