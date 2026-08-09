# config

Rev 0 decomp configuration lives here.

- `roms/us_rev0.json` - ROM identity, byte order, CRC metadata, and core address rules.
- `segments/rev0.yaml` - production no-gap ROM ownership for Splat.
- `overlays/us_rev0.json` - 19 ROM-derived overlay descriptors and group relationships.
- `splat/us_rev0.yaml` - Splat 0.34.0 production configuration.
- `splat/us_rev0.semantic.json` - machine-readable ownership and unresolved-candidate state.
- `splat/us_rev0.overlay-linker-inputs.json` - separate Phase 4 overlay reservations.
- `splat/splat64-0.34.0.lock.json` - authenticated runtime and package identities.
- `splat/splat64-0.34.0.provenance.json` - authenticated artifact provenance.
- `phase7/conventional-build.json` - pinned conventional assembly, runtime-placement, and linker
  contract. Its `nonDescriptorLoadSlabs` records describe evidence-backed ROM ranges that are
  manually loaded at a different runtime VMA without a fixed overlay descriptor. An optional
  slab-local `executableRanges` list records narrowly evidenced executable treatment without
  changing the accepted source owner or its source classification.
- `phase8/matching-c.json` - pinned 36-byte matching-C replacement contract.
- `compiler-assembly-dialect.json` - schema-1 compiler-assembly adapter contract. It pins the
  compiler, adapter module, assembler, flags, eligibility boundary, and sole rewrite rule.

`matching-c-targets.json` owns the adapter manifest path and SHA-256 once. Target entries remain
limited to `symbol` and `source`. Update the authenticated chain in this order:

```text
adapter module -> dialect manifest -> active-target manifest pin -> workflow fingerprint
```

Each step must reject the older hash before the next reviewed value becomes current.

Never hand-edit a generated configuration file. Change its generator, regenerate
it, and rerun the applicable verification gate.

Treat the Phase 7, Phase 8, lock, and provenance records as frozen contracts.
Change them only through a new reviewed result.
