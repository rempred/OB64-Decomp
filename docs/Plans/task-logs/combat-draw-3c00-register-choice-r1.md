# 3C00 companion/u1 register choice: bounded assistance r1

The frozen graph and pinned allocator source give a concrete **conditional reconstruction** of companion in s7 and u1 in s6. Earlier pseudo 925 (the frozen source's `rowField`) ends in s6, conflicts with companion, and does not conflict with u1. Together with earlier s4/s5 neighbors, that accounts for companion advancing to s7 and u1 subsequently reusing s6. The dumps do not prove those final neighbor assignments were already present at the first allocation attempts: their final map is printed **after reload**. No event history or retail source spelling is inferred, and no new experiment is proposed.

## Identity and authority

Task `combat-draw-3c00-register-choice`, revision 1; launch `COMBAT-DRAW-3C00-REGISTER-CHOICE-20260907-01`. Receiver `/root/boot_conversion_preparation`, gpt-6-astra Medium; Director `/root`, local native `01a07262-aeca-7341-ad10-2dba705ff988`. Ready `e86bce1059a7114a8436c61e3c91ab2d1129111f`, activation `6b20ae6242bac4b713fcf06d5bf63601d1b34240`, coordination `39a6cdfb8887020a4be05016f04c10ecff1e7fc7`, accepted source W7 `469a1416918592749d61dc34e3e079796f7b673c`. Fresh complete claim was created atomically and read back before other writes. Required unchanged guides are reused; active W8 and sequential routing remain controlling.

Authenticated predecessor report `3462E6C5E0C8C6A83FD6FCB118A4970BC6678850BDFB6D53FF91262A8D60CBBD` and evidence `7D76724ECE9790E427E4255C3AB25677346B8AC060513D35DE4E543A4F4D2766`, all nineteen retained inputs, its two controlling entry-note identities and accepted original Git blob. Report content matches frozen commit b105f297 after line-ending normalization. The two emitted assemblies again differ only at .file line 1 and diagnostic-option comment line 10; the other 2,037 lines agree. The predecessor's missing original preprocessing command/header snapshots remain an explicit provenance limit. Its complete-owner ROM result is reused, not a new owner reconstruction.

The earlier numeric-method report `69999363806465E81B71C36E9ECFDAE6708D336C5DB4287CD05419C2C6D5D7CB` and evidence `DE969AC7372A75F15B51167DA694926EB27CD7A0346CE956054D907D4EEA6FCD` authenticate, with report content matching 3023eda. Its method is task-specific assistance, not an accepted reusable diagnostic workflow; its ignored script was not run.

Inspected `global.c`, `config/mips/mips.h`, `config/mips/mips.c` and `toplev.c` match compiler commit `43d1cdb67ed135879869b5266f01efaaada5e35a`, tree `bbed133c38a1feffafe941c36b20d3b38ba47a33`, after CRLF normalization. Actual and Git-blob hashes are recorded separately. The recorded source-to-binary association was reauthenticated through reproduction manifest `98C8ACC06A8FBF40DADBD25AE20C2539E8765E14EA12895158C37CC413D06C26` and bootstrap result `67F92A13C607836C90DF877E93A8D1096F44DC9D4193986C12783D7D3B57E904`. Both source-directory and deployed cc1 executables hash to `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6`. This authenticates the existing association; no compiler was run or rebuilt.

## Numeric order and relevant neighbors

Applying the already documented numeric method to lreg counters, with floating division followed by integer truncation, gives the following. Each entry is an unshared size-one allocation unit: the 98-entry header has no grouped `+member` or multi-register size suffix. Positions are one-based in that complete header, not timestamps. Final mappings below are **post-reload observations**.

| Pseudo | References / live length | floor log2(refs) | Integer priority | Position | Final hard register |
|---|---:|---:|---:|---:|---|
| 99 | 92 / 629 | 6 | 8775 | 21 | 20 (s4) |
| 116 | 67 / 516 | 6 | 7790 | 24 | 21 (s5) |
| 925 | 24 / 150 | 4 | 6400 | 31 | 22 (s6) |
| 100, companion | 74 / 786 | 6 | 5648 | 34 | 23 (s7) |
| 115 | 56 / 527 | 5 | 5313 | 35 | 30 |
| 110 | 16 / 126 | 4 | 5079 | 36 | 16 (s0) |
| 112 | 8 / 61 | 3 | 3934 | 40 | 17 (s1) |
| 111 | 10 / 107 | 3 | 2803 | 43 | 18 (s2) |
| 113 | 6 / 48 | 2 | 2500 | 44 | 19 (s3) |
| 114, u1 | 6 / 51 | 2 | 2352 | 46 | 22 (s6) |

Companion and u1 retain GR_REGS-or-none classes and cross 50 and 2 calls respectively. Their SI and HI modes each need one GPR under the retained gp32 flags; two-byte HI does not mean a different allocation-unit size. `mips.h:1188..1216,1257..1276` and `mips.c:3430..3464` explain applicable call-used masks and mode validity. Numeric priority establishes companion-before-u1, not a direct register-number ranking.

The pre-allocation hard-conflict portion of companion's row includes GPRs 2..7,16..19,29, plus FPU/special registers. u1's includes 2..7,29 and FPU registers, but no 16..23. These are recorded hard conflicts, not all globally fixed registers. Call-used exclusion additionally rules out the ordinary call-clobbered GPRs on their initial non-caller-save attempts.

Neither companion nor u1 has a printed preference. `dump_conflicts` prints a preferences row iff the pruned ordinary preference set is nonempty, so these sets are empty at that dump. Copy preferences are built as a subset of ordinary preferences and pruned with the same mask (`global.c:809..816,860..861,1588..1611`); an unreported direct copy preference for s6/s7 is not supported. The only printed preference rows anywhere in this package are 117→2, 551→32, and 1093→2. Full-width preference sets and `regs_someone_prefers` are not printed.

## Pseudo 925 identification and observed overlap

This paragraph identifies the requested neighbor only; it does not study or redesign the writer's row/packet work. Frozen expanded source line 350 declares `rowField`; lines 355,363,371 assign `row * 4 & 0xFFF`. Initial RTL UID 2690 sets pseudo 925 from the mask of pseudo 116 shifted by two; UIDs 2923 and 3168 are its other assignments. It feeds the literal row-field OR expressions, including the following shared use, consistent with the source spelling. `neighbor-925.json` retains the selected exact blocks and source lines.

The overlap with companion is direct, not inferred from its final register: after the first row-field definition, UID 2703 uses 925 and UID 2707 reads memory at companion pseudo100+3. More strongly, lreg live-in sets for blocks 102 (first/last UID3031),103 (3032..3041),104 (3044..3339) contain both 100 and 925. The greg conflict graph lists their edge in both directions. It lists no 925↔114 edge. Thus s6 can serve these two disjoint allocation units 925 and114 while being unavailable to overlapping companion100. The recorded two death sites and six crossed calls for925 are compiler counters, not a runtime-duration claim.

## Choice mechanics and conditional reconstruction

`global.c:546..569` sorts allocation units, prunes preferences, prints conflicts, then attempts each eligible unit in order. `find_reg:904..1069` first excludes fixed/call-used, unavailable global registers, class exclusions and current hard conflicts. Pass0 additionally excludes registers not yet used and registers wanted by lower-priority conflicting units; pass1 drops those two extra restrictions. The source then considers copy and ordinary preference overrides among compatible registers. It can fall back to caller-save allocation or displace local allocations when no normal choice succeeds. Successful assignment propagates its occupied hard-register bits to conflicting units (`1163..1190`). This differs from merely choosing the smallest number appearing free in the printed row.

With the earlier units already in their final recorded registers, companion has 16..19 excluded initially and 20/21/22 excluded through conflicting earlier 99/116/925. The first remaining saved GPR in the target's ordinary scan is23, consistent with s7. For u1, conflicting earlier 110/112/111/113 account for16..19, 99/116 for20/21, companion100 for23, and115 for30. Earlier925 does not conflict with114, so22 remains reusable. Once925 has used22 it is also eligible for the already-used preference of pass0, subject to the undisplayed reservation set. This reproduces the observed result without a direct preference for either named state.

The important asymmetry is the **925↔100 edge and missing 925↔114 edge**, not simply companion's longer lifetime or u1's narrower type. It supports this source-consistent account; it does not establish that the real allocator took exactly these first attempts.

## Exact remaining evidence limit

`global.c:550` emits the initial conflicts before hard assignments. `global.c:574..582` calls reload while allocation data remain live; `retry_global_alloc:1202..1229` permits another attempt with forbidden registers and can change a pseudo's assignment. `toplev.c:3076..3090` prints dispositions only after `global_alloc` returns, hence after reload. The frozen final map cannot substitute for the absent intermediate map.

To turn this conditional reconstruction into an observed choice history would require the pre/post-attempt `reg_renumber` values for the relevant earlier units and100/114, the attempt-time propagated hard conflicts, `regs_used_so_far`, `regs_someone_prefers`/full preferences, exclusions and pass/fallback status, and any intervening reload spill/retry `forbidden_regs` changes. None is recorded as an event trace here. Ordinary preferences and initial conflicts are available; claiming all allocator state is absent would also be inaccurate. No instrumentation or compiler execution is authorized to fill the specific gaps.

No additional discriminator is proposed. The literal neighbor identity already touches the primary writer's excluded row-state work; a recipe here would duplicate or interfere with that investigation. Int-versus-short u0/u1 was not repeated. There is no dummy reference, score manipulation, source-spelling inference, compiler-defect claim or universal register-order rule.

## Delivery

`build/combat-draw-3c00-register-choice-r1/evidence.json` binds inputs, all recorded preferences, full header, selected conflict/neighborhood facts and calculated priorities. `neighbor-925.json` supplies bounded role/overlap excerpts. `output-manifest.json` binds those outputs, four authenticated source snapshots, offline parser, report and terminal claim; its hash is delivered directly to Director.

All fourteen W8 targets and the single complete-wave verifier remain required. This is ordinary matching assistance without independent matching review, structural/semantic acceptance or a reusable tool. Only the assigned claim/report/ignored root was written; no compiler, production/config/tooling, runtime/bridge/database or Git mutation occurred. Held Resolver, mutable W8 and prior frozen records are preserved. All assigned writes are released at terminal handoff.
