# Accepted

**Verdict:** `Accepted`.

**Status:** completed.

**Material result:** Frozen result `96bc8469f196fd3be106829ef414ff952816b538` resolves `GB26-IR-001` and `GB26-IR-002` without a material regression.

**Consequence:** Both prior findings close. The GNU Binutils 2.6 structural migration may advance from independent review.

**Required next action:** The Director may accept this correction, propagate the structural migration, and record both finding closures.

## Frozen subject

| Item | Identity |
|---|---|
| Correction base | `6a4db1a10c83e2ca4ea8324f19139e30c2658056` |
| Correction result | `96bc8469f196fd3be106829ef414ff952816b538` |
| Result tree | `043811777aed43708b22ea12748e22fac76902a0` |
| Result parent | `6a4db1a10c83e2ca4ea8324f19139e30c2658056` |
| Reviewed repository | `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp` |
| Reviewer-owned repository | `C:\Users\Joe\.codex\ob64-gnu-binutils-2.6-correction-independent-review-20260813-r1\repo` |

The canonical repository was at the frozen result before review. Its tracked working tree was clean.

The requested report path did not exist. The reviewer did not author the correction and observed no competing writer.

This was a direct Joe assignment. The reviewer workflow therefore required no workspace claim.

All durable mutations and generated outputs stayed under the reviewer-owned root.

Identity tests used unique system-temporary directories as reviewer-owned scratch. They removed those copies after each test.

The frozen implementation and `.codex-remote-attachments\` remained untouched.

## Claims reviewed

The review covered two correction claims.

1. The first-tracked-chunk smoke case creates its output directory before writing and works from an absent smoke root.
2. Source policy authenticates the production preprocessing executable closure before preprocessing and binds that closure into evidence.

These claims include the ten corrected assertions in the assignment.

| Corrected assertion | Result |
|---|---|
| The smoke case creates its required directory before its first write. | Supported |
| The smoke correction preserves its evidence target. | Supported |
| The smoke suite works when `build/toolchain-smoke` is initially absent. | Supported |
| Source policy authenticates the production preprocessing closure. | Supported |
| The driver and selected `cc1.exe` are pinned, validated, and reported. | Supported |
| Missing, drifted, or unbound identities fail before preprocessing. | Supported |
| Focused regression coverage exercises the corrected identity contract. | Supported |
| Classification, acceptance, and reporting gates remain intact. | Supported |
| The frozen change stays inside the two-finding boundary. | Supported |
| Preservation evidence belongs to the frozen result and supports exactness. | Supported |

## Prior-finding disposition

| Finding | Disposition | Reason |
|---|---|---|
| `GB26-IR-001` | `Run again` | The correction changes the failed case setup while preserving the original comparison. |
| `GB26-IR-002` | `Replace` | The former driver-only evidence cannot prove the expanded executable-closure contract. |

`GB26-IR-002` now uses closure discovery, exact identity checks, driver-binding checks, negative controls, and identity-bound reports.

## Causal review scope

The frozen delta changes nine tracked files. It adds 521 lines and removes 39 lines.

The implementation changes are limited to the smoke setup and source-policy identity contract. The remaining changes add focused tests, configuration, documentation, and the correction record.

No source owner, target source, function boundary, overlay, segment, linker rule, relocation rule, or compiler identity changed.

### Earlier checks

| Earlier evidence area | Status | Causal basis |
|---|---|---|
| First-tracked-chunk smoke case | `Run again` | The correction changes this case's directory setup. |
| Source-policy closure and identity failures | `Replace` | The evidence boundary now includes the selected preprocessing engine. |
| Active classification census and source-policy reports | `Run again` | The shared resolver and result digest changed. |
| Current build, verification, and exact-ROM acceptance | `Run again` | These consumers use the changed source-policy resolver and digests. |
| Frozen delta and supplied evidence provenance | `Run again` | The correction and new evidence require fresh identity checks. |
| Other twelve GNU 2.6 smoke checks | `Keep` | Their code, inputs, flags, and expected values did not change. |
| GNU 2.6 bundle and build provenance | `Keep` | The correction does not change the accepted binaries or manifests. |
| Structural boundaries, overlays, segments, and executable extent | `Keep` | No producer or accepted meaning changed. |
| Linker ownership, placement, and relocation rules | `Keep` | No governing source or contract changed. |
| Matching KMC compiler identity and compilation semantics | `Keep` | The GCC 12.2 chain classifies source only. |
| Modified-game behavior | `Keep` | The correction changes verification tooling, not game behavior. |

No `Add` check was necessary. Inspection found no new material risk with a separate causal path.

### Proportional expansion

The source-policy configuration schema changed from 1 to 2. The shared resolver, evidence identity, and result digest also changed.

Those changes widen the evidence boundary and alter foundational shared logic. They affect build and verification consumers.

The review therefore reran active classification and one clean heavyweight audit. This was the smallest combined downstream recertification.

A new historical migration campaign was unnecessary. Accepted structural meaning and the GNU 2.6 toolchain remained unchanged.

The heavyweight audit also repeated kept structural checks. Those incidental results do not change their `Keep` disposition.

## Review method

The review used five methods.

1. Authenticate the commits, parent relationship, result tree, tracked delta, and supplied evidence workspace.
2. Inspect the changed producers and trace their production call paths.
3. Reproduce the smoke failure condition from an absent generated root.
4. Falsify the preprocessing contract with a minimal tree and seven one-variable identity failures.
5. Rebuild the affected acceptance pipeline through a clean heavyweight audit.

The correction report and generated logs served only as an evidence index. Reviewer-owned executions supplied the verdict evidence.

Review runners matched the supplied qualified identities.

| Runner | Observed identity |
|---|---|
| Node.js | `v24.13.1`; SHA-256 `E3BE0545990C90995D7BF3A7AF5D64AF1F2E0FC1BBD9B79C27F7ABC1E9676E50` |
| Pinned Windows PowerShell | SHA-256 `7600FFE12DA441FE89D035B13801E8E91D064BC544A27B19A5CF49F6AB8B18F5` |
| Pinned automation assembly | SHA-256 `13FB07233112F765DE69AE4CDE6728AF672442DC9C5D7C9412C830E27FC1FC26` |

The smoke suite and audit independently authenticated the unchanged GNU 2.6 tools and MSYS runner.

## Direct observations

### Smoke correction

`tests/binutils_smoke.js` now creates `build/toolchain-smoke/first_tracked_chunk` before entering the part loop.

The first write occurs later when the adjusted source is written. The directory creation therefore dominates every case write.

The base-to-result diff only moves the directory declaration and adds recursive creation. It does not alter the manifest, source parts, flags, range, or comparison.

After setup, `build/toolchain-smoke` was confirmed absent. The standalone suite then passed all 13 checks.

The reviewer report was byte-identical to the supplied smoke report.

| Smoke evidence | Result |
|---|---|
| Report bytes | `5,568` |
| Report SHA-256 | `5A4EB9B42006625FB09E02323CAFD18958E16A080BB3E91F1CD48866751C1E9D` |
| First tracked chunk bytes | `65,536` |
| First tracked chunk SHA-256 | `A5AC0EB85A4882E1AC9091F31C7C7B929DE6FF224CA3963B863EC2AAE8AD96A5` |

The first smoke attempt lacked the normalized reviewer baserom. Its later cutover check stopped on that setup prerequisite.

That attempt did not test the corrected defect. The failed run was preserved, the authenticated baserom was generated, and a fresh smoke root was used.

### Production preprocessing closure

The reviewer queried the production driver with `-print-prog-name=cc1`. It selected the configured GCC 12.2 engine.

Verbose preprocessing invoked one companion executable. The command line named that same `cc1.exe` and exited zero.

The reviewer then built a minimal external tree containing exactly two files.

| Role | Bytes | SHA-256 |
|---|---:|---|
| `mips64-elf-cpp.exe` driver | 1,225,728 | `56D276AE66F2F499FAD2454663E8B5B82B20D5D7C44A4116349C096780FFF927` |
| GCC 12.2 `cc1.exe` engine | 21,875,200 | `40B1F1C1A2476FD1E286EDAFDEF6E352C188A722CF6E4AD9D58ED80C96F50A84` |

The relocated driver selected the relocated engine. It preprocessed the ordinary-C fixture successfully with the production flags.

This result confirms the required non-system companion executable closure for `-P -undef -nostdinc` preprocessing.

### Resolver and failure order

Direct inspection found this order in `tools/lib/source_policy.js`.

1. Authenticate the matching-compiler manifest and contract.
2. Authenticate the driver by file, size, and SHA-256.
3. Authenticate every declared dependency by file, size, and SHA-256.
4. Ask the authenticated driver to resolve each declared program.
5. Compare real paths and validate the driver version.
6. Return the preprocessor object used by classification.

Individual classification catches resolver failures and returns `UNKNOWN` without a preprocessor record.

Active-target classification resolves before classifying sources. A resolver failure throws before any active source can be accepted.

The reviewer instrumented executable invocations for all seven negative cases.

| Negative case | Individual result | Active result | Preprocessing calls |
|---|---|---|---:|
| Missing driver | `UNKNOWN` | Throw | 0 |
| Driver size drift | `UNKNOWN` | Throw | 0 |
| Driver SHA-256 drift | `UNKNOWN` | Throw | 0 |
| Missing engine | `UNKNOWN` | Throw | 0 |
| Engine size drift | `UNKNOWN` | Throw | 0 |
| Engine SHA-256 drift | `UNKNOWN` | Throw | 0 |
| Exact but unbound engine | `UNKNOWN` | Throw | 0 |

The unbound case made only the required `-print-prog-name=cc1` probe. It never invoked preprocessing.

### Classification, reporting, and digest binding

The focused suite preserved all ordinary fixture classes. It also passed deterministic, escaped-path, and shared-census checks.

All seven identity cases produced their expected failure. Both individual and active-target paths rejected each case.

The standalone source-policy command reported both executable identities. Every one of its 37 target records carried the same identity set.

The reviewer independently recomputed all 37 result digests. Every recorded digest matched.

Changing or omitting the engine identity changed the control digest. This diagnostic confirms that the engine is inside the digest boundary.

The reviewer classification and digest values matched the supplied source-policy report for all 37 targets.

### Clean acceptance audit

The entire reviewer `build\` directory was moved intact before the audit. The audit work root was also initially absent.

The audit ran from detached frozen result `96bc8469f196fd3be106829ef414ff952816b538`.

| Acceptance evidence | Result |
|---|---|
| Heavyweight audit | `PASS` |
| Structural protections | `PASS` |
| Current verification | `PASS` |
| Normalized ROM | 41,943,040 bytes; SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Phase 8 ELF | 100,536,566 bytes; SHA-256 `AFA3A43D2241F0EEC9923DC463FA14B2B85B0058485A3C83713C73F345EC3D32` |
| Exact C owners | 37 |
| Source classes | 5 `PURE_C`; 32 `HYBRID_C`; 0 `ASM`; 0 `UNKNOWN` |
| Source bytes | 1,088 `PURE_C`; 8,120 `HYBRID_C` |
| Compiler assembly rewrites | 0 |
| Relocations | 408 load-relevant; 0 ancillary; 38 retired `.pdr` |
| p3066 | Inactive |

The reviewer `build/current/verification.json` had SHA-256 `BBB1558AE9123CB0D6B460436B356B5CA3FEEEF1E459BCF6DB6F480B1FCCC23B`.

That file was byte-identical to the supplied verification report.

## Reused frozen evidence

The six assigned correction artifacts were read in the required order. Their hashes and internal references were checked before reuse.

The supplied clean repository remained detached at the correction base, as declared by the correction report.

Its executable, configuration, test, and documentation producer files matched the frozen result.

Two non-executable frozen files were absent during its audit run.

- `build/README.md` was absent because the complete generated build directory had been moved.
- The new correction report was not copied into the isolated producer checkout.

Neither file reaches smoke, classification, compilation, linking, verification, or audit semantics.

The reviewer audit used the exact frozen commit and closes this literal-checkout provenance limit.

Semantic comparison produced these results.

| Supplied artifact | Reviewer comparison |
|---|---|
| Smoke report | No differences |
| Source-policy report | Only generation time and reviewer absolute driver path differed |
| Fresh-compilation report | Only generation time and reviewer output path differed |
| Verification report | No differences |
| Audit report | Only completion time differed |

The supplied evidence therefore supports the recorded exact ROM, classification census, source-object proofs, and structural results for the frozen correction.

## Tests and results

| Test | Result |
|---|---|
| Commit, parent, tree, clean-state, and file-boundary checks | Pass |
| Base-to-result diff and whitespace check | Pass |
| Standalone smoke from absent smoke root | 13 of 13 pass |
| Driver `-print-prog-name=cc1` query | Pass; selected pinned engine |
| Verbose production preprocessing | Pass; one companion executable observed |
| Two-file minimal closure tree | Pass |
| `node tests/source_policy.js` | Pass |
| Seven identity failures | All rejected before preprocessing |
| `node tools/source_policy.js` | Pass; 5 `PURE_C`, 32 `HYBRID_C` |
| `node tests/active_targets.js` | Pass; 37 targets |
| Four changed-JavaScript syntax checks | Pass |
| Thirty-seven digest recomputations | 37 of 37 match |
| Clean `node tools/audit.js` | `AUDIT PASS` |
| Supplied-versus-reviewer evidence comparison | Equal except declared volatile paths and times |

## Adversarial-test admissibility

The absent smoke root is reachable after a clean clone or generated-output cleanup. Failure would block the assigned standalone smoke claim.

Each identity mutation models an ordinary missing, partial, changed, or incorrectly installed tool. Those states are named by the tracked fail-closed contract.

Each mutation changed one variable. An unchanged authenticated control remained available.

The material consequence would be unauthenticated preprocessing before a source-class acceptance decision. The tests stay inside the assigned toolchain threat model.

The minimal tree is a positive acceptance falsifier. It tests whether the observed two-file companion closure is sufficient under production flags.

The digest identity alteration was diagnostic only. It did not create a finding or change the trusted configuration.

No hostile race, forged hash, malicious reparse point, or verifier mutation was used.

## Admissible findings

None.

No observation identifies a material false result, unsupported assigned claim, preservation failure, or escaped correction boundary.

## Evidence limits

The review did not rebuild the accepted GCC or GNU 2.6 binaries from upstream source. Their unchanged authenticated identities remain preserved evidence.

The minimal closure test covers the production preprocessing flags and non-system companion executables. It does not claim an operating-system DLL inventory.

The review did not test hostile environment races or deliberate evidence forgery. Those threat models were not assigned.

No emulator or modified-game test ran. The correction changes verification tooling and makes no runtime behavior claim.

The initial smoke setup failure proves only that the reviewer clone lacked a generated normalized baserom. It is not a correctness defect.

## Documentation consequences

The changed source-policy and toolchain documents accurately describe the reviewed two-executable contract.

The earlier independent review and worker records remain preserved. This report supersedes neither record and edits neither file.

This accepted verdict closes `GB26-IR-001` and `GB26-IR-002`. No additional correction or research document is required.

The Director may update the structural migration status and any canonical closure marker during intake.

## Exact next route

The Director must intake this uncommitted report as `Accepted`.

The Director may then commit the review record, close both findings, accept the correction result, and propagate the GNU Binutils 2.6 migration.

No worker correction, proportional re-review, or reopened research assignment is required.

Do not push or publish as part of this review intake.
