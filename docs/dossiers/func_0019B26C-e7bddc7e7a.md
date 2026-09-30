# func_0019B26C: shop-quantity-value-producing-cap

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `E7BDDC7E7AEA6E4ED6103857CCD764C6E91A5C435F9265535CC4790D2BF9261B`
- Observation: `781AFDEEC012F329726CC8BCD699C27DF20DD16711DD305DAAD6FCE224E2D6BD`
- Source: [exact C](../archive/matching-c-candidates/2026-09-30-func_0019B26C-e7bddc7e7a.c)
- Metadata: [curated observation](func_0019B26C-e7bddc7e7a.observation.json)

Value-producing cap restores the complete retail quantity-helper tail; utility-wave final gates remain required.

## Source context

The full-owner in-place-cap control has branch-local prices, word-sized slot-clamp temporaries, 584-byte extent and the original frame. Original assembly and the func_0019A294 caller support u16 item ID, byte kind and byte quantity result.

Replace each final in-place cap with quantity = quantity * price > 99999 ? 99999 / price : quantity, retaining distinct branch-local price lifetimes and reload of the first table price after the slot call.

## Recorded observation

Pinned compiler emits the full 600-byte/150-instruction owner and 32-byte frame. The canonical focused diff reports PURE_C, exact decoded rows, zero differing linked words/bytes, sole .ob64.r3079 C contribution and zero fallback. All 22 actual object relocations have exact linked retail words and were recorded under the existing contract rules.

## Remaining failure

This provisional source still requires its recorded relocation-contract rerun and the combined final verifier for the unchanged three-member shop utility wave before matching-C acceptance.

Research role: emitted-best; selected emitted best: true.

Replay: `node tools/match.js probe func_0019B26C --source docs/archive/matching-c-candidates/2026-09-30-func_0019B26C-e7bddc7e7a.c`. Check the metadata's expanded/header identities before interpreting its dumps.
