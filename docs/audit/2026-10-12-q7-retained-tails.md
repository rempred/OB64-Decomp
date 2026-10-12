# Q7 retained original-assembly tails

Status: seven-file implementation applied; changed-input structural audit passed.
Independent final review and focused Phase 8 fixture closure are pending.
This note does not accept the classification or activate Q7 C.

The unchanged schema-1 `fixedOverlayNonExecutableRanges` contract describes two
eight-byte terminal intervals in descriptor 7 text:

| Original owner | Executable prefix ROM / RAM | Retained ASM ROM / RAM |
| --- | --- | --- |
| r2381, func_00127154, 1756 bytes | 127154..127828 / 801D2A14..801D30E8, 1748 bytes | 127828..127830 / 801D30E8..801D30F0, 8 bytes |
| r2317, func_00119454, 4332 bytes | 119454..11A538 / 801C4D14..801C5DF8, 4324 bytes | 11A538..11A540 / 801C5DF8..801C5E00, 8 bytes |

All intervals are hexadecimal and half-open. Both prefixes remain original ASM.
Original owner/manifest boundaries, fallback, complete bytes, descriptor mapping,
successors and source activation are unchanged. New slice suffixes are `.s0`
(executable) and `.s1` (R-only original ASM). The retained sixteen bytes never
count as matching C and are not native compiler padding or generated fill.

Q7-specific evidence independently authenticates every original owner word,
entry calls, terminal JR-ra/completed stack restoration, both following zero
words and accepted successor entries. Descriptor 7 maps ROM101CE0..13C4A0 to
RAM801AD5A0..801E7D60. Returns/delays are127820/127824 and11A530/11A534.
The raw descriptor scan covers59888 words and8048 direct transfers, including
non-executable source intervals. Neither tail word has an incoming direct edge
or aligned exact-pointer hit among10485760 whole-ROM words. The357 indirect
transfers, computed/materialized or unaligned pointers, other overlay contexts
and runtime paths remain unresolved. This does not prove universal deadness or
original native-alignment provenance.

Proposal evidence: `build/director-resume-20261012/q7-tail-classification/report.md`
SHA256 `D74430E3FD667E113206B2BCC33D40DE244E40BA1FCD3704D18463569C6DB7BE`;
`evidence.json` SHA256 `4CA949B458835D9838924A609200D0B37A9F46258664AECF0C775A203CA055A5`.
Sol agreement is `build/matching/q7-scripted-261012/q7-tail-sol-agreement.md`,
SHA256 `2C28D20B87D3D5B4BBB982AF0E51F358E69C09DC01F830D1635AF53643BF7C3C`.
GoldOx agreement2721 and Director scope2723 authorize this preparation.
The accepted FC7C decision establishes only representation precedent.

The ordinary source-object path assigns the sole `.text` directive to the
accepted section **before assembly** (`text_contract.assemblerInput` and
`phase8_matching_c.adjustSectionAssembly`). It neither truncates assembled
objects nor admits native padding. Standalone `.text` rounding would produce
1760/4336 bytes, twelve bytes beyond each body: eight retained bytes plus four
successor bytes. `tests/q7_retained_tail_rounding.js` is a synthetic assembler
plumbing control for both exact lengths and placements, using the production
assignment and complete authenticated original ASM parts for retained tails
and successors. It must prove exact1748/4324 linked sections, no linked native
padding/fill, unique original-ASM tails and unchanged successors. Synthetic
results establish no Q7 C compilation, PURE_C status, source proof or matching
acceptance. Actual future producers still require all their own gates.

`tests/q7_retained_tails.js` extends the Phase7 suite with both-word/raw-source
edge and pointer controls, boundary/descriptor/range checks and ELF/load
size/placement/flags rejection. Existing fixed-range schema/alignment/overlap
controls and FC7C/013D0/21C8DC split-row ownership, gap, overlap, relocation,
fallback and provenance controls remain required. The writer runs focused
tests and one changed-input structural audit, then independent review inspects
the exact outputs. Fill, stale source proof and relocation rejection remain
generic existing verifier requirements; this patch changes no production tool.

All ten Q7 owners remain one unfinished wave. Eventual C activation must preserve
the two exact body extents, sole C ownership, original-ASM R-only tails, fresh
source-object proof, actual per-producer relocations, exact target/full-ROM
bytes and mechanical PURE_C classification. No earlier nonmatching candidate
or synthetic fixture substitutes for those complete-wave gates. FC7C,013D0,
21C8DC, art-native/NINE,126770/26D24/table, accepted successors and outside-Q7
ASM119120 retain their current contracts.

The writer collected actual audit EOF0 at2026-10-12T21:50:08.940Z. CURRENT
63D5918AE1994D79702F244A1DCF0DA65C3BB3841DF2378F40BA958C3A65CF47
and baselineD630D52CCB6D3D07CE3E6692ED62598FD36A614FC16D0CD69C9D6D410A2955E3
both reproduce the canonical41943040-byte ROM, SHA256
571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A.
The audit passes ownership, placement, actual relocations, source policy and
fresh source-object proof for these inputs. Immutable audit/proof snapshots
are under build/matching/db10-fresh-261011/q7-retained-tail-integration-261012/
final-proof/identities.json; audit-report.json SHA256
2F47A51A664AB2955A0008999BB32EE295EEA43E9D246704F202AFEA97456137.
These results establish the exact structural rebuild, not Q7 matching C.

Focused Phase7 passes119 rejection controls, including64 Q7 controls; rounding,
all three unchanged split-row fixtures and active-target checks pass. The routine
manifest remains35/39 with four independently diagnosed pre-Q7 failures assigned
separately by the Director. Focused Phase8 first collected actual EOF1 at
2026-10-12T21:51:54.080Z: the synthetic retained-prefix fixture expected a wildcard
that the accepted renderer replaces with explicit ordered C object selectors.
Director2770 authorized the exact reviewed test-only correction, applied as
SHA256 F1DD2A570F668D0509B479E95794F8CA7D9B394F4B646C88AC6A215B8AAC01B7.
It preserves three original rejection controls and adds nine selector controls.

The repaired focused run44439 collected actual EOF1 at2026-10-12T22:04:18.089Z,
after completing that fixture, at the later generic ELF check for.ob64.r4062.
The test uses the original9284-byte slice, while accepted atomic output combines
func_0021EBBC and its988-byte continuation into one10272-byte section. A bounded
read-only comparison with the production phase8VerificationModel/atomic.outputModel
path passes the generic ELF and map checks and still rejects a four-byte target
section-size mutation. The minimum test-only output-model correction is staged,
unapplied, for a separate Director scope decision. The independent reviewer owns
whether the evidence closes Q7-specific coverage or requires further work; this
note does not assume the broader focused-suite failure is unrelated to Q7.

Original and repaired failure logs, exact approved test hashes and all eight
unchanged live/immutable audit proofs are preserved in the integration root.
These are not passing focused Phase8 results or waivers of any required gate.
