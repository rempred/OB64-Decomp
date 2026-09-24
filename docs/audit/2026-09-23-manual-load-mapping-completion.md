# Manual-load mapping backlog completion

The 23 added raw-DMA mappings account for every previously unqualified executable
slice in the accepted model: 863 original slices, 570,736 bytes. This is a complete
result for that finite backlog, not a claim that every possible runtime resource
or computed transfer has been observed. The changed-input structural audit and
independent review both passed on September 24, 2026 (UTC).

The six earlier mappings and all 19 fixed overlay descriptors are preserved.
Every physical assembly/data owner, original source hash, ROM byte and executable
classification is retained. There are now 29 manual-load slabs and 7,257 link
slices over the same 7,242 primary rows; 15 rows have link-only splits.

## Direct evidence

Twenty-one records have a literal eight-word loader witness: register-specific
LUI/ADDIU pairs load source into a0, destination into a1 and end into a2, followed
by JAL 0x8009DA50 with SUBU a2,a2,a0 in its delay slot. The two remaining records
come from the 40-byte table at runtime 0x80229DBC, ROM 0x001C2ECC, in descriptor18.
Its consumer computes byte-index * 40, reads destination +0, source +8, end +12,
and calls the same loader. Record1/2 are at ROM 0x001C2EF4/0x001C2F1C.

The wrapper at ROM 0x0002DE50 forwards these even lengths through its >=16-byte
path to the PI DMA reader at ROM 0x0001A380, which transfers <=0x200-byte chunks
and waits. No decoder or address-fix-up pass lies on these reviewed raw-copy paths.
Cache invalidation is a discovery lead, not the proof of mapping completeness or
nonexecution. General linear register propagation across branches/calls was not
accepted as evidence; exact instruction/table witnesses and independent review
support the records below.

All endpoints are exclusive. Zero-fill intervals are independently reviewed
loader facts, separate from initialized ROM transfers. All23 begin at the loaded
data end; 5 are empty and18 nonempty. They do not add ROM bytes or linker BSS
owners. Shared runtime addresses represent temporal reuse.

| Mapping | Initialized ROM interval | Runtime start | Literal/table witness | Zero-fill runtime interval |
|---|---|---|---|---|
| boot-resource-loader-0003f1b0 | 0x0003F1B0..0x00040E80 | 0x800E9C20 | call 0x0000239C | 0x800EB8F0..0x8016AF80 |
| cold-boot-loader-00071280 | 0x00071280..0x00079730 | 0x8019A7A0 | call 0x000516C4 | 0x801A2C50..0x801A2C90 |
| cold-boot-loader-00079730 | 0x00079730..0x00087200 | 0x8019A7A0 | call 0x0005153C | 0x801A8270..0x801A8270 |
| scenario-loader-00165fc0 | 0x00165FC0..0x00171EA0 | 0x80214F80 | call 0x0010B090 | 0x80220E60..0x80220F30 |
| scenario-loader-00171ea0 | 0x00171EA0..0x00177ED0 | 0x80214F80 | call 0x00103524 | 0x8021AFB0..0x8021AFF0 |
| scenario-loader-00177ed0 | 0x00177ED0..0x0017F9C0 | 0x80214F80 | call 0x0010B4BC | 0x8021CA70..0x8021E340 |
| scenario-loader-0017f9c0 | 0x0017F9C0..0x00188B60 | 0x80214F80 | call 0x0010F474 | 0x8021E120..0x8021E130 |
| scenario-loader-00188b60 | 0x00188B60..0x0018F100 | 0x80214F80 | call 0x0010B700 | 0x8021B520..0x8021B5F0 |
| scenario-loader-0018f100 | 0x0018F100..0x00195410 | 0x80214F80 | call 0x0010BA60 | 0x8021B290..0x8021B340 |
| scenario-loader-001977e0 | 0x001977E0..0x0019C760 | 0x80214F80 | call 0x0010BB80 | 0x80219F00..0x8021A140 |
| scenario-loader-0019c760 | 0x0019C760..0x001A2C20 | 0x80214F80 | call 0x0010B5EC | 0x8021B440..0x8021B510 |
| scenario-loader-001a2c20 | 0x001A2C20..0x001A4C10 | 0x80214F80 | call 0x0010361C | 0x80216F70..0x80216F90 |
| scenario-loader-001a4c10 | 0x001A4C10..0x001A9290 | 0x80214F80 | call 0x0010BC9C | 0x80219600..0x80219690 |
| scenario-loader-001a9290 | 0x001A9290..0x001B2670 | 0x80214F80 | call 0x0010C1F8 | 0x8021E360..0x8021E3F0 |
| scenario-loader-001b2670 | 0x001B2670..0x001BA050 | 0x80214F80 | call 0x00139924 | 0x8021C960..0x8021CB30 |
| ovl18-table-loader-001c3300 | 0x001C3300..0x001C9050 | 0x8022A840 | table 0x001C2EF4 | 0x80230590..0x802305D0 |
| ovl18-table-loader-001c9050 | 0x001C9050..0x001CE070 | 0x8022A840 | table 0x001C2F1C | 0x8022F860..0x8022F860 |
| cold-boot-loader-0023a3a0 | 0x0023A3A0..0x0023B220 | 0x801D0840 | call 0x0004D6A4 | 0x801D16C0..0x801D16C0 |
| cold-boot-loader-0023b220 | 0x0023B220..0x002447A0 | 0x801E6FB0 | call 0x0004DB44 | 0x801F0530..0x801F0570 |
| cold-boot-loader-002447a0 | 0x002447A0..0x0024BCA0 | 0x801D0840 | call 0x0004E218 | 0x801D7D40..0x801D87E0 |
| resource-dispatcher-00286bd0 | 0x00286BD0..0x0029A4C0 | 0x8022AC90 | call 0x002829D4 | 0x8023E580..0x8023E610 |
| resource-dispatcher-002a8d20 | 0x002A8D20..0x002AE3C0 | 0x802395C0 | call 0x00282920 | 0x8023EC60..0x8023EC60 |
| resource-dispatcher-002ae3c0 | 0x002AE3C0..0x002B8BA0 | 0x802395C0 | call 0x00282B34 | 0x80243DA0..0x80243DA0 |

For immediate zero-fill calls, the next two LUI/ADDIU pairs provide start/end,
followed by BEQ/BEQL equality guard and JAL 0x80093380 with end-minus-start in a1.
The branch-likely cases annul the a0=0 delay slot on the nonempty fallthrough path.
For the table loader, +0x10/+0x14 supply the endpoints; ROM 0x001BAF40..0x001BAF58
loads them and conditionally calls the clear routine. The routine at ROM
0x00023780..0x00023820 writes zeros using word loops and a byte tail. This is
static path evidence; no new live capture or execution observation is claimed.

## Boundary handling

Physical owner ROM 0x001C904C..0x001C9074 crosses two load contexts. Its first
four bytes map to0x8023058C and its next36 to0x8022A840. Keep both physical-source
pieces and reject a single logical body spanning both placements. The existing
func_001C9050 label belongs to the incoming slice; the builder now inserts the
section directive before zero-width labels/comments at a cut. It rejects other
directives at that insertion point, retaining source identity and byte checks.
The pinned original assembly is unchanged.

Data owner data_002B89C0 is also split at the final load end0x002B8BA0; its remainder
correctly stays ROM-only data. The earlier data owner at0x00040638 now has its head
placed by the boot-resource load and its existing cold-boot tail unchanged.

Five previously reviewed logical bodies are now placement-qualified using the
same endpoints and byte/source hashes: 1782C0..17841C,178450..178A44,
1C9050..1C906C,2B3300..2B3494,2B3494..2B3704. The last retains the reviewed
2B349C alias and preceding setup. No new semantic boundary is inferred here.

## Validation and limits

- Independent review confirmed all23 source/destination/end witnesses, the6 older
  controls, the concrete config delta and the generic cut-label fix.
- tests/manual_load_mappings.js checks ROM witnesses, affine placement, complete
  coverage, endpoint limits, unchanged execution flags and8 adversarial mutations.
- tests/tracked_assembly_slices.js checks all real split sources and10 adversarial
  cases, including block-comment delimiters hidden inside # line comments.
- tests/phase7_conventional_build.js passes against the new baseline, including
  the real func_001C9050 ELF symbol at0x8022A840 and the unchanged original owner.
- tests/logical_functions.js passes45 negative controls and placement/body checks.
- Audit r1 failed on the old cut-label restriction after 179 seconds. Audit r2
  passed every structural, ownership, placement, relocation, source-policy and
  fresh compilation gate for all 627 existing active targets. Both assembly
  baseline and current ROM rebuilt to canonical SHA-256
  571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A.
  The resource monitor recorded peak CPU 45.63% and RAM 34.49%, with no limit stop.

Discovery and independent working records remain in ignored
build/boot-decompression-trial-r1/. Durable literal witnesses are in
tests/fixtures/manual-load-mappings.json and the tests above. No C matching bytes
are credited for this placement work. Dynamic heap resources, arbitrary indirect
reachability and future executable-classification changes remain distinct questions.
