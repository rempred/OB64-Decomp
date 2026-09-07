# 3C00 residual R1

Completed. The retained candidate's net four-byte excess combines four additional instruction occurrences with three omitted retail occurrences. These differences concern companion-format tail sharing and prefix retention. The Director can return the specific regions below to the source worker; register/order residuals and normal matching gates remain open.

## Scope and authentication

Receiver `/root/db10_allocation_trace`; Director `/root`, local task `01a07dad-52c1-7cb0-9913-d9f7afa91281`. Assignment revision1, launch `COMBAT-DRAW-3C00-RESIDUAL-20260907-01`. The permanent claim was created atomically and read back before other writes.

Starting main HEAD was `8c76afb3e7af332739221c927e2db7a5e2d22cbb`; preceding prompt coordination was `5c44ac93`. Governing guides and W8 context were reused from this session. The complete-owner entry preparation and current R2 record were read. Production ownership stayed with the source worker on6098.

Only this report, its assigned claim, and ignored `build/combat-draw-3c00-residual-r1/` were written. No compilation, source trial, instrumentation, canonical diff/build/verifier, production/tooling/runtime change, agent launch, or Git mutation occurred. The generic older6752-byte instruction-alignment output was not used.

The named `size-pointer-explicit` package authenticates as follows:

| Artifact | SHA-256 / result |
|---|---|
| Authored C | `D5895DDDCF5D004CD7D8A3C71DEC9F1434A62886B92EF5EFC75BF1C8D646429B` |
| Compiler assembly | `912569D1DCF6430A9DB66B70E4D55A492305C96B4C96CEE667AEE4B639E7B487` |
| Raw object | `22E9B8899D1B70DC0FF87801F20CCE6AACCD017251DC19C042631498650145CD` |
| Recorded complete compiler input | 25,524 bytes; `F720F0F36D587745008D1A28995C580FB92981683C7150E3F015BB961034A115` |
| Extracted candidate section | 6,744 bytes; `043A0AFF68AE9319FEDB524D233D9716CCF152E9B946D9C2E04DE806AA882EE5` |
| Accepted original assembly | `C31BB4824DF0178D65383897F956F802C0C7CAD14245FD0A74BAB99F5C42C85B` |

Source/policy/input records agree. Assembly/object hashes match recorded provenance. The ELF function symbol has size6744 at offset0 in `.ob64.r3698`. The section contains1686 words and ends with the real return delay slot; no added tail padding is inferred.

All300 actual target-section relocations were parsed from the object and equal the named linkage and raw-evidence records. The complete1685-word retail owner equals the canonical normalized ROM at z64 offsets001F3C00–001F5654, end exclusive. The whole normalized ROM hash is `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

The recorded324 nonrelocation word differences were reproduced exactly. Compiler provenance was authenticated through frozen records, not independently recompiled. The complete input's recorded identity is retained; its bytes were not required for this byte/object comparison.

## Address and comparison conventions

Every offset below is hexadecimal and relative to the start of its respective owner. Retail z64 ROM offset =001F3C00+offset. Accepted runtime address =801B0770+offset. Candidate offsets identify object instructions, not accepted linked placement.

Raw candidate relocation words remain visible in `candidate.txt` and `instructions.json`. Their displayed unresolved J/JAL addresses are not runtime targets. Internal jumps are interpreted using their actual `.text` relocation addends; external calls retain their actual symbol names.

Both owners contain57 static direct calls. Pairing these in order yields consistent symbol-to-retail-target associations for every repeated callee. These anchors aid localization; they do not prove complete behavior or linkage equivalence.

The local alignment ignores register names and branch destinations while preserving instruction kinds, field offsets, constants, and shift amounts. For named data relocations, it uses the symbol's numeric address and recorded addend. All original bytes and relocation records remain separate. This is a candidate-specific inspection aid, not a new acceptance method.

## Extent-changing instruction account

Direct byte/control-flow observations support this occurrence account. It describes static code size, not the number of operations executed on one path.

| Difference | Candidate evidence | Retail evidence | Static word delta |
|---|---|---|---|
| Final companion tile stores are duplicated | Format-zero stores at1568/1570; nonzero stores at16D4/16D8 | One shared pair at16D8/16DC | +2 |
| Final nonzero tile prefix is rematerialized | `lui F588` at16C8 and prefix OR at16CC precede the tile-offset OR16D0 | One OR16D4 reuses the already prefixed saved value | +2 |
| Next-command cursor is loaded after the format join | One LUI/load pair16DC/16E0 | Separate pairs1564/1568 and16CC/16D0 | -2 |
| One tile-byte scalar reload is absent | Three loads from stack1BC across the owner, including16C4 | Four loads, including the additional format-zero reload1554 | -1 |
| Total | Four additional occurrences | Three omitted occurrences | +1 word =4 bytes |

The format-zero candidate jump at156C has a `.text` relocation targeting owner offset16DC. Its delay slot1570 stores the zero payload before entering the common cursor load.

The retail format-zero jump1570 targets owner offset16D8. Its delay slot1574 completes the packed value; the target executes the shared two stores. This directly distinguishes duplicated stores from mere register renaming.

For the nonzero format, the candidate retains the masked tile offset in `s2`. Its earlier command construction uses F588 without retaining that combined prefix in the same saved value. At16C8–16D0 it reconstructs the prefix and combines it with the new line field.

Retail forms the combined tile-offset/F588 value in `s7` at15F8. The final command reuses it at16D4. The candidate's two extra prefix instructions are therefore distinguishable from another arbitrary OR alignment.

The cursor sequence and stack reload counts are preserved literally. This report does not claim that an omitted reload is unnecessary or identify the compiler pass that removed it.

## Source correlations

Source lines refer to the frozen `candidate.c` copied into this package.

- Line293 computes `tileBytes = capacity * stride`; the shared stack1BC store is at102C in both owners.
- Lines339–353 contain the two companion-format branches. Their final PAIR calls at345 and352 correspond to the duplicated-versus-shared final tile stores.
- Lines341/348/352 express masked tile offsets and F588 packing. Their generated saved-value/prefix distinction corresponds to the additional16C8/16CC instructions.
- Line354 emits the common companion F200 pair. Its following-command cursor is loaded after the candidate branch join, instead of separately in retail's two predecessors.
- Lines355–368 emit primary commands and the shared final size payload. They contain substantial register/order differences, but the complete primary suffix does not identify a separate new arithmetic operation explaining the net size.

These correlations identify retained source regions for inspection. They are not source recipes, original source identities, or compiler-cause claims.

## Scheduling and alignment limits

The whole-owner register-insensitive instruction multiset differs by precisely the four-versus-three occurrences above. The broad companion-plus-primary region has the same difference. Prefix setup, vertices, and cleanup contribute no additional multiset count differences under this diagnostic normalization.

This does not mean those regions match. Registers, operand associations, order, branch destinations, and relocated bytes remain outside that count comparison. The324 fixed-offset native differences include these effects and instructions shifted after unequal regions.

Small call-to-call intervals are especially misleading here. Their unequal word deltas are -1,+1,-1,+1,+1. Some apparent insertions merely cross call/delay-slot boundaries.

For example, retail preloads the companion width at16FC, while the candidate places that load in the1704 delay slot. Retail computes the next primary row shift at1704 and mask at1740; the candidate moves the same two operations to1794/17A0. This is scheduling, not two additional row operations.

Likewise the primary endpoint addition occupies retail's17F0 call delay slot, while the candidate performs its corresponding addition at17F4. Width-argument load placement changes around the same call. The apparent deficit/excess in separate intervals is not an independent length-changing source operation.

`call-anchored-alignment.json` and `alignment.txt` preserve alternative insert/delete presentations, including zero-net reorders. Repeated ORs, stores, and register-insensitive matches are not unique alignments. The reported tail-sharing account relies on actual jumps, stores, source regions, and complete occurrence conservation, not solely a similarity score.

## Evidence and release

`inputs.json` binds all eight named candidate artifacts and original assembly. `instructions.json` and the complete text listings preserve every word. `focus-regions.json` preserves the two branch tails and neighboring row-scheduling region. `counts.json` records both complete-owner and narrower-boundary counts.

Reproduce the read-only analysis from the canonical repository:

```powershell
node build/combat-draw-3c00-residual-r1/extract.js
python build/combat-draw-3c00-residual-r1/counts.py
```

The extractor initially expected a conventional text-section name; inspection showed the existing `.ob64.r3698` owner section. The corrected selector requires one section of the recorded size and validates its exact hash and relocations. An optional Capstone import was unavailable; the existing project decoder was used without installing anything. An initial parser expected absent relocation fields to be null; it was corrected to handle omitted fields. No conclusion uses failed outputs.

No owner boundary, compiler defect, representation defect, new semantic claim, or matching acceptance follows. All fourteen W8 targets and their single final complete-wave verifier remain required. This support adds no ordinary review gate.

`output-manifest.json` binds final outputs, this report, and the permanent claim. All commands finished. All assigned writes are released at collaboration handoff. The Director next returns these bounded regions to the sole source worker.
