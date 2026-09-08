# DB10: exact hybrid after real-cursor reconstruction

Joe explicitly allowed minimal HYBRID_C exact completion for the three unresolved W8 targets. The final R12 source retains readable C and one explicit `move` instruction, two fixed-register bindings and three empty templates. It does not count as matching C. The earlier [5BF6 pure-C reference and frame intermediate](combat-db10-hybrid-frame-r12.md) remain available for later conversion.

## Source and development proof

Final authored SHA-256: `9F388B973CA8BA7937495B5438A3D2E94A32B064C26132A823F769591CB07274`. Compiler-input SHA-256: `D2DC36CC1E0718535997A08FA6FD6148D85406B6DE6FD28EAAA26FB5E21D8C9F`. The mechanically classified HYBRID_C source produces the original 5548-byte extent, frame560, zero differing linked bytes/words and 209 actual relocations in the private check, with exact pinned/tracer agreement.

The final canonical focused check also passes: sole `objects/c/func_0020DB10.o` contribution to `.ob64.r3922`, no assembly fallback or fill, exact placement, exact target bytes and all209 relocation words. The existing relocation contract matches without a DB10 linkage edit. Linked and expected SHA-256 are both `A47D14C3227F9FAD494097A03496A8759DE3C1A19E00324012CD541C53732EB7`. The command completed in about105.84 seconds with two compiler invocations and600 sibling cache hits. Its report SHA-256 is `EC0A7D5124CC48E7859BD0F227E67C3AC4A5402B639B4A6AD735C6929F3CD2E4`, at `db10/hybrid-readable/focused.json`. The selected source is provisional at this record; the one combined W8 verifier is the remaining acceptance gate.

The four accessed homes are460/468/484/492;476/500/508/516 are non-emitting homes. These are measured compiler results, not authored stack-offset constants. The current implementation is [func_0020DB10.c](../../../src/lib/func_0020DB10.c); retrieve its exact archived source and related experiments with `node tools/match.js intake func_0020DB10 --limit 50 --json`.

## What made the source exact

The actual context/resource predecessor values are shared between preheader preparation and insertion reads. Their declaration order relative to the two opaque reservations preserves the required homes. The one explicit instruction clears the real actor index after those bases have been prepared; its memory boundary keeps the compiler-owned stores before the clear.

The [local-base pair](combat-db10-local-base-pair-r12.md) demonstrates why an intermediate gained extra homes: removing two invariants from the compiler's candidate sequence allowed neighboring addresses to hoist. Guarded empty constraints restored locality but introduced copies. Consuming each transient predecessor base immediately in a real backward cursor removed those copies. Ordinary C then retained the required induction and allocation history while the temporary address constraints were removed.

Unsigned machine-address cursors avoid constructing C pointers before the arrays. They are dereferenced only within the actual nonempty-shift guard; each predecessor access has shift at least one. The arrays, real memory accesses and surrounding calls remain independently reconstructed C. No aggregate-layout assumption, hardcoded reload home, fabricated read or compiler-output rewriting is used.

## Bounded assembly minimization

The first private exact input was `26F2F6BF5E60290062E45F716A8CE4E9CD25B88F3BB2459F557615D86F7C1776`. Sequential reductions removed all three transient address bindings and both load-input points. The final binding-removal controls still regress: removing source register22 adds one instruction; removing resource cursor register5 changes six words. Removing the preheader memory boundary changes two words. Removing the final saved-register exclusion loses the reserved home and produces frame552; excluding register30 was unnecessary and was removed.

The remaining two opaque scratch values are assembly-owned lifetime reservations, not purported original C fields. Their empty definition, saved-register exclusion and final input retain one extra non-emitting home without accessing a dummy object or emitting padding. One reservation alone had stayed in register30 in the earlier measured context. Comments beside the source explain the purpose of the remaining assembly. This is practical minimization in the measured contexts, not a proof of global minimality.

The original pure-C history behind the unused home and preheader ordering remains unresolved. The successful cursor representation does not establish that the retail function inherently required assembly. Final classification remains HYBRID_C, and full-wave ownership/ROM acceptance must be checked separately.

Ignored evidence is under `build/combat-draw-wave8-r12/db10/hybrid-readable/` and `db10-traces/hybrid-readable/`. Private result SHA-256: `BC269B39BE2694F324FC7F5BA7B049BBFA5BC18A2BF326D078701B5F3057EFDF`. Trace analysis SHA-256: `AFF476DD82DB464BCEE384E284178D0C648AEF62804D2AC7E516EE90AEF8AAF7`. `db10-minimization.json` and the named `min-db10-*` directories retain the source-specific reduction controls; bulk compiler and ROM evidence remains untracked.
