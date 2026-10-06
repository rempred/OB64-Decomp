# boot_resource_loader_callback_register: storage-address-live-across-first-call

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `1D126FC4430E86E517D9449E11F31749289BB999D878C3969FB458D0A31BD0C8`
- Observation: `822CACFF56EDF4C4C69E8496EA12055E643285519EB74B74F3463720427CBC94`
- Source: [exact C](../archive/matching-c-candidates/2026-10-06-boot_resource_loader_callback_register-1d126fc443.c)
- Metadata: [curated observation](boot_resource_loader_callback_register-1d126fc443.observation.json)

Archive SIX source-bound AFAC-control evidence; canonical matching acceptance is separate.

## Source context

Original AFAC..B030 owner is one132-byte body, frame40, three saved variables s0context/s1arg0/s2arg1.

Use the same symbolic storage address800AF300 in both queue initialization and later callback registration.

## Recorded observation

PURE_C compiled144bytes with frame48 and saved storage address in s0 plus context in s1; incoming arguments shift to s2/s3. Full code coverage exists but nonexact extent and live ranges.

## Remaining failure

Extra saved address, code extent144 versus132, nonexact instructions. Inactive ASM private link unavailable. A worse measured source does not eliminate ordinary symbolic-address or callback lifetime hypotheses.

Research role: counterexample; selected emitted best: false.

Replay: `node tools/match.js probe boot_resource_loader_callback_register --source docs/archive/matching-c-candidates/2026-10-06-boot_resource_loader_callback_register-1d126fc443.c`. Check the metadata's expanded/header identities before interpreting its dumps.
