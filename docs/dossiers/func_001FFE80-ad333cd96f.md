# func_001FFE80: signed-copy-nondestructive-allocation-counterexample

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `AD333CD96F0C5AD0D49A2F658A4414E77956A05BDCA694736B1060BAF1DA550A`
- Observation: `F30594B002CB5194780B0FEFDD3F3C54494167F363094BC3007A399D9165A1AF`
- Source: [exact C](../archive/matching-c-candidates/2026-09-29-func_001FFE80-ad333cd96f.c)
- Metadata: [curated observation](func_001FFE80-ad333cd96f.observation.json)

Non-destructive cast keeps 796 bytes but substitutes a2 into the sum and shifts saved registers

## Source context

The casted position copy in the destructive form keeps the desired instruction structure with a six-word register swap. This non-destructive sum tests whether separate position and sum temporaries recover the retail v0/v1 allocation.

Use (s16)temp_v0_118 for the a2 copy before a separate temp_v0_121 position-plus-offset sum; assign the entry first and save the offset after the sum, with both F2 joins retained.

## Recorded observation

Current-run source policy classified PURE_C. The canonical focused linked diff accepted the 796-byte owner and all 54 relocations, but seven linked words (seven bytes) differ. At z64 0x00200030 the candidate uses a2 as the sum source instead of v0. The other six differences reflect s3/s4 allocation at z64 0x001FFFD0, 0x001FFFDC, 0x00200008, 0x00200038, 0x00200088 and 0x002000A4. This form does not improve the whole owner over the destructive cast candidate.

## Remaining failure

Linked target bytes are nonexact; no completed-wave verifier was run. The exact production hybrid source remains restored.

Research role: counterexample; selected emitted best: false.

Replay: `node tools/match.js probe func_001FFE80 --source docs/archive/matching-c-candidates/2026-09-29-func_001FFE80-ad333cd96f.c`. Check the metadata's expanded/header identities before interpreting its dumps.
