# include

Shared C headers for the decomp.

Suggested layout:

- `common/` - integer aliases, compiler macros, ABI helpers.
- `game/` - verified game structs and constants.
- `overlays/` - overlay-local declarations.

New shared headers must be guarded and self-contained: include their required integer
aliases instead of relying on declaration order in consumers. The common home is
`common/types.h`. Remove superseded local aliases in the same adoption change: the pinned
KMC GCC 2.7.2 rejects even an identical local typedef after inclusion. Guarded repeat includes
and both header orders passed the four-consumer pilot's compiler probes. Test include
order and the complete affected producer set with the pinned compiler and normal wave gates.

Legacy headers may still depend on cautious consumer-provided aliases where changing them
would broaden the current assignment. In particular, `game/class_entry.h` requires `u8`
and `u16` before inclusion. Migrate that header and all four existing consumers together
in a later explicitly scoped header wave, not during an unrelated function edit.

The declaration inventory is advisory: `node tools/declarations.js --target <symbol> --json`.
Forward declarations, identical text, partial views and true conflicts are different facts.
Keep partial or differently evidenced views local until original accesses, storage identity,
qualifiers and target-ABI layout are reconciled. Equal names or addresses across overlays
do not establish one object. A type/header change must preserve every affected consumer's
source class, ownership, placement, relocations and exact output; one final verifier covers
the complete assigned wave. No extra per-function full-ROM build is required.
