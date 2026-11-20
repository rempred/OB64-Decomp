# C function interfaces at final verification

Cutscene sound command `0x6F` is the regression case. Its [dispatcher](../../src/lib/func_00284288.c) declares and supplies two arguments. Its [wrapper](../../src/overlays/descriptor_14/func_002831E0.c) defines one. The retail instructions preserve the second argument in the gain register on both paths. This allowed a byte-identical rebuild while leaving the Editor's portable implementation with an incomplete C interface. [Retail evidence and replay](editor-function-families-20261120.md)

## Implementation

The Director approved the plan after independent review. The tooling author is developing the check against the preprocessed C used for the accepted build. The production integrator owns installation and the changed-verifier audit. The reviewer will examine the implementation and its rejection tests.

- At final-wave verification, compare declarations, definitions and direct calls across active C producers, including unchanged callers of a changed definition. Use the actual linked function identity to distinguish overlays and file-local functions.
- Check definite incompatibilities in fixed argument counts and C types. Account for typedefs, parameter adjustments, variadic functions and old-style declarations. Report which inputs or calls could not be analyzed and why.
- Record existing confirmed disagreements in a reviewed baseline. Identify each conflict precisely enough to detect a new caller, a changed signature or an additional incompatible call. Review baseline changes in Git.
- Report interface consistency separately from source class, placement, linked bytes and whole-ROM equality. Run the check before publishing a verified result. Reuse the existing build's inputs. Ordinary candidate matching continues to use the linked diff.

## Verification before rollout

Demonstrate that the real `0x6F` disagreement is detected. Test a corrected declaration and forwarding call, changes on either side of a call, shared-header changes, overlay and local-name collisions, compatible types, unsupported syntax, and stale baseline or analyzer inputs. Report coverage and measure a complete scan and a representative wave on the pinned host. The production integrator runs the [changed-verifier structural audit](../AUDIT.md) and its normal whole-ROM check. The independent reviewer checks the delivered changes before publication.
