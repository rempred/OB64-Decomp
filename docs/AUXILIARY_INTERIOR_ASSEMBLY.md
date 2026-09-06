# Retained interior original assembly

This capability has an independent [Accepted structural review](audit/high-attack-wave6-interior-asm-review-r1-20260906/review.md).
Implementation is frozen at `6e0ccd3030ad37e83478181081f3d56350f3de1e`; review is frozen at `091a66dc21b1e45a571741dbf331fcfaae95dbde`.
This document does not authorize a new production ownership contract.
EF50, D14C, and B06C remain inactive in canonical production.
The isolated regression uses B06C's accepted structural table contract as a test fixture, not a production activation.
That fixture comes from `850aa8f`, reviewed at `4096dc7`, and contains no provisional C source.
Tooling acceptance does not accept the unfinished seventeen-owner wave. B1F4 and D14C remain nonexact.

## Contract

An optional `preservedInteriorBefore` belongs to a noninitial C auxiliary fragment in one accepted read-only data row.
It describes one positive, contiguous original-assembly interval immediately before that fragment.
Its start must equal the preceding C fragment's end, in both ROM and accepted RAM placement.
Its end must equal the following C fragment's start.
Multiple gaps use separate contracts on their respective following fragments.

The complete row remains ordered and gap-free: optional assembly prefix, C fragments with explicit assembly interiors, and optional assembly tail.
Every interval has one owner. A noninitial fragment cannot also own an exterior prefix.
Only the final fragment may own the exterior tail.
Existing same-chunk, accepted-row, alignment, compiler-occurrence, and source-object-prefix restrictions still apply.

The interval object requires exactly these fields:

| Field | Required value |
| --- | --- |
| `inputSection` | `<outputSection>.interior_<eight uppercase ROM-start hex digits>` |
| `sectionType` | `SHT_PROGBITS` |
| `sectionFlags` | `["SHF_ALLOC"]` |
| `alignment` | `1` |
| `romStart`, `romEndExclusive` | Eight-digit uppercase `0x` addresses, end-exclusive |
| `vramStart`, `vramEndExclusive` | Accepted row placement, not historical assembly comments |
| `bytes` | Positive integer matching both extents |
| `expectedSha256` | Uppercase SHA-256 of the exact canonical interval |
| `ownerOriginalAssembly` | The accepted row's unchanged `asm/original/` source |
| `ownerOriginalAssemblySha256` | That source's authenticated uppercase SHA-256 |
| `expectedRelocations` | Explicit empty array |

Omit the optional field when no interior exists; `null`, unknown keys, invented entries, and missing relocation evidence reject.
No generated source is injected into C, and compiler assembly remains authenticated and unchanged apart from existing section assignment.

## Relocation boundary

This bounded implementation supports literal, relocation-free original data rows only.
It verifies actual original-row REL/RELA sections before extracting any bytes.
Any nonempty relocation section targeting that row rejects, even when its relocations lie outside the retained interval.
The generated retained object must also contain no nonempty REL/RELA sections or named non-section symbols.
It contains exactly one allocated, read-only, alignment-one interval section and no conventional code or data sections.

The empty census is therefore measured, not assumed from linked equality.
Relocating original assembly expressions require a separately evidenced extension; this implementation never strips or fabricates their relocations.
C table relocations remain independently checked against their normal contracts.

Retained original assembly is not compiler padding.
`compilerOccurrences[].paddingBefore` continues to describe only necessary compiler-emitted zero alignment bytes inside one C auxiliary contribution.
An assembly interior may contain nonzero data and must never increase the C replacement-byte census.

## Generation and verification

The original accepted chunk remains available under `comparison/original/`.
The producer authenticates the original source and complete original row against the canonical ROM before extracting the interval.
Pinned GNU objcopy creates a separate retained object under `objects/assembly/auxiliary/`.
The original row is removed once, and explicit linker selectors interleave retained objects with the C objects in accepted address order.
The existing output section and load-segment model remain unchanged.

The verifier checks exact map contribution order, full object paths, addresses, sizes, and sole ownership across the entire affected row.
It independently reconstructs interval bytes from the original fallback and checks retained binary, retained object, linked interval, and source-object proof.
Manifest and layout records must agree with the normalized contract.
Build records carry exact interval artifact identities, and status accounting retains their bytes as assembly.

The projected interval evidence uses schema version `1` and kind `retained-original-assembly`.
Existing outer build, layout, proof, and cache schemas remain unchanged.
Required evidence reconstruction and implementation fingerprints invalidate stale outputs; unchanged schema numbers do not permit missing new evidence.
Targets without interiors receive explicit empty build artifact lists and null compiled/layout interval projections.
Source-object proofs include interval evidence only when an interval exists.

The C-object cache binds the complete auxiliary contract and new implementation identity.
Cache restoration independently rebuilds the interval metadata; it does not cache retained assembly ownership artifacts.
CURRENT reuse checks interval artifact closure, and fresh verification regenerates retained objects alongside independently compiled C objects.
Normal exact-ROM acceptance remains mandatory and distinct from these isolated tooling tests.

## Bounded checks

Run `node tests/auxiliary_interior.js` for the isolated original-row fixture and negative controls.
The routine `node tools/test.js` includes this fixture.
Its assembly table proxies exercise real relocations and linker order, but they are not C implementations or source-class evidence.
Its separate D14C placement fixture covers two compiler occurrences and their four-byte alignment gap without claiming D14C compilation acceptance.

The assignment's isolated actual-C probe separately compiles unchanged B06C and archived EF50 sources, then reconstructs proofs and links the entire ROM.
Its results do not activate either prospective ownership change.
The frozen [implementation AAR](audit/high-attack-wave6-interior-asm-tooling-r1-20260906/aar.md) records commands, failures, artifact identities, and preservation checks.
Its pending-review statements describe the historical implementation handoff, not the capability's current review status.
The subsequent [Accepted review](audit/high-attack-wave6-interior-asm-review-r1-20260906/review.md) supplies independent structural review evidence.

Ordinary matching needs no independent review after its canonical gates pass.
Use focused linked-diff and source-policy checks per target, then final verification after the complete wave is ready.
Every assigned target must be `PURE_C` in that final report, with exact ownership, placement, relocations, target bytes, and full-ROM gates.
See [WORKFLOW.md](WORKFLOW.md) for changed-integration verification and the prohibition on per-function full-ROM runs within a wave.

Changes to these ownership rules remain structural work under `docs/AUDIT.md`.
