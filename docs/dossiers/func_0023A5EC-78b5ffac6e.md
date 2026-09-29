# func_0023A5EC: scenario-typed-25-byte-scan-row

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `78B5FFAC6EA361C82348828E6B8CA0ABFF490CF3F8AC4E015343F7F1A716EDCA`
- Observation: `121D9462B6618EE7DD3E0653D6DFD19373B95D894A80E97B8B77F1C6AC80E657`
- Source: [exact C](../archive/matching-c-candidates/2026-09-29-func_0023A5EC-78b5ffac6e.c)
- Metadata: [curated observation](func_0023A5EC-78b5ffac6e.observation.json)

A 25-byte scan-row type recovers the numeric counter and two branch-path increments, leaving one instruction short.

## Source context

Retail func_0023A5EC forms a D_801971F0 row base using D_801976DC times 25, adds a five-value numeric scan counter, and increments that counter separately on the invalid skip and valid paths. The prior flat-array PURE_C source strength-reduced the scan into a moving pointer and end pointer. The accepted owner is 2652 bytes/663 instructions with a 128-byte frame; original ASM is active.

Express D_801971F0 as 25-byte rows and index row[D_801976DC][2 + i], retaining the earlier 52-byte ResourceRow pointer difference, first-row marker and partial output-base alias.

## Recorded observation

Authenticated pinned-compiler watch emitted a numeric scan index with a precomputed 25-byte row base and separate skip/valid increments, matching the retail induction-variable shape. The PURE_C symbol is 2648 bytes/662 instructions, frame 128, zero actual-only and one expected-only instruction, compared with 2640/660 and three expected-only for the flat-array parent. Aligned opcode differences fell from 567 to 546 and differing bytes from 2231 to 2175, but 645 aligned symbolic instructions still differ. Changing to a positive validity branch emitted retail's sltu/sltiu/and test but merged the increments and fell back to 2640/660. A bitwise positive-validity early guard compiled byte-identically to this source.

## Remaining failure

The owner remains one instruction short with broad register, opcode, address and repeated-case differences. Its validity predicate is still inverted relative to retail, and no canonical linked relocation contract has been established. The 25-byte row type is structural source evidence, not a behavioral claim or matching acceptance. No production activation or full scenario wave verifier ran.

Research role: emitted-best; selected emitted best: true.

Replay: `node tools/match.js probe func_0023A5EC --source docs/archive/matching-c-candidates/2026-09-29-func_0023A5EC-78b5ffac6e.c`. Check the metadata's expanded/header identities before interpreting its dumps.
