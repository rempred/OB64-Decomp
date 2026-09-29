# func_0023A5EC: scenario-initial-field-preload-body-coverage

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `EDFCFA42D6997FE50BAF933F6DBE44767F2E2219A3B46F51F4BD8D2E317023FD`
- Observation: `437ECA0D2DD04AE7FB2A1A19927913AB4DCE0D7B71ECE48B2AB9AF8FB78DFE30`
- Source: [exact C](../archive/matching-c-candidates/2026-09-29-func_0023A5EC-edfcfa42d6.c)
- Metadata: [curated observation](func_0023A5EC-edfcfa42d6.observation.json)

Preloading initial fields before the kind branch recovers two instructions at the retail frame; broad nonmatch remains.

## Source context

The shared-row-base C source recovered the retail frame and s1 record pointer but emitted 2640/660, three instructions short. Retail loads the initial record's adjustment and two big-endian halfwords before its kind branch, while the macro read them in its non-kind-1 arm.

Split the initial record from the optional-case macro and preload its adjustment and two halfwords before testing the initial kind; keep optional cases in the shared macro.

## Recorded observation

Authenticated pinned-compiler watch emitted PURE_C at 2648 bytes/662 instructions, frame 128, zero actual-only and one expected-only instruction. The initial field reads now occur before the kind branch. Aligned symbolic differences are 594 and differing bytes are 1991. Alternate READ_BE16 addition and uncast spellings compiled identically.

## Remaining failure

The body is four bytes short with broad alignment and allocation differences. The source is research-only, has no accepted linked relocation contract, and does not close either scenario target or the wave verifier.

Research role: effect-example; selected emitted best: false.

Replay: `node tools/match.js probe func_0023A5EC --source docs/archive/matching-c-candidates/2026-09-29-func_0023A5EC-edfcfa42d6.c`. Check the metadata's expanded/header identities before interpreting its dumps.
