# Verdict: Accepted

The retained-interior original-assembly capability at frozen subject
`6e0ccd3030ad37e83478181081f3d56350f3de1e` passes Critical structural review with no
admissible finding. It preserves the accepted row owner while allowing explicitly bounded,
literal, relocation-free original bytes to be interleaved between C auxiliary fragments, and the
ordinary producer, linker, map, ELF, manifest, layout, proof, CURRENT, cache, and status paths agree
on that ownership. This matters because the capability can now proceed to a separate bounded
documentation/tooling closure; it does not activate EF50 or D14C, accept the unfinished seventeen-
owner wave, integrate or publish this checkout, or add support for relocation-bearing expressions.
The next actor is the Director, who may route only that post-acceptance closure and later make any
separate integration decision.

## Frozen review subject

- Assignment: `high-attack-wave6-interior-asm-review`, revision 1, launch
  `HA-W6-INTERIOR-REVIEW-01`.
- Reviewer task: `01a0746e-eeb6-7c43-abc5-f80307ab54ca`, local.
- Ready-routing parent: `778776c74291e64eddee5a7e9629a791d9e43010`.
- Subject checkout: `C:/Users/Joe/Projects/OgreBattlel64/high-attack-wave-5`.
- Subject branch: `codex/high-attack-wave-5`.
- Frozen subject: `6e0ccd3030ad37e83478181081f3d56350f3de1e`.
- Frozen prior subject: `841462eceb640d61f0393b4a60427d1abaf84d23`.
- Worker parent: `fbeaa52bdad610a1a906d1459755a808e6ffd62c`.
- Implementer task: `01a073b7-2265-7580-a386-0b4bff7e94b3`.

The frozen diff contains exactly fourteen paths: twelve implementation, fixture, and capability-
documentation paths plus the worker AAR and evidence index. There are no production configuration,
tracked C-source, tracked original-assembly, boundary, overlay, or linker-descriptor changes. The
only pre-existing subject status entries were the four disclosed inactive untracked drafts
`func_0022B1F4.c`, `func_0022C78C.c`, `func_0022D14C.c`, and `func_0022EF50.c`. They were neither
read as authority nor modified by this review.

## Claims reviewed

The review tested the following material claims:

1. `preservedInteriorBefore` denotes an explicit original-row interval immediately before a
   noninitial C auxiliary fragment, with exact source, row, ROM, RAM, bytes, and empty-relocation
   identity.
2. A row can contain more than one retained interior interval, and C fragments, retained intervals,
   and the final fallback tail must form one ordered, gap-free, nonoverlapping coverage chain.
3. The original assembly object remains the authenticated source of retained bytes, while the
   original whole-row contribution is removed exactly once and reconstructed as ordered C,
   retained-original, and tail objects.
4. Original-row relocations cannot be silently stripped. The bounded implementation accepts only a
   whole original row with no nonempty REL or RELA section targeting it; each generated retained
   object must likewise be literal, read-only, alignment-one data with no relocation or named
   non-section symbol.
5. Map and ELF evidence must establish exact contribution order, addresses, sizes, section shape,
   row bytes, and unchanged load-segment placement.
6. Build reports, source-object proofs, manifests, layouts, CURRENT reuse, object-cache identity,
   recorded-build validation, and status accounting must carry or reconstruct the same interval
   contract. Retained bytes remain assembly bytes and never count as matching C.
7. Compiler-generated internal padding, exterior prefix/tail ownership, occurrence handling, and
   existing auxiliary-table rules remain distinct and continue to reject contradictory coverage.
8. The implementation itself activates no production interval and establishes no new production
   source owner.

## Review method and result

I read the complete assignment, callback contract, repository structural/source policy, relevant
workflow and compiler notes, the new capability document, the fourteen-file frozen diff, the worker
claim/log/AAR/index, and the worker's baseline, final proof, closure, snapshots, captured commands,
and selected successful and failed probe artifacts. I then traced normalization, resolution,
original-row authentication, object generation, ordered linker emission, map/ELF verification,
manifest/layout/proof propagation, CURRENT and cache reconstruction, recorded-build checks, and
status accounting through their ordinary callers.

No P0, P1, P2, P3, or other admissible finding was found. In particular:

- The interval contract has one central normalized projection and rejects malformed shape,
  non-uppercase extents, source mismatch, overlap, reordering, incomplete coverage, and nonempty
  requested relocations.
- `originalInteriorBytes` authenticates the tracked source and exact complete row before extraction,
  and scans every REL/RELA section targeting that complete row rather than only the retained slice.
- Generated objects have exactly one allocated read-only `SHT_PROGBITS` contribution with alignment
  one, no relocation sections, and no named non-section symbols.
- Explicit linker selectors and the complete map contribution census prevent wildcard ordering,
  duplicate ownership, or a hidden row contribution.
- Strict interval records propagate through all acceptance consumers, while production currently
  records an explicit empty list for every target.
- Actual-C and recorded-build exercises are isolated evidence only. Their construction does not
  alter production configuration or promote a source owner.

## Independent acceptance tests

### Whole-row relocation rejection

1. **Claim under test:** the literal-only contract rejects any nonempty relocation section that
   targets the accepted original row, including a relocation outside the selected retained interval.
2. **Real producer:** the supported pinned MIPS GNU assembler produced an actual
   `.rel.ob64.r4248` relocation section for an otherwise authentic accepted row object.
3. **Ordinary route:** accepted row/configuration resolution reached the ordinary
   `originalInteriorBytes` authentication and extraction path used by the build.
4. **Concrete consequence if wrong:** a live relocation could be silently discarded while bytes
   were copied into a literal retained object, making ownership and modified-build behavior unsound
   even if one frozen retail image happened to compare equal.
5. **Smallest reproducer:** one real relocation at row offset zero while the first retained interval
   starts at row offset 40.
6. **Evidence grade:** structural object evidence from the actual assembler and ELF relocation
   parser; the path rejected before retained-object generation.
7. **Threat model:** accepted tracked assembly, accepted configuration, the pinned assembler, and
   the supported ordinary build path—not malformed artifacts injected after verification.

The control passed: the authentic accepted row had 1,248 exact bytes and no actual relocations; the
otherwise equivalent object with one real row relocation was rejected even though that relocation
lay outside the retained interval.

### Multiple retained gaps and linker order

1. **Claim under test:** one accepted row can contain multiple explicit retained gaps and must link
   them in exact C/interior/C/interior/C/tail order without gaps, duplicates, or reordering.
2. **Real producer:** supported `preservedInteriorBefore` configuration entries generated two
   retained objects, and the ordinary assembler and linker produced the row map and ELF.
3. **Ordinary route:** normalization, resolution, fallback extraction, retained-object creation,
   explicit linker emission, map census, ELF checks, and complete-row byte comparison all ran.
4. **Concrete consequence if wrong:** one gap could be omitted, duplicated, absorbed into the tail,
   or linked on the wrong side of its following fragment while superficial total-size checks passed.
5. **Smallest reproducer:** three relocating assembly proxy fragments, two separated 64-byte
   retained intervals, and the final original tail in one row.
6. **Evidence grade:** structural linker/map/ELF/byte evidence. The proxies intentionally establish
   placement and ownership only, not C-source or source-class evidence.
7. **Threat model:** accepted multi-interval configuration and the supported normal build/link/verify
   path, including ordinary relocation-bearing fragment objects and literal retained objects.

The control passed. The linked order was `func_0022B06C`, interior `0x00239EE8`,
`func_0022EF50`, interior `0x00239F48`, the third proxy, then the tail. The complete row matched the
canonical 1,248 bytes with SHA-256
`38DD3F1E201B57F2C3B9FAD009D443E512D21303BB6A1BF466648D6326E5EA1E`; both retained objects
had exact expected shape and empty relocation/symbol censuses.

Two earlier reviewer probe attempts are preserved but are reviewer-fixture errors, not subject
findings. Attempt 1 omitted the required relocation for each switch-table entry. Attempt 2 derived
proxy addends but failed to update the cloned target base. Both are marked `subjectFinding: false`;
the corrections changed only reviewer-owned ignored evidence and the final probe passed.

## Verification and authenticated reuse

Reviewer-run checks all exited zero:

- `node build/audit/HA-W6-INTERIOR-REVIEW-01/review-probe.js`
- `node tests/auxiliary_interior.js` — pass, including 37 negative controls
- `node tests/auxiliary_internal_padding.js` — pass, including 34 negative controls
- `node tests/func_0021B438_0021B894_switch_tables.js` — pass
- `node tests/diff_object_cache.js` — pass
- `node tools/test.js` — pass, 14 of 14 suites

The worker's final full structural audit was not redundantly rerun. Its frozen result was instead
independently authenticated against live bytes: 7,111 protected inputs had zero drift; all twelve
implementation files, six worker scripts, eleven snapshots and their live originals, seventeen
command captures, and twenty-three selected probe files matched their recorded identities. The
physical canonical, baseline, and CURRENT ROMs were each 41,943,040 bytes with SHA-256
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`. The audit passed at
`2026-09-06T12:24:00.599Z`, freshly compiled 547 sources, reported 481 `PURE_C`, 66 `HYBRID_C`,
zero `UNKNOWN`, and zero compiler rewrites, and found zero production retained intervals.

The isolated actual-C probe reproduced the complete exact ROM and independently rebuilt source-
object proofs for B06C and EF50, including EF50's measured 29 text relocations. The isolated
recorded-build fixture passed and rejected five missing, duplicate, stale-object, omitted-compiled,
or stale-verified interval mutations. These are strong path exercises, but neither is a production
build report or an activation decision.

## Evidence limits and consequences

- The independent multi-gap fragments are relocating assembly proxies. They prove linker ordering,
  ownership, object shape, and byte reconstruction; they do not prove a C implementation or
  `PURE_C` classification.
- The worker actual-C and recorded-build probes are explicitly isolated. Production has zero
  intervals, zero manifest interior owners, and null interior projections for all six current
  auxiliary layout records.
- No runtime or emulator work was performed. This review makes no behavioral or semantic claim.
- Only literal, relocation-free whole original rows are supported. Relocation expressions remain
  unsupported and require a separately designed and reviewed contract.
- EF50 and D14C remain inactive, as do B1F4 and B438. This review does not complete or accept the
  unfinished ordinary matching wave.

The capability document and compiler note correctly label the feature pending review in the frozen
subject, while the broader workflow, source-policy, and audit documents still describe auxiliary
ownership as contiguous-only. After this acceptance, the Director may route a bounded closure that:

1. updates both the subject and current canonical `docs/WORKFLOW.md`, `docs/SOURCE_POLICY.md`, and
   `docs/AUDIT.md` so complete C-plus-explicit-original-assembly coverage is documented without
   weakening the exact-ROM, ownership, or source-class gates; and
2. removes the pending-review wording in `docs/AUXILIARY_INTERIOR_ASSEMBLY.md` and
   `docs/KMC_GCC_MATCHING_NOTES.md` while preserving the literal, whole-row relocation-free limit.

That documentation/tooling closure is the only direct next route authorized by this verdict.
Integration, publication, production ownership changes, ordinary source tuning, and any broader
relocation contract remain separate Director decisions.

## Preservation

The reviewer created only this report, its evidence index, the exact parent task log, and ignored
review evidence under `build/audit/HA-W6-INTERIOR-REVIEW-01/`. No source, configuration, worker
artifact, branch, worktree, commit, task, subagent, runtime session, emulator state, Total Resolver
state, integration target, or publication surface was changed. The frozen subject HEAD and branch
remained exact through review.
