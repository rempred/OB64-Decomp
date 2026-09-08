# Kuna trial independent references

Completed reference preparation. Receiver `/root/combat_draw_continuation`, Astra Medium; Director `/root`; activation `7fcfae384aed4f006b4b4d2c02d179d39404e75d`, launch `KUNA-TRIAL-REFERENCE-20260907-01`. Fresh claim was created atomically and read back before other writes. No Kuna output was read, and no decompiler/compiler/package or production operation was run. Production ownership remains with this worker, with trials paused pending Director routing.

## Reused four-case oracle

Reuse frozen `docs/Plans/task-logs/angr-trial-reference-r1.md`, SHA E5FF81CB0543A9B7D6621E8C197962C61772BE415CBFD298EB9C24107F3627D0, including its exact source/ASM/proof references and limits. The pre-answer oracle is `build/angr-trial-reference-r1/oracles-before-results.md`, SHA C2EE0F0A97F3DA231FEBFA4CAD049D9574AFFC0EC6861AD6FBF260987822AF22. Neither is rewritten. Copies are bound under this task root for comparison only.

The solved samples BFF8,1F34B0 and1F197C are completed-wave PURE_C. Their questions cover likely-branch delay execution and bit result, two pointer/call loops and global reloads, a bounded switch/table, nine occupied outgoing argument positions, and a no-loop state/output relation. The hard215CF0 sample is accepted exact HYBRID_C with a retained PURE_C compiler-ordering blocker at two allocator sites. Its old broad extent/CFG deficit is superseded. Recovered global-load/result-save dataflow alone does not solve the documented scheduler tie.

Supplied C declarations remain distinct from machine constraints. Used registers and stack argument positions do not exclude unused formals or prove full pointed-to types. Unknown callee effects, supplied jump tables, external call models and context types must remain explicit. Existing project C/retained candidates are not claimed to be untouched m2c drafts. Recovered facts already in those references are rediscovery, not new matching guidance.

## Fifth sample: selected func_001F3C00

Accepted owner ROM[0x001F3C00,0x001F5654), runtime[0x801B0770,0x801B21C4),6740 bytes. Current authored source is `src/lib/func_001F3C00.c`, SHA D03797FD04EEE60592E0644A837E09308568D3E82448883997A10A85DA7F91F5. Expanded input SHA7DE6F8E24A17F19CB56105D1C2897C8252710112B1BE96AEE163177C98EC5102. It is PURE_C but nonexact, frame504, native209; focused linked comparison has770 different bytes/261words with actual relocations MATCH. Linked SHA2248CF47DF1FC28EC79516412C7BE10E0D0192420C86ECF0938E20720B79651E differs from accepted retail458A6CB397B154CCC0CBE12CAEF4456A711C676E6B269F32A8DEE2490522925A. This sample has no completed-wave matching acceptance.

Original assembly `asm/original/rev0/lib/func_001F3C00.s` SHA C31BB4824DF0178D65383897F956F802C0C7CAD14245FD0A74BAB99F5C42C85B. Existing authenticated disassembly `build/combat-draw-3c00-residual-r1/retail.txt` SHA CF1895D24E0D41D92D2C1B15CC9736253A7DD4CFD34F6882CCE21A79BE36136C provides owner-relative hexadecimal offsets below. Historical original-source runtime comments are not substituted for accepted placement. Existing competing-values report SHA BDE6BDDDD561E23F8A8553048A1CE78742B3729B40C7B1CE91018C6BCE662AE2 describes the older7F823 context; current D037 changes endpoint allocation and must use its own passes.

### Q9: actual cursor value histories

Can default/alternate Kuna output identify the real sync/render cursor and next size cursor, and show any earlier/later use of the **same value**, rather than equating reuse of a hardware register with reuse of an original C variable? Does it suggest a concrete readable pointer-state lifetime not represented by current source?

Known oracle: retail loads sync/render s1 at1500/1504 or1670/1674. E700 stores use it at1528/1530 or1698/16A0; final shared tile stores16D8/16DC use offsets8/C from that address. Next size s0 is independently loaded in each predecessor at1564/1568 or16CC/16D0. It supplies successor publication16E0–16E8, row store16F4, and final payload171C. The earlier nonzero-path s1 loaded1594/1598 is redefined1670/1674; merely printing one variable for both would not prove continuity of that pointer value. Both known predecessor size loads and the shared adjacent tile stores must remain accounted for.

Current D037 has sync/render924 globally s0 and size925 globally s1, versus retail s1/s0. Definitions in initial RTL:924 at2767/3000, last store uses3061/3064;925 at2802/3035, last payload3100. The two quantities have identical printed conflicts, ranks6/20, refs/live lengths24/41 and10/32. Those are current compiler facts, not inferred retail allocation classes. Sharing outer sizeCommand failed; splitting sync from render stores reunified between sched and lreg and yielded identical object bytes. These controls are already preserved. No new use or required shared original lifetime has been established outside the listed value histories. A different decompiler may suggest a hypothesis, but a variable name/merged declaration alone is not evidence that it should guide another source trial.

### Q10: separate endpoint definitions and shared-tail structure

Can the output preserve the distinct companion and primary packed endpoint values while structuring the common tail without duplicating stores, dropping a predecessor load or introducing an extra call? Can alternate transformations expose a materially different real-value structure rather than a restyled equivalent?

Known oracle: companion endpoint in retail s2 is defined14F0–14FC or1660–166C and last used1718/171C. Primary endpoint is newly computed into s0 at17F0 and1804–180C and lasts through18BC–18C8. Shared tile stores are16D8/16DC, reached by zero-format jump1570 with packing in delay1574. D037 already separates a local primaryEnd923/s0 from companion end921/s2, correcting packet row920/s3, tile922/s7 and u1/s7. It preserves both predecessor loads, full nonzero F588 tile state and common8/C stores. Remaining companion100/strip115 are s8/s6 rather than retail s6/s8; sync/size pair is also swapped. A decompiler need not reproduce these candidate pseudos or original C declarations, but must distinguish their actual values and operations.

### Q11: expression and type constraints

Can reconstruction distinguish signed division/narrowing from unsigned field packing at the relevant operations, without importing a guessed original struct or pointer type?

Known oracle: tile-byte division includes a signed-negative test15D8, conditional+7 at15E0, arithmetic shift3 at15E4, then mask511 at15E8; an unconditional logical shift is not an equivalent general signed expression. Nonzero prefix F588 is combined into s7 at15F8 and consumed again16D4. u1 is assigned zero or decoded width-minus-one at0F10/0F18, then sign-extended16 bits and stored1020–1028; its s7 register is reused later for a distinct tile value. Packet row/end packing shifts by2 and masks4095. These width/shift/sign facts are known. Full original scalar types, named gameplay meanings, array capacities beyond proven accesses and unknown callee mutation effects are not supplied by the matching result. Nicer struct names or unsigned declarations are not new evidence.

### Q12: bounded loop/update relation

Can structured output preserve the one-row-overlap updates and signed clamp, including normal versus flipped row paths, without assuming termination for an unproved domain?

Known oracle: source/project and retail1900-region use accumulated'=accumulated-1+strip; ordinary row'=row-1+strip; flipped row'=max(row+1-strip,0). Retail flipped calculation1920 and mask1924–192C establish the signed nonnegative clamp. Remaining'=remaining+1-strip at1930–193C; signed comparison with2 at1940/1944 exits, otherwise strip is retained or capped to remaining at194C–1960. This does not prove that every possible input has a positive strip, valid division or terminating loop. A synthetic symbolic subset needs explicit bounds and callee/input assumptions, not an unrestricted behavioral assertion.

## Comparison use and release

Question scopes may be shared before recovery, but exact answers/targets/prototypes must not seed discovery inputs. Compare default and alternate transformations under separately recorded assistance. Equivalent block partitioning is acceptable; missing operations, wrong delay execution, wrong address/value origins or unsupported type changes are not. Report whether a new, evidence-compatible source hypothesis is actually present. More readable output alone does not demonstrate fewer matching iterations or solve a compiler-ordering residual.

All reference questions and known/unknown answers were formed before inspecting Kuna output. Only fresh claim/report and ignored root were written; existing R2, angr reference and production files are unchanged. This reference adds no structural, semantic, compiler or matching acceptance. Reference writes are released; production resumes only after Director routing, retaining all14 W8 targets and the single final complete-wave verifier.

The exact pre-output oracle is `build/kuna-trial-reference-r1/oracles-before-results.md`, SHA9A49D9B08DE46B569CB21700BBD0CD7DC7A411621FD79920C2A83B340EB9ED6E, frozen2026-09-07T23:29:51-04:00. `inputs.json` SHA351C052499709B67458E8125C4682D74A17F3D3624C2C8FE0F4FF0794AF26D6B binds copied references, current3C source, original words, focused evidence and current allocation dumps. These are comparison oracles, not discovery inputs. The final manifest inventories this ignored root; no large historical evidence or current production input was rewritten.
