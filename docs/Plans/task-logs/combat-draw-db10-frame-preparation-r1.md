# DB10 frozen frame account r1

Completed bounded read-only assistance. The candidate's 552-byte frame comprises 24 outgoing bytes, 432 declared fixed-local bytes, 56 bytes containing four accessed scalar homes and three compiler-only USE homes, and 40 saved-register bytes. Retail's 560-byte frame has the same outgoing space, corresponding work-array starts and saved-register set, but 64 bytes between the fixed-local area and saved registers. This accounts for the eight-byte difference without identifying a missing retail source object or allocation event.

The two pointer values agree: candidate homes **1DC/1E4** hold **sp+5C/sp+A4**, just as retail homes **1E4/1EC** do. Their candidate stack homes first appear in `.greg`, after remaining global allocation and reload; their address pseudos already exist earlier. No padding or source recipe is proposed.

## Authentication and scope

Receiver `/root/boot_conversion_preparation`, gpt-6-astra Medium; Director `/root`, local native task `01a07262-aeca-7341-ad10-2dba705ff988`. Task `combat-draw-db10-frame-preparation`, revision1, launch `COMBAT-DRAW-DB10-FRAME-PREPARATION-20260907-01`. Ready `7ec01ed76f9275414855ea8e6c991215fb55d519`; activation `daf04bbd7c6296ca8e8b47e443301791f8ffd9d5`; coordination `42379835d0ac76c3348e4c1a0b5b15684a7cc02b`; accepted source W7 `469a1416918592749d61dc34e3e079796f7b673c`. Complete claim created atomically and read back before evidence writes. Unchanged governing guides reused.

All four prescribed snapshot hashes pass. `evidence.json` binds 21 inputs: authored C/assembly, expanded C/assembly, thirteen retained passes, diagnostic command, frozen full-owner report/evidence and exact W7 original ASM. Production and diagnostic assembly have identical line counts and differ only at line1 `.file` and line10's `-da` comment. All other lines match, including instructions, frame, labels and data. This supports applying retained metadata to the frozen production candidate. Expanded input is self-contained, with no includes, and has the prescribed identity; the original preprocessing command and frozen headers are unavailable, so independent preprocessing replay is not established. The command records the pinned cc1 path, `-O2 -meb -mips3 -mgp32 -mfp32 -G 0 -fno-PIC -mno-abicalls -fno-builtin -funsigned-char -da`, successful status and empty output; it was not rerun.

The exact W7 original SHA256 is `4493C58ABF102557B2E89D98021B18968903F706B3D983227497CD101379E2FE`. All 1,387 words at ROM20DB10..20F0BC match the actual canonical ROM, giving 5,548 owner bytes and instruction-byte hash `A47D14C3227F9FAD494097A03496A8759DE3C1A19E00324012CD541C53732EB7`. Raw v64 SHA256 `6CA0A1AFE224831E202857AD64EF26BD429A034A4EA48404BB09621641A07B12`; in-memory z64 normalization `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`. Retail evidence was extracted directly from accepted ASM, not the draft navigation file, so no m2c guard instruction enters the account. Full-owner preparation is reused at its frozen scope; no reconstruction or boundary analysis was repeated. The writer's 5,556 candidate bytes remain a provisional measurement, not a fresh assembly/diff or acceptance result here.

## Frame and storage table

Offsets and ranges below are hexadecimal, ends exclusive. Byte counts in parentheses are decimal. `stack-accesses.json` records all direct sp-relative memory instructions; `retail.txt` includes actual ROM addresses. Indirect work-array references are distinguished from scalar spill homes.

| Component | Candidate | Retail | Evidence and limit |
|---|---|---|---|
| Outgoing arguments | 000..018 (24) | 000..018 (24) | Four register-argument home words plus actual fifth/sixth stores at10/14. Retail20EF44/20EF4C stores pointer/run arguments. No incoming stack argument is consumed by this one-argument owner. |
| Work storage | 018..1C8 (432) | Corresponding starts within018..1C8 | Frozen C explicitly declares six 18-element, four-byte arrays. Starts are18,60,A8,F0,138,180. Retail independently forms these bases or equivalent indexed addresses, but spacing alone does not prove its original declarations/capacities. |
| Scalar-home region | 1C8..200 (56) | 1C8..208 (64) | Candidate seven eight-byte envelopes: four real four-byte homes plus three USE-only four-byte homes. Retail has four observed four-byte homes among eight envelopes; the unused envelopes have no proved original role. |
| Saved registers | 200..228 (40) | 208..230 (40) | s0..s8 plus ra, ten words; no FPU save. Every save/restore shifts by8. |
| Total | 228 =552 | 230 =560 | Both eight-byte aligned; no additional trailing alignment is needed in this accounting. |

Candidate `.frame` explicitly says `vars=488, regs=10/0, args=24, extra=0`: 432+56=488 and 24+488+40=552. The analogous retail local-region extent is496=432+64, giving24+496+40=560. This is a layout identity, not a claim that every unused retail envelope was allocated as a scalar spill.

The six candidate declarations (`sources`, `contexts`, `resources`, `variants`, `flag10s`, `flag8s`) occupy72 bytes each. Initial RTL uses virtual-stack register69 and bases0,72,144,216,288,360 relative to that fixed-local origin. The later physical origin issp+18. The work-list helper receives actual bases18/60/180/138 and F0 as its fifth argument. Bounds or exhaustion are not inferred from spacing and do not become a new ordinary matching gate.

## Accessed homes and pointer correspondence

| Candidate home / pseudo | Retail home | Observed identity and first visible transition |
|---|---|---|
| 1CC /72 | 1CC | Incoming selector. Initial RTL UID4 copies a0 to pseudo72; `.greg` UID4 stores it tosp+460. Retail20DB4C stores a0, with later reads20DD2C/20E650. |
| 1D4 /73 | 1D4 | Existing per-pass zero/one latch. Initial RTL UID51 initializes pseudo73; `.greg` UID51 stores zero tosp+468. Retail20DB7C and20E478 initialize the corresponding home; its later stores/reads remain intact. |
| 1DC /827 | 1E4 | Pointer value sp+5C, i.e. contexts base60 minus4 for the shifted-copy access. Original pseudo827 appears in RTL UID2753 as virtual local origin+68 decimal; its hoisted base definition UID3484 first appears in `.loop`. lreg has827 = frame-base+92; greg computes the same address in t3 then new UID3553 stores it tosp+476. Retail20ECF0/20ECF4 computes/stores sp+5C;20EE24 reloads it. |
| 1E4 /836 | 1EC | Pointer value sp+A4, i.e. resources baseA8 minus4. Original RTL UID2772 has virtual local origin+140; hoisted UID3485 first appears in `.loop`. lreg has836 = frame-base+164; greg computes it in t3 then UID3556 stores tosp+484. Retail20ECF8/20ECFC computes/stores sp+A4;20EE14 reloads it. |

The pointer comparison is based on both the stored address and its later indexed-copy use, not merely ordinal stack offsets. Neither pointer home is an extra array or an array's first element. The base-minus-four pointer is a derived address; it does not authorize creating an extra element or an out-of-bounds source object. Candidate1E4 corresponds to retail1EC, **not** to retail1E4 despite the identical numeric offset.

All four scalar homes are first observed as memory locations in `.greg`; through `.lreg` they remain pseudos. Existing global-allocation source timing distinguishes the initial global conflict dump from the post-reload greg instruction/map output. No retained intermediate allocation log separates which exact global failure, reload allocation or retry established an individual home. The new store UIDs for the two pointer homes are visible in that interval; assigning them to a specific unrecorded attempt would overstate the evidence.

## Compiler-only USE homes

| Candidate home | Pseudo / USE UID | Preserved origin |
|---|---|---|
| 1EC (492) | 987 /3511 | Pseudo first appears in `.jump` UID3357 as an unsigned comparison result; USE3511 first appears in `.combine`, before call UID2568. |
| 1F4 (500) | 988 /3512 | Pseudo first appears in `.jump` UID3362 as an unsigned comparison result; USE3512 first appears in `.combine`. |
| 1FC (508) | 990 /3513 | Pseudo first appears in `.jump` UID3372 as an unsigned comparison result; USE3513 first appears in `.combine`. |

By `.lreg`, each of these pseudos occurs only in its standalone USE with a REG_DEAD note; its earlier comparison-result definitions are no longer retained as definitions of that pseudo. The counters still list references and ST_REGS-or-none classification, which are compiler bookkeeping rather than emitted values or runtime access counts. In `.greg`, each USE and its REG_DEAD operand becomes a `mem:SI(sp+offset)` at the listed home. These persist through `.dbr`, but the final assembly contains **no load, store or address materialization targeting those homes**. They are actual retained compiler memory operands with no emitted memory access, not three initialized C locals.

The high-home stage census is exact: no such memory offsets through lreg; greg has460/468/476/484/492/500/508; sched2 additionally has saved-register offsets512..548. `pass-stack-evidence.json`, `selected-origins.json` and `homes.json` retain exact nodes and transitions.

For interpreting spacing only, pinned `reload1.c:2329..2358` supplies the stack-home allocation path for an unassigned referenced pseudo without an equivalent, including `assign_stack_local(...,-1)`. `function.c:655..729` defines -1 as biggest alignment plus rounded allocation size and a big-endian low-end correction. Authenticated MIPS definitions set BIGGEST_ALIGNMENT and STACK_BOUNDARY to64 bits. These facts explain why a four-byte SI memory operand can occupy an eight-byte envelope with offset+4. They do not prove an exact invocation trace or establish a retail allocation cause. Source files match commit43d1cdb67ed135879869b5266f01efaaada5e35a/treebbed133c38a1feffafe941c36b20d3b38ba47a33 after CRLF normalization; source/binary association and deployed hash are reauthenticated in `compiler-reference.json`.

## Retail limits and release

Retail's observed scalar words occupy1CC,1D4,1E4,1EC. In the eight-byte lattice beginning at1C8, word positions1DC,1F4,1FC,204 have no emitted direct accesses or address materializations in the accepted owner. Candidate has three non-emitting USE homes where its metadata establishes them. No original-retail RTL, USE records or frame-allocation log is supplied, so the four retail unaccessed positions cannot be labeled USE homes, deleted spills, extra locals or missing initializers. Likewise the candidate's three USEs cannot be assigned one-to-one retail counterparts. The extra eight bytes and shifted pointer homes are observed; their original compiler/lifetime cause remains unknown.

No source recipe, padding, artificial reference, original-source inference, new tool or acceptance claim follows. The primary writer's peer-delay, row/index/actor, band and token work was not investigated beyond authenticating complete frozen input bytes and the necessary frame-role correspondence. All fourteen W8 targets and the single final complete-wave verifier remain required; no independent source review or runtime gate is added.

Outputs under `build/combat-draw-db10-frame-preparation-r1/` are bound by `output-manifest.json`, including this report and terminal claim hashes. Only the assigned claim/report/ignored root was written. No compiler/link/build/verifier/source-policy, source/config/tooling, runtime/GUI/bridge/database, agent or Git mutation occurred. W8, held Resolver and frozen records are preserved. All assigned writes are released at terminal handoff.
