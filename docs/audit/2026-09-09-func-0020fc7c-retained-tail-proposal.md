# FC7C retained-tail structural proposal

Status: evidence-supported proposal only. No executable-extent, ownership,
configuration, compiler or source-class change has been made. The current
324-byte owner remains active as original assembly; its C candidate is inactive.

## Proposed claim

Investigate the last word of original row3934 as a separately retained non-executable
assembly slice under the existing `fixedOverlayNonExecutableRanges` contract.
Preserve the original row, its assembly file, public entry and complete bytes.

| Proposed slice | ROM interval | Descriptor-10 VMA interval | Bytes / proposed owner |
| --- | --- | --- | --- |
| Executable prefix | `0x20FC7C..0x20FDBC` | `0x801CC7EC..0x801CC92C` | 320 / unchanged PURE_C candidate |
| Retained tail | `0x20FDBC..0x20FDC0` | `0x801CC92C..0x801CC930` | 4 / original assembly |

Whole-row SHA-256 is `251481811BADC2DDE2541F271D42EBB61BD8398DABB20A32A35B8CA65AEC58E6`;
prefix is `015B00C840AF2FC03DAB3688EA6A1E006A1DEC78BBB3F3D47D2ADEC1735DDD3E`;
tail is `DF3F619804A92FDB4057192DC43DD748EA778ADC52BC498CE80524C014B81119`.
The C source remains `C40F27E8925BCC501EB1F8D2A46BEC79A67393B274918BBA4C149A69A086D2BA`.
Its exact first320-byte private result does not accept this structural proposal.

The accepted [013D0 correction](2026-09-03-high-attack-wave-3-func-002013d0-structural-correction.md)
and [independent review](2026-09-03-high-attack-wave-3-func-002013d0-structural-independent-review.md)
establish the existing representation, not FC7C's classification. Original compiler
alignment provenance is unnecessary for a separately supported retained-ASM claim.
This is a distinct investigation from the earlier unsuccessful native-tail/group
lookup; its frozen observations remain valid for those mechanisms.

## FC7C evidence

The normalized Rev0 ROM, original assembly/manifest and ROM-decoded descriptor10
were authenticated. Every one of the original owner's81 words agrees with the ROM.
The return at ROM`0x20FDB4` is `jr $ra`; its required delay slot at`0x20FDB8` restores
the stack. The next word at`0x20FDBC` is zero, followed immediately by the accepted
successor entry at`0x20FDC0`.

Authenticated Phase5A records conserve the full324-byte local owner, corroborate the
return/delay pair, and accept the successor boundary. The competing interval that
ends at the delay-slot address is explicitly unresolved and is not adopted. There
is no disposition or recorded historical direct edge to the proposed tail. Current
descriptor mapping independently resolves two raw calls to FC7C's actual entry;
older ambiguous back-map statuses and historical assembly PC comments remain qualified.

Supporting scans cover all33,980 aligned words in descriptor10 raw text, without
a reachability filter:3,919 direct transfers and no target at`0x801CC92C`. The scanner
covers ordinary/likely integer, REGIMM/link and coprocessor condition branches, plus
J/JAL; reserved branch encodings are reported. Thirty in-memory controls pass and
no reserved-selector unknowns occur in the scanned text. All10,485,760 aligned words
of the normalized ROM contain no literal pointer equal to`0x801CC92C`.

These negative results support the positive entry/return/successor evidence. They
do not establish universal unreachability. The338 indirect transfers, including301
return-encoded instructions, remain unresolved. Computed/materialized addresses,
unaligned pointers, other overlay execution contexts and runtime paths are not
excluded. No original assembler alignment mechanism is claimed.

Ignored reproduction artifacts are under `build/combat-fc7c-tail-evidence-r1/`:

- `assessment.md`: `E5998ACA4DCA874DB3B9065EA4B7FD536829F3F72037587A8A0073A194020B6F`
- `evidence.json`: `BD91CA874F36D42C1A5F2B72ACCAB12BBAA6D587ABC62C3ABD3A435A201CFFD4`
- `investigate.js`: `B5DAA825C96ACA0C47530DF85AE9D98478B2378C3947B209FDB7D89841A98347`

The detailed evidence binds the relevant Phase5A products, accepted source and
descriptor identities, exact intervals, all indirect-transfer locations and scan limits.
Only ignored evidence was generated; no production mutation, compilation or runtime
observation occurred in this investigation.

## Required before acceptance

Any implementation is separate structural work under `docs/AUDIT.md`, after the
ordinary source writer releases production/build ownership. Use the existing
generic split-row contract, preserving its schema and rejection rules. Do not
generate C padding, alter compiler output, change original source-part boundaries,
or add a function-specific verification bypass.

Prove contiguous exact320-byte RX C and4-byte R-only original-ASM ownership, with
unchanged VMA/LMA, complete-row bytes, fallback provenance, all five actual C
relocations and the full normalized ROM. Test meaningful malformed cases: a tail
entry or code edge, changed return/delay/successor, wrong descriptor or range ID,
misaligned endpoints, gap/overlap, changed bytes, C-owned or executable tail,
retained ASM-owned prefix, and provenance/relocation drift. Existing013D0 and
21C8DC split cases and all generic adversarial rejection must remain intact.

The applicable structural audit and independent review are mandatory. A passing
local comparison alone is insufficient. The complete thirteen-target supplement
also retains its one final normal verifier; all targets must be ready before that
source-wave gate, and every claimed result must refer to its actual verified inputs.
