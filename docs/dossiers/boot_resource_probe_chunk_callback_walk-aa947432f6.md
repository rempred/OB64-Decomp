# boot_resource_probe_chunk_callback_walk: unqualified-callback-and-fixed-byte-control

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `AA947432F6EA22016E5FB08722E6904E138712B046F48B47F68D4E33CF9AD777`
- Observation: `B400CC5F3AC23D0F2B7ECC2902F62E748D20B1E86E837D21DC0CD9A0C1BBB48D`
- Source: [exact C](../archive/matching-c-candidates/2026-10-07-boot_resource_probe_chunk_callback_walk-aa947432f6.c)
- Metadata: [curated observation](boot_resource_probe_chunk_callback_walk-aa947432f6.observation.json)

unqualified-callback-and-fixed-byte-control

## Source context

Full152-byte chunk-walk owner; independently derived allocate/store/read/32-chunk-indirect-loop/free source. Fixed-byte input is an external address binding, not C-owned storage.

Initial source uses an unqualified callback field and unqualified external byte declaration.

## Recorded observation

PURE_C emits148 bytes/frame40: fixed-byte read hoists before callback assignment and callback store fills the branch delay slot. Complete logical operations are represented, but extent/order/word equality fail. Raw relocation-masked equality is false.

## Remaining failure

Four-byte extent and store/read scheduling differences. Private isolated linked diagnostics unavailable for inactive ASM owner; canonical/full-ROM acceptance absent.

Research role: effect-example; selected emitted best: false.

Replay: `node tools/match.js probe boot_resource_probe_chunk_callback_walk --source docs/archive/matching-c-candidates/2026-10-07-boot_resource_probe_chunk_callback_walk-aa947432f6.c`. Check the metadata's expanded/header identities before interpreting its dumps.
