# Combat draw 001F6098 allocation preparation r1

Completed bounded assistance for COMBAT-DRAW-6098-ALLOCATION-PREPARATION-20260907-01. Receiver /root/boot_conversion_preparation, Director /root (native 01a07262-aeca-7341-ad10-2dba705ff988), local, Astra Medium. Fresh claim created atomically and read back before other writes. Ready 112756a7b8d7ede7403bcff3506809a4f95bd719; activation ed2eb5f2ac32a8a21426ce2ea6a4b78d08869a31; coordination baseline 5101bd4a7ba67e9e4441e74a5653c95f8bfb7a6e; accepted source W7 469a1416918592749d61dc34e3e079796f7b673c.

Both supplied assemblies assign remaining to register23/s7 and x0 to register30/fp, opposite retail. The retained diagnostic first makes those assignments in .greg, not local allocation. Its two allocation units have identical recorded conflict sets, but remaining appears earlier in the global allocation order. A concrete evidence limit prevents assigning its exact lifetime counts or update history to the production snapshot: their two tail arithmetic instructions differ. No nonduplicate source discriminator is sufficiently supported by this package; none is proposed.

## Input applicability

inputs.json authenticates all 21 supplied files before interpretation, including all 13 passes. The four pinned source/assembly identities match the prompt. The accepted W7 original ASM SHA256 is 63304127A1DECEDF5AD1253390FEEB1A68D54A4B237EFFA71CDD006143722924. All 1,037 original words agree with the derived aid and actual ROM. Raw ROM SHA256 6CA0A1AFE224831E202857AD64EF26BD429A034A4EA48404BB09621641A07B12 and in-memory normalized SHA256 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A agree. Prior full-owner report/evidence identities match the prompt. No frame-position account was repeated.

Complete offline macro expansion/token comparison finds exactly the following source-body difference, beyond preprocessing/comments/whitespace: production lines289..290 assign nextRemaining=remaining+1 and then remaining=nextRemaining-strip; diagnostic line304 uses remaining=remaining+1-strip. The same unused nextRemaining declaration remains in the diagnostic. No mutable header was read. source-comparability.json records the token delta.

After excluding comments and .file directives, all assembly lines are equal except these two consecutive instructions at .L49:

| Production color-exact.s | Diagnostic candidate.s |
|---|---|
| addu $2,$23,1 | addu $2,$20,-1 |
| subu $23,$2,$20 | subu $23,$23,$2 |

Thus the register choice, initial loads, comparisons and copies elsewhere are directly comparable. The production update matches retail's add-one-then-subtract shape, with the remaining register substituted. The diagnostic uses remaining-(strip-1). Its direct-source lowering already has that shape in initial RTL UIDs2073/2075; this is not a later allocator transformation. Equal reported 48-difference totals do not mean equal instructions or equal pre-allocation lifetimes. No compiler or linker was run to reproduce those totals, and no production RTL is supplied.

## Allocation units and real lifetimes

| Value | Initial diagnostic evidence | Actual uses and copies |
|---|---|---|
| remaining, pseudo118 | RTL1013 reads header+6 as HI into440;1014 zero-extends into118. By .lreg1013 is deleted and1014 directly zero-extends the header halfword. | Initial minimum:1150 compares118 with strip116;1155 copies118 into116. Flipped initial row:1173 computes118-116 into122. Tail:2073 computes116-1 into830;2075 destructively updates118;2078 compares updated118 with2;2088 compares strip116 with118;2093 conditionally copies118 into116. The updated unit carries into the next row. |
| x0, pseudo125 | RTL1017 reads decoded.field04 at reg69+4. .lreg address is frame+36; .greg resolves sp+36. |1026 adds125 to decoded width for full right x.1177/1178 form a separate narrowed-left unit109 through shift16/arithmetic-shift16; this does not replace full125.1771/1804/1906/1939 retain full125 in later coordinate sums. No assignment updates125 inside the row loop; its full value stays live across the row body and back edge. |

These are distinct SI units. The HI source440 is folded into remaining's load; the narrowed-left109 is a real derived value with different range/use obligations. Neither is evidence of a separate full-x0 carry copy. The remaining-to-strip copies change a second real state value; they do not split remaining's own carried unit in this diagnostic. Exact selected nodes through all 13 stages are in allocation.json; units.json preserves every pseudo118/125 occurrence before hard-register replacement.

| Recorded stage fact | remaining118 | x0 125 |
|---|---|---|
| .lreg reference/lifetime counters |23 references /398 insns |18 references /397 insns |
| .lreg call/death metadata |crosses 12 calls; dies in 0 places |crosses 12 calls; dies in 0 places |
| Local assignment |none; stays pseudo118 |none; stays pseudo125 |
| Position in .greg global allocation list |31 of 72 |34 of 72 |
| First retained hard-register assignment |.greg118 in23 |.greg125 in30 |
| Emitted initial load in both assemblies |lhu $23,6($21) |lw $fp,36($sp) |
| Retail initial load |ROM1F68A0: lhu $s8,6($s5) |ROM1F68A4: lw $s7,24($sp) |

The .lreg counters are compiler metadata, not an independent count of emitted instructions or exact runtime lifetime. Before .greg, register30 in x0's memory address is the frame reference; it is not a local assignment of x0 to30. .greg UID1017 instead sets value register30 from sp+36. This distinction matters when finding the first allocation decision.

The global conflict lists for118 and125 are identical, including their mutual conflict and hard registers2..7,16..18,29,32..37. They require separate registers. The retained order places118 before125, and dispositions assign23 then30. This supports an observed global ordering/allocation explanation. It does not prove a numeric score, a tie, a particular tie-break, or that the one-insn lifetime difference caused the reversal. There is no recorded numeric priority or counterfactual allocation in these passes. Earlier allocated global neighbors also constrain the eventual registers; the initial hard-conflict list alone is not the complete final availability state.

Retail tail ROM1F6FBC/1F6FC0 uses addiu v0,s8,1 then subu s8,v0,s4. It preserves the same initial remaining load and carried update behavior, with remaining in30. The candidate production tail uses this shape with remaining23. The diagnostic tail uses a different arithmetic temporary but the same observed hard-register roles. No finding here changes the accepted function extent or source gates.

## Discriminator limit and handoff

No experiment is proposed. Direct versus named remaining is already tested and is exactly the supplied source delta; increment-then-subtract, successor guard, direct corner casts and sourceX=x0 after setup are also excluded tested controls. Rephrasing one would not be a new discriminator. This package does not establish another real copy boundary that both preserves retail's initial load/tail and predictably changes the global ordering without duplicating those controls. The first concrete evidence missing for production-specific allocation causation is retained pre-allocation RTL/counters for the exact named-update production snapshot. That is an evidence limitation, not a request to compile or provide a new package. An exact priority/tie-break claim would additionally require applicable authenticated allocator reasoning; it cannot be supplied from the ordinal list alone.

The matcher's newer half-width correction reportedly has 46 differences at the same size/frame. That is attributed context only; its package was neither read nor rebound to this report. All correspondences above refer solely to the supplied color-exact snapshots. Frame positions, half-width operations and color/packet behavior were excluded from analysis.

Only the new claim/report/ignored root were written. No candidates, source/configuration edits, compiler/link/build/verifier/source-policy operations, runtime/bridge/DB access, Git mutations or agents occurred. All fourteen W8 targets and the existing single final complete-wave verifier remain required. This is ordinary assistance, not independent review or reusable compiler/semantic acceptance. All assigned writes are released at direct collaboration handoff; outputs then remain frozen.

All 21 input files rehashed unchanged at release. Output identities (SHA256); exact sizes are in outputs.json.

| Artifact | SHA256 |
|---|---|
| allocation.json | 4460BDB4677A225F6FDA264C18B0AFBF15FFAD04B572E60127FBF4AE60822B44 |
| allocation.py | BF2F893257AD8FEF5572592FEBC11F96D35392EC6950AF7240F6C01490146370 |
| auth.py | AA57EFE4F59CDD821045813E942D2BABEF4CE821AE9B6CFD3CC5136BDBDBDDB8 |
| finalize.py | B50DFBE1667D97FEA6709B4102BD6E0F1AB6C52424E2EA78EA4BCA1E027BDA06 |
| inputs.json | DD55E0BF3DD3E4BF9926CFCEEA38382C12D572DD730BE13692033DB1086C0D7A |
| source-comparability.json | B328276648B73FB8E116D7B4C882317FB37EAEF167F35B877082538B3AFE0304 |
| trace.py | AF09AD1638CE95DCBE64E664A9C96A4037FD39C268FF47DCAA95AD3285095A4A |
| units.json | E20EEE3D6D54C1965C3CDFC9C612E80E8B59B9717BDC74F5E81399746E3FA533 |
| outputs.json | A10EA548B0F59DA222288763DE4461B6B2F0194E3DB070E015EB4FFEED7DBCCA |
