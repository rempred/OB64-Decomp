# func_0023A5EC: scenario-positive-scan-validity-shape

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `CB2827CEDBCC29B309731A5CCC7A7AAC026C024BBE98BD8F65DEE655BF1652EA`
- Observation: `1F9BF39FB5E6D0DB68C9AD62A8E413E46D1861309596A95C7DB91BF1FD3F5EA5`
- Source: [exact C](../archive/matching-c-candidates/2026-09-29-func_0023A5EC-cb2827cedb.c)
- Metadata: [curated observation](func_0023A5EC-cb2827cedb.observation.json)

Positive scan validity recovers retail test opcodes but merges two index increments and loses extent.

## Source context

Retail func_0023A5EC tests scan values with positive nonzero and less-than-100 predicates combined by and, increments the numeric scan counter in both the invalid skip and valid path, and then checks counter < 5. The typed-row partial-output PURE_C source retains the two increment paths but compiles the early invalid guard as an inverted predicate and strength-reduces the counter into a pointer.

Express scan validity as value > 0 && value < 100 with explicit increments in both the valid and invalid arms, keeping all row and output logic unchanged.

## Recorded observation

Authenticated pinned-compiler watch emitted the retail sltu/sltiu/and validity sequence, reducing aligned opcode differences from 567 to 553 and differing bytes from 2231 to 2197. It merged the two increments into one pointer increment, however, yielding 2632 bytes/658 instructions, frame 128, zero actual-only and five expected-only instructions versus the parent 2640/660 and three expected-only. A positive predicate with an explicit continue on the invalid arm compiled back to the parent object byte-identically.

## Remaining failure

The scan still uses a moving pointer/end pointer instead of retail's saved numeric counter; the merged increment loses two instructions. Repeated cases and linked bytes remain broadly nonmatching, with ASM active and no final scenario verifier.

Research role: counterexample; selected emitted best: false.

Replay: `node tools/match.js probe func_0023A5EC --source docs/archive/matching-c-candidates/2026-09-29-func_0023A5EC-cb2827cedb.c`. Check the metadata's expanded/header identities before interpreting its dumps.
