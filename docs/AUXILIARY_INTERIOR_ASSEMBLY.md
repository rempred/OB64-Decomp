# Retained interior original assembly

This capability has an independent [Accepted structural review](audit/high-attack-wave6-interior-asm-review-r1-20260906/review.md).
Implementation is frozen at `6e0ccd3030ad37e83478181081f3d56350f3de1e`; review is frozen at `091a66dc21b1e45a571741dbf331fcfaae95dbde`.
This document does not authorize a new production ownership contract.
Production ownership and matching-C status come from the canonical verifier and generated CURRENT status.
The isolated regression uses B06C's accepted structural table contract as a test fixture and preserves the current canonical target model.
That fixture comes from `850aa8f`, reviewed at `4096dc7`, and contains no provisional C source.
Tooling fixture acceptance does not establish source classification or matching-C acceptance.

## Contract

An optional `preservedInteriorBefore` belongs to a noninitial C auxiliary fragment in one accepted read-only data row.
It describes one positive, contiguous original-assembly interval immediately before that fragment.
Its start must equal the preceding C fragment's end, in both ROM and accepted RAM placement.
Its end must equal the following C fragment's start.
Multiple gaps use separate contracts on their respective following fragments.

The complete row remains ordered and gap-free: optional assembly prefix, C fragments with explicit assembly interiors, and optional assembly tail.
Every interval has one owner. A noninitial fragment cannot also own an exterior prefix.
Only the final fragment may own the exterior tail.
Accepted placement pairing, alignment and compiler-occurrence restrictions still apply.
Shared-row validation requires the current accepted model and re-resolves every complete
text owner and the data owner, including their actual archive chunks and source identities.
Different contributor text chunks are supported only within one unique accepted
non-descriptor `loader-dma` slab, with model/config agreement, complete containment and
both ROM/RAM endpoint equations. Equal addresses or slab labels alone are insufficient.
Existing same-chunk placement modes remain supported; forged chunks and unsupported
cross-chunk overlay, boot, linear or ROM-only contexts reject.

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

### Terminal compiler alignment

The optional, true-only `sourceObjectPrefix.discardedTerminalAlignment` mode separates
native terminal alignment from the original bytes that follow a table in ROM. It admits
only the exact zero bytes required by the native section alignment, authenticated by
full-section, payload and padding hashes and the unchanged compiler grammar. Symbols
touching those bytes, relocations outside the selected payload, extra relocation carriers,
and nonzero padding reject. Explicit linked retail padding cannot be combined with this mode.

The selected C section excludes that padding. Original prefix/interior/tail contributions
still cover the whole accepted row exactly once, even when the original tail is four nonzero
bytes. Without this explicit mode, the legacy equality between source padding and retained
tail remains required. Fresh proof, recorded-build evidence and cache identities retain the
mode; omitted or downgraded evidence cannot reuse acceptance. The
[boot-data repair note](audit/2026-10-06-boot-initialized-data.md) records validation status.

## Generation and verification

The original accepted chunk remains available under `comparison/original/`.
The producer authenticates the original source and complete original row against the canonical ROM before extracting the interval.
Pinned GNU objcopy creates a separate retained object under `objects/assembly/auxiliary/`.
The original row is removed once, and explicit linker selectors interleave retained objects with the C objects in accepted address order.
The existing output section and load-segment model remain unchanged.

The verifier checks exact map contribution order, full object paths, addresses, sizes, and sole ownership across the entire affected row.
Every multi-member shared row uses explicit C/ASM input selectors, including rows without
interiors. Manifest and linker response-file order cannot determine fragment order.
Verification also reconstructs the recorded shared-row linker stanza, rejecting wildcard
selectors even if the observed map happened to have the expected order.
The global selector census accepts only the finite script forms emitted by the build.
Bare-file inputs, wildcard section patterns, input lists, nested selector wrappers and
other unsupported descriptions fail closed, including outside the protected stanza.
Comments do not create selectors. Literal selectors permit surrounding whitespace.
Prefix/tail placement and the original row-symbol assignment remain fixed. These checks re-derive existing model
and contract data without adding persisted certificates or changing evidence schemas.
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
The isolated ordering probes additionally cover genuine text contributors from two archive
chunks in one accepted slab, and a shared row without an interior. Both link with reversed
manifest/response-file order and check exact row bytes, explicit selectors and map ownership.
Model-provenance negatives retain the forged-chunk rejection alongside authentic cross-chunk
positives. Tooling review and changed-input structural acceptance remain separate from fixtures.

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
