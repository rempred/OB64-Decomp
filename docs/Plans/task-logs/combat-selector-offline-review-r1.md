# Combat selector offline review r1

Verdict: **Revision required**.

Material result: the frozen identities, thirteen immediate JALR-origin observations, signed-return interpretation, bounded no-positive-provenance claim, competing interpretations, and remaining observation gate are supported. The report nevertheless omits a concrete in-scope result available from the accepted baseline: the accepted `resource-loader-00213b10` placement maps the `00213B10` publication of `801E5AA0` to an exact six-entry callback table at ROM `00228D70`. All six entries map to same-slab function-owner starts and none equals the selector at `801BE2E8`. This is a compatible publication and a discriminating bounded offline experiment, contrary to the frozen report's no-mapping/no-experiment rationale.

Consequence: do not propagate frozen subject `2c6cf22815c5e9baa013364119e8e1aaedfb8cf7` as completed offline triage. The positive selector-consumer gate remains open, and this finding creates no matching, source, capture, structural, family-disposition, or runtime consequence.

Director action: route finding `CSOR1-F01` for a worker correction of the report and its evidence package, then proportionally re-review the corrected publication-table result and unchanged remaining gate. W7 production remains independent and unaffected.

## Frozen subject and eligibility

- Launch: `COMBAT-SELECTOR-OFFLINE-REVIEW-20260907-01`.
- Reviewer: `/root/combat_shared_dispatch_review`, Sol Max.
- Director: `/root`, native task `01a07262-aeca-7341-ad10-2dba705ff988`, host `local`.
- Frozen subject: `2c6cf22815c5e9baa013364119e8e1aaedfb8cf7`.
- Frozen report: `docs/Plans/task-logs/combat-selector-offline-provenance-r1.md`, SHA-256 `A34489B86F4E3C424725D4E7451188CAB0E4AE1E4C789934509C0E2943D7A950`.
- Frozen evidence: `build/combat-selector-offline-provenance-r1/input-evidence.json`, SHA-256 `E07A2E4F2C7B15847C23DDD3F966E6F4175AFA567E1A06F015FE4820A18FA546`.
- Accepted source baseline: `d70fd853fdffacf71290b24763e010a549276a55`.
- Review claim: `docs/Plans/task-logs/combat-selector-offline-review-r1.claim.json`, SHA-256 `A5DF293DE65A36DE6011EB335A65049E0017958ACFB58B7C2D859935ECEC0E10`.

Before the first review write, I confirmed the exact subject and package hashes, the worker's completed state, the absence of the assigned review claim/report/output root, and no competing ownership of the review surfaces. I then created the complete claim atomically with create-new semantics. The checkout advanced through unrelated production work while this review ran; the frozen subject and baseline stayed fixed, and no W6 or W7 production input entered the review.

The worker changed only its prompt status, claim, and report in the frozen subject. Its report and evidence hashes still matched immediately before this report write.

## Claims reviewed

| Claim | Independent result | Decision |
| --- | --- | --- |
| The frozen package authenticates fourteen accepted original owners and 671 words | All fourteen files match their recorded hashes, match baseline `d70fd853` modulo CRLF/LF only, and reproduce all 671 canonical ROM words | Supported |
| Descriptor-10 retains thirteen JALRs, twenty-four other non-return JRs, and 301 return JRs | Independent decode of ROM `001F0A30..00211D20` reproduced all counts and all thirteen JALR PCs/registers | Supported |
| The thirteen JALR targets have the immediate origins stated in the report | The object-word, root-table, entry `+C0/+0`, saved-`a3` stack `+14`, and saved-`a3` stack `+7C` chains all match the canonical words and relevant control paths | Supported as immediate-origin triage, not complete provenance |
| The comparator paths test signed `v0`, while a normal selector return is an unsigned byte | The four comparator uses are `bgez v0`; `func_00201778` returns through `lbu` in the `jr ra` delay slot | Supported as a weakening observation only |
| The three root setters publish `801CFC74`, `801E5AA0`, and `801EFCB0` to `801D0810` | Direct instruction decoding reproduces all three values; signed `ADDIU FC74` produces `801CFC74` | Supported |
| No compatible table mapping or discriminating offline experiment is available from those publications | Accepted placement maps the second setter and all six table slots exactly; see `CSOR1-F01` | Not supported |
| No positive selector provenance follows from the named local reads | The mapped six-slot table contains no `801BE2E8` entry, the zero-initialized first state has no static selector entry, and the third setter lacks accepted compatible placement | Supported within this bounded review; non-use remains unproved |
| A qualified invocation with actual transfer origin and relevant register/resource state remains necessary | Static publication narrows one root state but does not prove an invocation of any wrapper or selector | Supported |

## Review method and results

I used the worker report only as an index. I independently authenticated the canonical normalized ROM, accepted baseline owners, frozen report, and frozen evidence. I decoded descriptor-10 transfers and the exact predecessor/source words for every retained JALR. I separately evaluated each published `801D0810` value against accepted placement rather than historical assembly PC comments.

The corrected reviewer check at `build/combat-selector-offline-review-r1/independent-check-r2.js` passed 70 of 70 checks. Its result is `build/combat-selector-offline-review-r1/independent-results-r2.json`, SHA-256 `4E9AB83317F84F18E37264667230F6D3599E26A4F2C9E6ABF00B60D2E65B1F61`. The script SHA-256 is `81601D137B0079458F4363BFE5A46B3ABB9B6FC1B6C066EAE46DA5D67A89AE81`.

The check reproduced:

- canonical z64 SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`;
- fourteen authenticated owners and 671 exact words;
- all thirteen JALR sites and source registers, plus the `24`/`301` JR counts;
- all three root-setter words and the signed-address correction;
- selector placement at RAM `801BE2E8` and its unsigned-byte return;
- zero descriptor-10 direct J/JAL hits to the selector's eight words;
- the three publication-placement outcomes below.

An initial reviewer result at `build/combat-selector-offline-review-r1/independent-results.json` is preserved. It reported 69 of 70 checks because my expected arithmetic for the third numerical mapping was mistyped as ROM `00233F80`; the directly computed value was the correct `00232F80`. I corrected that reviewer-only expectation on a fresh `r2` script/result path. This diagnostic error did not enter the finding or alter frozen evidence.

### Publication outcomes

`func_0020BCE0` is inside descriptor 10. Its corrected pointer `801CFC74` maps to ROM `00213104`; the six initial ROM words there are zero. This proves only initial bytes. It does not exclude runtime slot writes or establish a selector consumer.

`func_00213B10` is the exact entry of the accepted loader-DMA slab:

```text
ROM   00213B10..0022A280
RAM   801D0840..801E6FB0
delta 7FFBCD30
```

The accepted loader constructs those endpoints at ROM `0004E65C..0004E678`, loads the slab, and calls its entry `801D0840` at ROM `0004E70C`. The entry constructs `801E5AA0` and stores it to root `801D0810`. Applying the accepted slab delta maps that pointer to ROM `00228D70`, where the canonical words are:

| Slot | RAM target | ROM target | Exact accepted owner |
| ---: | ---: | ---: | --- |
| `+00` | `801D85C4` | `0021B894` | `func_0021B894` |
| `+04` | `801D92E0` | `0021C5B0` | `func_0021C5B0` |
| `+08` | `801D202C` | `002152FC` | `func_002152FC` |
| `+0C` | `801DF9D8` | `00222CA8` | `func_00222CA8` |
| `+10` | `801DF404` | `002226D4` | `func_002226D4` |
| `+14` | `801D0854` | `00213B24` | `func_00213B24` |

Every target is an exact owner start inside the same accepted slab. None is `func_00201778` at RAM `801BE2E8`. This resolves the six wrapper targets for that statically published root state; it does not prove that a wrapper ran while the root retained that value, that the table was never overwritten, or that one of these targets cannot reach the selector by another unresolved indirect path.

`func_0023B220` lies beyond the accepted `resource-loader-0022a280` slab endpoint. Although `801EFCB0` numerically falls inside that slab's RAM interval and would map to ROM `00232F80`, those words are executable instructions rather than a six-pointer table, and the setter itself lacks same-placement support. The frozen report was right not to turn this numerical overlap into placement evidence.

## Blocking finding

### CSOR1-F01

**Finding ID:** `CSOR1-F01`

**Finding:** The report stops the root-publication investigation before applying an already accepted compatible slab mapping. It therefore incorrectly states that the inspected leads contain no compatible table mapping or discriminating bounded offline experiment.

**Failed assigned claim or gate:** The worker assignment required inspection of existing accepted evidence for a concrete previously untested offline line and a precise no-experiment limit only if none was justified. Frozen report lines 3, 38, 40, 42, and 43 rest the no-experiment conclusion on the absence of compatible placement/table publication. The exact `00213B10 -> 801D0840 -> 801E5AA0 -> 00228D70` chain supplies both.

**Frozen subject:** `2c6cf22815c5e9baa013364119e8e1aaedfb8cf7`, report SHA-256 `A34489B86F4E3C424725D4E7451188CAB0E4AE1E4C789934509C0E2943D7A950`.

**Direct observation:** Baseline `d70fd853` contains the accepted slab mapping, unchanged `func_0004e448`, unchanged setter `func_00213B10`, and unchanged `table_00228d6c`. The worker evidence package authenticates the setter but omits the accepted slab config, loader owner, and table owner. Independent canonical-byte inspection maps the six table words to the six exact same-slab owners listed above; no slot equals the selector.

**Reachable producer path:** The loader copies ROM `00213B10..0022A280` to RAM `801D0840..801E6FB0`, then calls `801D0840`. That entry publishes `801E5AA0` to `801D0810`. The six descriptor-10 wrappers read that root and slots `+00..+14` before their JALRs. This is an exact static publication path. Actual execution of a wrapper in this state remains unobserved.

**Material consequence:** The frozen report understates what existing offline evidence can decide and leaves a completed conditional target resolution out of its evidence boundary. Its ultimate no-positive selector result survives, but its claimed basis and handoff are incomplete. Because this changes research evidence and interpretation, it cannot be handled as a non-semantic coordination correction.

**Supporting evidence:** `build/combat-selector-offline-review-r1/independent-results-r2.json`; canonical ROM words; accepted `config/phase7/conventional-build.json`; `asm/original/rev0/lib/func_0004e448.s`; `asm/original/rev0/lib/func_00213B10.s`; `asm/original/rev0/lib/table_00228d6c.s`; and the six manifest owners. These inputs are unchanged from accepted baseline `d70fd853`.

**Smallest correction boundary:** revise the worker report and reviewer-visible evidence package to include the accepted slab/input identities, exact table mapping, all six conditional targets, and their non-equality to `801BE2E8`. Replace the blanket no-compatible-mapping/no-discriminating-experiment language with the precise result: one statically published root state is resolved and negative for a direct selector slot; actual wrapper execution, mutable table state, the other root states, caller arguments, and indirect downstream reachability remain open. Do not change production source, accepted structural configuration, R2 discovery, matching obligations, or runtime authorization.

## Evidence limits and propagation

This review did not build, compile, diff, verify source policy, open an emulator or GUI, access a bridge/session/knowledge database, capture runtime state, or modify production evidence. It did not rerun the worker's frozen checker. Reviewer mutations are confined to the claim, this report, and ignored `build/combat-selector-offline-review-r1/` artifacts.

The mapped table is static publication evidence, not an observed selector invocation. The first table state may be runtime-populated; the third setter still lacks accepted compatible placement. Object fields, saved comparator arguments, twenty-four other non-return JRs, external owners, synthesized targets, interior entry, relocated code, runtime writes, and non-use remain competing possibilities. The selector's argument domain, table semantics, valid bounds, family disposition, and behavioral name remain unresolved.

The remaining observation gate in the frozen report is retained: qualify the selector by exact entry/signature and record its actual caller or transfer origin, compatible loaded code identity, `a0`/`a1`, initialized root/resource identity, addressed byte, and resulting value. For indirect transfer, preserve the target register/value and its last definition; for tail/interior entry, preserve exact entry and register state. A pre-`jr` snapshot alone remains insufficient because `lbu` executes in the return delay slot.

No canonical documentation should be changed from this review. The Director should route only `CSOR1-F01` for worker correction and proportional re-review. The result does not authorize capture, selector naming, source acceptance, matching integration, family exclusion, structural change, or changes to W7.
