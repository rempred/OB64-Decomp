# OB64 Decomp — Next Steps

This file is the active queue only. Changing counts belong in `node tools/status.js`, not here.

## Immediate gate: independent GNU Binutils 2.6 structural review

The GNU Binutils 2.6 implementation commit requires a fresh independent structural review before
it is treated as accepted canonical history. The reviewer should begin from the implementation
commit and use new external output roots.

At minimum, independently falsify:

- source commit `54514ded39ceb32165a125ddba04ca5b551773a2`, deterministic build inputs, tracked patch
  scopes, output hashes, and runner identity;
- big-endian MIPS3/O32 assembly behavior, historical `move` expansion, call relocations, linker
  LMA/`PT_LOAD` behavior, and binary extraction;
- exact Phase 7 assembly/data ownership and exact Phase 8 target ownership for all active
  replacements;
- untouched KMC compiler output followed only by the accepted target-section adjustment;
- the reviewed distinction between load-relevant relocations and discarded ancillary procedure
  metadata, including the `func_0000A1F8` section-symbol normalization;
- all six GNU 2.6 hybrid rewrites, with every target still classified `HYBRID_C`;
- p3063 exact `PURE_C`, p3064 exact `HYBRID_C`, protected `func_0002CD70` OR words, and inactive
  p3066;
- absence of the retired compiler-assembly rewrite path and modern Binutils from active
  configuration/build code; and
- two clean reproducible builds, normal verification, regression suites, the heavyweight audit,
  and complete ROM SHA-256
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Record the review in a new durable audit report. Corrections discovered by review should be made
as a separate structural change and rerun through the same gates.

## Structural follow-up: audit remaining manual-load slabs

The accepted `scenario-loader-00195410` record proves the generic placement mechanism for a ROM
range that retail manually DMA-loads to a different runtime VMA without a fixed overlay descriptor.
Audit other `rom-only` executable owners against direct loader/DMA evidence before treating their
ROM addresses as runtime addresses.

- Add `nonDescriptorLoadSlabs` records only when exact ROM and runtime endpoints are proven and the
  ranges have equal length.
- Do not reuse the scenario-loader `+0x8007FB70` delta outside
  `0x00195410..0x001977E0`, and do not invent fixed overlay descriptors for manual loads.
- Preserve existing owner boundaries, ROM LMAs, segmentation, source ownership, and the 19 fixed
  descriptors unless separate direct evidence proves one wrong.
- Run the heavyweight structural audit and obtain independent review for every accepted mapping.

The accepted mapping and remaining uncertainty are documented in
`docs/audit/2026-08-07-func-0019554c-slab-placement-blocker.md`.

## Matching priorities: optimize for LordlyCaliber leverage

Do not restart an easy-function matching farm merely to increase percentage. Choose targets by the
amount of runtime-hook or workaround complexity they can remove.

Use `node tools/match.js rank --lane leverage` as an inspectable starting queue,
then apply the reviewed subsystem priorities below. The workbench's scratch-exact
results and family siblings are leads to review, not automatic promotion. Add
target-specific value annotations to `config/matching-priorities.json` only when
the subsystem relationship is already supported; do not let the high-yield
small-leaf pilot displace LordlyCaliber leverage.

### Tier 1 — Current runtime hooks and code patches

Identify and decompile the original call graphs around:

1. scenario deployment/enemy-record construction currently intercepted by the squad override;
2. scenario/mission resource loading and DMA paths used by archive relocation;
3. shop resource/inventory loading used by the Expansion-Pak shop override;
4. the battle-stream path patched by High Attack Streamsplit; and
5. the menu/render path used by the Chaos Frame display module.

A large nonmatching research reconstruction can be more valuable than dozens of unrelated tiny
matches, but the retail exact baseline must remain separate and honest.

### Tier 2 — Current LordlyCaliber limits

Prioritize code governing:

- multi-window mission archive loading/relocation;
- combat buffer capacity/ownership;
- scenario deployment limits and group construction;
- stronghold/scincsv descriptor creation;
- map-sprite/class deployment validation; and
- reserve/active character validation.

### Tier 3 — Broad subsystem leverage

Then expand through:

- battle damage and action execution;
- battle AI/action choice;
- event/script interpretation;
- world-map state;
- dialogue; and
- audio/resource consumers.

## Legacy hybrid cleanup

Do not stop high-value subsystem work to purify every legacy hybrid immediately. Convert hybrids
opportunistically when they sit on a high-value call graph, are tractable foundational helpers, or
obscure an important source-level modification.

A target graduates from hybrid to matching C only when it is mechanically `PURE_C`, retains sole
C-object ownership and exact target bytes, and the complete ROM remains exact.

## Explicitly deferred

Do not combine the active queue with:

- another Splat upgrade;
- another compiler or Binutils replacement;
- Rev 1 support;
- new segmentation without a dedicated structural task;
- broad function-boundary reclassification; or
- a native-PC/static-recomp project.
