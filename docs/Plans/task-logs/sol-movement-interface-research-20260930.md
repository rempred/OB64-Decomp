# Movement interface research, 2026-09-30

Status: bounded static gate evidence ready for independent review. Original ASM remains production for the six interfaces below. Exact instruction probes are research, not matching-C acceptance.

Joe's five-family assignment authorizes the complete twenty-member W5 scope. The prerequisite remains the [family map's movement gate](../../../../docs/Plans/squad-construction-family-map.md): close `func_0012B1C4` and `func_0012D6FC`, then review `func_00107D60`, `func_00107E38`, `func_0011AB74` and `func_0011AECC` together before movement source conversion. This review concerns that existing interface gate; ordinary matching acceptance still uses the complete wave's canonical verifier.

## Complete bodies and producers

Current authenticated target metadata and the full original word census agree:

| Interface | Physical owner | z64 interval | Live entry | Owned bytes / words | Frame |
|---|---|---|---|---|---|
| `func_0012B1C4` | p2415 | `0012B1C4..0012B440` | `801D6A84` | 636 / 159 | 64 |
| `func_0012D6FC` | p2420 | `0012D6FC..0012DA10` | `801D8FBC` | 788 / 197 | 40 |
| `func_00107D60` | p2240 | `00107D60..00107E38` | `801B3620` | 216 / 54 | 32 |
| `func_00107E38` | p2241 | `00107E38..00108500` | `801B36F8` | 1,736 / 434 | 168 |
| `func_0011AB74` | p2322 | `0011AB74..0011ABD4` | `801C6434` | 96 / 24 | 48 |
| `func_0011AECC` | p2326 | `0011AECC..0011B344` | `801C678C` | 1,144 / 286 | 160 |

D6FC's descriptive 1,072-byte header is stale; its complete 197-word interval is 788 bytes. E38 has 1,728 executable bytes followed by eight original zero bytes, all owned by p2241. Neither discrepancy authorizes a new boundary, filler or discarded tail. Its separate 32-byte [table_00142810](../../../asm/original/rev0/lib/table_00142810.s) contains eight original pointers to internal E38 cases. The switch load at z64 `0010804C` addresses live `801EE0D0`; the eight entries point to `801B3918`, `801B3970`, `801B3988`, `801B39E0`, `801B39F8`, `801B3A10`, `801B3A54`, `801B3A6C`. Keep that original data owner; a C table/native-producer activation requires its applicable structural gate.

The twenty assigned owners were cross-checked before tuning. `func_00131828` is a 492-byte physical-owner envelope with five already accepted callable bodies: `00131828` (288), `00131948` (60), `00131984` (60), `001319C0` (48), `001319F0` (36). A future producer must cover all five under that one owner. The accepted movement consumer remains `0012BC64..0012C788`; no wave or body is shortened.

## Geometry interface

The original call at z64 `0012C3AC` in `func_0012BC64` supplies four words: owner in a0, an unused word in a1, unit in a2, and a three-float point at stack `+0x50` in a3. The caller does not consume v0. The second input is unused throughout the complete body; no pointee or meaning is assigned to it.

B1C4 captures unit float `+0x1C` before testing owner mask `0xC000` or unit mask `0x00010000`. It uses unit floats `+0x08/+0x10` and point `[0]/[2]`, both ordered zero-direction cases, the two original double constants and `func_8009CFE0(dz, dx)`, negative and positive normalization loops, the bitwise conjunction of both zero tests, owner float `+0x18`, and the signed counter at unit `+0x88`. The nonzero counter restores the captured float, decrements the counter, and resets it to five outside `0..5`; zero resets to five. Every path calls the protected `func_00106CE0(&unit[0x18], &unit[0x1C], 1.0f)` float interface. No flag meaning, angle name, runtime residency or coordinate domain is strengthened.

The [full baseline](../../archive/matching-c-candidates/2026-09-30-func_0012B1C4-b19101df73.c) covers both calls and every branch but emits 608 bytes/frame64. The [selected readable source](../../archive/matching-c-candidates/2026-09-30-func_0012B1C4-7c56d67d80.c), observation `D47415089355DF0AB60B50B9804EF8947311B7D31BB39827349EA7CFA5C13DB3`, emits 636 bytes/159 instructions/frame64 with zero relocation-masked raw word differences under unchanged cc1 and the accepted repaired assembler. A cached positive-loop accumulator, actual path-local step assignments and separate ordered counter guards explain the required source shape. This has not passed canonical linked ownership/relocation or the twenty-member final verifier.

## Auxiliary interface and route handoff

The direct original call at z64 `0012C3C8` in `func_0012BC64` passes unit, a byte loaded from source `+9`, and a word-state pointer from stack `+0x6C`. It does not consume v0. D6FC's complete body uses only that selector's low byte; the research prototype uses `u8` and widens its row offset before shifting six. This does not establish a table capacity or a universal source-record meaning.

The auxiliary is the complete 64-byte allocation published at unit `+0xA0`. Its numeric layout is:

| Offset | Observed creation or use |
|---|---|
| `00 / 04` | Unit word `14` and indexed unit word `54 + 4*unit[24]` |
| `08 / 0C` | Zero, later E38 unsigned lower-bound comparisons |
| `10 / 14` | Literal 63, later E38 unsigned upper-bound comparisons |
| `18` | Metadata pointer `801F0D98` |
| `1C` | Allocation of signed dimension product `DA8 * DAC`; E38 uses bytes |
| `20` | Allocation of `DA8 * (DAC << 2)`; E38 uses four-byte costs |
| `24` | Separate allocation of the same size; four-byte predecessor entries |
| `28 / 2C` | Zero at creation; E38 running/current-node state |
| `30` | Allocation of `DA8 * (DAC * 12)`; E38 uses twelve-byte queue entries |
| `34 / 38` | Untouched at creation; initialized by E38 |
| `3C` | Zero; E38 also supports an optional byte-mask pointer here |

When unit `A0` and `*state` are zero, D6FC allocates and initializes the auxiliary, then publishes both globals even if allocation failed: `801F0DB4 = 801F36D8 + 64*selector` and `801F0DB0` from the four-byte pointer bank with selector byte at `800E7AC3`. The equivalent flat bank base is `800E7A90`, selector offset `+0x33`; no entry count is inferred. A successful four-buffer check reloads unit `A0`, calls E38, and sets `*state = 1`. Failure frees each nonnull buffer and clears its field, then conditionally frees/clears the current unit `A0` allocation.

For an existing auxiliary, nonzero `28` and zero `*state` call E38 and set state. Otherwise an existing unit `68` dispatches `func_0012C788(byte_800E7AB9, unit, 5, 1)`. With no `68` buffer, `func_00107D60(unit[14], unit[54+4*unit[24]], auxiliary[24])` supplies the pointer. A nonnull result is published at unit `68`; all four auxiliary buffers are freed and cleared; AECC is called; unit word `6C` becomes one. All 18 original call sites are covered: five allocations, nine frees and the four route interfaces. No additional error guard or reordered publication is introduced.

The [typed baseline](../../archive/matching-c-candidates/2026-09-30-func_0012D6FC-93f69d038d.c) emits 772 bytes/193 instructions/frame40. The [flat one-word frontier](../../archive/matching-c-candidates/2026-09-30-func_0012D6FC-2f7b79ba6f.c) restores 788/197/frame40, leaving one reversed ADDU operand pair. GoldOx mail515 explained named-anchor CSE commutation. The [byte-bank shift counterexample](../../archive/matching-c-candidates/2026-09-30-func_0012D6FC-fc1f786807.c) has eleven raw differences; [multiplication by four](../../archive/matching-c-candidates/2026-09-30-func_0012D6FC-19b778f211.c), observation `F7FAD760E1A1539B46ED954F3B0316743FBC4B7A77323DBAD1038A23E651906E`, lets CSE form the shared symbolic base and independently restores all 197 raw instruction words at frame40. The symbol-plus-`0x33` relocation and canonical sole-owner gates still require proof. This is no tooling defect, compiler exception or matching acceptance.

## Four route interfaces reviewed together

`func_00107D60` receives two full words and a predecessor pointer, and returns a newly allocated word list terminated by `-1` on its normal path. If the endpoints agree, its count is one. Otherwise it follows four-byte predecessor entries backward and counts from two. A predecessor `>= 0x1000` invokes the diagnostic at `00107DAC`; if that call returns, the instruction at `00107DB4` (`0806CD9D`) jumps to its own accepted live address `801B3674`, with a NOP delay slot. This failure path stays in a self-loop and does not reach allocation. The other path allocates `(count+1)*4`, writes the terminator, and fills the list backward from the requested endpoint. It has no allocation-null guard or negative-predecessor rejection in the original body. Calls at `0012663C`, `0012D68C` and `0012D9A0` in F84/D170/D6FC consume the normal returned pointer; preserve those conditions and the original diagnostic/self-loop behavior.

`func_00107E38` receives one auxiliary pointer; a1 is not an input in its complete body. Metadata `+10/+14` supplies signed dimensions and `+18/+1C` supplies byte-map/halfword-table pointers, agreeing with D6FC's published metadata globals. Its dimension-product initialization sets byte flags to zero and four-byte cost entries to `0xFFFFFFFF` (`00107EC8`, `00107ED4/ED8`); it subsequently sets the start-node cost to zero at `00107F10`. For exactly 4,096 twelve-byte queue entries, its strided writes initialize only halfword `+4` to `0xFFFF`; the other bytes are not cleared by that loop (`00107F14..00107F20`). Entry zero is then initialized separately with halfwords `+0/+2/+4 = 0xFFFF` and word `+8 = 0xFFFFFFFF`, after initializing queue state. It then evaluates all eight direction cases through the original separate table. It preserves unsigned auxiliary bound checks, halfword `0xFFFF`, byte masks, predecessor/cost writes, and the three original queue-helper calls. It returns word zero for a suspended batch and word one for completion/exhaustion, resetting the original 90 counter as encoded. All three current callers F84/D170/D6FC discard that return and set their own state word to one; do not turn that state assignment into a test of the return. The fixed initialization and dynamic allocation dimensions are preserved; their runtime range relationship is not proven here.

`func_0011AECC` receives a unit pointer and reads the `-1`-terminated list at `+68`. It counts entries and returns early for fewer than three. Otherwise it allocates a 32-byte record and five count-sized four-byte arrays, initializes floats from unit `08/10`, converts later route entries through the original `func_0011ABD4` interface and metadata bounds, and preserves its signed quotient/remainder arithmetic. The final endpoint selects unit `4C/54` only for the original byte91/word84 condition, otherwise the indexed unit `28/30` fields. It builds cumulative distances with the original double square-root fallback, normalizes them, invokes the two coefficient calls and original interpolation/distance calls, sets record `1C` to zero and its encoded step at `18`, then publishes the record at unit `A4`. Preserve all 13 calls, the original diagnostic and unchecked subordinate allocations. Known callers overwrite v0 after return; that is a caller-use fact, not a universal return-value claim.

`func_0011AB74` receives float f12, the unit in a1, and output pointers in a2/a3. It reads unit `A4`, forwards record `08` in a3 and fields `00/04/0C/10/14` in the five outgoing stack slots to the protected `func_0011A9B8` interpolation interface. Its callers at `001254CC` and `0012C804` use the output floats and do not consume v0. Preserve the mixed float/pointer ABI and the observed repeated unit `A4` reads; do not replace this with an integer-first ABI.

The retained exact hybrid `func_0011B344` remains the cleanup interface; SDK/memory helpers, `func_00106CE0`, `func_0011ABD4`, interpolation/coefficient helpers, deferred scripted owners and external field users stay protected. Static complete-body/caller agreement is sufficient for a bounded source contract proposal; it proves neither runtime reachability/residency, all allocation outcomes, larger capacities nor complete discovery.

## Next gate and acceptance

Request independent review of this existing static movement-interface gate. On acceptance, continue ordinary matching within Joe's full twenty-member wave, preserving accepted owners, original fallback sources and the separate E38 table/tail gate. Neither these two exact instruction probes nor six reviewed interfaces shrink that wave. Run its one canonical final verifier only after every assigned producer and applicable gate is ready. The latest AD0/28050 production additions also remain provisional; the earlier structural audit does not verify the entire current checkout.
