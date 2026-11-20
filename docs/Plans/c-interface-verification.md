# C function interfaces at final verification

<a id="accepted-audio-interfaces-to-correct"></a>

## Accepted audio corrections

- **Cutscene gain, command `0x6F`.** The wrapper accepts an index and a signed 32-bit gain. It forwards that gain to the default channel service when the index is 7 and to the indexed channel service on the other path. All 48 gain cases produced identical traces on retail and on the rebuilt ROM. The two fixed-address services are local C functions inside their respective resident source files. [Dispatcher](../../src/lib/func_00284288.c) · [Wrapper](../../src/overlays/descriptor_14/func_002831E0.c) · [Default service](../../src/lib/func_0003fd74.c) · [Indexed service](../../src/lib/func_0003fde0.c)
- **Null-context sound request.** The router calls `func_800EA604(0, arg1)` unless mode 12 suppresses the call. The resident function receives the full request and passes its low halfword to the queue. For example, `0x12340021` reaches the resident entry intact and the queue receives `0x21`. All 16 routing cases passed on retail and the rebuild. [Caller](../../src/lib/func_00208DC8.c) · [Retail instructions](../../asm/original/rev0/lib/func_00208DC8.s) · [Resident provider](../../src/lib/func_0003fb94.c)

Both corrected functions verified as `PURE_C` with their original placement, sole C owners and all 29 relocations. The full 41,943,040-byte ROM matched normalized US Rev 0. The interface scan cleared four argument-count findings and reported zero new conflicts. It retains explicit limits on checking the two local service aliases and the resident channel-pointer type. The source regression rejects a missing or changed forwarded argument at each of the three calls. [Accepted correction](https://github.com/rempred/OB64-Decomp/commit/b42789195e6f3235ad8dc5e3c1f63f4503e12688) · [Regression tests](../../tests/c_interfaces.js)

## Implementation

The checker runs during final-wave verification. It reads the exact preprocessed C used by the accepted build and reports source-interface findings alongside the ROM result. [Implementation](https://github.com/rempred/OB64-Decomp/commit/6b3d9370d85bed30fd9a205bdfb1a5dc6744b8c8) · [Setup and workflow](../WORKFLOW.md#c-interface-consistency-at-the-complete-wave-boundary)

- At final-wave verification, compare declarations, definitions and direct calls across active C producers, including unchanged callers of a changed definition. Use the actual linked function identity to distinguish overlays and file-local functions.
- Check definite incompatibilities in fixed argument counts and C types. Account for typedefs, parameter adjustments, variadic functions and old-style declarations. Report which inputs or calls could not be analyzed and why.
- Record existing confirmed disagreements in a reviewed baseline. Identify each conflict precisely enough to detect a new caller, a changed signature or an additional incompatible call. Review baseline changes in Git.
- Distinguish changes to an incompatible call's arguments, including member names, prefix and postfix operators, and type operands. A comment or a spacing change between the same tokens should preserve the identity of the call.
- Report interface consistency separately from source class, placement, linked bytes and whole-ROM equality. Run the check before publishing a verified result. Reuse the existing build's inputs. Ordinary candidate matching continues to use the linked diff.
- Include the interface report in captured worker inputs. Replay must authenticate the selected report and tools, work from the captured inputs after the live checkout changes, and reject a missing or altered required report. Historical captures retain their original verification contract.

## Installed verification

On November 20 the installed checker detected both audio disagreements, and the corrected-source controls cleared the corresponding findings. The routine test runner passed all 68 suites. The structural audit passed, and all 41,943,040 rebuilt bytes matched normalized retail US Rev 0. The interface scan added 69.2 seconds to that verification and reported zero new conflicts against the reviewed baseline. The report identifies unparsed inputs and unresolved calls so its coverage can be inspected.

The integrator captured new worker inputs, authenticated the interface report and frontend, and replayed `func_00208DC8` to matching linked bytes. An older story-event snapshot also replayed under its original contract. The historical nine-row fixture correction was committed separately. [Worker snapshot workflow](../WORKFLOW.md#private-candidate-workers) · [Fixture correction](https://github.com/rempred/OB64-Decomp/commit/c2b4e1500ecb9d0912a6ef43e6335934ca5dc04e)
