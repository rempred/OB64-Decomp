# 0E64: returning the complete inline result

Renewed PURE_C work resolves the register mismatch that previously led to a premature hybrid
stopping decision. The earlier SI/HI interference was specific to the tested source arrangements;
it did not rule out this ordinary inline-helper boundary. The exact hybrid remains historical
evidence. The current source has no assembler binding, template or injected instruction.

Both inputs below keep the incoming selector full-width, test only its low byte for the FF
sentinel, and make the same three ordered random calls only in the existing zero/flag2 branch.
They preserve unsigned shifts, mask, OR and remainder, the later adjustment, stores and calls.
The sole difference moves `% 5u` from the caller into the inline helper's returned expression.

| Input | Authored SHA-256 | Expanded SHA-256 | Different bytes / words |
| --- | --- | --- | --- |
| inline-random-word | `FBA5B3393273D78679A1B6B607AD039AB2EB173B039794AEFA85680E0747906E` | `49834546D3CEEBD7237B38661C7CA7FB2EA5096B3AC6DFDCBB85B25D47328815` | 31 / 14 |
| inline-random-result | `51A78CA99EC12D7B28920640544BD419C37FFE6473BD2FDF900308E39266472D` | `55E5C0C8D3C8005E8F1CB094DFF0A4D81EAB0F20CD01235A96111F3A86ADC7B4` | 0 / 0 |

Both private inputs are PURE_C, 248 bytes, frame 32, with five candidate relocations. The
complete helper result recovers the required entry copy, full-width predicate register and
subsequent output. This is an observed source-context effect, not proof of the original source
or a general guarantee about inline functions. Returning the intermediate word is a useful
counterexample to treating any helper extraction as equivalent for matching.

The production cleanup names the helper `random_selector_value`, normalizes indentation and
retains a concise explanation. Final source SHA-256 is
`BF79F7DA363A79941DF1656F2303A3B3637B94681EC9D78026AEC1FDA40FFE07`, expanded input
`20417EAD6B460942E32282A4A9A1B45307CF346BEE34F491AC463F4B8A3C8619`.
Its canonical focused check is PURE_C and EXACT: sole 248-byte C contribution in `.ob64.r3666`,
accepted placement, no original-ASM fallback or fill, matching actual relocation contract and
all five relocated words, and zero differing target bytes/words. Linked and expected SHA-256
are both `CA3B27E47695D9C6A49825E29861359A1B814C8897B46C5DCA83455CEA88A399`.
The complete thirteen-target supplement verifier has not run; this remains provisional.

Frozen evidence is under `build/combat-discovery-supplement-r3/001F0E64/`. The two private
`result.json` hashes are respectively
`F4419CD05116DFEFEDD985466C29910CB04E9AEAC7024E48614AE10631CA8E6F` and
`A6B8BD920B7E827C38EBB49996E15C618CA8E1D814F51995416A316B14924A8A`.
`final-pure/focused.json` has SHA-256
`9A98E0E795DE132CE0AE58EED22A298AF5F178F6D3358B767B2AE90E666DA9D1`;
`final-pure/policy.json` has SHA-256
`6ADA143D7950B8611E5230F4CFB75C8C57DB2B49DC4776A178CC7F17D8764CB1`.
Research intake preserves the exact source pair and cleaned final source. The previous pure
best and failed approaches remain available; no historical reference needs to be rewritten.
