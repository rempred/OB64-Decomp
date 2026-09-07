# Combat draw inputs r2 citation correction

## Outcome and scope

Status: complete; literal citation correction released.

The R1 report contains one incorrect full commit ID in its baseline paragraph. The R1 machine-readable package and the report evidence table already contain the authoritative commit ID. This correction preserves all R1 bytes and changes no source fact, membership record, semantic claim, ownership record, or acceptance state.

## Corrected citation

The incorrect citation is at `docs/Plans/task-logs/combat-draw-inputs-r1.md:11`:

- Incorrect: `d70fd8524ad3f9d7c9f6355be1772bca852d087a`
- Authoritative replacement: `d70fd853fdffacf71290b24763e010a549276a55`

`git rev-parse d70fd85` returns `d70fd853fdffacf71290b24763e010a549276a55`. `git cat-file -t` identifies that object as a commit. The incorrect value does not resolve to a Git object.

## Other full commit citations

The other full commit citations in the R1 report are correct:

- Assignment release `29cd12758c13c02ecd75c735ffa4ced0bd9f31ca` resolves to a commit.
- Evidence-table lines 139–148 consistently cite `d70fd853fdffacf71290b24763e010a549276a55`; every accompanying 40-character blob ID resolves as a blob.

The unchanged R1 package also carries correct commit identities:

- `assignmentRelease`: `29cd12758c13c02ecd75c735ffa4ced0bd9f31ca`
- `acceptedSourceBaseline`: `d70fd853fdffacf71290b24763e010a549276a55`
- `observedHeadDuringExtraction`: `d31a27cc4c37d5a441ae47c3dc81516cafa0651b`
- Reused W6 extraction baseline: `78ebc7e9800a6379c2d58814c39eea06cebf49fa`
- Reused W7 extraction baseline: `dff8b8c3b09996da4da08a11aef92b03a753f8cf`
- Frozen archive canonical baseline: `497181d8a6ba4bc32c35a465fccd261abe2e0c69`
- Preserved consumer source commit: `81e34359469d71e6473f8323f937a1e6bd717567`

Each resolves to a Git commit. Every package `sourceIdentities[*].commit` value resolves exactly to its recorded Git object.

## Package disposition

No corrected R2 package is required. The R1 package already records the authoritative baseline and all checked commit identities correctly. It remains unchanged:

- Path: `build/combat-draw-inputs-r1/w8-inputs.json`
- Bytes: 99,239
- SHA-256: `4340C97DE145E1970D62F909B443894ACECFF3742F544D9BB41CCE0A9263025D`

## Claims and evidence grades

- **Verified literal identity:** the replacement full commit ID is the exact object returned by Git for `d70fd85`.
- **Verified bounded correction:** only the R1 baseline-paragraph citation is wrong; the package and evidence-table commit citations are correct at the checked scope.
- **No technical reassessment:** the fourteen-target extraction was not repeated or reinterpreted.

## Changed surfaces

- `docs/Plans/task-logs/combat-draw-inputs-r2.claim.json`
- `docs/Plans/task-logs/combat-draw-inputs-r2.md`

The R1 claim, report, and package remain byte-identical. No R2 output root was created because no replacement package was needed.

## Failed paths and limits

The incorrect full ID does not resolve to a Git object. No source, configuration, build, runtime, database, semantic, or matching evidence was examined beyond the bounded identity reconciliation.

## Evidence index

| Artifact | Bytes | SHA-256 | Scope |
|---|---:|---|---|
| `docs/Plans/task-logs/combat-draw-inputs-r1.claim.json` | 317 | `0ADD52413E75767E030189E93012254DF8420994E193F8C74805E6BB1220D812` | Frozen R1 claim |
| `docs/Plans/task-logs/combat-draw-inputs-r1.md` | 18,861 | `7E3A029A76EB190DC1F4099FC4ADE5472AFCC15C80867FFEED62934E14C50F35` | Frozen report containing the one incorrect citation |
| `build/combat-draw-inputs-r1/w8-inputs.json` | 99,239 | `4340C97DE145E1970D62F909B443894ACECFF3742F544D9BB41CCE0A9263025D` | Correct unchanged literal package |

## Verification summary

- Reproduced the mismatch between R1 line 11 and `git rev-parse d70fd85`.
- Confirmed the wrong ID is missing and the replacement is a commit.
- Confirmed the assignment-release commit and every other report full commit citation.
- Confirmed the package baseline and nested commit-designated fields resolve to the recorded objects.
- Rechecked all three frozen R1 SHA-256 identities before and after writing this correction.

## Protocol deviations

None.

## Proposed canonical-document changes

When the Director cites the W8 input baseline, use `d70fd853fdffacf71290b24763e010a549276a55`. Preserve R1 as the frozen erroneous record and pair it with this R2 correction.

## Next action

The Director may intake the unchanged R1 package together with this correction. This correction task releases all writes.