# Combat draw W8 R9: source experiment findings

This records the first R9 source sequence; the complete fourteen-target W8 assignment remains active and unresolved. No new production best is selected. D037 (3C00), D764 (6098), and 5BF6 (DB10) remain the selected mismatch inputs. The eleven exact controls remain unchanged. Research effects below are input-specific compiler observations, not matching or semantic acceptance.

## Method and results

Normal intake and accepted default Kuna/m2c packets were consulted for all three targets. Each listed input was mechanically PURE_C and received an early private pinned compile/assemble/link comparison against its accepted retail target. Selected cases also received canonical focused diff. The unchanged diagnostic compiler was used only with per-input pinned/diagnostic assembly agreement, normalizing its diagnostic-option comment only. No shared tooling, flags, compiler identity, ownership, or relocation configuration changed. No runtime or full-ROM verifier ran.

Private authored inputs and complete results are under `build/combat-draw-wave8-r9/<family>/<case>/`; authenticated trace inputs, pass dumps and HOME/access details are under `<family>-traces/<case>/`. These generated artifacts remain ignored. Relocation counts in this table are not proof of relocation-list equality.

| Family/case | Extent | Frame | Different bytes/words | Relocations |
|---|---:|---:|---:|---:|
| 6098/control | 4148 | 408 | 56/46 | 162 |
| 6098/outer-vertex-triples | 4148 | 408 | 56/46 | 162 |
| 6098/unsigned-clamp | 4132 | 408 | 2138/607 | 159 |
| 6098/unsigned-clamp-nested | 4132 | 408 | 2138/607 | 159 |
| 3c00/control | 6740 | 504 | 770/261 | 302 |
| 3c00/capacity-reuse | 6720 | 496 | 2707/771 | 302 |
| 3c00/tile-early-control | 6736 | 504 | 2290/658 | 302 |
| 3c00/capacity-late-transfer | 6728 | 496 | 2720/770 | 302 |
| 3c00/capacity-reclamp | 6768 | 504 | 3006/839 | 304 |
| 3c00/local-reused-primary-end | 6732 | 504 | 1451/427 | 302 |
| 3c00/local-u16-end | 6744 | 504 | 1522/442 | 302 |
| 3c00/local-u16-both-ends | 6744 | 504 | 1522/442 | 302 |
| 3c00/local-reuse-narrow-strip | 6732 | 504 | 1455/428 | 302 |
| 3c00/local-reuse-shared-step | 6716 | 504 | 1449/421 | 302 |
| db10/control | 5548 | 552 | 41/28 | 209 |
| db10/normalized-total-run | 5556 | 552 | 443/142 | 209 |
| db10/dual-run | 5548 | 560 | 70/23 | 209 |
| db10/derived-total | 5548 | 560 | 69/23 | 209 |
| db10/derived-additional | 5552 | 552 | 428/132 | 209 |
| db10/derived-throughout | 5552 | 552 | 428/132 | 209 |
| db10/inclusive-run | 5544 | 560 | 441/128 | 209 |
| db10/count-then-test | 5540 | 560 | 430/128 | 209 |
| db10/mixed-entry-total-backedge | 5580 | 560 | 471/134 | 209 |
| db10/count-entry-total-backedge | 5572 | 552 | 462/145 | 209 |
| db10/signed-derived-total | 5548 | 560 | 69/23 | 209 |

Canonical focused diff confirmed DB10 derived-total at 5548 bytes, frame560,69 differing bytes/23 words, PURE_C and exact209-entry relocation contract. It confirmed6098 outer-vertex-triples at 4148/frame408,56/46, PURE_C and exact162-entry relocation contract. The3C00 capacity and endpoint-reuse cases, DB10 normalized-total-run and mixed-entry case, and 6098 unsigned-clamp were rejected for incorrect section extent. These are ordinary unsuccessful source candidates; no acceptance rule was weakened.

## What changed the question

**DB10:** derived-total introduces a real additional-members counter initialized to zero, guards it against count-1, consumes it via additional++, and derives total run=additional+1 for unchanged resource indexing, submission and actor advancement. It restores retail frame560 and four accessed plus four non-emitting homes while retaining exact5548 extent and the baseline's complete relocation list. The23 different words are confined to six preheader ordering words and 17 batch-loop words; all other linked words match, including the frame.

The nearest counterexample updates run first and derives additional=run-1. That kills the initial additional value at the entry comparison in .flow and loses the fourth unused home (5552/frame552). In derived-total the real increment consumes initial zero; combine retains a non-emitting USE. This distinguishes input-specific value-use history from merely spelling a zero comparison. It does not establish which authored variables produced retail's empty slots.

Splitting entry to additional<count-1 and backedge to run<count retains 4+4 but grows to 5580. Its fourth unused home comes from an initial predicate, not the same jump-created predicate as derived-total. The ordinary count>1 entry with a total-run backedge gives 5572/frame552 and 4+3. Signed run/additional in derived-total is complete raw-text and relocation-identical, so signedness supplies no emitted discriminator here. The useful next question is whether one real total-run recurrence can retain the initial-value use history without extra emitted induction work; no dummy references, storage, or invented guards are justified.

**3C00:** capacity reuse removes a real home and reduces frame to 496 but does not establish retail's companion/strip register roles. Moving the multiplication alone or transferring the clamped value later does not resolve that arrangement. The localized D037 source with primaryEnd=endField restores 23 static WIDTH calls through jump2 (localized recomputation had22) but is6732/frame504. Narrow endpoint controls and value-preserving narrow strip assignments do not match. Sharing the real overlap step gives 6716/frame504 and moves the companion to 22, but strip/right-edge roles remain23/30 rather than 30/23. That final source now differs from the retained R7 localized state principally in shared versus distinct primary-row quantity; it is not an independent rediscovery of a matching solution. The endpoint-reuse result is a successful tail-shape discriminator and an unselected full-function transfer.

**6098:** hoisting the two distinct y/nextY/bottomY triples to function scope changes declaration/pseudo order but yields complete raw-text and relocation equality with D764. The unsigned outer color-clamp partition is defined-value equivalent and changes emitted branches, yet frame stays408 with 23 accessed homes and no unused homes. Ternary and nested signed selection inside that partition emit identical raw text and relocations. Neither result supplies evidence identifying or recreating retail's six additional frame slots.

## Preservation and limits

Useful DB10 baseline/derived-total/counterexample and 3C00 endpoint-reuse C states are preserved using the generic capture/import/preserve route with curated observations. The baseline is an authored emitted-best annotation only. Archives retain exact authored C and authenticated source/expanded/dependency identities; generated compiler material stays private. Existing R7/R8 relations remain discoverable by normal intake.

All twenty starting inputs were authenticated against the R8 terminal index and preserved byte-for-byte under `build/combat-draw-wave8-r9/starting-inputs/`, including D764's two CRLF sequences. At this report boundary they are restored; no source best or actual relocation entry changes are proposed. W8 has not passed its final fourteen-target/full-ROM gates.

Measured canonical focused command durations available before this boundary were 53.184s (capacity),115.728s (vertex hoist),71.279s (normalized run),117.375s (derived-total),69.274s (unsigned clamp), 49.145s (endpoint reuse), and 65.922s (mixed entry). These include build/cache/link work and are not compiler-only timing. Private measure calls record their own wallMs in each result; trace and preparation commands also retain command evidence. Interpretation/reporting time was not separately measured, and no percentages are inferred.

## Preserved source links

| State | Source | Curated metadata |
|---|---|---|
| control | [exact C](../../../docs/archive/matching-c-candidates/2026-09-08-func_0020DB10-6d3b02845b.c) | [observation](../../../docs/dossiers/func_0020DB10-6d3b02845b.observation.json) |
| derived-total | [exact C](../../../docs/archive/matching-c-candidates/2026-09-08-func_0020DB10-51a6102b90.c) | [observation](../../../docs/dossiers/func_0020DB10-51a6102b90.observation.json) |
| derived-additional | [exact C](../../../docs/archive/matching-c-candidates/2026-09-08-func_0020DB10-15eadcd53d.c) | [observation](../../../docs/dossiers/func_0020DB10-15eadcd53d.observation.json) |
| local-reused-primary-end | [exact C](../../../docs/archive/matching-c-candidates/2026-09-08-func_001F3C00-2418e773c8.c) | [observation](../../../docs/dossiers/func_001F3C00-2418e773c8.observation.json) |
