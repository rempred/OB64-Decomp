# Registry-bound local compiler entries

Status: accepted after the combined structural audit, fresh compilation and
independent final review. Sol/LavenderSpire agreed in mail1704; Claude/GoldOx
agreed with six corrections in1711. Astra approved the corrected design and
accepted its implementation and complete validator integration after audit1723.

## Problem and evidence

The [validator body admission](2026-10-07-resource-validator-logical-bodies.md)
establishes three independent bodies in unchanged owner row 9, ROM
`0x18D4..0x1A44`: 352/8/8 bytes. No caller is established for the two small bodies.
Existing secondary-entry tags assert internal calls or fixed-address calls;
neither claim follows from the evidence. Exporting the helpers or inventing
source references would not resolve that gap honestly.

LavenderSpire's complete GLOBAL diagnostic candidate emits 368 bytes with zero
differences outside its 16 actual text relocation fields. A separate ordinary
`static` source emits identical instructions and all three declarations; all 13
compiler-pass dumps agree and only two `.globl` directives disappear. This is
compiler evidence, not proof of LOCAL ELF bindings, relocations or linked bytes.
The preserved sources and controls are under `build/matching/resval-20261007/`.

## Approved contract

`reviewed-local-body` means an independently admitted executable body emitted
with reconstructed LOCAL binding. Reachability remains unspecified. It does not
establish original C linkage, deadness, a caller or a new export.

Whenever any compiler entry uses this tag, the entire ordered function census
must correspond exactly to authenticated registry bodies covering the producer.
That includes entries retaining older call-evidence tags; those tags keep their
existing meanings. Check intervals, fragments, placement and selected-owner
containment, not merely the producer's outside endpoints. Unknown bytes,
padding, partial bodies, omissions and invented internal splits reject.

The primary remains GLOBAL/owner. Every secondary must use the exact canonical
`body.symbol`, including case; lowercased alias lookup is insufficient. Entries
using the new tag require `supplemental-reviewed-body` evidence and LOCAL binding.
Preserved production envelopes and absent registry context cannot bypass this
check. Registry body authentication, source policy, actual relocation contracts,
sole ownership, exact linked bytes and complete-ROM equality remain mandatory.

This initial implementation supports one complete physical owner. Composed or
multi-owner use of the new tag must reject both during activation and in the
shared ELF partition validator used by canonical projection and diff caching.
Existing multi-owner call-tag contracts and zero-size continuation-symbol checks
remain unchanged. Compilation groups retain their separate restrictions.

## Validation required before acceptance

Exercise the validator's352/8/8 partition and an unrelated complete reviewed row
132 or133. Real rows68/99 provide mixed-status rejection controls. Test shifted
internal boundaries with unchanged total size; exact-name/case/alias errors;
mixed-tag census errors; missing, extra, reordered, unknown, padding or continuation
bodies; wrong status, placement, fragments and authenticated source hashes;
GLOBAL secondary and primary-tag misuse; and explicit rejection of the unsupported
multi-owner composition through both canonical and cache/split paths.

Retain authenticated cache dependencies and current contract validation. A cached
object or an old GLOBAL scratch result must not become production acceptance.
Run relevant existing source-census, logical-body, cache and multi-owner regression
tests, including unchanged relocation-order protections.

The production writer independently compiles the complete static-helper source
through the supported production path. Check one GLOBAL352-byte main, LOCAL8-byte
helpers at offsets`0x160` and`0x168`, exact368-byte owner coverage and all actual
relocations. Explicitly record any ancillary `.rel.pdr` behavior after LOCAL
binding; any metadata relocations remain separate from load-relevant text
relocations. Do not assume the GLOBAL diagnostic object proves these facts.

A real nonzero-return control for the final helper must compile and fail the
linked-byte comparison; a GLOBAL-secondary control must fail the census. Neither
control needs a full-ROM build. After focused checks and independent review,
combine any ready whole-validator activation with the tooling in one
`node tools/audit.js --profile` run. No preliminary full build or separate unchanged
verifier is needed. A tooling-only result cannot be reported as source acceptance.

Private checks must drain before shared tooling/configuration changes. Workers
may continue private source edits and reasoning while checks are held. Release
the hold and refresh affected intake after the accepted combined state is stable.

## Focused implementation result

QuietPond1714 and LavenderSpire1716 confirmed actual command exits for drain1713.
The six-file implementation passed eight focused commands: reviewed_local_bodies
(three real positive owners and30 negatives), active_targets, logical_functions
(45 negatives), resource_validator_logical (13 negatives), compiler_text_functions,
multi_owner_functions, diff_object_cache and multi_owner_relocation_order. The
last three include actual native split, cold/warm/invalidation and linked two-VMA
regressions. Every command exited zero and all owned processes finished.

Independent review confirmed all applied files match the reviewed draft and
recorded hashes, with no blocking implementation finding. Detailed command and
file identities are in ignored
`build/audit/validator-localbody-20261007/implementation-results.json`.
These tests do not establish the production validator's LOCAL object or linked
result; its complete source integration remains the production writer's next gate.

## Actual validator integration and controls

QuietPond1720 completed the supported canonical focused diff and real negative
controls, then restored the intended source. Independent review checked the
actual raw, stripped and linked ELF artifacts and their identities. All three
censuses retain the352-byte GLOBAL main and8-byte LOCAL helpers at`0x160`/`0x168`.
The linked368-byte owner independently matches the ROM hash
`8EC2F99EBD290DC40AF6C31B9EC8FCE9995917B99F63E0D83D5293AFDCE10999`,
with one C-object contribution, no fallback and no fill. All16 text relocations
match; the two internal section-relative jumps carry addend`0x144`.

The design review anticipated ancillary helper PDR relocations. That prediction
was wrong for these actual pinned-assembler objects: the valid LOCAL raw object
and the real GLOBAL-secondary control both contain no`.pdr` or`.rel.pdr` section.
All16 raw relocations are text relocations. Offsets`0x160`/`0x168` identify the
functions; there are no PDR addends or retirement records to invent. Existing
ancillary removal and load-relevant checks remain unchanged.

The real return-1 control changes the final helper's last word from`00001021` to
`24020001`, preserving the complete size and relocation contract while correctly
failing linked-byte equality. The GLOBAL-secondary control preserves native text
but rejects the symbol census before linking. Final restored source SHA-256
`E1B961A781053421EEAEFAC81F98DD7473A62268EA97A1093DCD805F16FE2F9A`
again reports PURE_C, exact linked bytes and matching relocations. Only this target,
its census/relocations and three evidenced message addresses were added to configuration.

The compact source/control packet is
`build/matching/movement-w5-20261007/validator-readiness-1718.json`.
Native/linked integration review passes. The required `node tools/test.js`
manifest also passed all33 suites in145.8 seconds with exit0; its full output is
`build/audit/validator-localbody-20261007/routine-test.log`. All test processes
exited, and no correction or shared-input change was needed.

## Final acceptance

The single `node tools/audit.js --profile` completed with `AUDIT PASS`, exit 0, at
`2026-10-08T03:17:58.096Z` (October 7 Eastern), in 1064.809 seconds. No preliminary
full build or separate verifier was run. CURRENT is
`EFC0B6A930E197792D9C8682EF923F952733178BE6346302D72335524D2138BA`;
baseline `D6553DEDD807851A93DC37DB9A8E9CD0186DA99B0ED88A763E39BBBC56B4B32F`
is unchanged. The independently hashed 41,943,040-byte ROM equals canonical
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Setup, CURRENT verification and independent fresh compilation pass. Every active
source proof was recreated, including this validator's PURE_C source, unchanged
raw/stripped objects, complete three-body census, sole ownership and 16 exact text
relocations. Its ancillary and retired-PDR counts are both zero. Independent
final review verified current report hashes/freshness and actual ROM identity,
with no blocking finding. The tracked-input comparison changed only the three
reviewed tooling modules and the two target/linkage files, plus the new C source;
all previously accepted sources and headers remain unchanged.

Detailed proof remains in the normal generated reports and ignored
`build/matching/movement-w5-20261007/validator-combined-audit-outcome-1723.json`.
Director1725 releases the actual native-check hold and resumes W5 and DB10 in
their separate private roots. Their unfinished scopes are unchanged. This
accepts one complete physical owner containing three compiler functions; it does
not establish either helper's callers or original linkage.
