# boot_command_stream_dispatch: first-argument-local-prologue-control

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `3B698B0D4AC66DB7ED7A1B0BE55226327A7807593DBEB254658E7CCD759B3F36`
- Observation: `4176689DB3C6D5A9470327C51F82663D8C63EE955444F0B8F5CB8F9DDB9C6CB2`
- Source: [exact C](../archive/matching-c-candidates/2026-10-06-boot_command_stream_dispatch-3b698b0d4a.c)
- Metadata: [curated observation](boot_command_stream_dispatch-3b698b0d4a.observation.json)

First-word local lifetime control for the complete command owner; compiled 656-byte nonmatch.

## Source context

Complete 652-byte command dispatcher derived from original ASM and all three original tables; legacy ellipsis and aligned NEXT_WORD cursor are already present.

Initialize the opcode local from __builtin_va_alist and use that local for the initial root lookup.

## Recorded observation

Private watch001 compiles PURE_C but preserves the first word in s2 and places the initial root load after frame setup. It produces a length mismatch against the complete 652-byte owner. The remaining three structured switches produce all 36 table entries.

## Remaining failure

Nonexact complete text; private linked diagnostics unavailable for inactive ASM owner. This candidate is retained only as the source-bound early-lifetime control.

Research role: counterexample; selected emitted best: false.

Replay: `node tools/match.js probe boot_command_stream_dispatch --source docs/archive/matching-c-candidates/2026-10-06-boot_command_stream_dispatch-3b698b0d4a.c`. Check the metadata's expanded/header identities before interpreting its dumps.
