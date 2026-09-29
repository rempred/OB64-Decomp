# func_0023A5EC: scenario-index-to-record-pointer-register-reuse-diagnostic

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `C825EBE69D628CEF565F28BECFA14FC00F830B75500713ADA9FFE5228D243685`
- Observation: `1EB32BD6AF8F47D03F035AEDF0B4BF4EB2946ABA64C43B2AF6317CB72C21FEA1`
- Source: [exact C](../archive/matching-c-candidates/2026-09-29-func_0023A5EC-c825ebe69d.c)
- Metadata: [curated observation](func_0023A5EC-c825ebe69d.observation.json)

Diagnostic parameter reuse restores frame with an integer-pointer cast; retain only as allocator evidence, not readable production C.

## Source context

The natural named record-pointer source emits retail-sized text but allocates one extra saved register and a 136-byte frame. Retail reuses saved s1 for the resource record index before memcpy and the stack-record pointer after resource_free. This is a diagnostic test of whether one source variable can force that handoff, not a proposed readable production representation.

After resource_free, overwrite the now-dead s32 record_index parameter with the 32-bit stack-record address and cast it back to a byte pointer at later record uses; retain the unsigned final clamp. This intentionally tests register reuse across the two phases.

## Recorded observation

Authenticated pinned-compiler watch emitted PURE_C at 2644 bytes/661 instructions, frame 128, zero actual-only and two expected-only instructions. It placed the stack-record pointer assignment in the resource_free delay slot and reused s3 for the earlier record index and later pointer, confirming the allocation mechanism. It did not recover retail s1, and aligned symbolic differences were 607 with 2066 differing bytes; the ordinary scan-best source remains more readable and has 603 symbolic differences.

## Remaining failure

Pointer-to-integer and integer-to-pointer casts are implementation-defined and weaken source quality; this control is not selected. It remains eight bytes short with broad machine-code differences, no accepted relocation contract and no production activation. A readable type/structure explanation for retail s1 reuse is still needed.

Research role: counterexample; selected emitted best: false.

Replay: `node tools/match.js probe func_0023A5EC --source docs/archive/matching-c-candidates/2026-09-29-func_0023A5EC-c825ebe69d.c`. Check the metadata's expanded/header identities before interpreting its dumps.
