# C function interfaces at final verification

## Accepted audio interfaces to correct

- **Cutscene gain, command `0x6F`.** The dispatcher declares and supplies context and gain. The wrapper and its two gain-service declarations name only one parameter. Both retail paths forward the gain in `$a1`. Make the gain explicit through both calls and verify that the resulting code still matches. [Dispatcher](../../src/lib/func_00284288.c) · [Wrapper](../../src/overlays/descriptor_14/func_002831E0.c) · [48-case replay finding](editor-function-families-20261120.md)
- **Null-context sound request.** `func_00208DC8` declares and calls `func_800EA604(0)`. Its call relocation names a fixed address. The accepted resident function at that address, `func_0003fb94`, takes a channel and a 32-bit request. In a replay of both original instruction ranges, modes 0, 11 and 13 forwarded the entire request in `$a1`, while mode 12 skipped the call. For request `0x12340021`, the resident function received `0x12340021` and passed `0x21` to the queue. All 16 combinations passed. Correct the caller's declaration and pass its second argument explicitly. The verifier regression must resolve the fixed alias to the resident entry using relocation and ownership evidence. [Caller](../../src/lib/func_00208DC8.c) · [Retail call and delay slot](../../asm/original/rev0/lib/func_00208DC8.s) · [Resident provider](../../src/lib/func_0003fb94.c)

## Implementation

The Director approved the plan after independent review. The tooling author is developing the check against the preprocessed C used for the accepted build. The production integrator owns installation and the changed-verifier audit. The reviewer will examine the implementation and its rejection tests.

- At final-wave verification, compare declarations, definitions and direct calls across active C producers, including unchanged callers of a changed definition. Use the actual linked function identity to distinguish overlays and file-local functions.
- Check definite incompatibilities in fixed argument counts and C types. Account for typedefs, parameter adjustments, variadic functions and old-style declarations. Report which inputs or calls could not be analyzed and why.
- Record existing confirmed disagreements in a reviewed baseline. Identify each conflict precisely enough to detect a new caller, a changed signature or an additional incompatible call. Review baseline changes in Git.
- Report interface consistency separately from source class, placement, linked bytes and whole-ROM equality. Run the check before publishing a verified result. Reuse the existing build's inputs. Ordinary candidate matching continues to use the linked diff.

## Verification before rollout

Demonstrate that both audio disagreements are detected and that corrected callers clear the corresponding findings. Test changes on either side of a call, shared-header changes, ambiguous and interior aliases, overlay and local-name collisions, compatible types, unsupported syntax, and stale baseline or analyzer inputs. Report coverage and measure a complete scan and a representative wave on the pinned host. The production integrator runs the [changed-verifier structural audit](../AUDIT.md) and its normal whole-ROM check. The independent reviewer checks the delivered changes before publication.
