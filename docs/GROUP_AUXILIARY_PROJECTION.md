# Native text and fixed-row read-only composition

The explicit compilation-group mode `native-text-readonly-owner-projection`
composes native text-owner projection with fixed-row switch-table projection.
It requires structural review and canonical changed-input audit acceptance.
An isolated fixture does not accept a production member or matching wave.

The group registry keeps the existing text, function, tail, and relocation
contracts. This mode additionally requires an `auxiliary` object with exactly
`sections` and `projection`. Every `sections` entry has a mandatory `memberSymbol`
naming its group member, in addition to its complete-row auxiliary contract.
There is no top-level attribution, implicit default, or legacy fallback.
`projection` uses the
[fixed-row read-only census](AUXILIARY_PROJECTION.md). Ordinary group and standalone
auxiliary contracts retain their existing meanings and rejection rules.
This composition supports projection schema version 1 only. Version 2's owned
native padding is rejected by registry, binding, grammar, object, projection,
conservation and proof entry points; standalone support does not extend group
composition implicitly.

Composed groups may contain one or more complete payload rows. The one-payload
minimum is available only through the composed group context, with at least two
members and exact per-table attribution. It does not lower standalone projection
or compiler-occurrence minima and does not use a source-object prefix.

All compilation groups conserve the serialized native REL sequence. Addresses
may descend within a member; duplicate places and member-index regressions are
rejected. Per-symbol pending HI16 records must pair with a LO16 in the same owner.
No stage sorts relocation records. A projected partition that would interleave
members is unsupported. The existing text tail remains owned natural assembler
alignment at the final member, unlike standalone schema 3's removed outside-owner
padding. Relocations or references into that tail remain forbidden.

The native assembler input equals the compiler output byte-for-byte. Grammar
validation checks every complete compiler occurrence without using its temporary
section-assigned return value. One producer is compiled and assembled once.

The transformation order is:

1. Authenticate native `.text`, `.rodata`, functions, actual relocations, symbols,
   zero padding, and pinned ancillary metadata.
2. Project the complete native text envelope to its accepted owner rows. Preserve
   the native text section symbol at the first text owner and every function size.
3. Preserve that intermediate artifact, then project complete read-only payloads
   to their accepted rows. Native read-only padding is check-only and remains
   owned by authenticated original ASM rows.
4. Remove ancillary metadata through the existing pinned objcopy operation.
   Independently verify the projected and stripped producer before linking.

Both projection stages change relocation places only. Pointer words remain
relative to the original group text anchor, even when their attribution member
starts at a nonzero group offset. That offset is used to validate destinations,
never subtracted from emitted addends. Every table destination must lie in the
table's attributed function executable interval, excluding its tail. References to
each read-only payload must originate in that table's member and land within that
specific payload. Members may own zero, one, or multiple tables; their subsets
need not be contiguous. A range spanning several tables cannot substitute for
the exact subset. The complete producer scan
rejects references into read-only padding or native text tail, cross-owner
HI16/LO16 pairs, and references to compiler markers or discarded metadata.

The raw compiler marker belongs to nonempty native `.text`; text projection
mechanically moves it to the first owner. Its exact metadata and complete zero
`st_other` byte remain required, and it cannot receive relocations. The pinned
objcopy creates ordinary local section symbols for remaining read-only payloads.
Only stripped-stage validation admits those exact zero/default symbols, and
none may receive a reference. The original first-payload anchor remains intact.

The read-only transformation compares every preceding text section, encoded
word, relocation entry, symbol identity, and ancillary payload before and after
the transformation, allowing only necessary ELF section-index remapping. Raw,
text-projected, fully projected, and stripped stages each carry complete object
censuses. Member text evidence schema 4, producer object evidence schema 7,
and nested composition evidence schema 2
distinguish composition from ordinary group evidence (2/3) and standalone
auxiliary evidence (1/4).

Fresh proof and cache validation reconstruct both projections and authenticate
the intermediate artifact. Exact composition fields bind all stage hashes to
their artifacts and the group contract. Each member retains its own source class,
text outcome, and proof while sharing the complete producer. Each member claims
only its explicitly attributed auxiliary sections. The existing manifest collapse links one object;
original payload contributions are removed once; retained ASM rows remain intact;
status counts each payload byte once. Cache restoration cannot supply only one
member of the producer. Object inspection and self-compared proof validation both
check each table's target interval and each reference's member, including HI16/LO16
pair ownership. Stale singular contracts and earlier composed evidence schemas
reject even when report hashes are recomputed. Existing implementation and registry
fingerprints invalidate prior CURRENT/cache reuse; ordinary group and standalone
projection schema versions do not change.

`node tests/group_auxiliary_projection.js` uses an unrelated authenticated PURE_C
producer with three functions and two middle-member switch tables, plus a second
native producer with a third table emitted by another member. It checks
native and projected actual links, all member source proofs, retained ASM and
accounting, cache restoration, and direct adversarial object/schema mutations.
The registered node tests/paired_owner_projection.js suite additionally uses
tracked clean-room paired sources with a real native REL address descent and one
complete eight-entry table, plus an unrelated two-member one-table producer.
It exercises full private links, owned tails, body-specific table references and
destinations, native-order/cache/proof mutations, and compiled nonmatching controls.
These fixtures do not activate production owners or reduce a matching wave.
Artifacts remain ignored under `build/tests`. Production integration and the
complete-ROM audit belong to the designated production source/build writer.

The complete NINE producer `func_00108aa0_group` was admitted on 2026-10-11 using
this unchanged mode and version-1 auxiliary projection. Its nine PURE_C functions
preserve all nine physical owners, 374 text relocations and the natural eight-byte
terminal alignment tail. The two 76-byte tables belong to `func_0010A718` and
`func_0010ADB8`, with 19 relocations each and their original group-relative addends.
Original ASM rows r2551/r2553/r2555 retain their complete 8/4/12 bytes; original
text and table assembly remain available as excluded fallbacks. One changed-input
structural audit passed normal and fresh compilation, sole C ownership, placement,
complete owner/table bytes and byte-identical Rev 0 ROM gates. Independent final
structural review passed before whole-wave acceptance. This admission changes no
generic contract, compiler identity, boundary or semantic claim.

## Single native function with an owned alignment tail and read-only tables

The explicit `native-text-readonly-single-owner-projection` mode admits exactly
one physical owner and one GLOBAL compiler function. It uses the same registry
fields and version-1 auxiliary projection as the composed group mode, including
mandatory per-table `memberSymbol` attribution and complete original data-row
ownership. At least one table is required. The older modes still require two or
more members; standalone auxiliary and legacy text splitting retain their minima.

The function starts at native text offset zero. Its complete body plus the actual
minimal assembler section-alignment zeros must equal the complete accepted owner.
Zero-length tails are supported. The section's native alignment determines the
tail; neither the contract nor projection inserts bytes. Named symbols, relocation
places, and internal reference destinations in the tail reject. Every table entry
must point to an aligned instruction inside the function, excluding its tail.

The assembler receives untouched pinned compiler output. The existing raw,
text-projected, read-only-projected and stripped artifact pipeline authenticates
all functions, sections, symbols and serialized relocations, retaining both section
anchors and encoded addends. Linked evidence includes the owner-local tail,
complete function census, sole contribution, load mapping and full-owner bytes.
Member text schema 6, object schema 10 and nested composition schema 3 distinguish
this admission. Proof reconstruction and cache restoration reject older schemas,
mode substitutions, malformed partitions and stale implementation identities.
The existing implementation fingerprints invalidate CURRENT and cache reuse;
private command drift checks already include these helpers.

Public workbench scratch commands still reject compilation-group producers. This
mode does not add private CLI group admission. The focused isolated fixture is
`node tests/single_owner_auxiliary_projection.js`, registered in `tools/test.js`.
It checks two placements, independent native producers, positive and zero tails,
full source proofs, cache miss/hit reconstruction and malformed evidence controls.
With the preserved research source available, `--real-candidate` additionally
checks the inactive `func_002215D0` candidate: its actual native tail and table
survive projection, while the real ORI/ADDIU mismatch still prevents matching
proof. These tests do not activate a source or accept an unfinished wave.


## Ordered owners with multiple native functions

The separate `native-text-owner-functions-projection` mode admits a contiguous,
complete text producer with two or more physical owners and one or more native
GLOBAL functions per owner. Each member has exactly `symbol`, `ownerRowIndex`
and ordered `functionSymbols`. The first function is the member's entry; every
function occurs once, without gaps or crossings. Only the last owner may contain
the authenticated natural terminal alignment tail. No auxiliary/table/data
extension is supported by this mode; the older modes retain their contracts.

Multi-function owners require the complete ROM-authenticated logical-body census:
exact canonical names, intervals, fragments, original-source hashes and placement.
Each secondary GLOBAL body requires `independent-entry-supported`; LOCAL-only
reviewed-body admission and weaker statuses do not grant this eligibility. Ordinary
single-body owners retain their existing physical-owner authentication. Logical
padding coverage and actual native zero-tail evidence are checked separately.
Derived group records use that same status as entry evidence, without asserting
original visibility, historical translation-unit membership or a particular call
mechanism. Standalone compiler-function admission remains unchanged.

REL records retain their serialized native order. Both physical-owner and function
indices must be nondecreasing; a descending place within the same function is
allowed. Duplicate places, unresolved HI16s and HI16/LO16 pairs crossing a function
or owner reject. Internal references cannot target the owned terminal zeros.

A fixed linker assignment is omitted only for an exact admitted GLOBAL function
name at its authenticated owner/VMA. The linked symbol must actually be GLOBAL,
section-defined and have the contracted size. Duplicate, undefined, LOCAL, wrong
address and wrong-owner definitions reject. Other fixed aliases, including interior
aliases, retain their assignments and addresses.

This mode uses member text-contract schema 5 and object-evidence schema 9. Complete
raw/projected/stripped function, section and ordered-relocation censuses, current
registry/linkage identities, member-local tail evidence and linked fixed-binding
records are validated on proof reconstruction and cache reuse. Old group schemas
remain unchanged. The registered `owner-function-groups` suite supplies a tracked
clean-room twelve-function producer, an unrelated multi-function final-owner
fixture, native old-alias callers, compiled nonmatching sources and malformed
census/order/tail/alias/proof/cache controls. Generated objects and reports remain
ignored. These fixtures do not activate production sources.
