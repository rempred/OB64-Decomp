# Logical functions and physical owners

The matching workbench separates callable bodies from preserved assembly owners.
`config/logical-functions.json` records reviewed bodies, exact bytes, source fragments,
padding, and unavailable placement. It does not create linker exports or activate C.

The registry is self-contained. External research paths identify provenance;
normal commands do not read those paths. The registry pins the review and case-index
hashes. Each body records its evidence status, canonical byte hash, and ordered
source intersections. The loader derives those intersections from the accepted model.

## Research selections

An owner can contain several functions. Preparation emits every reviewed function in
address order and passes all names to one pinned m2c invocation. The compiler checks
the complete ordered function census. Missing functions, extra functions, overlaps,
and gaps reject. Different generated lengths remain valid nonmatching experiments.
Comparison uses the complete emitted executable section for logical selections.
Reports distinguish function bytes from bounded zero alignment.

A complete body can cross a physical source cut. This selection is explicitly
`logical-body` scratch work. It carries the full expected interval and original
fragments. Physical sources and linker ownership remain unchanged. Historical names
remain available as aliases:

```powershell
node tools/match.js inspect func_0000E708
node tools/match.js prepare func_0000E708 --variant structured
node tools/match.js prepare func_0004890C --variant structured
node tools/match.js history func_00261D60
```

The first two commands select ROM `0x0000E6F8..0x0000EA98`, including its setup.
The third selects the helper at ROM `0x0004890C..0x00048928`.
The final command discovers continuation aliases while retaining recorded symbols
and target IDs. Old histories remain stale; they are never rewritten.

Unknown executable remainder prevents complete candidate generation or import.
Reviewed helpers remain individually inspectable. Padding and shared continuations
are not independent functions. Unqualified placement remains unavailable.
ROM `0x0000780C..0x0000785C` has a separate reviewed structural addendum.
Its standalone body is supported; runtime callers remain unproved.

For non-descriptor load slabs, switch-table preparation requires an adjacent bound,
controlling zero branch, and unchanged index. The table must resolve uniquely in
non-executable data in the same accepted slab. Every destination must remain inside
the selected body. This does not infer a new loader mapping.

## Production boundary

The active-target loader rejects interior aliases and producers that cut logical
bodies. An explicit preserved production envelope can retain an existing full-owner
compiler contract that deliberately includes next-function setup. Its physical
fragments and compiler census must agree. This preserves an existing producer;
it does not claim that its text is one standalone body.

Multi-owner and compilation-group admission retain their restrictions.
Group members cannot be compiled individually through a logical alias.
Activation still requires reviewed linkage, sole ownership, source policy,
exact target bytes, and exact full-ROM verification.

Registry identity participates in workbench model contract 5, CURRENT fingerprint 8,
build-report schema 6, audit schema 5, recorded-build validation, and cache inputs.
The compiler workbench contract is 10; the m2c adapter is 12. Physical layout and
ELF representation schemas retain their meanings.

## Verification

```powershell
node tests/logical_functions.js
node tests/logical_functions_integration.js
node tests/matching_workbench.js
node tests/matching_workbench_integration.js
node tests/active_targets.js
node tests/diff_object_cache.js
node tools/audit.js
```

The audit includes canonical CURRENT verification and fresh source compilation.
An extra unchanged full build or verifier invocation is unnecessary.
Drafts and comparisons are research evidence, not matching-C acceptance.
