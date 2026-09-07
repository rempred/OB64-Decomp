# Combat shared dispatch independent review

Completed. Verdict: **Accepted**. The bounded static qualifications at frozen subject `b062808` withstand independent recomputation.
They may guide later Combat shared-prerequisite work without changing Wave 6 matching acceptance.
Director `/root` may propagate this reviewed dependency while retaining every original Wave 6 gate.

## Frozen subject and eligibility

- Frozen subject: `b06280860f1723c14600979f1c5515164069defb`.
- Worker report: [combat-shared-dispatch-research-r1.md](combat-shared-dispatch-research-r1.md).
- Worker report SHA-256: `80600CDE844E4D4A506838391ADBECD339153F27F61D5FC90FB53A0EDEF13254`.
- Ignored worker evidence SHA-256: `3912709E85540A2A106EB871138710972D220CC0DEAE1AFC0A7A803B13977C7B`.
- Review assignment: `combat-shared-dispatch-review`, revision 1.
- Launch: `COMBAT-SHARED-DISPATCH-REVIEW-20260907-01`.
- Receiving reviewer: `/root/combat_shared_dispatch_review`, Sol Max, local.
- Claim: `combat-shared-dispatch-review-r1.claim.json`, created with create-only semantics before review writes.

The worker reported `completed`, released all writes, and recorded no unfinished correction.
This reviewer did not produce the worker result.
The report matched the frozen commit, and the ignored evidence matched the assigned hash.

The starting review HEAD was `d2f2952ff8adfacda5675ca59028d294dcdf4ff8` on `main`.
Concurrent boot and selector records were disjoint from the assigned review paths.
Later HEAD movement changed only selector coordination files and `docs/Plans/sequential-main-program.md`.
The frozen report and all static review inputs retained their identities.

## Claims reviewed

1. `func_0022F2BC` has four normal selector routes after `func_0022EF50` prepares byte `+0x78`.
2. Record flag mask `0x8` overrides mask `0x4`, and both paths precede the normal selector routes.
3. `func_0022257C` copies 80 bytes, calls two parser helpers, and preserves the second helper's return.
4. `func_00222604` depends on five bounded helper interfaces without an outgoing Wave 6 owner call.
5. The reported direct incoming bridge calls, field widths, table bounds, and dependency edges match accepted static evidence.
6. The report reuses preserved W6 r3 findings and identifies its new qualifications.
7. The original seventeen-owner Wave 6 membership and complete-wave acceptance gates remain unchanged.

## Review method

I inspected the frozen report, subject diff, accepted placement inputs, original owner assembly, and preserved W6 r3 records.
I then decoded decisive instruction words directly from the normalized Rev 0 ROM.
I did not use assembly comments as placement authority.

The independent checker authenticated every word in 31 selected owners against the ROM.
It derived loaded addresses from the accepted overlay and slab models.
It resolved direct calls with each caller's accepted loaded address.
It retained the report's stated image and scan limits.

The strongest competing interpretation was an overlay alias selecting a different helper owner.
The accepted Combat image selects the reported owners, while other candidate mappings remain explicit.
This conclusion does not claim runtime residency.

Another competing interpretation was an overlooked direct caller to `func_00222604`.
The independent scan covered 590 physical owners inside the report's bounded ROM interval.
It found no direct `jal` to that bridge.
Indirect calls, data pointers, tail jumps, and callers outside the interval remain unresolved.

All checks were ordinary read-only static acceptance checks.
No hostile mutation or unsupported producer state affected the verdict.
The smallest falsifiers were contradictory decoded words, a bounded direct call, an escaping table target, or a changed frozen scope.

## Tests and results

The focused checker and compact result are reviewer-owned ignored evidence:

- [independent-check.js](../../../build/combat-shared-dispatch-review-r1/independent-check.js), SHA-256 `BD97C5234FA74F757C58842C9DA845B0D9D50D0DD370A5E2B8EC76CD9A9D2488`.
- [independent-results.json](../../../build/combat-shared-dispatch-review-r1/independent-results.json), SHA-256 `FBDEC5CBDCC5F65502D1F947F773B697B66FA4E661638ACF6F6801BDC7F24F10`.

The principal command returned the stated result:

```text
node build/combat-shared-dispatch-review-r1/independent-check.js
PASS: 101688 focused independent checks
Evidence: build/combat-shared-dispatch-review-r1/independent-results.json
```

The assertion count includes repeated bounds and identity guards around each decoded word.
The compact artifact groups them into ten material review areas.

| Check | Direct result | Consequence |
|---|---:|---|
| Frozen report diff against `b062808` | Exit 0 | The reviewed report is the frozen subject. |
| Rev 0 ROM identity | 41,943,040 bytes; expected SHA-256 | Every decoded word belongs to the canonical target. |
| Selected owner authentication | 31 owners; 23,956 bytes; all words equal | Dispatch and helper observations agree with raw ROM bytes. |
| W6 main membership | 15 owners; 21,248 bytes | The original family table is intact. |
| W6 shared bridges | 2 owners; 344 bytes | The complete Wave 6 boundary remains seventeen owners. |
| Copy-bridge direct calls | 24 bounded; 22 from eight W6 owners | The reported incoming interface use reproduces. |
| Predicate-bridge direct calls | 0 in the bounded scan | The negative claim passes at its stated limit. |
| Direct W6 dependency graph | 17 owner sets matched | No reported internal edge was missing or extra. |
| Dispatch tables | Bounds `10`, `5`, `10`, and `7` | Every selected target remains inside its stated logical owner. |
| Frozen subject production paths | 0 changed | No source, assembly, config, tool, or test input changed. |

The three accepted model inputs retained their worker-recorded hashes:

| Input | SHA-256 |
|---|---|
| `asm/original/rev0/manifest.json` | `EE6A81334FDCFC2867BC7AF63AD56624E08C6B92D992915A45B610B44D3FCF44` |
| `config/overlays/us_rev0.json` | `D4F1FB177822334EB748D6D62B342FB813D8825FEDD912057CF651EB616A5FB6` |
| `config/phase7/conventional-build.json` | `72EECEB8CBCF25E00D4BC90F03E908714FDFFA1F2AFD72AF9ABABB4B4D75D2E1` |

## Dispatch and override result

The four-route map reproduces exactly:

| Prepared selector condition | Additional predicate | Selected accepted owner | Decisive call-site z64 offset |
|---|---|---|---|
| Byte `+0x78 == 0` | `func_0020C120 == 0` | `func_0022B1F4` | `0x0022F520` |
| Byte `+0x78 == 0` | `func_0020C120 != 0` | `func_0022C78C` | `0x0022F510` |
| Byte `+0x78 == 1` | None | `func_0022BFF8` | `0x0022F538` |
| Every other byte | None | `func_0022D14C` | `0x0022F548` |

The dispatcher calls `func_0022EF50` before loading selector byte `+0x78`.
No normal route bypasses that preparation call.
The selector is an unsigned byte view, not a closed four-value enumeration.

The flag word first tests mask `0x8`, then mask `0x4`.
Those paths call `func_0022EC08` and `func_0022EDD4`, respectively.
Their return values bypass the normal zero-return update.

All four normal routes converge on one return check.
A nonzero callee result propagates unchanged.
A zero result stores `-1` to record word `+0x68`, then returns zero.

The zero-selector predicate tests record word `+0x4C` against `0x0A`, `0x19`, and `0x7B`.
These remain observed constants without assigned gameplay meaning.

## Decisive address evidence

| Semantic name | Game meaning | Address | Address space | Evidence role |
|---|---|---|---|---|
| Mode dispatcher owner | Applies overrides and selects a normal route | `0x0022F2BC..0x0022F580` | z64 ROM range | Accepted owner boundary |
| Mode dispatcher entry | Loaded dispatcher entry for the selected slab | `0x801EBFEC` | Loaded virtual address | Call-target resolution base |
| Selector preparation call | Calls `func_0022EF50` | `0x0022F4EC` | z64 ROM offset | Establishes ordering |
| Selector load | Loads unsigned byte `+0x78` | `0x0022F4F4` | z64 ROM offset | Proves post-call selector read |
| Copy bridge owner | Copies scratch input and calls parser helpers | `0x0022257C..0x00222604` | z64 ROM range | Accepted owner boundary |
| Copy bridge entry | Selected loaded bridge entry | `0x801DF2AC` | Loaded virtual address | Direct-call scan target |
| Predicate bridge owner | Combines flags, a global byte, and helper predicates | `0x00222604..0x002226D4` | z64 ROM range | Accepted owner boundary |
| Predicate bridge entry | Selected loaded predicate entry | `0x801DF334` | Loaded virtual address | Direct-call scan target |
| Parser return consumer | Adds the copy-bridge result to the caller's running value | `0x0022EEFC` | z64 ROM offset | Proves material return use |
| EF50 table bound | Limits its table index to seven slots | `0x0022F1CC` | z64 ROM offset | Proves selected table extent |

Raw assembly comments contain obsolete loaded addresses.
The review used accepted descriptor and slab arithmetic instead.

## Bridge-interface result

The copy bridge advances source and destination pointers by 16 bytes until the source reaches `+0x50`.
Each iteration copies four words.
The total copy is therefore 80 bytes.

It calls `func_001F0E64(scratch, argument1)` first.
It then calls `func_001F197C(*(input[+0x4C] + 0x40), scratch, argument2)`.
Its epilogue leaves the parser return register unchanged.

The parser returns signed division by two and can write a `-1` terminator through a nonnull third argument.
`func_0022EDD4` adds that return to its running value immediately after the bridge call.
A void bridge declaration would therefore lose a material result.

The predicate bridge calls only these selected helper interfaces:

- `func_0020BF98`;
- `func_0020C014`;
- `func_0020BFF8`;
- `func_0020C0E8`; and
- `func_00045e5c`.

Its exact positive gate combines record flag bit 8 with input mask `0x400` as exclusive-or.
Input mask `0x8000` forces zero, and global byte zero also prevents a positive result.
On the surviving `0xFF` path, record flag bit 9 supplies the result.
Other surviving values gate the normalized low-byte helper result.

The worker report states those predicate conditions in cumulative order.
Read in that order, the bridge description is accurate.
No outgoing direct call connects this bridge to a large Wave 6 owner.

## Dependencies and preserved prior evidence

The direct Wave 6 dependency graph matched every reported owner set.
The copy bridge has 22 direct calls across the eight reported Wave 6 owners.
`func_0023431C` supplies two additional bounded direct calls outside Wave 6.

The four dispatch-table bounds decode to ten, five, ten, and seven slots.
Every selected slot targets code inside `func_0022B06C`, `func_0022D14C`, or `func_0022EF50`.
The first D14C table ends four bytes before its second table.

The preserved [W6 r3 evidence index](../../../../high-attack-wave-5/docs/matching-c/high-attack-wave6-action-mode-dispatch-r3-20260905/evidence-index.md) already records the route map and copy-bridge return.
Its SHA-256 remains `215D3E293D5E67DE3FEA241D0BA305148D65871CA972126551344031F65E1396`.
The preserved r3 AAR hash remains `A6BCFAF8DBEC99C59C7815D548DC1D2613FAD950934ECCDB81109767AC5B37C1`.

The reviewed worker correctly labels those facts as reused evidence.
Its new work supplies bounded ROM authentication, placement qualification, bridge-call limits, table bounds, and dependency navigation.
It does not present donor source as accepted production.

## Admissible findings

None. No material dispatch, override, bridge-interface, dependency, provenance, or preservation claim failed an in-scope check.

## Evidence limits

This verdict accepts bounded static research qualifications only.
It does not establish runtime reachability, residency, mode frequency, gameplay names, timing units, or original C types.

The predicate-bridge caller result is a bounded direct-`jal` negative.
It does not exclude indirect calls, data-driven calls, tail jumps, or callers outside the stated scan.

The selected helper identities depend on the accepted Combat image configuration.
Alternative overlay mappings remain candidate aliases, not contradictions.
No runtime image observation was performed.

The report's field declarations are reconstruction constraints.
They are not recovered original declarations or new canonical structure types.

No compilation, linked diff, full-ROM build, source-policy run, runtime contact, database access, or production mutation occurred.
The static result neither proves nor accepts a source match.

## Wave preservation and documentation consequence

The original Wave 6 set remains fifteen family owners plus `func_0022257C` and `func_00222604`.
All seventeen owners retain the original complete-wave `PURE_C`, ownership, placement, relocation, target-byte, and exact-ROM gates.

`func_0022B1F4` and `func_0022D14C` remain nonexact.
`func_0022EF50` remains inactive with unresolved production ownership.
The preserved B06C table evidence remains separate from production activation and complete-wave acceptance.

This verdict does not accept either bridge in isolation.
It does not shorten Wave 6 or launch a concurrent High Attack source family.
Combat may use the reviewed static package for required shared-prerequisite work under the accepted sequential scope.

The Director may add concise current navigation to the preserved W6 r3 evidence and this reviewed report.
No canonical semantic name, structural contract, matching count, source status, or family membership changes through this verdict.

## Exact route

Review state is `accepted` for the bounded static qualifications in frozen subject `b062808`.
Director `/root` may propagate the result and route later Combat shared-prerequisite work from it.
No worker correction or proportional re-review is required.
All reviewer writes are released after terminal handoff.
