# Scratch COP1 native assembler input

Status: accepted after required checks and independent review with no material findings.

## Defect and approved scope

The section-assigned scratch compiler converted numeric `add.s`, `sub.s`,
`mul.s` and `div.s` instructions to `.word`. The pinned KMC assembler's
`gas/input-file.c` performs its VR4300 multiply workaround on instruction text.
Consequently, scratch compilation could omit required spacing instructions or
misinterpret an intervening arithmetic instruction. Correct instruction encodings
alone did not preserve assembler behavior.

Sol and GoldOx explicitly agreed on the scratch defect/missing capability and a
generic native-input remedy in Agent Mail 1183/1186. Astra approved this bounded
tooling repair. Both decomp workers drained native/store commands before mutation.
Production compilation, focused linked diff and the canonical verifier already
kept native instructions; their implementation and accepted proofs are unchanged.

The conversion entered in `2c534d2b` on August 25. A bounded search recovered its
deterministic-encoding rationale but no original failing fixture. Later operand
errors dependent on assembly filename/comments were addressed by the September 30
assembler repair. Earlier research also recorded native/transformed byte-count
differences. No current reproducer justified retaining the automatic conversion.

## Change

Scratch compiler contract 11 keeps native instruction text and applies only the
existing permitted section assignments. The auxiliary-read-only allowance and
stricter native-tail rules retain their scope. No binary, compiler flag, production
owner, source-policy rule or acceptance gate changes.

New reports bind the native instruction policy and both assembly identities.
Cache reuse re-creates the permitted section assignment and rejects instruction
rewrites, including rehashed artifacts relabeled with the new policy. Earlier
transformed compilations remain historical evidence. Historical compiler probes
remain readable; new probes have a distinct implementation identity.

Native scratch/probe entry points reject a `VR4300MUL` value beginning with `OFF`,
case-insensitively after the assembler's leading C whitespace. Rejection precedes
scratch/store/cache side effects and leaves the environment unchanged. Metadata
session preparation, help and historical queries remain usable. There is no new
transformed-mode option or target-specific instruction injection.

## Validation and production audit boundary

- `tests/scratch_cop1.js` covers 33 paired native/section-assigned cases: the four
  single-precision binary operations and register-overlap patterns, single/double
  multiply adjacency, directives/blank lines, and intervening arithmetic. It also
  covers disabling environments, stale/tampered provenance and old probe reading.
- An authentic archived `PURE_C` candidate remains nonmatching: 1,144 native bytes
  versus the 1,140-byte original. Tests do not substitute transformed scores or
  change expected target bytes.
- Independent checks preserve CRLF instruction text and reproduce an adjacent
  multiply pair as 12 native/section-assigned bytes versus eight transformed
  bytes. Disabled-environment execution rejects, while historical probe comparison
  remains available.
- The required `node tools/test.js` manifest ran 33 suites in 180.2 seconds.
  Thirty-two passed; the remaining failure was an existing routing test's mock
  import table missing the new helper. Its binding was repaired without changing
  assertions, and the complete affected `tests/matching_private_workspace.js`
  suite then passed. Every required suite has passing evidence for final inputs;
  the 32 unaffected suites were not repeated solely to replace the initial log.
- Director before/after authentication covers 7,006 production inputs and bound
  artifacts, with no changed identities or conflicts. Fresh context preparation
  reproduces CURRENT `44C2FEA1FA4861B69FF10526AEB5213A8134BA955D9BA64BEF9549F9E23CBC35`
  and baseline `1C14E225B1650F78DB175CCF6933B950262A4F848215BC114149ACD3181B061F`.
  The existing canonical proof remains exact; the complete ROM SHA-256 remains
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

This is a focused research-tool audit. None of the production structural or
verification inputs listed in [AUDIT.md](../AUDIT.md) changed, so the accepted
baseline/current audit is reused. No full-ROM build or verifier repeat ran for
this repair. This decision does not excuse an audit for a future production change.

Independent review inspected the final implementation, all four test-harness
adaptations, retained results and this report. Its own native/environment/CRLF
checks agreed. Review accepted the final-input evidence without describing the
initial routine run as an all-green run. Tooling acceptance activates no function.

Ignored evidence: `build/scratch-cop1-director-20261005/{before,after}.json`,
`build/scratch-cop1-review-20261005/result.json`, and
`build/tests/cop1-xkpgUw/result.json`. Routine and repaired-suite logs are
`build/tests/scratch-cop1-routine.log` and
`build/tests/scratch-cop1-private-retest.log`. The director's `closure.cjs` reproduces the
identity and existing-proof checks. Sol's original four-case reproduction is
`build/matching/solsquad/squad-scheduler-1094bc-as-stem-diagnostic.json`.

## Continuation

After tooling acceptance, refresh affected scratch context and continue each
complete assigned wave. Recheck selected floating-point candidates with native
input when resumed; earlier transformed scores do not establish native equality.
Ordinary matching acceptance still requires linked relocation/ownership/placement
and exact target bytes, followed by the complete wave's full-ROM verifier.
