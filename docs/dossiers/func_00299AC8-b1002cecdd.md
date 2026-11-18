# func_00299AC8: army-alternate-counted-slot-loop

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `B1002CECDDE6419B14327BF11834296DF3A5871CF617D173FD50D50BE4378FBE`
- Observation: `3F4B8B3DC83DC8E6851E25718606C4EEF38CAB35A7DDCC2AFB3A8353F11F01A7`
- Source: [exact C](../archive/matching-c-candidates/2026-11-18-func_00299AC8-b1002cecdd.c)
- Metadata: [curated observation](func_00299AC8-b1002cecdd.observation.json)

The counted walk recovers both branch forms and the mask delay-slot placement.

## Source context

The alternate draw path walks up to fourteen slots before updating the graphics cursors. Presets 6, 11 and 16 can also enter the bounded linked-panel walk. The archived control uses Git checkout line endings. The private control with the original line endings remains in the wave scratch root.

Use a counted for-loop over the slots instead of the do-while loop in the control.

## Recorded observation

Both forms emit 480 bytes. The for-loop gives the original two branch forms and the original delay slot at offsets +0x38, +0x74 and +0x78.

## Remaining failure

The do-while form uses two branch-likely encodings and puts the low-byte mask in the second delay slot.

Research role: counterexample; selected emitted best: false.

Replay: `node tools/match.js probe func_00299AC8 --source docs/archive/matching-c-candidates/2026-11-18-func_00299AC8-b1002cecdd.c`. Check the metadata's expanded/header identities before interpreting its dumps.
