# Boot-initialized data mapping for resource decoder tables

Status: implementation approved, not accepted. CloudyMoose1440 and GoldOx1438 identify
the placement/admission gap; both explicitly agree to Astra1444's bounded remedy in
mail1446 and1445. Independent original-byte/design review supports the mapping with
the validation limits below. A separate Astra helper prepares the patch only under
ignored `build/boot-data-admission-20261006/implementation/`; canonical application
awaits actual native/store drains. Workers continue private source experiments;
no shared-input hold is in effect. Final review/tests/audit remain outstanding.

The mapping-only staged package passed independent review:71 negative controls,
all existing target contracts, and unchanged-row comparisons. This is not final
structural acceptance. Source-bound padding rejections subsequently established
the adjacent composition gap below; the same package is being extended for one audit.

## Original evidence

The tracked 4,096-byte raw header and the full original row789, boot-clear stub and
two table consumers were independently checked against the canonical normalized ROM.
Header source: `data/source-owners/rev0/raw_header/0000_raw_header_00000000_00001000.srcbin`.
Header entry at byte8 is RAM `80070C00`. IPL3 at ROM `4C0..510` programs a one-megabyte
PI DMA from ROM `1000` to that entry; `584..594` waits for completion and `764..770`
transfers control to it. This establishes the initial copy `ROM1000..101000` to
`RAM80070C00..80170C00`, with additive delta `8006FC00`.

`asm/original/rev0/boot/boot_entry_clear_bss.s` lines13..23 clears RAM
`800AEDB0..800E9C20`. Original row789, ROM `3DDC0..3F1B0`, therefore initially resides
at RAM `800AD9C0..800AEDB0` and survives that clear. Initial residency is not a claim
of permanent residency, absence of later writers, or runtime behavior.

`boot_resource_tag_record_decode.s` lines302..308 proves an unsigned85-entry dispatch
through RAM `800AE128`; `boot_resource_op_dispatch.s` lines27..35 proves nine entries
through RAM `800AE2E8`. Original row789 contains the corresponding tables at ROM
`3E528..3E67C` and `3E6E8..3E70C`. All94 destinations are inside their respective
primary functions. The historical RSP filename/processor annotation does not make
the CPU-consumed words executable or justify a boundary change.

## Proposed model change

Keep the existing global early-boot cutoff `2F000`. Extending it to `3F1B0` would also
change46 other data owners, including row743 which crosses the current cutoff.
Instead, admit the existing whole5,104-byte row789 as a non-descriptor load slab with
explicit kind `boot-initialized-data`; retain its section, boundaries, source, data
classification and nonexecuting flags. No generated segmentation/overlay/manifest
or frozen compiler contract changes are needed.

Derive the shared delta, actual DMA bounds and preserved-data limit from authenticated
original header/boot-clear bytes in production validation. A mutable bound alone is
insufficient. The new slab kind must cover complete existing data owners, remain below
the clear boundary and inside the initial copy, contain no execution override, and
avoid ROM/VRAM conflicts with other accepted placements. Do not globally forbid
intentional overlap among unrelated existing overlays.

Auxiliary admission should pair an executable early-boot-linear consumer only with
a uniquely resolved, validated boot-initialized-data slab of the same proven image.
Arbitrary ROM-only data, ordinary loader slabs and reverse pairings remain rejected.
Existing source-object, table-entry, relocation, placement and sole-owner checks stay
unchanged. The retained row conservation is prefix1,896 + table340 + interior108 +
table36 + tail2,724 =5,104 bytes; genuine compiler padding must not silently consume
original bytes. The two functions remain one seven-body wave.

## Validation and ownership

Reject incorrect delta, jointly shifted bound/slab, crossing the clear start,
partial-owner/code-owner admission, execution overrides, ROM/VRAM conflicts,
wrong-kind auxiliaries and non-boot consumers. Assert that only row789 placement and
the new slab summary change: preserve all other rows, boundaries, names, execution
flags and existing auxiliary contracts. Authenticate full original table coverage.

Astra owns mapping/tooling changes and independent review. CloudyMoose remains the
sole decoder source/production writer. Actual native/store drains must precede
shared-input edits. Required focused tests, independent review and one full structural
audit establish acceptance. Combine complete decoder-wave acceptance into that audit
if ready; otherwise do not claim either function accepted. No per-function ROM build.

## Compiler alignment and retained original data

CloudyMoose1451 reproduced rejection by the unchanged validators for both source-bound
native sections; GoldOx1450/1452 independently agrees. Tag emits344 bytes comprising
340 table bytes and4 terminal alignment zeros; op emits40 comprising36 and4 zeros.
Original words immediately following the tables are `77620000` and `4C48613A`.
Existing `sourceObjectPrefix` requires the whole retained exterior tail to be exactly
the source's terminal zero padding. It cannot represent a first fragment followed by
an original interior or a final fragment followed by the2,724-byte nonzero-led tail.
Fixed-row native projection does not admit these retained original intervals either.

Astra1453 approves a narrow explicit `sourceObjectPrefix.discardedTerminalAlignment`
mode. Absent mode keeps the existing zero-tail case unchanged. The new mode must
authenticate full native section identity, compiler occurrence grammar, table prefix,
all relocations and exactly the required terminal zero alignment. No nonzero, named
or relocated data may be discarded. Source padding has no linked owner; original
prefix/interior/tail remain independently authenticated ASM under gap-free, sole-owner
row conservation. A matching source class or score cannot replace those gates.

Reject unknown/nontrue mode values, simultaneous linked retail padding, wrong extent,
alignment or hashes, nonzero padding even with a changed claimed hash, and missing,
overlapping or changed original remainders. A four-byte nonzero original tail is
different from the legacy four-zero-byte case; equal lengths alone are not grounds
to conflate them. Keep shared-row and fixed-row projection contracts distinct.

The extension must cover normalization, accepted-model resolution, actual source
objects, projection, fresh and recorded proof, and cache identity/validation. Preserve
the legacy B894 control and exercise both complete shared-row fragments. Saved
rejections/contracts are under `build/matching/sol-decode-20261006/padding-*`; the
reproducer writes worker-owned artifacts and must not be rerun by another agent.
The tag source remains nonexact; these fixtures establish tooling behavior only.
