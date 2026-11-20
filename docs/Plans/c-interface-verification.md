# C function interfaces at final verification

## Accepted audio interfaces to correct

- **Cutscene gain, command `0x6F`.** The dispatcher declares and supplies context and gain. The wrapper and its two gain-service declarations name only one parameter. Both retail paths forward the gain in `$a1`. Make the gain explicit through both calls and verify that the resulting code still matches. [Dispatcher](../../src/lib/func_00284288.c) · [Wrapper](../../src/overlays/descriptor_14/func_002831E0.c) · [48-case replay finding](editor-function-families-20261120.md)
- **Null-context sound request.** `func_00208DC8` declares and calls `func_800EA604(0)`. Its call relocation names a fixed address. The accepted resident function at that address, `func_0003fb94`, takes a channel and a 32-bit request. In a replay of both original instruction ranges, modes 0, 11 and 13 forwarded the entire request in `$a1`, while mode 12 skipped the call. For request `0x12340021`, the resident function received `0x12340021` and passed `0x21` to the queue. All 16 combinations passed. Correct the caller's declaration and pass its second argument explicitly. The verifier regression must resolve the fixed alias to the resident entry using relocation and ownership evidence. [Caller](../../src/lib/func_00208DC8.c) · [Retail call and delay slot](../../asm/original/rev0/lib/func_00208DC8.s) · [Resident provider](../../src/lib/func_0003fb94.c)

## Implementation

The checker runs during final-wave verification. It reads the exact preprocessed C used by the accepted build and reports source-interface findings alongside the ROM result. The two audio corrections above remain open. [Implementation](https://github.com/rempred/OB64-Decomp/commit/6b3d9370d85bed30fd9a205bdfb1a5dc6744b8c8) · [Setup and workflow](../WORKFLOW.md#c-interface-consistency-at-the-complete-wave-boundary)

- At final-wave verification, compare declarations, definitions and direct calls across active C producers, including unchanged callers of a changed definition. Use the actual linked function identity to distinguish overlays and file-local functions.
- Check definite incompatibilities in fixed argument counts and C types. Account for typedefs, parameter adjustments, variadic functions and old-style declarations. Report which inputs or calls could not be analyzed and why.
- Record existing confirmed disagreements in a reviewed baseline. Identify each conflict precisely enough to detect a new caller, a changed signature or an additional incompatible call. Review baseline changes in Git.
- Distinguish changes to an incompatible call's arguments, including member names, prefix and postfix operators, and type operands. A comment or a spacing change between the same tokens should preserve the identity of the call.
- Report interface consistency separately from source class, placement, linked bytes and whole-ROM equality. Run the check before publishing a verified result. Reuse the existing build's inputs. Ordinary candidate matching continues to use the linked diff.
- Include the interface report in captured worker inputs. Replay must authenticate the selected report and tools, work from the captured inputs after the live checkout changes, and reject a missing or altered required report. Historical captures retain their original verification contract.

## Installed verification

On November 20 the installed checker detected both audio disagreements, and the corrected-source controls cleared the corresponding findings. The routine test runner passed all 68 suites. The structural audit passed, and all 41,943,040 rebuilt bytes matched normalized retail US Rev 0. The interface scan added 69.2 seconds to that verification and reported zero new conflicts against the reviewed baseline. The report identifies unparsed inputs and unresolved calls so its coverage can be inspected.

The integrator captured new worker inputs, authenticated the interface report and frontend, and replayed `func_00208DC8` to matching linked bytes. An older story-event snapshot also replayed under its original contract. The historical nine-row fixture correction was committed separately. [Worker snapshot workflow](../WORKFLOW.md#private-candidate-workers) · [Fixture correction](https://github.com/rempred/OB64-Decomp/commit/c2b4e1500ecb9d0912a6ef43e6335934ca5dc04e)
