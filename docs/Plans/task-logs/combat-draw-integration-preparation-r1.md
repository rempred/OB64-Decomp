Completed: the complete draw-integration owner is authenticated and described for W8 reconstruction. All 1,387 instruction words match the canonical normalized ROM. The note preserves construction, work-list ordering, and integration dependencies. The Director next retains this preparation for the future W8 source worker, after W7's complete prerequisite gate.

Assignment: `COMBAT-DRAW-INTEGRATION-PREPARATION-20260907-01`, revision 1. Worker: `/root/compilation_groups_design`, Astra Medium. Director: `/root`, native task `01a07262-aeca-7341-ad10-2dba705ff988`, local. Starting HEAD: `7131b25db325ad3e48d304769591a6fbac21cd00`. The fresh claim was created atomically before other writes.

## Authority and authentication

The unchanged input package is `build/combat-draw-inputs-r1/w8-inputs.json`, SHA256 `4340C97DE145E1970D62F909B443894ACECFF3742F544D9BB41CCE0A9263025D`. Its extraction baseline is `d70fd853fdffacf71290b24763e010a549276a55`. The R2 citation correction applies; the incorrect R1 paragraph is not authority.

All production source, type, manifest, and configuration references came from Git blobs at `0e1191013aeebed2929c9caff7c1f139169ad7f3`. Mutable W7 source, configuration, and compiler output were excluded. The other helper's draw-entry reconstruction was not inspected or repeated.

| Item | Authenticated value |
|---|---|
| Complete original owner | `asm/original/rev0/lib/func_0020DB10.s` |
| Accepted owner row | 3922 |
| Bytes / instruction words | 5,548 / 1,387 |
| z64 ROM range, exclusive end | `0x0020DB10..0x0020F0BC` |
| Accepted RAM range, exclusive end | `0x801CA680..0x801CBC2C` |
| Original source SHA256 | `4493C58ABF102557B2E89D98021B18968903F706B3D983227497CD101379E2FE` |
| Owner instruction-byte SHA256 | `A47D14C3227F9FAD494097A03496A8759DE3C1A19E00324012CD541C53732EB7` |

The original source equals the production-baseline blob and manifest identity. Descriptor 10 maps the complete owner. Every instruction word equals the corresponding normalized ROM word. The source v64 SHA256 is `6CA0A1AFE224831E202857AD64EF26BD429A034A4EA48404BB09621641A07B12`. In-memory normalization yields z64 SHA256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Original branch comments retain stale decode addresses. The evidence listing computes branch targets from instruction immediates and accepted placement. Every conditional target remains inside this owner. This is an annotation limitation, not evidence of a boundary defect. Direct calls were decoded independently; all 43 sites agree with the input package.

## Reconstruction shape

The accepted callers declare `void func_0020DB10(int selector)`. `func_001F2134` forwards its selector; `func_001F309C` calls with zero. The owner saves its argument and later tests only whether it is nonzero. It does not return a constructed pointer. The frame is `0x230` bytes and saves `s0..s8` plus `ra`.

Use three main phases while retaining all their distinct subpaths:

| Phase | z64 ROM span | Required behavior |
|---|---|---|
| Scene submission setup | `0x0020DB10..0x0020DB6C` | Initialize scene-relative four-word record and submit its address |
| Optional first construction pass | `0x0020DB6C..0x0020E478` | Five source slots selected by `D_801976E8`, gated by `D_801976D9` |
| Second construction pass | `0x0020E478..0x0020ECE8` | Five source slots selected by `D_801976DC`, continuing the output record position |
| Deduplicate and sort work | `0x0020ECE8..0x0020EEC8` | Scan twenty actor records, build six parallel arrays |
| Materialize grouped work | `0x0020EEC8..0x0020EF74` | Submit equal-key runs, then shared and supplemental initialization |
| Per-record policy integration | `0x0020EF74..0x0020F024` | Scan twenty records with flags and supplemental lookup |
| Repeated per-record update | `0x0020F024..0x0020F08C` | Call `func_001F114C` ten times for each present actor |
| Epilogue | `0x0020F08C..0x0020F0BC` | Restore the full frame and return |

Here “actor” follows the input package's actor-input terminology. Offset names below describe storage, not newly accepted field meanings.

## State and source-record widths

`D_801CE8BC` is the scene root. Accepted caller C allocates and clears `0x6094` bytes. Actor records begin at scene `+0x1C4`, with stride `0xF8`. Presence tests read record `+0x48`, equivalently scene `+0x20C + index*0xF8`. Twenty records are scanned in the final phases.

At entry, scene `+0x5124` receives pointer-valued word `0x801CA534`. The next three words receive `-0x11D0`. `func_001F0F6C` receives the address of this scene-relative record. Existing helper C appends its argument to a scene queue; this call must not be described as freeing memory.

Both source selections index `0x19`-byte records at RAM `0x801971F0`. Accepted `func_00201108` already describes this source as `SourceRecord { u8 bytes[0x19]; }`. The owner reads slot ID at `+2+slot` and byte token at `+7+slot`. It reads both as unsigned bytes. Each construction pass resets a separate zero/one latch.

Selectors below 30 use a `0x38`-byte source row at RAM `0x80193BC0 + id*0x38`, with auxiliary base `0x80190F80`. Other selectors use a `0x34`-byte row at `0x80195560 + id*0x34`, with auxiliary base `0x801953F0`. The stride distinction is explicit arithmetic. Do not reuse the unrelated `ClassEntry` or `CombatPosePoolRecord` layouts for these rows or `0xF8` actors.

The second pass additionally reads unsigned halfword `D_80197B60`. If bit `0x8000` is set, it processes only slot zero. Empty slot IDs are skipped without consuming an output actor record.

The float globals are RAM `0x801976EC` for the first pass and `0x801976E0` for the second. Each is loaded as float, converted to double, then tested against three half-open bands: `[0.208,0.375)`, `[0.375,0.625)`, and `[0.625,0.791)`. Preserve the double constants and comparison order. A float-only approximation is not justified.

Within those bands, the byte token indexes tables at RAM `0x801CFC98`, `0x801CFCA4`, or `0x801CFCB0`. Their first nine bytes are respectively `6,3,0,7,4,1,8,5,2`; `8,7,6,5,4,3,2,1,0`; and `2,5,8,1,4,7,0,3,6`. Outside the bands, the original token remains. The evidence captures bounded twelve-byte windows, not newly accepted table extents or input bounds.

## Actor construction details

For IDs below 100, the owner requires source-row halfword `+0x18` to be nonzero unless the function argument is nonzero. The smaller-selector path clears the actor's complete `0xF8` bytes and copies fields inline. The larger-selector path calls `func_0020C908(actor,id)`.

The inline copy uses these exact widths and mappings:

| Source-row storage | Actor destination | Width/conversion |
|---|---|---|
| `+0x11`, `+0x12` | `+0x48`, `+0x4C` | Unsigned byte widened into word |
| Current source ID | `+0xF6` | Byte |
| `+0x13`, `+0x1A` | `+0x31`, `+0x33` | Byte |
| `+0x16`, `+0x18` | `+0x22`, `+0x20` | Unsigned halfword |
| `+0x1C..+0x26`, step two | `+0x24..+0x2E`, step two | Unsigned halfword |
| `+0x28` | `+0x30` | Byte |
| `+0x1B` | Both `+0x3F` and `+0x34` | Byte |
| `+0x2A..+0x30`, step two | `+0x36..+0x3C`, step two | Unsigned halfword |
| `+0x32`, `+0x35` | `+0x3E`, `+0x32` | Byte |

Actor word `+0x4C == 1` causes byte `+0x3E` to be cleared. Source byte `+0x33` bit 1 sets actor word `+0x40` bit `0x200`. Its bit 2 sets actor bit `0x2`. These bit tests are distinct from the later per-pass `0x500` modification.

Scene byte `+0x6084` and actor bit `0x2` control suppression paths. Some paths clear the actor and skip slot consumption. Retain the exact branch targets in `owner-words.txt`; do not merge all suppression paths with successful construction.

For IDs at least 100, the gate instead reads unsigned halfword at auxiliary base `+2*id-0xC4`. The actor initializes from source row zero or `func_0020C908(actor,0)`. It then restores the actual ID at actor `+0xF6`. It overrides halfword `+0x20` from that auxiliary lookup and `+0x22` from auxiliary `+2`. Auxiliary byte `+id+0x90` bit 2 can set actor bit `0x2`.

After token selection, the first pass sets actor bits `0x500`; the second clears them with mask `~0x500`. Unsigned division/remainder by three produces actor words `+0x54` and `+0x58`. The first pass stores remainder and quotient. The second stores `2-remainder` and `8-quotient`. Preserve intermediate byte truncations. The `0xAAAAAAAB` multiply sequence is compiler evidence for unsigned division, not a requested handwritten expression.

The first pass has additional ID behavior: actor word `+0x48` values `0x87`, `0x88`, or `0xA1` use the original slot token. For `+0x48 == 0x87`, it submits the first actor's pointer fields, consumes another actor slot, and invokes the extra construction path. That path calls `func_0020C908` and `func_0020CBDC(actor,1)`, then clears actor `+0x70` and `+0x6C`. Preserve the extra output-record count independently of the five-slot input counter.

The body constructor is `func_0020CBDC(actor,mode)`. Its retained prologue consumes actor and the second argument; unrelated live argument registers are not extra interface evidence. Ordinary-ID paths use mode zero, the extra path uses one, and auxiliary-ID paths use the per-pass latch.

Four inline twenty-record searches locate a present peer with actor bit `0x200` and the pass's required bit-8 polarity. The first pass requires bit 8 set; the second requires it clear. If the peer differs from the current actor, has word `+0x4C == 0x21`, and lacks bits 0 and 1, another update occurs. It calls `func_0020D434(actor[+0x58])`, then RAM helper `0x8016E338` with the low bytes of `+0x48`, `+0x4C`, and the helper result. The low result byte plus one becomes word `+0x70`.

Actor bit `0x200` plus a low-byte result of two from RAM helper `0x8016DEC4` sets the per-pass latch. The owner also loops over three word pointers at actor `+0,+4,+8` and `+0xC,+0x10,+0x14`. Nonzero values go to `func_001F0F6C` and `func_001F102C` respectively. Their accepted C appends to separate scene queues. Do not rename these submissions as deallocation.

## Work-list and integration order

The work-list phase scans twenty present records. RAM helper `0x8016FA34` receives unsigned halfwords `+0x36,+0x38,+0x3A,+0x3C`. The owner masks its result to sixteen bits. It also extracts actor flags at bits 10 and 8.

The stack contains six parallel word arrays, spaced `0x48` bytes apart. The observed bases are `sp+0x18`, `+0x60`, `+0xA8`, `+0xF0`, `+0x138`, and `+0x180`. This spacing supports eighteen words per array in the frame, not a new global actor-count limit.

The arrays store actor `+0x48`, actor `+0x4C`, the `func_002015C8` result, the sixteen-bit helper result, flag bit 10, and flag bit 8. Duplicate detection compares `+0x48`, helper result, and the two flags. It does not compare `+0x4C`. Preserve that exact key.

For a new tuple, `func_002015C8` receives `(actor[+0x48], actor[+0x4C], flag10, flag8)`. Accepted helper C returns a twelve-bit resource value in an `int`. This owner sorts that result with unsigned comparisons. Insertion shifts all six arrays together and retains equal-key ordering.

The materializer receives equal-resource runs. Its arguments are pointers into arrays for `+0x48`, `+0x4C`, flag8, flag10, sixteen-bit helper result, then run length. The fifth and sixth arguments are stack arguments at `sp+0x10` and `sp+0x14`. These calls are `func_00207658` at ROM `0x0020EF48`.

Preserve the literal grouping-loop bounds. At `0x0020EF10`, the run counter is compared with the total work count while the load index uses start plus run. The evidence does not justify replacing this with a conventional remaining-count bound. Actual valid-state constraints and exact C expression remain for the source worker; no storage assumption or out-of-range experiment is proposed.

If work count is zero, the owner skips the materialization and subsequent per-record integration/update block. Otherwise the required order is:

1. All grouped `func_00207658` submissions.
2. `func_002073CC(5,0)` at ROM `0x0020EF64`.
3. `func_0021088C()` at `0x0020EF6C`.
4. Scan twenty actors. Skip absent actors and actors with flag bit 1 set.
5. Call `func_0021062C(actor[+0x48],actor[+0x4C],4)`; skip a nonzero result.
6. Call `func_0020C014(actor)` to choose the side-status byte near `D_801976E8` or `D_801976DC`.
7. If that status byte's bit 1 is set, set actor flag bit 2 and call `func_0020FC7C(actor)`.
8. Call `func_00210930()` at `0x0020F01C`.
9. Scan twenty present actors and call `func_001F114C(actor)` ten times each.

The five supplemental-interface records for `002073CC`, `0020CBDC`, `0021062C`, `0021088C`, and `00210930` retain their package scope. This note does not accept a broader visual meaning for their tables or keys.

## Interfaces and matching cautions

The evidence JSON lists all 43 calls in owner order, their delay-slot operations, and descriptor-10 owner identities. Calls outside that descriptor retain their RAM identifiers and existing package aliases. In particular, RAM `0x80093380` has accepted alias `func_00023780`; its calls clear exactly `0xF8` bytes here. No new global alias was created for the three RAM helpers at `0x8016DEC4`, `0x8016E338`, and `0x8016FA34`.

Keep word flags, unsigned byte inputs, unsigned halfword copies, and signed argument truth testing distinct. Accessing `+0x4B/+0x4F` reads the low bytes of big-endian words `+0x48/+0x4C`. Do not substitute host-endian byte assumptions. The accepted scene declaration remains opaque; this task creates no new shared type.

The duplicated construction blocks, repeated null checks, alias-sensitive global reloads, byte truncations, double constants, and branch-likely delay slots all matter to matching. The note identifies their presence without prescribing artificial lifetimes. Keep actor-slot counters, source-slot counters, latch state, unique-work count, and run counters separate.

## Delivery and limits

`build/combat-draw-integration-preparation-r1/inspect.js` passed the full owner/ROM comparison, descriptor placement, complete word sequence, branch containment, and all 43 package call checks. Evidence is `build/combat-draw-integration-preparation-r1/evidence.json`, SHA256 `7F0FF78ECAF3171D283534F9EAA5CDF77038703FC7D50CD6F05AF5E51912BA0E`. `owner-words.txt` contains the complete corrected address ledger. Baseline C/header copies under the same ignored root have `.txt` suffixes and are reference material, not candidates.

No boundary, field meaning, helper behavior beyond cited static/accepted evidence, or matching result is newly accepted. No candidate C, compiler, build, verifier, source-policy, runtime, capture, database, production edit, agent, or Git mutation occurred. Only the assigned claim/report and ignored root were written. All writes are released at handoff.

All fourteen original W8 members remain intact. W7 prerequisites, shared obligations, and the later thirteen-target supplemental wave remain separately retained. The future source worker independently reconstructs this full owner and establishes the existing complete-wave gates. This ordinary preparation adds no independent matching review.
