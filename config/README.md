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
  contract. Its `fixedOverlayNonExecutableRanges` records carve directly evidenced padding from
  code-class rows inside a specific fixed descriptor and overlay section, without changing the
  accepted source owner. Its `nonDescriptorLoadSlabs` records describe evidence-backed ROM ranges that are
  manually loaded at a different runtime VMA without a fixed overlay descriptor. An optional
  slab-local `executableRanges` list records narrowly evidenced executable treatment without
  changing the accepted source owner or its source classification. A slab-local
  `nonExecutableRanges` list similarly carves directly evidenced padding out of an otherwise
  code-class owner while retaining that owner's complete assembly fallback.
- `phase8/matching-c.json` - legacy detailed target/link-symbol/relocation evidence used to derive
  the minimal active-target model. Procedure-descriptor records are retained only as retired
  ancillary evidence.
- `matching-c-linkage.json` - reviewed active linkage contract. It owns the shared absolute-symbol
  registry and explicit load-relevant relocation contracts for new or migrated targets. An empty
  target contract is meaningful: it records that the source object was reviewed and has no
  load-relevant relocations.
- `gnu-binutils-2.6-build.json` - pinned source, deterministic MSYS2 build inputs, project patches,
  versions, production executables, and runner identities.
- `toolchain.json` - active GNU Binutils 2.6 resolver, flags, and ignored local install root.
- `source-policy.json` - matching-compiler provenance plus the complete authenticated executable
  chain used to preprocess sources before classification.
- `matching-workbench.json` - optional workbench schema, pinned m2c commit/tree/target, configured
  ruleset ensemble, and bounded-output limits. It is a research contract, not an acceptance gate.
- `matching-priorities.json` - reviewed additive target/subsystem value annotations used by
  workbench ranking. Missing runtime or priority evidence is not scored negatively.
- `total-resolver/sources.json` - frozen pre-R3 migration inputs plus the maintained bridge/client,
  external Project64, and decomp identities checked by Total Resolver before capture or rebuild.
- `local-tools.example.json` - portable template for the ignored `local-tools.json` that resolves
  the authenticated compiler, Splat, asm-differ, work roots, audit evidence, and pinned PowerShell
  runtime without committing machine-specific paths.

`matching-c-targets.json` owns the toolchain and build-provenance manifest paths and SHA-256 values
once. Target entries remain limited to `symbol` and `source`. New targets never receive fabricated
records in `phase8/matching-c.json`: use `tools/diff.js` to discover their source-object relocation
candidate, then review and record the smallest exact target contract in
`matching-c-linkage.json`. Update the authenticated chain in this order:

```text
build script/patches -> GNU 2.6 build provenance -> toolchain manifest
-> Phase 7 and active-target pins -> workflow fingerprint
```

Each step must reject the older hash before the next reviewed value becomes current.

Never hand-edit a generated configuration file. Change its generator, regenerate
it, and rerun the applicable verification gate.

Treat the Phase 7, Phase 8, lock, and provenance records as frozen contracts.
Change them only through a new reviewed result.
