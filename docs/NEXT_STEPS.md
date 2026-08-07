# OB64 Decomp — Next Steps

This file is the active queue only.

Changing counts belong in `node tools/status.js`, not in this document.

---

## Immediate Goal: Simplify Without Losing Proof

### 1. Freeze the current accepted baseline

Before workflow surgery:

- run the existing accepted baseline/Phase 7/Phase 8 verification paths;
- record the current exact retail ROM identity;
- record the currently active replacement target set; and
- do not change existing C/asm implementations during the workflow migration.

### 2. Add retrospective source classification

Implement `tools/source_policy.js`.

Classify every active `.c` replacement as:

- `PURE_C`;
- `HYBRID_C`; or
- `UNKNOWN`.

Do not break the exact baseline because legacy sources are hybrid.

Update generated status so only exact `PURE_C` targets count as matching C.

### 3. Add the minimal command layer

Implement:

```text
node tools/build.js
node tools/diff.js <symbol>
node tools/verify.js [--target <symbol>] [--require-pure]
node tools/status.js
node tools/audit.js
```

Initially reuse the proven existing Phase 7/8 libraries internally.

Do not create a second independent matching implementation when the existing verifier already
proves ownership, target bytes, and full-ROM identity.

### 4. Prove parity

For the exact same source tree:

- old accepted verification passes;
- new verification passes;
- target placement/ownership decisions agree;
- target linked bytes agree;
- final ROM SHA/bytes agree; and
- source-policy classification is deterministic.

Do not retire the old user-facing workflow before parity is demonstrated.

### 5. Reduce duplicated target metadata

Introduce a minimal active-target model containing primarily:

```json
{
  "symbol": "...",
  "source": "..."
}
```

Derive addresses, ranges, owner IDs, overlay information, expected retail bytes, original assembly,
and relocations from accepted structural sources where safe.

Use an adapter during migration. Do not delete trusted metadata before the derived replacement has
been proven equivalent.

Move durable link symbols to a shared symbol source when unambiguous; do not invent addresses merely
to make the config smaller.

### 6. Retire active process bureaucracy

After parity:

- remove Highway/Lane/Lease/Checkpoint/Promotion concepts from active instructions;
- stop generating ordinary-function promotion/review packages;
- stop manually duplicating matching counts across docs;
- keep historical evidence/history intact rather than rewriting it; and
- keep the heavyweight forensic checks behind `audit`.

### 7. Replace the canonical docs

Install:

- `AGENTS.md`;
- `docs/WORKFLOW.md`;
- `docs/SOURCE_POLICY.md`;
- `docs/AUDIT.md`; and
- this `docs/NEXT_STEPS.md`.

---

## After Migration: Optimize For LordlyCaliber Leverage

Do not restart an easy-function matching farm merely to increase percentage.

Choose the next decomp targets by the amount of runtime-hook/workaround complexity they can remove.

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

---

## Legacy Hybrid Cleanup

Do not stop high-value subsystem work to purify every legacy hybrid immediately.

Convert hybrids opportunistically when:

- they sit on a high-value call graph;
- removing inline assembly is tractable;
- they are small foundational helpers; or
- they obscure an important source-level modification.

The target graduates from hybrid to matching C only when it is `PURE_C` and remains exact.

---

## Explicitly Deferred

Do not combine these with the workflow migration:

- Splat version upgrade;
- compiler/toolchain replacement;
- Rev 1 support;
- new segmentation;
- broad function-boundary reclassification; or
- a native-PC/static-recomp project.

Evaluate those separately once the simplified Rev 0 workflow is stable.
