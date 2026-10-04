# Fixed-row read-only auxiliary projection

The explicit `auxiliaryProjection` linkage mode maps one authenticated native
`.rodata` section to complete, existing read-only owner rows. It does not change
accepted boundaries or text ownership. This tooling requires structural review
and the changed-input audit before production use; a focused fixture is not
matching-C acceptance.

The target retains its ordinary `auxiliarySections` records, one per complete
payload row. Each has the existing object/linked hashes and exact local
`R_MIPS_32` relocation contract. No exterior prefix/tail, retained interior,
source-object prefix, multi-text producer, native-text-tail, or compilation
group may be combined with the standalone mode. The separately documented
[compilation-group composition](GROUP_AUXILIARY_PROJECTION.md) supports version 1 only.

The target-level contract has exactly these fields:

```text
schemaVersion: 1 or 2
mode: "fixed-row-readonly-projection"
compilerSection: ".rodata"
bytes: complete native section size
alignment: native section alignment
expectedObjectSha256: complete native section hash
segments: ordered, gapless census of every native byte
```

Offsets and lengths in this contract are integers. A payload segment has
`kind: "payload"`, `offset`, `bytes`, `outputSection`, compiler `label`, and
`alignmentDirectives`. It must equal one complete compiler occurrence and one
complete accepted owner row. Its position in the segment list must agree with
the auxiliary record order. Payloads share the first row's accepted placement
context; both ROM and runtime displacement must equal their native offsets.

Version 1 retains its original meaning: payload bytes are all pointer entries;
every native alignment gap remains check-only original ASM. Version 2 additionally
allows a complete nonfinal payload row to include the natural padding after its
pointer entries. Its existing auxiliary record declares `entries`,
`trailingPaddingBytes`, and `expectedTrailingPaddingSha256`; no segment field or
invented pointer entry represents that padding. The complete row has
`bytes == entries * 4 + trailingPaddingBytes` and `ownerTailBytes === 0`.
The positive padding amount must equal both the native alignment formula and the
next table offset minus this table's entry end. Payload starts remain aligned.
Owned terminal padding is explicitly unsupported in version 2; terminal padding
must remain check-only. Compilation-group composition accepts version 1 only.

A check-only segment has `kind: "zero"`, `offset`, `bytes`, `ownerSection`,
`ownerOffset`, `ownerBytes`, and `expectedOwnerSha256`. It binds native alignment
padding to an interval inside a retained original ASM row. The complete original
row, including bytes outside the native footprint, is authenticated and must be
zero. The contract does not allocate a buffer from the authored owner length;
resolution first binds it to the accepted row and bounded baserom slice.
These segments emit no section or C ownership. Missing, additional, reordered,
overlapping, or non-native padding rejects.

Compiler input and instructions remain untouched. The existing compiler grammar
authenticates each occurrence's actual entry count and alignment directives,
using pointer ends rather than ownership ends to derive native gaps. Section assignment gives the native
read-only section the first payload's input name. The authenticated unsplit
assembler object remains an artifact. ELF projection copies each payload,
partitions actual relocation entries by their **place**, and subtracts only
that payload's native offset from `r_offset`. It preserves `r_info`, symbol
identity, and every encoded addend. The original read-only section symbol stays
anchored at offset zero of the first payload, including text references to later
tables through nonzero addends. Padding cannot have a symbol, relocation place,
or reference, including padding owned inside a version-2 payload. Copying and
ownership use whole-row intervals; relocation places, counts, and destinations
use only pointer-entry intervals. Unexpected allocation, symbols, relocation types, or destinations
reject.
The standard `gcc2_compiled.` marker requires its exact metadata, including a
zero `st_other` byte, and cannot receive any relocation.

Version-1 object evidence schema 4 and nested projection schema 1 retain their
exact fields. Version 2 requires object evidence schema 6 and nested projection
schema 2, adding an exact `payloadSlices` census: output section, native offset,
whole bytes, entry bytes, padding bytes, whole native slice hash, and padding hash.
Fresh object evidence records the contract, complete raw section/symbol/
relocation census, projection implementation identity, raw/projected artifact
identities, actual pointer relocations, anchor references, and retained bindings.
Source proof and cache inspection independently reconstruct the projected object
from the unsplit artifact. Link evidence authenticates the full retained original
ASM objects, sole map contributions, bytes, and load mappings. Existing payload
ownership, fallback pruning, exact linked-byte, and complete-ROM gates remain in
force. Current-state and cache implementation fingerprints include the new helper.
Status counts payload bytes once; check-only bytes remain original ASM.
Structural proof validation requires the exact versioned projection-evidence
fields. Its native-object, projected-object, and native-section hashes must bind
to the unsplit artifact, projected source-object artifact, and projection contract,
respectively. Version-2 slice fields must also agree with final auxiliary object
evidence. These schema checks supplement independent object reconstruction.
The projector copies authenticated native slices, including owned zero padding;
it never manufactures payload padding. Hash equality binds bytes, not historical
copy provenance: pinned compiler/assembler reproduction, strict native grammar,
zero validation and independent projection replay provide that evidence.

`node tests/auxiliary_projection.js` is registered in `node tools/test.js`. Its
unrelated authenticated PURE_C source emits 20- and 28-byte tables in a 56-byte
native section. It exercises both legacy rows and a version-2 first row owning
20 pointer bytes plus four native padding bytes; the second row owns 28 pointer
bytes and a larger unchanged ASM row retains the terminal four-byte gap.
The test compares actual native and projected links, derives
strict source proof, checks retained ASM maps and status, exercises real cache
miss/hit reconstruction, and rejects malformed contracts, objects, padding,
ownership, composed-path leakage, stale versions and proof records. A real changed
PURE_C source remains a rejected nonmatch. It writes only ignored fixtures under `build/tests`.
Existing single-occurrence, prefix, interior, B438/B894, and compilation-group
tests retain their original contracts.
