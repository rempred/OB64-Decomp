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
Artifacts remain ignored under `build/tests`. Production integration and the
complete-ROM audit belong to the designated production source/build writer.
