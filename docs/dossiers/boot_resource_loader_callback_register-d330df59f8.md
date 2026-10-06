# boot_resource_loader_callback_register: separate-storage-address-view

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `D330DF59F80D436161FCBD447BC833500C97A1F7760977F962EACCE48C456470`
- Observation: `BA222233014C53AC1EF815C485023B0FB79FBE5C88EF1844FA92600ED6341F29`
- Source: [exact C](../archive/matching-c-candidates/2026-10-06-boot_resource_loader_callback_register-d330df59f8.c)
- Metadata: [curated observation](boot_resource_loader_callback_register-d330df59f8.observation.json)

Archive SIX source-bound AFAC-best evidence; canonical matching acceptance is separate.

## Source context

Compare complete AFAC PURE_C source with same storage symbol used twice: it carries address across first call, frame48 and body144 versus retail40/132.

Use existing800B0000 link anchor minus0D00 for first initialization storage argument; keep direct800AF300 storage view in callback registration. No shared header or tool change.

## Recorded observation

Private r3 emits full132-byte body with frame40, original s0context/s1arg0/s2arg1 lifetimes and13 actual relocations. Raw relocation-masked bytes agree exactly, including first-call argument formation.

## Remaining failure

Inactive ASM owner lacks authenticated isolated private link. Expected provenance unavailable; raw relocation fields differ until link. Canonical focused diff and final complete-SIX verifier remain required.

Research role: emitted-best; selected emitted best: true.

Replay: `node tools/match.js probe boot_resource_loader_callback_register --source docs/archive/matching-c-candidates/2026-10-06-boot_resource_loader_callback_register-d330df59f8.c`. Check the metadata's expanded/header identities before interpreting its dumps.
