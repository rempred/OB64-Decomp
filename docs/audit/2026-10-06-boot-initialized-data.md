# Boot-initialized data mapping for resource decoder tables

Status: **accepted**, including independent review of the completed native proof,
ELF/map placement, baseline and CURRENT ROMs. The single combined audit passed at
`2026-10-06T18:24:55.181Z` in1351.287 seconds; its embedded normal verification passed
at `18:24:55.008Z`. Complete decoder source integration is committed as `6fda08ef`.
Current input identity: `2BC89C7B15D5FA68752B52F5329B2A999604B51A1E7CD2083974ABFD08EF525B`.
Both baseline and CURRENT reproduce the canonical ROM SHA256
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
See [the complete wave record](../Plans/task-logs/sol-resource-decode-wave-20261006.md)
for all source bodies, proof identities and auxiliary contributions.

CloudyMoose1440 and GoldOx1438 identified the gap and explicitly agreed to the bounded
remedy in1446/1445. Actual native/store drains1468/1469 preceded canonical application.
All33 routine suites are covered:31 passed in the initial143.6-second run; the two
independently reviewed test-only corrections passed targeted reruns. Native jobs actually
exited before Shop was released in1474. CloudyMoose released production ownership in1475.

The final mapping/padding package passed141 negative controls, preserved all773 prior
active contracts and changed only row789 placement. All other row placements and overlays
also remain unchanged in the completed native evidence.
Reviewed patch SHA256: `44BF88FA0E6990FA13A853EEED5D3B68CA0BA192C37E4AF76B411743887048EC`.
Fresh and recorded proofs independently preserve native344→340 and40→36 table selections,
exactly four terminal zero bytes, unchanged payloads, and no discarded named content.
The linked row conserves1896+340+108+36+2724 with no fill or duplicate ownership.
No additional audit/build/verifier was run merely for review or the unchanged commit.

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
The saved negative tag fixture remains nonexact; these fixtures establish tooling behavior only.
Later ready source evidence in mail1466 does not replace canonical linked and full-ROM gates.

## Routine regression follow-up

The new independently authenticated boot-clear read adds one classified assembly read;
the existing per-owner read census must remain unchanged. Its test needs to distinguish
that proof read from owner enumeration and the final source sweep, including tamper checks.

The accepted-model identity changes with the conventional configuration and authenticated
header input. All60 curated compiler-lesson sources retain their exact hashes and their
candidate IDs reproduce against the pre-change model. They do not bind to CURRENT.
Existing intake correctly reports `target-mismatch`; historical IDs must not be rewritten
or relabeled current-valid. Curated-reference tests must separately require intact source,
header, preprocessing and reference closure, and preserve visible current binding failures.
Neither an old-model nor an altered candidate ID proves current matching acceptance.
Both test-only corrections passed independent review and canonical reruns:132 symbol
equivalences/eight mutations with exactly one boot-proof read, and26 knowledge checks
with no KMC invocation. Production intake, cache checks and historical IDs are unchanged.
