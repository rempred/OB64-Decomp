# Independent Material review: standalone analysis packets

**Verdict: Accepted.** I found no material defect in the frozen implementation. It may be adopted as the optional difficult-function analysis-intake command described by the assignment. Its Kuna and m2c results remain hypotheses, with m2c primary; this verdict does not accept generated C, any W8 source, or any matching/structural claim.

Reviewer `/root/db10_trace_review`; Director `/root`; launch `ANALYSIS-PACKETS-REVIEW-20260908-01`; review activation release `40174bbe11beddb9c3fbd2a18028a506257dbda9`; assigned implementation `5d57f140479f01e3ecd1bd80bae4185834ac40d8`.

## Subject and evidence authentication

The assigned implementation report hashes to `4E2F1828E864962BE08EDC3E49DE40A6AF6F073E6B7EA569F7B3CBE34B07EC3A`, and its evidence manifest hashes to `A4C9EB6B30C21D596826761B31F79344201A2EC59C300C70F6086993A6F42AF9`, exactly matching the review prompt. I independently checked every one of the manifest's 937 entries for presence, byte count, and SHA256; all 937 passed. The changed-file index hashes to `F0B9B20DD24A3B92D17014A21960C8BFDDFBC98EAA223762C592EEE57CD5DB00`, and all eight listed implementation/documentation/claim files still have the bound sizes and hashes. The focused reference comparison and routine-baseline records also match their assigned hashes `4372B22384A91572F03A1A4A3FF9B06A039012B4CA345BFA90203F7D6F0AB63A` and `72B36E63E95F9AED79FA48DFC6B607DF7EB2FF7854D36082194EE09A7754135A`.

The review claim was created atomically before the review-root writes and read back with the assigned task, launch and reviewer identities. Concurrent W8 source work was not used as review evidence; the reviewed implementation files and bound packet inputs were authenticated independently.

## Independent checks

I reran the focused suite into the new ignored review root. It passed all 40 checks in 25.9 seconds. The result is `build/analysis-packets-review-r1/focused/run-x7MUPM/results.json`, SHA256 `BEE9C944E5D51080A30DC6E9E1A6EAEA0278083E7A6EE61D96C51DAAC083D803`. This replay covered exact frozen outputs for `func_001F6098` and `func_001F3C00`, the explicit same-overlay table case for `func_001F197C`, the 376-byte compilation-group member `func_00204F34`, alternate-output separation, unsupported ownership/mapping/table inputs, corrupted caches, tool drift, missing tools and timeout handling.

I separately prepared `func_0020BFF8` through the public CLI. The first invocation produced both hypotheses and a byte-verified Kuna disassembly; the second invocation returned a cache hit for the same key and directory. An independent readback checked:

- the 28-byte `retail.bin` exactly equals ROM bytes `[0x20BFF8,0x20C014)` and hashes to `42B8E56A4C3097C5F8332B852371C4CFFE0BC702D3F142F3FD99CB958A616B02`;
- the ELF is big-endian ELF32/MIPS with one read/execute `PT_LOAD` at the accepted entry address, and its load bytes exactly equal that retail interval;
- Kuna and m2c outputs are nonempty, Kuna reports the complete 28-byte extent, and the separate disassembly status is `byte-verified`;
- the packet declares `hypothesisOnly: true`, keeps `primary: m2c`, and carries the required type/semantic/runtime limitations;
- all 19 cached artifacts match the packet manifest and the serialized identity hashes to the directory/cache key `1386931C57EAF0CFF58DCFCC07335E19AC4B81BA2E08C313151F756C771AD975`.

The independent readback result is `build/analysis-packets-review-r1/independent-result.json`. A scan of `tools/`, `tests/` and `config/` found zero references to the new packet module outside `tools/analysis_packet/`, supporting the claimed separation from ordinary build, link, diff and verification paths. Code inspection also confirmed that preparation reads the authenticated accepted model and normalized retail ROM, rejects unsupported owner shapes before launching analyzers, records explicit tables only after same-overlay accepted-map and switch-recognizer checks, reauthenticates tools and implementation after execution, and verifies the artifact census, hashes, identity and imported Python files before cache reuse.

## Routine-suite failures

The worker's `node tools/test.js` result is accurately reported as 12/16 passing. I did not treat the failures as green. All ten files named by `routine-baseline.json` still match its exact hashes. The active target `func_00204EE0` has `compilationGroup: combat_pose_metadata` and no standalone `source`, the production group exists, `tests/compilation_groups.js` explicitly requires zero active production groups, and `tools/lib/matching/target_model.js` still requires every active target to have `target.source`. Those facts directly explain the four observed failures in `active-targets`, `compilation-groups`, `matching-context` and `matching-workbench`.

The new packet module is absent from those suites and their dependency paths. The evidence therefore supports unchanged-baseline attribution: these failures expose an existing compilation-group/test-model incompatibility, not a regression caused by this implementation. Repairing that incompatibility remains separate work; it does not block use of this isolated optional command.

## Adoption boundary

The command is suitable for producing authenticated second-interpretation packets for the supported version-1 shape: one unambiguous accepted executable owner/slice at its primary entry, optionally with one explicitly validated same-overlay table. A compilation-group member is represented only by its accepted retail interval and records its production grouping; multi-owner logical functions, secondary entries, prefixes, ambiguous or multiple mappings, arbitrary data and inferred external context reject.

The cache is appropriate for trusted local reuse with drift detection. It is not a signed archive or a proof of the operating-system dependency closure. Default MIPS32 static analysis is not complete VR4300/FCSR/runtime execution. Generated output supplies hypotheses about structure and semantics; it does not establish original compiler history, source correctness, matching C, linked ownership, target-byte equality or complete-ROM equality. Ordinary source experiments and the final W8 acceptance gate remain governed by the canonical matching workflow.

All review writes are confined to the claim, this report and `build/analysis-packets-review-r1/`. No production source/configuration, shared tool, compiler, runtime, canonical build/diff/verifier or Git state was changed.
