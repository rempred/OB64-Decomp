# Combat shared dispatch prerequisite research

Completed. The preserved W6 r3 report already contains the four-route map; this result closes its navigation and qualification gap.
Independent ROM checks support that map and the shared bridge interfaces, without establishing gameplay names or new matching acceptance.
The Director must route this completed result for applicable independent review before accepting its new qualifications.

## Identity and authority

- Task: `combat-shared-dispatch-research`, revision 1.
- Launch: `COMBAT-SHARED-DISPATCH-RESEARCH-20260907-01`.
- Receiving worker: `/root/sequential_scope`, Astra Medium, local.
- Director: `/root`, native task `01a07262-aeca-7341-ad10-2dba705ff988`, local.
- Read-only baseline: main `f5156ab8bb325cc92eacf5f6b91017037a4aa40d`.
- Claim: `combat-shared-dispatch-research-r1.claim.json`, created with `FileMode.CreateNew` and immediately read back before other writes.
- Owned outputs: this report/log, the permanent claim, and ignored `build/combat-shared-dispatch-research-r1/`.

This is Combat shared-prerequisite research, not a concurrent High Attack implementation wave.
Production source, assembly, configuration, tools, ROM, historical worktrees, and other workers' outputs remained read-only.
No compilation, linked diff, source-policy regeneration, runtime control, database mutation, agent creation, staging, commit, branch, worktree, or push occurred.

## Reused evidence

The central predecessor is [W6 r3 evidence index](../../../../high-attack-wave-5/docs/matching-c/high-attack-wave6-action-mode-dispatch-r3-20260905/evidence-index.md), lines 162–180.
It already records the 80-byte bridge copy, forwarded parser return, output-pointer behavior, and all four dispatcher destinations.
Its [r3 report](../../../../high-attack-wave-5/docs/matching-c/high-attack-wave6-action-mode-dispatch-r3-20260905/aar.md), lines 56–57, points to that map.
The preserved F2BC note also explicitly says the four routes were mapped separately.
These are existing project research observations, not newly discovered facts or accepted donor production.

The [accepted sequential scope](../sequential-family-scope.md) and [accepted prerequisite review](sequential-prerequisites-review-r1.md) retain original family memberships and wave gates.
The [High Attack plan](../high-attack-battle-stream-families-director-20260902.md), W6, requires this four-route understanding before large-owner tuning.
The [restart index](../../RESUMING_FROZEN_FAMILIES.md) distinguishes fourteen provisional W6 sources from the unfinished seventeen-owner wave.
It also preserves B1F4/D14C nonexact status and EF50's unresolved production partition.
No donor candidate became accepted through this task.

The parent research-aide index identifies canonical decomp assembly as the current byte/instruction foundation.
That is the smallest accepted source needed here; no historical runtime atlas, external decomp source, or live resolver database was imported.

## Independent method and placement limits

The normalized ROM is `build/baserom.us_rev0.z64`, 41,943,040 bytes.
Its measured SHA-256 is `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
Every instruction word in 31 bounded owners, totaling 23,956 bytes, matched that ROM at its original z64 offset.
This includes all seventeen W6 owners and fourteen directly relevant interface owners.

Placement comes from `config/phase7/conventional-build.json`, `config/overlays/us_rev0.json`, and the original assembly manifest.
W6 large owners use accepted slab `resource-loader-0022a280`; the bridges use `resource-loader-00213b10`.
Descriptor 10 supplies the selected Combat helper entries.
These mappings identify loaded-image addresses; they do not prove that an image was resident or executed during a particular run.

Raw assembly comments often display an obsolete runtime PC.
For example, F2BC's accepted entry is live `0x801EBFEC`, not the comment's `0x8029EEBC`.
The extraction recomputes direct-call destinations from instruction words and accepted placement.
It retains competing overlay mappings rather than silently collapsing them.
The selected helper identities below are conditional on the stated Combat image configuration.

## Four normal dispatch routes

Use neutral route conditions rather than inventing action names.
The relevant dispatcher is `func_0022F2BC`, z64 `0x0022F2BC..0x0022F580`, live `0x801EBFEC..0x801EC2B0`.
After preparation, it loads an unsigned byte from the input record at `+0x78`.
There are four destinations, not a proven four-value enum.

| Route condition after preparation | Accepted owner | z64 owner range | Live entry | Decisive call-site z64 offset |
|---|---|---|---|---|
| Byte `+0x78 == 0`; predicate `func_0020C120 == 0` | `func_0022B1F4` | `0x0022B1F4..0x0022BFF8` | `0x801E7F24` | `0x0022F520` |
| Byte `+0x78 == 0`; predicate `func_0020C120 != 0` | `func_0022C78C` | `0x0022C78C..0x0022D14C` | `0x801E94BC` | `0x0022F510` |
| Byte `+0x78 == 1` | `func_0022BFF8` | `0x0022BFF8..0x0022C78C` | `0x801E8D28` | `0x0022F538` |
| Every other byte value | `func_0022D14C` | `0x0022D14C..0x0022EC08` | `0x801E9E7C` | `0x0022F548` |

Source: `asm/original/rev0/lib/func_0022F2BC.s`, z64 `0x0022F4EC..0x0022F564`.
The four calls pass the same record pointer and the same second-argument word pointer.
Their return register is tested for zero; nonzero values propagate unchanged.
On the normal-route zero-return join, the dispatcher stores `-1` to record word `+0x68`, then returns zero.
This join does not apply to every earlier exit.

The zero-byte predicate is independently bounded by `func_0020C120.s`, z64 `0x0020C120..0x0020C164`.
It returns true for a nonnull record whose word `+0x4C` equals `0x0A`, `0x19`, or `0x7B`.
It returns false otherwise.
The dispatcher has already rejected a null record before reaching this predicate.
These constants are observed values; this report does not assign class, weapon, or action names to them.

### Entry and override order

The four-route decision is reached only after these ordered gates:

1. A null first argument returns zero.
2. For a nonnull record, words `+0x8C`, `+0x88`, and `+0x84` are cleared.
3. Signed `record[+0x6C] < record[+0x70]` is required to continue.
4. The byte at `(*D_801CE8C0)+0x818` increments before the first helper returns.
5. Nonzero `func_0020C2C0` or `func_0020C32C` enters the early common update path.
6. Otherwise, flag word `+0x40` mask `0x8` selects `func_0022EC08` first.
7. If mask `0x8` is clear, mask `0x4` selects `func_0022EDD4`.
8. Further record/global cursor checks and `func_00214BDC` can still select update/scan exits.
9. Only the remaining path calls `func_0022EF50`, then reads the dispatch byte.

Source: F2BC z64 `0x0022F2D8..0x0022F4F4`.
The mask paths return their helper's value directly and bypass the normal-route `+0x68 = -1` join.
If both masks are set, `0x8` wins by branch order.

The common update path compares `+0x94` with the second argument's pointed word using signed comparison.
It then compares the selected value with `(*D_801CE8C0)+0x828` using unsigned comparison.
It emits helper call `func_0021D200(0x1C, value, record)`, increments `+0x6C`, and writes back through the second argument.
References: z64 `0x0022F330..0x0022F414` and `0x0022F458..0x0022F4C4`.
The scan path visits indices `0..19`, conditionally copies each entry's `+0x70` to `+0x6C`, and returns one after its update.
It also writes byte one at `(*D_801CE8BC)+0x6088`.
These are static operations; the unit of the compared values remains unnamed here.

### Preparation writes the selector

`func_0022EF50` is called immediately before the dispatcher reads `+0x78`.
A reconstruction must not dispatch from a cached pre-call byte.
EF50 derives an initial byte through `func_00044130` and `func_00044358`.
The latter reads live table byte `0x8018AA80 + 16 * (argument & 0xFF)`.
Reference: `func_00044358.s`, z64 `0x00044358..0x00044370`.

EF50 has additional paths for initial values `3`, `4`, and `5`.
It can store literal `3`, literal `4`, or a later helper result to `+0x78`.
References: z64 `0x0022EFFC..0x0022F038`, `0x0022F228..0x0022F264`.
Other initial values are stored at z64 `0x0022F018`, in a branch-likely delay slot.
Those values take the default D14C route unless zero or one after preparation.

EF50 also updates words `+0x7C` and `+0x80`.
It uses the global byte at live `0x801CE8F8` for the record-word `+0x4C == 0xA4` path.
F2BC increments that global with `lbu/sb`, not a pointer-sized store, at z64 `0x0022F4D8..0x0022F4E8`.
References: EF50 z64 `0x0022EF9C..0x0022EFF8` and `0x0022F264..0x0022F290`.
This confirms the predecessor's width correction without claiming a runtime mode distribution.

## Field and declaration boundaries

| Interface | Direct static evidence | Safe reconstruction constraint | Limit |
|---|---|---|---|
| Main record `+0x40` | Word load and masks `0x8`, `0x4` in F2BC | Preserve a 32-bit flag word and ordered tests | Flag meanings are not established here |
| Main record `+0x6C`, `+0x70` | Signed comparison, increment, and scan copies | Preserve 32-bit arithmetic and observed signed comparisons | Do not collapse into an unsigned count merely from names |
| Main record `+0x78` | `lbu` after EF50; `sb` inside EF50 | Unsigned 8-bit selector view | It is not a closed four-value enum |
| Main record `+0x7C`, `+0x80` | EF50 word stores; D14C reads word `+0x7C` and byte `+0x7F` | Preserve big-endian byte/word views | `+0x7F` is the low byte of that word, not automatically a separate field |
| Main record `+0x94`, second argument | Word loads/stores, signed then unsigned comparisons | Preserve a mutable 32-bit pointed value and both comparison domains | Original C typedef and time unit are not proven |
| Global roots | Loads from live `0x801CE8C0` and `0x801CE8BC` | Keep roots and pointee fields distinct | This is pointer use, not measured live allocation or lifetime |
| Bridge input `+0x4C` | Loaded as a pointer, followed by pointee `+0x40` | Use a separate view from the main record | Equal offsets do not prove equal structures |

Proposed declarations are reconstruction aids, not original-source or canonical semantic claims.
A word-returning dispatcher taking an opaque record pointer and a 32-bit word pointer fits the observed call interface.
Each four-route owner must preserve that interface; source type uniqueness is not established by register passing alone.
Use separate record views or byte offsets until stronger field evidence supports shared structures.
No production declaration or draft was written.

## Shared Combat bridge interfaces

### Copy and parser bridge: `func_0022257C`

Its accepted owner is z64 `0x0022257C..0x00222604`, live `0x801DF2AC..0x801DF334`.
The loop copies five groups of four words: exactly `0x50` bytes into stack scratch.
It is not a five-word copy, despite the older assembly heading.
References: z64 `0x00222594..0x002225CC`.

It calls `func_001F0E64(scratch, argument1)` at z64 `0x002225D4`.
It then calls `func_001F197C(*(input[+0x4C]+0x40), scratch, argument2)` at z64 `0x002225E8`.
The return register survives the epilogue unchanged.
The third argument is forwarded unchanged and can be a null pointer at observed callers.

The parser computes a signed division-by-two return at z64 `0x001F1D20..0x001F1D28`.
Its nonnull third-argument path writes words, including a `-1` terminator, at z64 `0x001F1CF8..0x001F1D1C`.
EDD4 consumes the bridge return by adding it to its running value immediately after z64 call `0x0022EEF4`.
The decisive addition is z64 `0x0022EEFC`.
Therefore a void bridge declaration would discard a material interface result.
This reauthenticates the existing W6 r3 signature reconciliation.

The direct W6 callers are A280, A964, ADFC, B1F4, BFF8, D14C, EC08, and EDD4.
There are 22 direct `jal` sites across those eight owners in the bounded scan.
C78C reaches the bridge through ADFC and its helper chain; it also calls the parser helpers directly.
The bridge's own implementation depends on the two parser/copy helper interfaces, not on matching the four large mode owners first.

### Predicate bridge: `func_00222604`

Its accepted owner is z64 `0x00222604..0x002226D4`, live `0x801DF334..0x801DF404`.
It reads a byte through `func_0020BF98`, whose source is live `0x80197B62`.
Input mask `0x8000` forces zero.
Otherwise it combines input mask `0x400` with complementary predicates over record flag bit 8.
It requires the global byte to be nonzero.
For global byte `0xFF`, it returns the record flag-bit-9 predicate.
For other nonzero values, it calls `func_00045e5c(record byte +0x4B, global byte)` and normalizes the low-byte result.
References: `func_00222604.s`, z64 `0x00222624..0x002226B4`; helper leaf sources are included in the extracted evidence.

The relevant helper identities are `func_0020BF98`, `func_0020C014`, `func_0020BFF8`, `func_0020C0E8`, and `func_00045e5c`.
The first two complementary flag predicates safely return zero for a null record.
No W6 owner directly calls this bridge in the authenticated W6 instruction set.
The additional bounded direct-call scan also found no `jal` to this bridge.
This is not proof of no indirect, data-driven, tail-call, or out-of-range use.
Its accepted original W6 membership remains unchanged; lack of a direct call does not remove it.

## Prerequisite package and original wave obligations

The static four-route prerequisite is answered by the preserved r3 map plus these independent qualifications.
No new runtime observation is required to establish these branch destinations.
No full large-owner conversion is needed merely to implement either bridge's outgoing interface.
That technical dependency is separate from the original complete-wave acceptance requirement.

The smallest useful static implementation reading package is:

1. F2BC's ordered guards, override routes, post-EF50 selector, and return join.
2. EF50's writes to selector and associated words, with byte/word access widths preserved.
3. The two bridge contracts and their immediate callees, including the forwarded parser return.
4. Each selected large owner's bounded call/data context before its own matching attempt.
5. Existing B06C, D14C, and EF50 table ownership evidence before any affected activation.

Within W6, the direct dependency graph is:

| Owner group | W6 callees |
|---|---|
| F2BC | EC08, EDD4, EF50, B1F4, BFF8, C78C, D14C |
| B1F4, BFF8 | 2257C, A4E0, ADFC |
| C78C | A4E0, ADFC |
| D14C | 2257C, A7B8, B06C |
| ADFC | 2257C, A414, A964, A280 |
| A7B8 | A414 |
| A280, A964, EC08, EDD4 | 2257C |
| 2257C, 22604, A414, A4E0, B06C, EF50 | No direct W6 callee |

The evidence JSON records every direct call-site offset and all candidate accepted placements, including dependencies outside this table.
Examples include stream writers, Combat selector/parser interfaces, and later resource-slab helpers such as `func_00237750`.
These remain interfaces, not newly added family members or requirements to convert every transitive callee.

The original W6 set remains:
`func_0022257C`, `func_00222604`, `func_0022A280`, `func_0022A414`, `func_0022A4E0`, `func_0022A7B8`, `func_0022A964`, `func_0022ADFC`, `func_0022B06C`, `func_0022B1F4`, `func_0022BFF8`, `func_0022C78C`, `func_0022D14C`, `func_0022EC08`, `func_0022EDD4`, `func_0022EF50`, and `func_0022F2BC`.
All seventeen must satisfy the original complete-wave PURE_C and exact-ROM gates before W6 is exact-complete.
Combat can own required shared source work under the accepted sequential scope; later High Attack reuses accepted results.
This research does not authorize isolated bridge acceptance that shortens W6, a concurrent source family, or a new prerequisite match inventory.

### Existing table prerequisites

| Consumer | Table live address | Table z64 address | Reachable slots from decoded bounds | Evidence |
|---|---|---|---:|---|
| B06C | `0x801F6BF0` | `0x00239EC0` | 10 | Bound at z64 `0x0022B0A4`; jump at `0x0022B0BC` |
| D14C first table | `0x801F6C18` | `0x00239EE8` | 5 | Bound at `0x0022D208`; jump at `0x0022D220` |
| D14C second table | `0x801F6C30` | `0x00239F00` | 10 | Bound at `0x0022DD6C`; jump at `0x0022DD84` |
| EF50 | `0x801F6C58` | `0x00239F28` | 7 | Bound at `0x0022F1CC`; jump at `0x0022F1E8` |

All extracted table destinations remain inside their respective original logical owners under the named slab mapping.
The first D14C table has five entries followed by four bytes before the next table; table extent is not inferred from adjacency alone.
The EF50 seven entries do not absorb its trailing object alignment into another case.
These checks corroborate preserved structural evidence; they do not approve a new production partition or change ownership rules.
The restart index remains the activation guide for accepted auxiliary capabilities and unresolved EF50 production ownership.

## Claims, limits, and verification

| Claim | Evidence grade | Review status | Falsifier or limit |
|---|---|---|---|
| Four-route mapping and override priority match the original instructions | Verified static | Pending | A different decoded branch/call word or accepted placement contradicting the listed sites |
| EF50 must precede reading the selector byte | Verified static | Pending | A path from normal dispatch to selector read that bypasses that call |
| Copy bridge copies 80 bytes and forwards a material parser return | Verified static | Pending | Different loop bound, register clobber, or caller consumption than the cited words |
| Predicate bridge contract is independent of large mode-owner implementation | Supported static interface conclusion | Pending | An outgoing bridge edge to a large mode owner or unaccounted hidden interface dependency |
| Complete seventeen-owner W6 obligation remains intact | Accepted plan requirement, preserved here | No new verdict | This report cannot waive or replace that boundary |

Runtime reachability, gameplay mode names, input distributions, timing units, and original C type choices remain unresolved here.
No claim of pure-C impossibility or compiler behavior follows from this research.
The direct-call negative for 22604 is bounded to decoded `jal` words in the stated scan; it does not exclude indirect consumers.
The bounded bridge scan covers original owners wholly within z64 `0x001F0A30..0x0023A3A0` with one accepted placement.
The extracted candidate mapping retains overlay alternatives; conditional mapping is not runtime residency proof.

Verification checked normalized ROM identity, complete word coverage and byte equality for all 31 selected owners, accepted-map arithmetic, and direct call destinations.
It also checked table bounds against decoded instructions and mapped every extracted slot into the intended owner.
No build, complete verifier, or live experiment was run or needed for these static claims.
The sole intermediate extraction mistake was a provisional nine-slot D14C second-table count; its decoded bound proved ten before final evidence was written.
The final artifact contains ten entries. No incorrect count was propagated to production or a frozen record.

## Evidence index and reproduction

- `build/combat-shared-dispatch-research-r1/extract.js`: task-local read-only ROM/assembly extractor.
- `build/combat-shared-dispatch-research-r1/evidence.json`: complete bounded instructions, hashes, accepted placements, call-site candidates, table slots, and incoming bridge sites.
- Evidence JSON SHA-256: `3912709E85540A2A106EB871138710972D220CC0DEAE1AFC0A7A803B13977C7B`.
- The JSON identifies every source assembly SHA-256 and owner ROM SHA-256, plus the three accepted model inputs and central research references.
- Reproduction starts with `node build/combat-shared-dispatch-research-r1/extract.js`; input hashes and the ROM identity must remain unchanged.
- The checked-in report carries the material findings even when ignored evidence is unavailable.

The extraction script reproduces raw observations; research-reference hashes and written scope limits were added afterward to the JSON.
The raw instruction comments are preserved as annotations only; accepted runtime addresses occupy separate fields.
This avoids treating old disassembler comments as canonical placement evidence.

## Work log and handoff

Read current canonical and parent guides, worker workflow, source policy, sequential scope/review, W6 plan, research-aide routing, and preserved W6 r3 reports.
Recovered the already-existing route map before performing bounded independent checks.
Authenticated the ROM and selected owner words; inspected dispatcher gates, EF50 writes, bridge bodies, and concrete caller return consumption.
Recorded dependencies without expanding membership or altering original complete-wave obligations.
The Director confirmed no wider scan or unrelated test was needed; the task stopped at that boundary.

Broad reads occasionally exceeded display limits; bounded follow-up reads recovered the relevant sections.
Git emitted inaccessible global-ignore warnings; exact assigned-path checks remained available.
No unexplained change occurred in the worker's assigned report or claim.
Other workers' boot and selector outputs remained untouched.
No background process was started.

Proposed canonical navigation: point the four-mode prerequisite to preserved W6 r3 evidence lines 162–180 and this reviewed qualification report.
No historical report or production source needs rewriting by this worker.
The report is completed for review; technical and semantic acceptance remain with the independent reviewer and Director.
All owned writes are released at terminal handoff.
