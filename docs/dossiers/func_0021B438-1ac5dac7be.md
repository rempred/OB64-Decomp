# func_0021B438: structured-other-loop-changes-b438-shape

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `1AC5DAC7BE7FEFB667C4F8D364EBF9E38D4A487ED27A1639D3572C34F53A9D34`
- Observation: `0091F9595E73B81B8B702844DE8AA80922CC44F8B38E548161F3BC3C928C4DB7`
- Source: [exact C](../archive/matching-c-candidates/2026-09-29-func_0021B438-1ac5dac7be.c)
- Metadata: [curated observation](func_0021B438-1ac5dac7be.observation.json)

Structured other-index loop shifts B438 compiler allocation but adds one instruction and changes table destinations; source-level counterexample only.

## Source context

Retail processes the current actor after iterating candidate other groups. The retained best C expresses that search as an open-ended loop with a bottom continuation, and pinned GCC global-allocation priority for the adjustment variable remains too high. GoldOx's diagnostic suggested a structured other-index loop as a bounded source-level allocator experiment.

Move the actor's current/adjustment update after a structured for(other_index = 0; other_index < 20; other_index++) search loop, replace the bottom goto with continue, and express the owner equality as owner == other.

## Recorded observation

Authenticated pinned-compiler watch emits PURE_C but 828 bytes/207 instructions against retail's 824/206. The length shift yields 154 aligned symbolic differences, including 114 opcode differences in the diagnostic alignment. The source-level change does not preserve the exact owner shape.

## Remaining failure

This loop form is not selected. It remains a source/compiler-shaping clue because a natural lifetime placement may alter register priority, but any successor must recover the 824-byte extent, retail table targets, and exact linked bytes. No tooling defect or production ownership change is inferred.

Research role: counterexample; selected emitted best: false.

Replay: `node tools/match.js probe func_0021B438 --source docs/archive/matching-c-candidates/2026-09-29-func_0021B438-1ac5dac7be.c`. Check the metadata's expanded/header identities before interpreting its dumps.
