# boot_command_stream_resource_node_dispatch: extra-variable-argument-skip

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `B09CFEADE4632252523A55C57939EDC162A36B513D0D6E9306325DBEAC8CD97A`
- Observation: `E17FCF340761C0AD40DE33D512C4E2FBCE4471753AAF251D650D1728CE0A47D9`
- Source: [exact C](../archive/matching-c-candidates/2026-10-06-boot_command_stream_resource_node_dispatch-b09cfeade4.c)
- Metadata: [curated observation](boot_command_stream_resource_node_dispatch-b09cfeade4.observation.json)

Cleanup/dispatch FIVE source-bound private observation; canonical complete-wave proof remains separate.

## Source context

Legacy GNU varargs ellipsis and next-arg accessor with a separate loop pointer lifetime, but one extra4-byte cursor advance.

Add4 to __builtin_next_arg before the aligned word read.

## Recorded observation

PURE_C/568 bytes with full16-byte prefix. One nonrelocation difference: sp+0x2B at ROM9AC4 instead of sp+0x27, so this source skips an incoming word.

## Remaining failure

One wrong cursor word plus unresolved symbolic relocation fields; not selected.

Research role: counterexample; selected emitted best: false.

Replay: `node tools/match.js probe boot_command_stream_resource_node_dispatch --source docs/archive/matching-c-candidates/2026-10-06-boot_command_stream_resource_node_dispatch-b09cfeade4.c`. Check the metadata's expanded/header identities before interpreting its dumps.
