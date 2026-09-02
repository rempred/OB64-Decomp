# OB64 Decomp — Next Steps

This file is the active queue only. Changing counts belong in `node tools/status.js`, not here.

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
results, ruleset-ensemble membership, and family siblings are leads to review,
not automatic promotion. Use `--variant structured` for one baseline draft or
the default configured ensemble when a broader bounded pass is useful. Add
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

Use the [High Attack Battle Stream Families Director Plan](Plans/high-attack-battle-stream-families-director-20260902.md)
for item 4. It keeps all eight bounded families and five shared bridge functions
in a sequential queue. Wave 1 is the action-stream record-construction family.

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
