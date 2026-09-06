# Compilation-group design: raw metadata correction

Completed as a correction proposal for `CGDR-001`. The raw producer must admit exactly one pinned-shape `.reginfo` section before ancillary stripping. The Director must freeze this addendum and request proportional independent re-review before implementation.

This addendum corrects only the raw allocation boundary and its required evidence in `compilation-groups-design.md`, frozen at `5dad70919ff43bc988cdbff9003be91347153a75`. Every unaffected design requirement remains unchanged. No production change is implemented or accepted.

## Corrected allocation rule

Replace the predecessor's unqualified raw rejection of extra allocated sections with the following stage-specific rule.

The raw native assembler object must contain the contracted `.text` and exactly one `.reginfo` section with this shape:

| ELF field | Required value |
|---|---:|
| Name | `.reginfo` |
| Type | `0x70000006` |
| Flags | `2` (allocated, neither writable nor executable) |
| Size | `24` bytes |
| Alignment | `4` |
| Address | `0` |
| Entry size | `1` |
| Link | `0` |
| Info | `0` |

These values describe the designated pinned producer, not a group-specific escape hatch. The group configuration must not override them. Missing or duplicate `.reginfo` rejects under this initial producer contract. A different pinned producer shape requires new evidence and review.

The allowance does not admit any other nonempty allocated section. Preserve the predecessor's empty `.data`/`.bss`, writable-storage, COMMON, native text and allocation-census restrictions. Nonallocated ancillary metadata remains subject to the existing producer grammar, complete census and ancillary-removal rules.

Record `.reginfo` bytes, SHA-256 and full section shape in raw proof evidence. Its register-mask contents may vary with the authenticated source. Do not pin the pose payload hash globally or use a configurable accepted-byte list. Independent reproduction must reproduce those bytes for the same authenticated inputs.

The only symbol defined in `.reginfo` permitted by this initial shape is its unnamed local section symbol. Require zero value, zero size, default visibility and section type. Permit zero or one such symbol; reject other definitions. Reject any relocation section targeting `.reginfo` and any actual relocation referencing a symbol defined there. Inspect section indices and symbol references, not only section names.

This excludes metadata carrying hidden linked storage or references whose meaning would change when removed. Unsupported relocation formats still reject under the predecessor's rules.

## Projection, removal and proof order

1. Authenticate, preprocess, classify, compile and assemble through the unchanged pinned producer.
2. Preserve and validate the raw native object before any section removal.
3. Project `.text` into owner sections using the proposed metadata-only transformation.
4. Require projected `.reginfo` bytes and semantic section shape to equal the raw record.
5. Validate projected text, function symbols, group anchors and complete load-relocation semantics.
6. Remove `.reginfo`, `.pdr`, `.comment` and `.note` using the existing pinned objcopy sequence.
7. Require `.reginfo` to be absent from the stripped object before linking.
8. Independently compare projected and stripped load-bearing evidence before publishing any accepted artifact.

ELF table indices and file offsets can change during projection or stripping. Compare symbol names, section identities, values, sizes, bindings and visibility through normalized references. Do not require incidental index equality.

The comparison must prove that every projected owner retains its exact bytes, shape and function census. It must also prove unchanged relocation places, types, symbol/value semantics and encoded addends. The complete native tail remains inside that text comparison.

Discarded ancillary sections and their relocation differences remain visible in reports. Their removal must not conceal allocated bytes or remove a load-relevant symbol/reference. A successful linked-byte comparison alone cannot replace these producer checks.

The stripped object must contain only the contracted projected load-bearing sections and previously permitted empty sections. Reject retained `.reginfo`, even when it has zero size. The linked ELF, map and PT_LOAD census must contain no group `.reginfo` contribution. Original owner boundaries and one-section load mappings remain unchanged.

Apply the same stage distinction in compilation, independent source-object proof, cache validation, recorded-build validation and diagnostic/workbench admission. Raw evidence cannot be accepted as stripped evidence. Forged stage labels or missing ancillary evidence reject. Status never counts `.reginfo` bytes as C owner bytes, padding or functions.

## Direct project evidence

`tools/lib/text_contract.js`, `nativeObjectAllocationEvidence`, already permits raw `.reginfo` with type `0x70000006` and flags `2`. Its `allowReginfo` argument is false for stripped-object checks. This addendum defines the new group contract more explicitly; it does not change the art-native validator.

`tools/lib/phase8_matching_c.js`, `compileTarget`, includes `.reginfo` in the raw allocated set. After source-object validation, pinned objcopy removes the four named ancillary sections. The code then compares target bytes, compiler-function evidence and relocations across removal.

The designated research root is `C:/Users/Joe/.codex/ob64-pose-split-research-20260906-r1/`. Direct parsing of its preserved objects establishes:

| Artifact or comparison | Observation |
|---|---|
| `group.native.o` | Exactly one `.reginfo` with the complete shape above. |
| Raw `.reginfo` symbols | One unnamed local section symbol; value and size zero, visibility zero. |
| Raw `.reginfo` relocation targets/references | None. |
| `group.native.input.o` | `.reginfo` absent after the recorded ancillary-removal path. |
| Raw versus stripped `.text` | All 832 bytes equal. |
| Raw versus stripped function census | All five function records equal after section-reference normalization. |
| Raw versus stripped load relocation census | All 17 records equal after section-reference normalization. |

Raw object SHA-256: `2549C60B2B092D672FA5AEEA7CCD0C183F90567171538FE3AED0A7926452F09D`.

Stripped object SHA-256: `0CA08E84D5D7FE6C6F2FC77BA793D7D5AB089576474296BB3774C6CE19389011`.

Observed `.reginfo` SHA-256: `60B9106DB2E0DF08285CB4551E6A8F7809CC6D9B33B921A384F40E271B07B2B2`.

These are evidence identities, not configuration allowlists. The 24 bytes are `a01f01fe0000000000000000000000000000000000000000`.

The object parsing uses the project `parseElfFile`, `elfSectionBytes` and `rawRelocationRecords` functions. No assembler, objcopy, compiler, link, full build or audit was rerun. This checks preserved native/stripped artifacts; it does not prove the unimplemented group projection.

## Causally required tests

Retain every predecessor positive, negative and acceptance requirement. Extend the unrelated pure-C and zero-tail fixtures to exercise the raw metadata allowance through the same pinned producer. Record each fixture's own metadata bytes rather than expecting the pose hash.

Require positive evidence at all three object stages: raw native, projected unstripped, and stripped. Require projected/stripped equality for all owner bytes, function symbols and normalized load relocations. Verify `.reginfo` absence in the final linked allocation and load census.

Add the following bounded negative controls:

- Missing or duplicate raw `.reginfo` rejects.
- Any shape-field mutation in the table rejects, including writable or executable flags.
- A correct name with another section type rejects.
- Any other uncontracted nonempty allocated section rejects.
- A named symbol, function symbol, or forbidden section-symbol shape inside `.reginfo` rejects.
- A relocation targeting `.reginfo` or referencing its section symbol rejects before removal.
- Modified `.reginfo` bytes without matching independent producer evidence reject.
- Projection that changes metadata payload bytes rejects.
- Stripping that changes an owner byte, function symbol or load relocation rejects, even with forged agreeing reports.
- `.reginfo` retained in a stripped cache artifact or linked contribution rejects.
- Missing stage evidence, stale schemas and raw/stripped record substitution reject at downstream boundaries.

A mutation test must target the relevant validator directly when a normal linker would reject earlier. This proves the producer boundary itself fails closed.

Implementation still requires one completed changed-input structural audit and independent review. This correction requires only proportional design re-review now. It does not add per-function full builds or an ordinary matching review gate.
