# Combat draw 7ADC packet preparation r1

Completed bounded assistance. The second scheduling pass first overlaps the two packet pointers. Local allocation already assigned different registers before that overlap. The Director should route this stage account to the matcher; no nonduplicate source discriminator is justified by this package.

Launch COMBAT-DRAW-7ADC-PACKET-PREPARATION-20260907-01; receiver /root/boot_conversion_preparation; Director /root, native 01a07262-aeca-7341-ad10-2dba705ff988; local; Astra Medium. Ready 8eaf0e30008f454f9e04e6a6760ee33f1e6534e0; activation 8f8e88a8fa0aebe55e4e9ee96bdba479f078d808. Coordination baseline is 9f368071dca99396faf02a03365b891edee29f67. Accepted source remains W7 469a1416918592749d61dc34e3e079796f7b673c. The fresh claim was created atomically and read back before other writes. Unchanged required guides were reused from the continuing assignment context.

## Authentication

inputs.json binds all 21 supplied files, including diagnostic-command.json and all thirteen passes. All four pinned source/assembly identities match the prompt. Full function-body macro expansion matches diagnostic candidate.c after excluding comments and whitespace. Emitted assembly matches after excluding comments and .file directives. Full-file comparison authenticated excluded operations without interpreting them.

All 950 original words agree with the accepted W7 Git blob, the derived aid and actual normalized ROM. The complete owner remains 3,800 bytes. The following eight-byte owner was excluded. Both prior preparation hashes match the prompt. inputs.json records the exact original ASM and ROM hashes. Raw ROM SHA256 is 6CA0A1AFE224831E202857AD64EF26BD429A034A4EA48404BB09621641A07B12. In-memory normalized SHA256 is 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A.

The reported 3,800-byte candidate, 368-byte frame and 172 native differences remain diagnostic context. No compiler, linked diff or matching verifier was run.

## Source order and copy units

The assigned source emits the FD pair, masks rowField, then emits the F5 pair. Each PAIR expansion takes the current cursor, advances the global cursor and writes two words. The FD second word contains the header payload address. The F5 first word requires a width-helper call.

Initial RTL UID1176 stores the FD payload at firstPointer+4. UID1183 subsequently loads the global cursor for the F5 pointer. The source order therefore agrees with retail's store-before-load order; the overlap is not present initially.

First CSE folds the source pointer copies. The first scoped pointer461 becomes cursor-load unit462. The second scoped pointer474 becomes cursor-load unit475; its copy UID1189 disappears. These remain distinct allocation units. UID1176 carries REG_DEAD for462 by .flow/.combine, before475's subsequent definition at1183. This death note marks the last use of the pointer value. It does not impose a general memory fence.

## First changed stage

| Stage | Observed order and allocation |
|---|---|
| .rtl through .combine | Payload1176 precedes cursor load1183. Pointer copies fold in first CSE without changing that order. |
| .sched |1176 still precedes1183. Its scheduling dependencies do not contain a store-to-cursor-load edge. |
| .lreg |462 is assigned hard16/s0;475 is assigned hard17/s1. Both are local units in block43. The payload still precedes the cursor load. |
| .greg |Hard registers replace the pseudos. New reload2215 reads the payload from sp+260 into t2. Order is2215,1176,1183. |
| .sched2 |Order becomes2215,1183,1176. This is the first retained pointer overlap. |
| .jump2, .dbr, assembly |The overlap remains. Assembly lines751..753 read payload into t2, load cursor into s1, then store t2 at4(s0). |

The local metadata gives462 twelve references across twelve instructions, crossing one call. Unit475 has twelve references across seventeen instructions, also crossing one call. Those are compiler counters, not numeric priorities. The hard-register assignments are explicit in .lreg; global allocation did not originate them.

The first pointer dies at1176. Before .sched2, its lifetime ends before the second pointer's definition. After .sched2, the second pointer has been defined while the first is still needed for that store. Separate s0/s1 registers permit this overlap. The retained package does not show why local allocation chose those separate registers despite the earlier nonoverlapping order.

## Memory and dependency constraints

The payload store1176 addresses mem/s:SI(firstPointer+4). Cursor load1183 addresses mem:SI(symbol_ref D_800E9BA0). In .sched, both depend on the preceding width call1162. Cursor load1183 has no listed dependency on payload store1176. The header-width load1199 does depend on1176 and1172. The following format load1197 also depends on those stores and cursor publication1187.

After reload insertion, .sched2 adds a dependency from1176 to payload reload2215. Cursor load1183 remains independent of1176 in the retained dependency list. It moves between the reload and its consuming store. This fills the visible load-to-use interval, but no retained scheduler score proves the exact selection motive.

This is a concrete distinction between the cursor symbol and header/packet memory in this diagnostic. It does not prove arbitrary alias freedom, reconstruct the complete alias-analysis algorithm, or establish a universal compiler rule. No fabricated alias or artificial dependency is proposed.

## Retail comparison

All instruction offsets below are z64 ROM offsets. The cursor's symbol denotes RAM address800E9BA0; sp offsets are relative to the current frame.

| Role | ROM offsets | Observed retail behavior |
|---|---|---|
| FD payload |001F8408..001F840C |Load payload from sp+104 into t2; store it at4(s0). |
| F5 pointer |001F8410..001F8414 |Materialize/reload the cursor into the same s0 after the payload store. |
| F5 setup |001F8418..001F8430 |Load header width/format, advance/publish cursor, call the width helper. |

Retail's reused s0 cannot be overwritten by the second cursor load before the first packet's payload store. That register dependence is absent when the candidate uses s0 and s1. This explains the observed permissive condition for .sched2, without claiming how retail's original source obtained its register reuse.

## Discriminator limit and release

No new source discriminator is proposed. Sharing the pointer across packets, raw u32 access, pointer indirection and declaration-order changes are already failed controls. The frozen evidence identifies the scheduling transition and allocation precondition, but not another real-state copy or memory boundary that changes them. Rephrasing a failed shared-pointer control would not be a distinct experiment. A claim about the exact local-allocation choice would need applicable allocator decision evidence; it is not present in the ordinal metadata.

The matcher's later task-local wrapper trial is separate context. It was not read, duplicated or assessed. Nothing here depends on its eventual result. Solved prefix/vertices and endField/render-tail work were excluded.

Only the fresh claim, this report and the assigned ignored root were written. W8 production, EBBC preparation, held Resolver files and frozen records were preserved. No candidates, source/configuration/tooling edits, compiler/diff/verifier/source-policy operations, runtime/bridge/DB actions, Git mutations or agents occurred. All fourteen W8 targets and the existing single final complete-wave verifier remain required. This is ordinary assistance, not independent review or reusable compiler/semantic acceptance. All assigned writes are released at direct collaboration handoff; these outputs then remain frozen.

All 21 input files rehashed unchanged before release. Output identities (SHA256); exact sizes are in outputs.json.

| Artifact | SHA256 |
|---|---|
| auth.py | E9F9359D75F5231062DFD40FE180CFFCF1706155D0AEFCE021171A231E833DE4 |
| comparability.json | D05B2E6A29D93AD7FE9B66CC72EA73D19532620DC6155D62B17827A0E2982B2E |
| finalize.py | 26D706156738116D05EFF4ED1761FE738AC3183AC818842ADE73DA12B9AACCBF |
| inputs.json | D767EED9E6CF0E17D15C4CDD9C7353984ECFD2F1E3091742DEED4726E9753BEC |
| overlap.json | A5164A4590F2F72016AC0A1B8ED930306311519F3DD65C59384D89DAE7C7746E |
| overlap.py | 1BC1595D141E2016DEA2C004F0E76BBDE01511EB31AA2A5E1BA319B46415697C |
| stages.json | 26E41B84FFBC5841216ADAC0E39A340476F0C9789BC41F621DC94CD1C68CA14E |
| stages.py | 803DDB09C648F2E019A1718593FF9C8F668D2311D68402690999D2CEA5C0FB20 |
| trace.py | D818A268EA517E0EC7D718ADC6C3CD1948662B18CB615CE77AE661DE00F2BF22 |
| outputs.json | F57F3A9230D3B358190229BB7999346D2B76B04CA8FFD941EEF5FA411AF83D82 |
