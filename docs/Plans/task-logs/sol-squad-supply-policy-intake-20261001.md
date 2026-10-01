# Squad W6 supply policy and teardown: static intake

Prepared by receiving Sol/MagentaTiger on 2026-10-01 for the explicit pre-source
research gate. This records literal static control flow, not runtime AI choice,
timing, terrain reachability, purchase behavior, or a completed matching wave.
Joe's five-family assignment retains all ten W6 members together:
`func_0014F300`, `func_00131480`, `func_00123E38`, `func_00124018`,
`func_00124328`, `func_00131388`, `func_00124B98`, `func_00124520`,
`func_0012469C`, and `func_0012A958`.

The [family map](../../../../docs/Plans/squad-construction-family-map.md)
requires research of B98/4520/469C before source work and keeps the encoded-item
writer `func_00130E60` shared. The
[scope reconciliation](../sequential-family-scope.md) also preserves A958's
complete interface. The requested review concerns these explicit gates; it adds
no reviewer requirement to ordinary matching leaves.

## Bodies and physical owners

Each following logical body currently resolves to one accepted descriptor-7
text owner. Every original instruction and trailing owner word was included in
the static reading. Decode-comment VMAs and historical size labels are not the
placement authority.

| Target | Owner | z64 range, exclusive | Current live range, exclusive | Words |
|---|---|---|---|---:|
| `func_00124B98` | p2374 / `primary:6a0e756b76582a8fb93f` | 124B98..124FC0 | 801D0458..801D0880 | 266 |
| `func_00124520` | p2372 / `primary:1480258a4071fe4365ad` | 124520..12469C | 801CFDE0..801CFF5C | 95 |
| `func_0012469C` | p2373 / `primary:edc837b74f91a4030c64` | 12469C..124B98 | 801CFF5C..801D0458 | 319 |
| `func_0012A958` | p2412 / `primary:c533917eb2f0b0db8808` | 12A958..12AE04 | 801D6218..801D66C4 | 299 |

B98 includes its return/delay at 124FB4/124FB8 and the original four-byte zero
at 124FBC. Its historical 1,792-byte label is stale; the complete owner is 1,064
bytes. 469C includes the eight-byte `D_801F1070` load before the prologue at
1246A4. Starting at the prologue alone omits required input behavior. Its two
23-entry switch tables remain separate original data owners:
[table_00142D88.s](../../../asm/original/rev0/lib/table_00142D88.s) and
[table_00142DE8.s](../../../asm/original/rev0/lib/table_00142DE8.s), each 92
bytes, with the intervening original ownership preserved. This intake does not
activate any compiler table, padding producer, tail mechanism, or new owner.

## B98: ordered dispatch and publication

Source: [func_00124B98.s](../../../asm/original/rev0/lib/func_00124B98.s).
The incoming A0 is a unit pointer. `unit.word00 & 0x04000000` returns zero
immediately. Otherwise `unit.byte04` selects a 25-byte record at `D_801971F0`,
and `unit.byteBB` supplies the selector used below. The call at 124C44 to
`func_0012DA10` receives the **unit in A0**; V0 holds the record and is saved at
stack +24 in the call delay slot. The saved predicate is whether DA10 returned
zero. No record-pointer argument substitution is justified.

For each of the five record bytes at +2..+6, in order:

1. Skip zero. An ID below 100 also requires the halfword at
   `D_80195578 + 52*ID` to be nonzero; IDs at least 100 bypass that check.
2. `func_00123E38(source_id, ID) != 0` returns literal result 1.
3. For ID below 100, bit 4 of `D_80195593 + 52*ID` skips the remaining tests.
4. `func_00124018(source_id, selector, ID) != 0` returns literal result 2.
5. `func_00124328(source_id, ID) != 0` returns literal result 3.
6. If DA10 returned zero, skip. Also skip when `(unit.word00 & 0xC0) == 0x40`
   or bit 8 is set. Require `func_00124520(unit, selector, ID) != 0`.
7. If bit `0x08000000` is already set, remember that encounter and continue.
   Otherwise call `func_0012469C(unit, stack_point)`; result -1 continues,
   while another result enters the publication path and returns literal 4.

At 124D70..124EF8, publication backs up fields 4C/50/54/64 into
40/44/48/60 and the low byte of word24 into byteBC, then sets `0x08000000`.
When the current 08/10 coordinates equal the output point's first/third floats,
the third output float is adjusted by the literal float bits `0x38D1B717`,
using the comparison with `D_801F0DA4`. The retained hybrid
`func_001072B8(unit)` is called. The path then writes byte91=0, word84=-1,
word80=-1, halfword88=0, byte92=0 and clears bit 1; output coordinates are
copied to 28/2C/30. Final writes include word20=1, byte91=2, halfword88=90,
word24=1, word84=-1, clearing bits 4, 0x200 and 0x00800000, setting bit 2,
and writing word58 from the truncated/normalized first and third coordinates
with a factor of 64 for the third. These are literal stores, not assigned AI
state names.

After exhausting the five slots (124F00..124F78), an encountered set
`0x08000000` suppresses restoration. Otherwise an existing `0x08000000` is
cleared; fields 40/44/48/60 are retained across `func_00121DA8(unit)`, then
word24 is restored from byteBC and 4C/50/54/64 from those saved fields. The
exhausted path returns zero. No return-code names beyond their literal values
are established here.

## 4520: numeric predicate

Source: [func_00124520.s](../../../asm/original/rev0/lib/func_00124520.s).
Input consumption is A0 pointer, A1 signed selector, A2 signed index. An index
at least 100 or selector 4 returns zero; no lower-bound guard is present.
All reads use the 52-byte table: halfwords at 5578/5576 and byte5592, relative
to `0x80190000 + 52*index`.

| Selector | Float ratio | Signed byte threshold |
|---|---:|---:|
| 1 | 0.75 | 75 |
| 2 | 0.5 | 75 |
| 3 | 0.25 | 100 |
| Other values except 4 | 0 | 100 |

A1 is overwritten with the threshold; the last comparison does **not** use
the original selector. With unit bit `0x08000000` set, the predicate is
`current != 0 && (current != reference || byte5592 != 0)`. Without that bit,
it is `current != 0 && (float(current) < ratio*float(reference) ||
threshold < byte5592)`, with the original ordered float comparison.
Both paths return normalized zero/one. In particular, the set-bit equal-value
path branches from 12460C to the common nonzero test at 124684; it does not
return the raw byte5592 value.

## 469C: two scans, helper outputs, and the unresolved defaults

Source: [func_0012469C.s](../../../asm/original/rev0/lib/func_0012469C.s).
A0 is the unit and A1 is the final output point pointer. The initial signed
count at `D_801F1070` gates both scans; the count is reloaded at their backedges.
The selected index starts at -1 and the best-distance float starts with bits
`0x447D2000`. Selection uses a strict ordered less-than test, retaining the
earlier accepted candidate on ties.

The first scan indexes 36-byte records and rejects a row when
`(halfword(D_801951CC + 36*index) & 4) == 0 &&
byte(D_801951C5 + 36*index) != 0`. `func_0012EA80(index, stack_point)` supplies
three floats. The squared first/third-coordinate distance from unit08/unit10
must improve the current best; coordinates must pass the original comparisons
against `D_801F0D98/DA0` and `D_801F0D9C/DA4`. The truncated 64-wide grid index
is checked through the selector/bank at `D_800E7AC3`/`D_800E7A90` and the
64-byte rows at `D_801F36D8`; halfword value 0xFFFF rejects the candidate.

`D_801F361C == 0` or unit.word70 == 1 accepts an otherwise eligible candidate.
Otherwise the byte at `D_8018F481`, minus 0x27, drives the 23-entry dispatch.
The first helper argument is unit.byte17; the second is the low byte of the
64-wide grid index; the third/fourth are pointers to two stack output bytes.
Both dispatches have the same numeric classes:

| Key | Called live address | Output-byte offsets, first / second scan |
|---|---|---|
| 0x27 | 801E5E18 (accepted descriptor-7 `func_0013A558`) | +20/+21 ; +22/+23 |
| 0x2F, 0x30, 0x3C, 0x3D | 801E6300 | +20/+21 ; +22/+23 |
| 0x33 | 801E6C10 | +20/+21 ; +22/+23 |
| Other keys | No dispatch helper call | Default byte test below |

Only the second byte of each pair is tested; nonzero updates the selected index
and best distance. If the first scan selects none, the second scan omits the
36-byte-record rejection but otherwise retains the same checks. A selected
index is passed to EA80 with the caller's A1 point pointer; the function returns
that index, or -1 if neither scan selects one.

The actual tables and out-of-range branches establish a consequential gap:

| Dispatch | Default target | Required byte test | Zero path |
|---|---|---|---|
| First | live801D01B4 / ROM1248F4 | `lbu V0, stack+21` | 124908 loop advance |
| Second | live801D03DC / ROM124B1C | `lbu V0, stack+23` | 124B30 loop advance |

Default table indices are 1..7, 10..11 and 13..20. The out-of-range branches
at 124874/124A9C reach the same tests. **Default does not directly skip the
candidate.** No visible dominating initializer for +21/+23 exists in this
body. EA80 directly writes only three floats into stack +10/+14/+18; its
external call does not pass this output pointer as a formal argument. This
does not establish every external callee effect or default-path reachability.
Selector provenance, override conditions and helper outputs remain separate
research questions. Zero-initializing these bytes or changing default to a
skip would invent behavior. This is not a demonstrated tooling defect or an
inherent-assembly finding; no pure-C attempt or hybrid fallback is claimed.

## A958: complete teardown interface

Source: [func_0012A958.s](../../../asm/original/rev0/lib/func_0012A958.s).
The incoming A0 unit is retained through all 1,196 bytes. No deliberately
assigned semantic return is visible. The accepted 105CC0 declaration currently
uses an unknown word return and ignores it; this intake does not narrow that
shared declaration.

The function clears unit bit `0x00020000` if set, selects the 25-byte source
record by unit.byte04, and clears bit 2 of source.byte01. For the five IDs at
+2..+6, zero is ignored. IDs at least 100 are cleared together with a halfword
slot at `D_8019532C + 2*ID` (source at least 30) or
`D_80190EBC + 2*ID` (source below 30). IDs below 100 clear a class-table current
halfword at `D_80195578 + 52*ID` or `D_80193BD8 + 56*ID`, respectively.

Only source IDs below 30 call the live F300 capacity leaf at ROM12AA98, address
801FE190. That call is **not** `func_000C9850`. Its result is masked to 16 bits.
For each counted carried byte from source +13, a nonzero ID searches forty
four-byte rows at `D_80193AC0`; a matching row's nonzero byte02 is decremented,
and the carried source byte is cleared regardless of a match.

If unit bit 0x40 is clear, execution goes to the common clearing tail. If set,
`func_0012E968(unit)` chooses an 11-byte record at `D_801969B8` and
`func_0012E9F4(unit)` supplies the following branch selector. With bit 0x80
set, record.byte01 clears bits 0/2 and source.byte01 clears bit 1. Five record
IDs at +2..+6 except 0xFF address units through `D_801F0CB0`; their bits
0x80/0x40/0x4000/0x8000/0x10000 are cleared. A unit without bit 8 receives
0x20000000 only for a nonzero slot. A unit with bit 8 calls retained
`func_0010746C`, sets 0x00800000 and copies 08/0C/10/14 to 4C/50/54/64.

Without bit 0x80, selector 1 moves record+5 to +3, selector 2 moves +6 to +4,
selector 3 clears +5 and selector 4 clears +6; each consumed source slot becomes
0xFF. Other selectors make no such move. The original unit then clears
0x40/0x4000/0x8000/0x10000. The five record bytes turn 0xFF into zero;
other IDs pass their 25-byte source record to `func_00129068`, preserving its
unnamed result contract. Live8016B088 supplies the low byte stored at record+9.
`func_0012E8EC` receives the unit selected by record+2 and supplies the value
subtracted from 11 for record+10. The common tail clears bytes91/92/90/98,
writes float9C=-1, and calls `func_00128E80`. The original call/store order and
literal flags remain required.

## Requested gate disposition

Review the four complete numeric interfaces, especially the two 469C default
byte tests, before B98/4520/469C or A958 production conversion. Determine whether
the qualified literal behavior above satisfies the static pre-source policy
gate or which bounded evidence is still required. Runtime choice/timing and
selector reachability are explicitly unproved. Preserve all table owners,
SDK/memory interfaces, retained hybrids and caller declarations.

`func_00130E60` remains ASM across p2449/p2450 with no conversion or ownership
change proposed. Please clarify its retained-interface disposition for this
ten-member wave versus the broader family closure condition; it is not an
additional wave member. Remaining ordinary W6 source work proceeds under Joe's
existing assignment. One final combined verifier remains pending until all ten
members are ready; this research intake establishes no matching acceptance.
