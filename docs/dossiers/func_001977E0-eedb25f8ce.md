# func_001977E0: shop-widget-pointer-reloads-complete-extent

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `EEDB25F8CE9680CCBD63D9015C75FA52E1148B7E243F95DC4D9DB13F25576E8F`
- Observation: `A1ED2E9930CB00426A4E399ECB6F997429441837AB66D4D43DC49E52B244152E`
- Source: [exact C](../archive/matching-c-candidates/2026-09-29-func_001977E0-eedb25f8ce.c)
- Metadata: [curated observation](func_001977E0-eedb25f8ce.observation.json)

Exact text/frame and most retail state intervals from shared tick and independent widget-pointer reloads; broad nonexact code remains.

## Source context

The shared-tick source aligns most state entries but is six terminal instructions short. Retail checks the widget pointer, then reloads the same global pointer for each motion-direction field read and again for the final rectangle call. The former local widget pointer lets the compiler reuse the initial read.

Read the widget field and final rectangle-call pointer through an independent global view of the same observed address, while retaining the local pointer for null checks. Keep the shared tick tail and explicit state-1 maximum merge.

## Recorded observation

Pinned compiler output restores the six missing terminal instructions without moving any state entry: full text 4580 bytes/1145 instructions, 112-byte frame. Authenticated watch EEDB25F8CE9680CCBD63D9015C75FA52E1148B7E243F95DC4D9DB13F25576E8F classifies PURE_C with zero expected-only and actual-only instructions, 2681 differing symbolic bytes, and score 57.79. States 0-4 and 13-15 start at retail offsets; only state 5 is four bytes short, state 9 four bytes short, and the shared 10-12 interval eight bytes long.

## Remaining failure

A text-length match and improved symbolic score do not establish linked target bytes. The object still differs broadly in opcodes, register allocation, and control flow, and the 16-entry switch table has no approved auxiliary C ownership contract. The independent widget-pointer name is a compiler-shaping alias for the same physical global, not proof of original naming. Original ASM remains production; no completed-wave verifier has run. A common flag-store source experiment shrank the tail and was not selected.

Research role: emitted-best; selected emitted best: true.

Replay: `node tools/match.js probe func_001977E0 --source docs/archive/matching-c-candidates/2026-09-29-func_001977E0-eedb25f8ce.c`. Check the metadata's expanded/header identities before interpreting its dumps.
