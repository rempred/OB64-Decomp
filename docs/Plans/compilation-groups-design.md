# Compilation-group design

Completed as a design proposal. One compiler invocation can supply several accepted function owners through a lossless object projection. Production activation remains unauthorized. The Director must route this proposal for independent review before implementation.

## Decision and scope

Introduce an explicit compilation producer, separate from a function target and its structural owner. A native group produces one authenticated `.text` section. Project that section into existing owner sections without changing any instruction, padding byte, relocation information word, or encoded addend.

Use a separate group projection mode beside the current multi-owner splitter. Keep existing modes and their guards unchanged. The resulting single C object contains every member section and remains each member's sole linked producer.

This proposal supports contiguous, unambiguous executable owners within one accepted placement context. Each owner has one compiler-emitted public function at its accepted start. The only non-function bytes permitted initially are the authenticated native terminal alignment bytes in the final owner. Groups with auxiliary sections, local extra functions, internal padding, mixed slices, or continuation owners reject.

These restrictions define a reusable first representation. They are structural properties, never symbol names or fixed pose sizes. Future shapes require separate evidence and review.

## Evidence and limits

The starting code is main `46d78ded786669e306bc3ca80c6f2d9e752a81a5`. This assignment inspected project code and local research artifacts. It ran no compiler, build, verifier, or audit.

The parent pose report has SHA-256 `C1198AD8810DBBF437EF80114AEBB01E3748C3E011547EF26A2EA4A1776DE16F`. Its isolated experiment found 824 function bytes and eight native terminal zeros. The complete 832-byte group reproduced five retail owner ranges. Its 17 load relocations survived the ordinary section-assignment control, which lost the terminal zeros.

The evidence root is `C:/Users/Joe/.codex/ob64-pose-split-research-20260906-r1/`. This assignment inspected `corrected-results.json` and `supplement.json`. The report documents untouched compiler assembly and all five public entries. This is isolated feasibility evidence, not accepted production preprocessing, matching acceptance, or original compilation-unit proof.

| Current contract | Inspected source | Design implication |
|---|---|---|
| Active target resolves accepted owners, source and linkage | `tools/lib/active_targets.js`, `resolveAcceptedRows`, `resolveCompilerTextFunctions`, target construction | Targets must remain individual functions; group membership must not disguise continuation owners. |
| Native descriptor is restricted to the art routine | `tools/lib/text_contract.js`, `normalizeNativeTextTail`, `resolveTextContract` | Leave the accepted descriptor intact; add a separate general group mode. |
| Multi-owner object splitting already preserves text bytes | `tools/lib/elf_text_split.js`, `splitRelocatableTextSection` | Reuse byte slicing and metadata remapping; retain the old entry point's guards. |
| Current splitter requires aligned boundaries and continuation symbols | `normalizeOwners`, `preserveOwnerBoundarySymbols`, `splitRelocatableTextSection` | New mode needs independently checked alignment and existing public symbols, without synthesized symbols. |
| Compilation and independent proof currently iterate targets | `tools/lib/phase8_matching_c.js`, `compileTarget`, `verifySourceObjectProofs`; `tools/lib/current_workflow.js` | Iterate unique producers for compilation and proof; project member results afterward. |
| Relocations normalize against owner-relative logical offsets | `tools/lib/phase8_matching_c.js`, `relocationRecords` | Group-relative semantics must be explicit; repeated `.text` owner keys would silently collapse records. |
| CURRENT, caches and workbench bind target contracts | `tools/lib/current_workflow.js`, `tools/lib/diff_object_cache.js`, `tools/lib/matching/compiler.js` | Every group input invalidates all member views and cached producer artifacts. |
| Map, manifest and layout use one target object path | `tools/lib/phase8_matching_c.js`, manifest/layout/map verifiers | Resolve the unique producer path; retain complete per-owner checks. |
| Status accounts targets and row claims | `tools/lib/source_policy.js`, `classifyTargetSources`; `tools/lib/status_accounting.js`; `tools/status.js` | Share classification evidence while counting accepted functions, never producers. |

The existing `tests/multi_owner_text.js` contains an independent assembler fixture. It compares split and unsplit links with an external call, a HI16/LO16 pair, and a branch across an owner seam. That is useful test precedent. It does not establish the proposed native multi-function extension and was not rerun here.

## Proposed representation

Add a versioned `config/matching-c-compilation-groups.json`. Keep group source and member order authoritative there. Each active function target refers to its group instead of supplying another independently compiled source. Require exactly one producer choice per target.

A proposed record contains these fields:

| Field | Required meaning |
|---|---|
| `id` | Safe, unique producer identifier; no executable semantic meaning. |
| `source` | One authored repository C translation unit, with authenticated repository-local dependencies. |
| `mode` | `native-text-owner-projection`. |
| `members` | Ordered target symbols and exact accepted owner identifiers. |
| `text` | `.text`, exact size, alignment, read-only executable PROGBITS flags, and reviewed raw section hash. |
| `functions` | Complete symbol census: member symbol, group offset, function size, binding, type and visibility. |
| `tail` | Offset, size, hash and native origin; explicit zero size when absent. |
| `relocations` | Complete reviewed group-relative load relocation contract, including symbol/value and addend semantics. |

The normalized record derives ROM/RAM endpoints, owner hashes, fallback identities, section names and overlay context from the accepted model. If authored redundancy is retained for review, it must equal those derived values exactly.

Member offsets must equal cumulative accepted owner sizes. Members must cover the entire group exactly once. Their RAM and ROM intervals must be contiguous, with identical placement context and translation delta. The first RAM address must satisfy native alignment.

Every function starts at its owner's first byte. Function sizes cover all owners exactly, except the final owner can include the declared terminal tail. Reject duplicate, missing, extra, weak, local, aliased, zero-sized or displaced function entries. Do not synthesize entries to satisfy this census.

An active group is indivisible. All members must reference the same normalized producer and be active together. A previously accepted neighboring function remains a distinct target with its own result. Removing a group requires restoring or explicitly replacing every member producer.

Source organization is one authored C unit, with shared declarations moved into ordinary authenticated headers when useful. Do not generate concatenation or deduplicate declarations during production. Such transformations create another producer contract without helping this design.

## Producer and projection

Preprocess and classify the group once using the existing authenticated executable closure and dependency rules. Compile those exact preprocessed bytes once. All members inherit that translation unit's mechanical class. One assembly escape makes every member HYBRID_C; UNKNOWN rejects.

Preserve compiler assembly byte-for-byte. Use existing pinned compiler flags and native GNU 2.6 assembler flags. Validate assembly grammar without applying the ordinary `.text` replacement. Preserve raw assembler object evidence before any projection or ancillary stripping.

Validate the raw native object independently:

- Exactly one allocated executable `.text` contains the declared group bytes.
- The complete function and defined-symbol census matches the contract.
- Nonempty writable sections, COMMON storage, extra allocated sections and auxiliary output reject.
- Native alignment and terminal length match the authenticated assembler result.
- Tail bytes are zero, match their recorded hash, and contain no overlapping relocation or function.
- No authored padding function, explicit terminal fill, or assembly rewrite supplies those bytes.

The tail length must equal `alignUp(functionEnd, nativeAlignment) - functionEnd`. This equation alone is insufficient proof. The raw native object, untouched assembly, and pinned assembler invocation establish the producer.

The new projection function consumes that validated native object and normalized owner map. It must not expose unrestricted section renaming or alignment overrides to target configuration.

For each owner, copy its exact byte interval into its existing `.ob64.rNNNN` section. Concatenating projected section bytes must reproduce raw `.text`, including its native tail. No truncation, extension, filling or rewriting is permitted.

For owner offset `o` and native alignment `A`, derive projected alignment as `gcd(A, o)`, with `gcd(A, 0) = A`. Require power-of-two native alignment and four-byte owner boundaries. This retains the alignment guaranteed at that exact group offset. It does not claim each interior function begins at a native section boundary.

At link time, independently require `ownerVMA = groupVMA + o` and the corresponding ROM equation. Require exact owner sizes and no linker fill. Merely lowering section alignment without these equations must reject.

Preserve function size, binding, type, visibility and name. Rebase its section-relative value and section index to the containing owner. Preserve all original public entries. Unlike the old continuation mode, add no boundary symbols and change no function size.

Preserve the original `.text` section symbol as an anchor to the first projected section. Its base remains the native group base. Existing encoded group-relative addends therefore remain unchanged, including references beyond the first owner's end. Named member symbols retain their original absolute value through section/value rebasing.

Partition relocation entries by relocation place. Subtract the containing owner's group offset from `r_offset`. Preserve `r_info`, symbol identity, relocation ordering and every encoded addend. Preserve existing HI16/LO16 pairing checks; cross-owner pairs and unsupported relocation forms reject initially.

Validate relocation width and bounds before partitioning. Every relocation must belong to exactly one owner and must not cross its endpoint. Reconstruct the full group-relative relocation census afterward and compare exact normalized semantics with the raw object and reviewed contract.

Member relocation evidence must include both the owner-relative place and the group-relative place. It must retain the group-base anchor when one is used. Do not compare a grouped section reference against a standalone `.text` base without translating its semantics. Keep legacy contracts unchanged and bind grouped evidence explicitly to its producer.

Retain discarded ancillary relocation differences in proof reports. Reject unsupported load-relevant RELA or other relocation formats before projection. Metadata remapping must preserve nontext references or reject them; ancillary stripping must never hide uncontracted allocated bytes.

A section-symbol relocation must not be rebased to an arbitrary destination owner. Its original anchor and addend jointly define the target. Independent split-versus-unsplit links must test this rule at nontrivial placements and addends.

## Linking and acceptance evidence

Keep existing owner output sections and their one-section PT_LOAD mappings. Select each projected input section from `objects/c/groups/<id>.o` using exact paths. List that object once in the link input manifest. Each owner retains its accepted address, extent, flags and retail hash.

There is no physical group output section. The group exists in the raw compiler object and producer evidence. Projected sections retain the current physical owner layout. This avoids an additional aggregate-section and load-census abstraction.

Remove every grouped owner's original assembly contribution through the existing chunk-pruning mechanism. Prune each chunk once after collecting all removals. Authenticate and retain every fallback source/object. Prove omitted sections are absent while unrelated chunk sections remain exact.

A group proof records classification/input identity, compiler assembly identity, raw native object, projection contract, projected object and stripped linked object. A member proof references the group proof and its exact owner interval. Hash references alone are insufficient; strict verification must recreate the producer and projection once per group.

Independent verification must check raw versus projected bytes, complete symbol census, relocation semantics and permitted metadata differences. Use the project ELF reader to check serialized output. Do not rely solely on replaying the same projection writer and comparing its own report.

The final verifier checks each member's object contribution, public entry, placement, relocations and complete owner bytes. It then checks the complete retail ROM. Group success requires every member result, with no partial acceptance.

Existing current-state and recorded-build checks must reject absent group evidence, stale schemas and inconsistent member references. Preserve all compiler, assembler, preprocessing, artifact-confinement, baseline and structural checks.

## Cache, diagnostic and count rules

Cache the producer by the full normalized group record, source/dependency identities, exact preprocessing bytes, tool identities, flags and relevant implementation schemas. Member order and relocation changes invalidate the entire group. Header changes invalidate every consuming producer.

Store one artifact bundle per group. Member cache views are bounded references to that bundle. Reject mixed-generation member reports and old target-only cache records claiming group membership. Do not cache by selected function name alone.

`diff <member>` must compile or reuse the whole group, then select the requested owner for display. Show function-byte and complete-owner comparisons separately when a tail exists. Validate all members' placement and ownership in the focused link. A requested member can never silently compile alone.

The matching workbench must accept an explicit group candidate source. Until supported, it must fail closed with a group-specific diagnostic. It must not emit a standalone candidate that looks production-equivalent.

Status emits one result per accepted function target. Count each public member once if its inherited class is PURE_C and all final gates pass. Count the group as one producer in a separate diagnostic field. Do not count continuation markers or the tail as functions.

Byte accounting retains the union of accepted owner ranges, including exact native tail bytes already inside those owners. Show function payload and native padding separately if reporting them. Never add producer bytes again to member totals. Any failed member prevents the group from becoming accepted.

## Compatibility boundaries

The art-native descriptor remains unchanged, including its function census, native tail and allocation checks. A later migration to a one-member general producer would be a separately reviewed simplification. It is unnecessary for this implementation.

Existing multi-owner mode represents one logical function across accepted owner rows. It can preserve synthesized zero-size continuation entries. Existing multi-function mode represents reviewed local functions inside one owner. Neither mode expresses several independent public functions.

Do not relax their public-entry, partition or combination guards. Group targets must not also declare legacy multi-owner, multi-function, auxiliary or art-native contracts. Share parsing and byte-copy helpers only where their invariants agree.

An unsplit group output section would preserve native object metadata, but replace several physical owner sections and PT_LOAD records. That requires broader linker and structural-verifier changes. It is rejected for this first implementation.

Per-function assembly assignment loses the demonstrated native tail. Retained ASM tails, linker fill, injected padding, hidden functions and symbol-specific exemptions are excluded. None tests the proposed producer abstraction.

## Required evidence before acceptance

These are proposed tests, not results from this design assignment.

| Positive shape | Independent assertion |
|---|---|
| Pose research group, reclassified through production inputs | All five public entries, all owner bytes and all 17 load relocations survive native projection. |
| New project-authored pure-C two-function fixture, unrelated names and sizes | One member calls another; native terminal padding differs from the pose shape; split and unsplit links have identical bytes and public symbols. |
| New pure-C group with zero native tail | Zero-length tail is accepted without inventing bytes; count equals actual function census. |
| Existing art-native, local multi-function and continuation multi-owner controls | Old valid shapes still pass their old contracts; forbidden combinations still reject. |

The independent C fixture must be compiled with pinned production tools. Derive its dimensions from that compiler output rather than hand-encoding instructions. Choose ordinary C that emits an external call and an address relocation when possible. An assembler fixture can separately isolate section-symbol addends and HI16/LO16 behavior; it must remain ASM/HYBRID evidence.

Compare raw native and projected links at two aligned placements. Use external addresses with nonzero low halves and a carry-sensitive HI16/LO16 case. Check actual linked instructions, exact symbols, relocation semantics and allocated-section census. This is stronger than two generated reports agreeing.

Required negative controls:

- Missing, duplicate, reordered, overlapping, noncontiguous or wrong-context members reject before compilation.
- Missing public function, extra hidden function, changed binding, changed size or displaced entry rejects.
- Altered raw tail, appended zeros, uncontracted internal gap or a tail relocation rejects.
- Rewritten compiler assembly and forged projection text bytes reject independently of exact final bytes.
- Wrong relocation anchor, changed addend, dropped entry, crossing relocation or cross-owner HI16/LO16 pair rejects.
- Unaligned group start, incorrect derived slice alignment, moved owner or linker fill rejects.
- Extra C contributor, original ASM member still linked, duplicate object selection or wrong full object path rejects.
- Nonzero COMMON, writable output, extra allocation and auxiliary output reject at producer, cache and verifier boundaries.
- Group header edit, reordered members, stale schema or mixed artifact generations invalidates reuse.
- A macro/header assembly escape makes every group member HYBRID_C; external dependencies and UNKNOWN reject.
- Forged counts, duplicated member results, dropped member results and double-counted bytes reject.
- Retained nonexact Combat candidate remains nonexact; report equality cannot make it accepted.

Use small parser/projection/cache tests during implementation. Run one completed changed-input heavyweight audit after the complete tooling change and its bounded fixtures are ready. Do not precede it with a redundant full build.

The audit must establish unchanged baseline reconstruction, exact combined CURRENT, every applicable structural gate, and equivalent existing regression controls. Independent review examines the frozen diff, producer/projection evidence and smallest falsifiers. Review does not require an unchanged audit rerun.

Tooling acceptance does not activate the unfinished Combat wave. Later group activation must include the complete assigned wave and one final normal verifier. Changed integration inputs require verification at their completed boundary.

## Concrete implementation scope and risks

1. Add group config validation and normalized producer/member records in `active_targets.js`, with one focused group-contract module.
2. Add explicit native owner projection in `elf_text_split.js`, retaining the existing function's behavior and tests.
3. Extend `text_contract.js` with raw group and projected-owner evidence, without broadening the art descriptor.
4. Update `phase8_matching_c.js` compilation, independent proof, pruning, manifest, layout and map paths to use producers plus member views.
5. Update `source_policy.js` and `current_workflow.js` to classify, compile and reproduce once per producer.
6. Update diff cache, workbench compiler, diagnostic linker and `diff.js` dispatch for group-aware reuse and focused comparisons.
7. Update status/accounting and audit/reproducibility schema consumers; add focused positive and negative group tests.
8. Document the accepted producer contract in source policy, workflow and audit after review. Keep production group configuration empty until separately authorized activation.

The main risks are relocation-anchor errors, stale per-target assumptions and native alignment lost during projection. Exact linked bytes alone cannot establish producer honesty. The raw object, independent metadata checks and split-versus-unsplit controls address those risks.

The design is technically plausible because the existing splitter already preserves instruction bytes while remapping ELF metadata. The new native alignment and public-function mode remains unimplemented and untested. If pinned GNU 2.6 rejects the preserved group-base relocation anchor, stop and route that concrete limitation. Do not rewrite instructions or widen accepted shapes to bypass it.

