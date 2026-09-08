# DB10: keep real predecessor bases local

This R12 pair records a useful HYBRID_C mechanism, not a selected match. Joe allowed minimal hybrid completion for the three unresolved W8 members. The pure-C 5BF6 reference and the earlier [two-reservation frame intermediate](combat-db10-hybrid-frame-r12.md) remain separately recoverable. Neither input here passes the target-byte gate; the complete fourteen-target W8 verifier remains required.

## Source contexts and measured effects

`sort-offset-first` is a connected descendant of the two-reservation intermediate. The real context/resource predecessor addresses are explicitly shared between the index-clear input and insertion reads. Declaring the opaque reservations before those bases restores their relative home order. Moving the ordinary sort offset initialization before the bound source-base assignment, and declaring the clear's memory ordering, restores the original six-word preheader sequence. However, two other predecessor bases now hoist outside the actor loop and acquire real stack homes.

`inner-address-tied` adds an actual nonempty-shift guard and computes each of the variant, flag10 and flag8 predecessor addresses as an unsigned machine address. A separate input passes immediately through a volatile empty tied output; the existing predecessor read consumes that output. This keeps all three bases local without explicit address instructions, fabricated references, hardcoded frame offsets or a change to the local arrays' layout. It restores the eight-home layout and frame560, but introduces three address copies and changes allocation. It is a mechanism result, not an improvement selected by the byte score.

| Input | Authored SHA-256 | Compiler-input SHA-256 | Extent / frame | Different linked bytes / words |
| --- | --- | --- | --- | --- |
| sort-offset-first | `0F3C6F72D9D72A7C2554EB2FAE5B91E0A71BD7D01DE4E659A5E3385147060F5D` | `64E1271B63C56157CA1E740C2BBD8827D90C09F70A0F95FD1005935495FC9140` | 5564 / 576 | 814 / 251 |
| inner-address-tied | `A60F6741BDB31A25E6261B7577AC3D78335E4E957689045A1738482E599E2C59` | `C6C75F9B169EB443E68E7E36A6E8F3DF16B2CC242168DE7057CBD49418BF23AC` | 5560 / 560 | 905 / 480 |

Both inputs mechanically classify HYBRID_C, have 209 actual relocations and have exact per-input pinned/tracer assembly agreement. These measurements use the retained private one-owner link, not canonical ownership or full-ROM acceptance. The accepted target extent is 5548 bytes. The larger differing-word count in the second input includes allocation changes; restoring the frame does not imply its other bytes improved.

## Why the extra homes appeared

The retained compiler's loop invariant motion uses an order-sensitive desirability budget. In `loop.c`, line1609 cumulatively doubles the same `insn_count` for previously moved candidates; line1631 compares `threshold * savings * lifetime` against that count, and line1904 reduces the threshold after a successful move. The original two-reservation input first hoists the common array base and the context/resource predecessor bases. It then rejects variant/flag10 bases as "not desirable," leaving them local.

Moving context/resource out of that candidate sequence does not merely save two computations. It allows variant/flag10 to qualify next. Those addresses were already distinct predecessor bases in the earlier CSE output; their new homes do not prove failed identity sharing or newly duplicated source objects. Constraining only those two bases in an intervening guarded control then allows flag8 to hoist. The final empty-constraint control therefore covers all three actual predecessor addresses.

The volatile output cannot itself be treated as invariant, while the adjacent C input has a short lifetime. This preserves the original local address-computation boundary. The asm-specific identity constraint is transparent about its compiler purpose; it is not a claim about the original C spelling. An unknown initial value reported for the separate actor-index asm does not establish the cause of the extra homes.

## Remaining question and retained evidence

The resulting three copies motivated consuming each constrained transient base immediately in its real backward cursor. That is a subsequent source experiment, not part of this pair. Exact allocation/order and complete target bytes remain unresolved here. A worse candidate score does not disprove the demonstrated home-locality mechanism.

Retrieve these archived sources and their relations with `node tools/match.js intake func_0020DB10 --limit 50 --json`. Ignored source, policy and private results are under `build/combat-draw-wave8-r12/db10/<input>/`; authenticated dumps are under `build/combat-draw-wave8-r12/db10-traces/<input>/`. The retained compiler source is under `build/combat-db10-allocation-trace-r1/compiler/`.

| Input | Private result SHA-256 | Trace analysis SHA-256 |
| --- | --- | --- |
| sort-offset-first | `46C725B3C701C8E82B94430775EDE676EAF4D83C5E540BF4BF4D737790A65269` | `02CE3F7B20488F32B7337FB206B46881707F4AC742891FF724D31676024612E6` |
| inner-address-tied | `171906BB3CB65448726AC0492330EC80A1AD52440C7460BAC4797B531A967F63` | `357EE97AB4477AB577EA582D2BCFADED1B44A5B8652413AA3CA2BA4C9DE299EC` |

In the first input, the accessed variant/flag10 homes are508/516. In the second, only460/468/484/492 are accessed;476/500/508/516 remain non-emitting homes. These offsets describe compiler evidence for these exact inputs and are not constants inserted into the authored assembly.
