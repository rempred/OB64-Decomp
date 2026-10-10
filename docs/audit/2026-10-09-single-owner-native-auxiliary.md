# Single-owner native text and switch-table projection

Status: accepted after regression tests, the changed-input structural audit and
independent final review.

`func_002215D0` exposed a representation gap: untouched pinned compiler output
assembles to a 3,000-byte function, eight natural alignment bytes and a 240-byte
switch table. The accepted text owner is 3,008 bytes. Its source still differs
from retail, so this evidence establishes layout support, not matching acceptance.
Sol and GoldOx agreed on the gap in messages 2063/2062; Astra approved the separate
tooling assignment and both matching workers drained native commands.

The explicit `native-text-readonly-single-owner-projection` mode reuses the
existing native text/read-only group pipeline with exactly one physical owner
and one GLOBAL compiler function. It conserves complete sections, function
extent, actual minimal zero alignment tail, ordered relocations, encoded addends,
section anchors, table attribution and original data-row ownership. Table
destinations and references cannot enter padding. Unexpected executable sections
also reject when they lack allocation flags. Member/object/composition evidence
uses schemas 6/10/3; stale or altered proofs must fail independent reconstruction.

Legacy group minima, bounded `nativeTextTail`, standalone auxiliary contracts,
compiler identity and source policy are unchanged. Public compilation-group
scratch commands remain unsupported. No target, table partition or production
source is activated. See [the contract](../GROUP_AUXILIARY_PROJECTION.md).

Focused tests use unrelated compiled functions with eight-, four- and zero-byte
native tails, two link placements, source-proof/cache reconstruction, and
128–129 rejection controls per fixture. The real inactive dispatcher preserves
its complete native text/table through projection and retains the actual
`+0x64` ORI/ADDIU mismatch: both raw-target and full-owner exactness remain false.
Evidence is under `build/tests/single-owner-auxiliary-Q4CD59/`.

All 38 registered suites and two additional compatibility suites passed on the
final implementation. The aggregate reconciles the sole inventory delta, a
Director-owned queue-document edit; implementation inputs remained unchanged.
YellowTiger ran one `node tools/audit.js --profile`, with no preliminary build or
separate verifier. It reached EOF/exit 0 in 1,164.349 seconds on October 9 Eastern.
CURRENT `E9E49D4729BBC43706C5EBB54CB85FB0840948DDBB4D809AE24A872F4A241E0A`
retains baseline `D6553DED` and the byte-identical 41,943,040-byte Rev 0 ROM,
SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
All active targets passed fresh source proof without compiler-assembly rewrites.
Independent final review reconciled the implementation and reports without a
blocker or another verification run.

Generated evidence remains untracked under
`build/audit/single-owner-native-aux-20261009/`: `aggregate-validation.json`,
`yellowtiger-audit-2070-summary.json`, and its referenced run/report snapshots.
The prior CURRENT `B98A0C71` is preserved there. No production target uses the new
mode yet. Complete W8 and its W6/W7 prerequisites remain unfinished matching
assignments. Workers resume after refreshing affected private inputs once;
ordinary waves gain no additional review or per-function full-ROM gate.
