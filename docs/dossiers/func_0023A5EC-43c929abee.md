# func_0023A5EC: scenario-named-record-pointer-register-pressure

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `43C929ABEE3C2AB0D8D30DE4C0D987FB7BD3ED0797D3CF4A63E6FD651D244445`
- Observation: `7D33633EC755569EB19D80128ECD6BDE06E30D541BDAE059BDCC579598411129`
- Source: [exact C](../archive/matching-c-candidates/2026-09-29-func_0023A5EC-43c929abee.c)
- Metadata: [curated observation](func_0023A5EC-43c929abee.observation.json)

Named record pointer recovers exact text extent but adds one saved register and eight bytes of frame.

## Source context

Retail func_0023A5EC assigns the stack record pointer at the resource-free delay slot and keeps it across initial/optional records in a saved register while retaining a 128-byte frame. The current readable scan-best C source addresses the record array directly and is 2644/661, frame 128. The retail clamp uses unsigned sltu; the trial includes that localized cast.

Introduce a named record_ptr after freeing the loaded resource, use it for the initial record and both optional-group bases, and cast the final maximum/limit clamp to unsigned as observed in retail.

## Recorded observation

Authenticated pinned-compiler watch emitted the record pointer assignment in the resource_free delay slot and reached exactly 2652 bytes/663 instructions with zero expected-only and zero actual-only instructions. It also added s7 to the saved-register mask and grew the frame to 136 bytes versus retail 128; aligned symbolic differences regressed to 648 and differing bytes to 2212. The saved record pointer landed in s3 rather than retail s1.

## Remaining failure

The extra saved register, eight-byte frame surplus, register allocation and broad linked bytes prevent matching. The scratch source has no production ownership or accepted relocation contract; original ASM and the two-target scenario wave remain open.

Research role: counterexample; selected emitted best: false.

Replay: `node tools/match.js probe func_0023A5EC --source docs/archive/matching-c-candidates/2026-09-29-func_0023A5EC-43c929abee.c`. Check the metadata's expanded/header identities before interpreting its dumps.
