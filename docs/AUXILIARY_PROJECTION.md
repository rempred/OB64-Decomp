# Fixed-row read-only auxiliary projection

The explicit `auxiliaryProjection` linkage mode maps one authenticated native
`.rodata` section to complete, existing read-only owner rows. It does not change
accepted boundaries or text ownership. This tooling requires structural review
and the changed-input audit before production use; a focused fixture is not
matching-C acceptance.

The target retains its ordinary `auxiliarySections` records, one per complete
payload row. Each has the existing object/linked hashes and exact local
`R_MIPS_32` relocation contract. No exterior prefix/tail, retained interior,
source-object prefix, native-text-tail, or compilation group may be combined
with the standalone mode. Versions 1/2 require one compiler function; version 3
allows a complete registry-bound function census inside one physical text owner. The separately documented
[compilation-group composition](GROUP_AUXILIARY_PROJECTION.md) supports version 1 only.

Schema 4 is admitted only with the separately authenticated
[atomic original-owner union](ATOMIC_OWNER_UNION.md). It adds compiler occurrence
bundles within complete existing data rows and authentic owned terminal alignment
zeros. It does not relax versions 1–3 or their text-producer restrictions.

The target-level contract has exactly these fields:

```text
schemaVersion: 1, 2, or 3
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

## Version 3: one native multiple-function text owner

Version 3 adds exact field `nativeText`: `bytes`, `alignment`,
`outputAlignment`, and `terminal` with `offset`, `bytes`, `sha256` and
`origin: "native-assembler-section-alignment"`. Each payload segment adds
`dispatchSymbol`, the exact compiler function name; zero segments are unchanged.
Payloads contain pointers only, as in version 1. The full ordered text census
must match ROM-authenticated registry bodies, with at least one
`reviewed-local-body` secondary so an all-legacy census cannot bypass validation.
Mixed older tags retain their meaning, and every secondary name/boundary is checked.
New-tag eligibility is exactly supplemental-reviewed-body or independent-entry-supported.

The existing grammar validates compiler assembly; the assembler receives the
untouched bytes. Native .text must contain the complete function census plus
only its exact terminal alignment zeros. The projector excludes that unowned
terminal span, authenticates no symbols or relocation places/targets enter it,
and copies every function byte unchanged into the original owner's section.
This does not extend any retail owner. Native .rodata is projected into its
existing complete data rows, with gaps still owned by authenticated original ASM.

Both directions of table attribution are mandatory: each aligned section-relative
pointer destination stays within its dispatch body's half-open interval, and all
actual HI16/LO16 references to the payload originate in that same body. Next-body
boundaries, swapped attribution, gap references and nonzero/unknown section
anchors reject. Effective named-function R_MIPS_26/R_MIPS_32 targets are also
checked against the retained text extent; unsupported text references reject.

Object evidence schema 8 and nested projection schema 3 include the nativeText
contract, native/projected text hashes, function census and table attribution.
Existing composed-group schema 7 is unchanged. Proof and cache reconstruction
repeat projection from authenticated unsplit objects; status counts only the
original text owner and complete payload rows, never the native terminal bytes
or retained ASM gaps. No compilation-group, multi-owner, private CLI or
diagnostic-link capability is added.

The routine manifest includes `tests/native_function_projection.js` and
`tests/reviewed_local_bodies.js`. The native test uses a tracked independently
derived C fixture, creates a real source control, compiles with pinned tools,
and writes generated evidence only below build/tests. It needs no ignored
matching candidate or historical object. Structural acceptance remains gated by
independent review and one changed-input audit.


## Standalone native occurrence projection (schema 6)

The explicit mode `native-occurrence-readonly-projection` admits one ordinary
complete text function/owner and two or more gapless pointer-only native readonly
occurrences in distinct existing data rows. Schemas 1–5 retain their meanings.
Groups, atomic unions, native text tails, compiler padding, prefixes, interiors,
shared rows and changes to accepted row boundaries are unsupported.

The contract keeps the existing native size/alignment/hash and payload segment
census and adds `retainedRows`: ordered records with `offset` (retail displacement
from first payload), `ownerSection`, `ownerBytes`, and `expectedOwnerSha256`.
These are complete original ASM rows, not native zero segments. Their source,
accepted placement context, bounded complete ROM bytes, original object, sole
map contribution and load mapping are independently authenticated. Payloads
start at row starts; the first covers its complete row. A later payload may
retain its original suffix through the ordinary exact `preservedTail` contract.
Payloads, retained row tails and intervening whole rows must tile the retail
span. Retained rows/tails contribute no matching-C bytes.

Compiler assembly changes only the established section assignment. The native
assembler artifact is immutable. Every table word and instruction/addend byte
is copied exactly. Actual R_MIPS_32 entries partition by place; only r_offset
changes relative to the selected occurrence, plus any explicit symbol-index
remapping needed below. Every occurrence must have an actual incoming text
HI16/LO16 reference. Complete pending-high sets must resolve with signed-low
carry to aligned entries in one occurrence. Missing, duplicate, unpaired,
ambiguous, mixed-occurrence, unsupported or out-of-range references reject.

For native occurrence offset o and accepted address V, its virtual anchor is
B=V-o. The original section symbol remains at the first payload address V0.
Every distinct positive delta=B-V0 derives one zero-size LOCAL/STT_OBJECT/default
symbol named `__ob64_readonly_anchor_<lowercase-hex-delta>` in that first payload.
Delta must be word-aligned and strictly inside that payload, agree in ROM/RAM,
and be completely explained by the retained retail partition. No arbitrary,
negative, absolute or global anchor is admitted. The OBJECT type is required:
the pinned GNU2.6 objcopy converts NOTYPE data locals to OBJECT during ancillary
removal. Native compiler output still cannot author this extra data symbol.
The projected source object and stripped link object must retain exactly the
same derived OBJECT census/value/binding/size; linked values add V0.

Only proved pair symbols are retargeted; all encoded addends remain unchanged.
The proof equation is B+A=V+(A-o). New locals are inserted before original
globals, with a complete bijective old-to-new index map and corresponding index
updates in every REL section, including ancillary records. Existing symbol
identities, relocation types, order and places are conserved apart from the
explicit payload-place and paired-symbol transforms. No symbol is another C
owner or additional native function.

Object evidence schema 17 and nested projection schema 6 add `occurrence`
with exact `symbolMap`, `anchors` and `pairs` records to the native census.
Independent source-object, recorded-build and cache replay rebuild the projection
from native artifacts; proof schema checks reconstruct the anchor/index/effective
address equations. Stripped and linked anchors have independently checked exact
metadata. Implementation fingerprints invalidate stale reuse inputs. Ordinary
auxiliary tail custody, fallback exclusion and full-ROM gates remain mandatory.

`tests/auxiliary_occurrence_projection.js` uses an unrelated PURE_C source and
real pinned tools, including a HI16 carry placement, canonical compile/proof
callers, cold/warm cache replay, a real nonmatch and malformed evidence controls.
These bounded fixture checks do not activate a source target or establish wave
acceptance. Installation requires independent review and the changed-input audit.
