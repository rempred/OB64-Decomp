# Verdict: Accepted

**Material result.** The frozen package supports the E16 candidate/pass identity and the claimed jump-to-first-CSE reuse boundary. E16 still contains a separate post-event-8 recomputation in jump output, first CSE removes that recomputation and reuses the pre-call pseudo, and later allocation places the already call-crossing lifetime in `s0`. The evidence therefore falsifies an allocation-only or final-scheduling-only origin for E16's retention. E04's final assembly also retains the pre-event-8 sum, but the bounded evidence has no E04-authenticated pass dumps and cannot transfer E16's stage boundary to E04. Retail independently recomputes the event-9 base after event 8. The eight-byte frame difference remains separate and unexplained.

**Consequence.** These conclusions may be propagated as candidate-specific static diagnostic research. They do not accept E16, E04, or any source; establish whole-owner equivalence; identify an original retail pass history, declaration, alias rule, or signed-overflow domain; prove a compiler defect; award matching credit; partition the B1F4 owner; or authorize production changes.

**Required Director action.** Record the E16 jump-to-first-CSE transition, E04 final-output retention, bounded E04 dump absence, retail recomputation, and separate frame question as Supported research only. After the W7 production writer releases its surface, the Director may separately assign an authenticated E04 RTL/jump/first-CSE capture with unchanged source, compiler, flags, and final-assembly parity. Use that result to choose at most one stage-predicted source experiment. A requirement that post-call recomputation survive first CSE applies only to an experiment testing the observed E16 CSE-retention mechanism; it is not a universal matching or source-acceptance rule.

## Frozen subject and eligibility

- Assignment: `combat-b1f4-diagnostics-review` revision 1, launch `COMBAT-B1F4-DIAGNOSTICS-REVIEW-20260907-01`.
- Frozen subject: `2011590ac399e3d417e886dc27fd091dc045ab50`.
- Accepted source baseline: `0e1191013aeebed2929c9caff7c1f139169ad7f3`.
- Frozen report: `docs/Plans/task-logs/combat-b1f4-preserved-diagnostics-r1.md`, 9,721 worktree bytes, SHA-256 `EABA8ADED92D93EB6D97A006F437DE5EBE0DB1B147C4696415B729286A5D9295`.
- Frozen evidence: `build/combat-b1f4-preserved-diagnostics-r1/evidence.json`, 9,342 bytes, SHA-256 `D24479CEC72756316CD94DC98BEA0D372D1BA346075F49ABC56F2CF6CCCDB066`.
- Frozen extracts: `build/combat-b1f4-preserved-diagnostics-r1/event-time-pass-extracts.txt`, 17,153 bytes, SHA-256 `35EAF1C1397F3B1A502D709AD87CB11B6C1F514C76906790987EC474392AD364`.
- Reviewer: `/root/compilation_groups_implementation_review`, independent of the worker that produced the subject.

The subject commit's report blob is 9,720 bytes with SHA-256 `242A9BFD9EE423FDC4155343E8E0EC7566BE8D9A2139BCA6A1AFD04C20D9A4A4`. Comparison found only checkout newline representation at the file end; after newline normalization the subject blob and assigned worktree report are identical. The assigned artifact therefore resolves uniquely. This is an identity note, not a finding.

The worker marked the diagnostic complete and its probe/run artifacts remain acceptance-ineligible. The fresh reviewer claim was created atomically before review writes. W7 production inputs were excluded. All reviewer mutations stayed in the assigned claim, report, and ignored review root. No C compilation, linked diff, build, verifier, source-policy generator, runtime, GUI, bridge, database, or Git mutation was used.

## Claims reviewed

1. P04 binds the preserved E16 source, target, compiler record, ordered pass set, and final assembly.
2. E16 retains separately expanded post-call arithmetic through jump output, then first CSE replaces it with the pre-call sum.
3. The resulting call-crossing lifetime exists before allocation; allocation and final scheduling are not its sole origin.
4. Retail recomputes the event-9 base after event 8, while E04 final output retains the pre-event-8 sum.
5. E04-authenticated RTL, jump, and first-CSE dumps are absent only from the named historical run and probe surfaces.
6. The proposed E04 capture is a proportional discriminator, and any later source experiment must stay within the causal limits of the captured stage result.
7. The 272-byte candidate versus 280-byte retail frame difference remains independent of the event-time reuse result.

## Independent method and results

I used a reviewer-owned Node.js static checker to rehash all 21 bound evidence inputs and independently inspect the raw sources, manifests, pass dumps, final assemblies, object bytes, relocation records, accepted original word records, placement metadata, bounded directory inventories, and family membership. It checked all thirteen P04 dump files, confirmed all 59 frozen extract blocks are literal selections of their corresponding raw dumps, decoded all 897 contiguous retail words, and reconciled the complete seventeen-member shared W6 family plus its W5, W7, and W8 dependencies.

The successful checker is `build/combat-b1f4-diagnostics-review-r1/attempt-04/static-review.js`, SHA-256 `64E8B1CB8F9E0A965B8E3DD390EA2B297433F2F5A669BE039559F3A28893C755`. Its result is `build/combat-b1f4-diagnostics-review-r1/attempt-04/static-review-result.json`, 4,383 bytes, SHA-256 `EC67CF1931F8012BFDCB5A141386BE3DA25D02BBD97D4D3EDD9B8DAFB9690868`.

### Candidate and pass identity

- P04 is probe `93A46B0D3C89F37023582D452B8DEEAC22AB66883F37AAE4ADA2C9827923C108` for target `558D4917C41101CC9B097C7B75F10A01E58C07F6EBB1337622A65ED84C842F5C`.
- Its embedded source text and source file are identical and hash to E16 identity `BDD3B1A20DF1B8F7D2219775F665C93A4318238B00D09EE391F882C4965D6B18`. The compiler record is `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6`.
- The thirteen ordered pass names, flags, suffixes, dump byte lengths, and dump hashes match the probe manifest.
- P04's final assembly equals the preserved E16 workbench assembly after removing only each file's `.file` directive and compiler-command comment. No code instruction was normalized away.
- The supplemental E16 workbench report hashes to `CB2F6B7D3891AC1E414134DFAB59E39B5BC25AB8A7ACE104AEC89C65F2E8C71F`, binds the same target/source/compiler records, emits 3,576 bytes with a 272-byte frame, and remains nonexact.
- E04 binds different source identity `25C2B19614E7C99A026750897005399A09B71796C2652FFB338530C10AAB64ED`. E16 pseudo and instruction identifiers cannot be attributed to E04.

This authenticates correspondence among the named historical artifacts. It does not reproduce the compiler or authenticate an original retail compiler/pass history in this review.

### E16 stage boundary and causal limits

The independently read stages show the precise transition:

| Stage | Event-time observation |
|---|---|
| RTL | UIDs 2177 and 2179 form pseudo `416 = 122 + 144 + 84`; UID 2185 passes `416` to event 8. After call UID 2191, UIDs 2194 and 2196 separately rebuild the base as pseudo `418`; UID 2198 adds pseudo `85` for event 9. |
| Jump | The same separate post-call UIDs 2194 and 2196 remain. |
| First CSE | UIDs 2194 and 2196 are gone; UID 2198 instead forms event 9 from pre-call pseudo `416 + 85`. |
| Flow | Pseudo `416` is used three times across eight instructions and crosses one call. |
| Global allocation/final | The retained sum occupies `s0`; event 8 consumes `s0`, and event 9 adds stack-decimal-164 duration to `s0`. |

The source writes the event-8 and event-9 expressions separately, and the initial RTL expands a distinct post-call expression. The shown arithmetic inputs have no intervening definitions before the second expression. Those facts support the availability and stage-boundary observation. They do not reveal the exact internal CSE routine or cost rule. The event call receives `arg0` and may affect pointed-to state; the evidence establishes no hidden mutation of the independent automatic scalar pseudos. It also establishes no original declarations, alias contract, nonalias contract, or signed-overflow domain. Retail intermediate passes are unavailable.

The sound causal conclusion is narrow: for this E16 artifact, retention first becomes visible between jump and first CSE, so allocation-only and final-scheduling-only accounts are falsified. A future experiment designed specifically to prevent this retention needs a predicted effect at that boundary. Other legal strategies might match through different dataflow and cannot be rejected merely because they do not preserve one chosen intermediate form.

### Retail correspondence and E04 boundary

The accepted original contains 897 contiguous words over complete owner ROM `[0x0022B1F4, 0x0022BFF8)`, or 3,588 bytes, with loaded entry `0x801E7F24`. The independently decoded tail has the retail base sum at ROM `0x0022BF08`, the event-8 call at `0x0022BF30`, a new `s6 + s8` at `0x0022BF40`, stack reloads at `0x0022BF44` and `0x0022BF48`, and additions around the event-9 call at `0x0022BF58` and `0x0022BF60`. Retail therefore emits post-event-8 recomputation. Static words do not establish why.

E04's final assembly instead computes and retains the event time in `s0`, uses it for event 8, reloads only duration after the call, and adds duration to `s0` for event 9. Its decoded object is 3,576 bytes against 3,588 retail bytes, `rawExactBytes: false`, and `acceptanceEligible: false`. E04 and E16 differ at fourteen object words bounded by relative offsets `0xD08..0xD40`; that comparison is between two candidates, not candidate-to-retail equivalence.

The E04 final-output fact cannot establish its first reuse stage. The named E04 run contains exactly `candidate.compiler.s`, `candidate.input.c`, `candidate.o`, `candidate.s`, and `workbench-report.json`, with no pass dump. The named probe root contains exactly three probe directories; their embedded source identities are `6AA5BD7D58B00CBD6948714F7822C3700EF2744919E23AA71DD074885F189F8E`, E16's `BDD3B1A20DF1B8F7D2219775F665C93A4318238B00D09EE391F882C4965D6B18`, and `8E1348C7A2CA8B4653B22FF7A011DEA70EE0027F4758FC1318A8346DAD4B0B0F`. None is E04. This proves absence only on those two named surfaces.

The minimum useful follow-up is therefore an E04-authenticated RTL, jump, and first-CSE capture, with unchanged compiler/source/flags and preserved final-assembly parity. If reuse already exists in RTL, E16's stage result does not transfer. If jump still has separate sums and first CSE reuses the earlier value, the same transition is supported for E04. If separate sums survive first CSE, inspect only later retained stages until the first reuse appears. Only after that discriminator should one source experiment test a predicted effect at the observed stage. This route does not authorize duplicate-branch recipes, carrier spelling churn, unsigned-negation identities, memory side effects, changed call arguments, register binding, source-policy exceptions, or unrelated prefix drift.

### Frame question

The candidate directly accesses twelve scalar stack slots at decimal offsets 140, 148, 156, 164, 172, 180, 191, 199, 207, 215, 220, and 228; four are byte accesses. Candidate saved registers begin at `0xE8` in a 272-byte frame. Retail has no direct stack access at `0xE8` or `0xEC`, begins saved registers at `0xF0`, and uses a 280-byte frame.

The missing direct accesses do not prove an omitted local; an eliminated allocation remains possible. No allocation event or eliminated-object provenance identifies the extra eight bytes. The frame deficit and the 12-byte text deficit remain open and are not explained by the event-time CSE result.

## Findings, tool history, and evidence limits

No admissible defect was found in the assigned diagnostic claims. The source-experiment statement is accepted with the propagation limit stated above: survival through first CSE is a falsifier for the observed E16 retention mechanism, not an acceptance condition for every potential source formulation.

The review preserved all unsuccessful reviewer-tool attempts:

- Attempt 00's PowerShell base64 decoder used an invalid `.AsSpan()` call and produced no decoded evidence. Its failure record hashes to `DADD7BEAC1C195AD3B9D88A638EEF5903E1686677D43FE1F36A46C790757AA13`.
- Attempt 01's checker, SHA-256 `894B07C24901E425E8E6CFEFDDADD914D91CED361EA02D25CB3C2B183B9173F2`, imposed a generic four-block minimum on the one-block `dbr` extract. It produced no result; failure record SHA-256 `27A1E1DA11713F71E0E52B270833FFEB3F112F591E4B6BB8C2E3E01C1E980BB3`.
- Attempt 02's checker, SHA-256 `D582E75C76655EA37EAF99C6393121A8D2EBF853247FFF65C8127E84434617BD`, required UID 2206 at column zero although delay-slot scheduling nests it in sequence UID 2675. It produced no result; failure record SHA-256 `8B642F19A566D8A411BBDC812D3F4B19C2FDDFE2F7FAF9FCD9A34DF4C2953F45`.
- Attempt 03's checker, SHA-256 `5C59D8733FB6968D17098B83BE3504085C09A1DD492DC314FE8C24FC41B43948`, overconstrained placement of the independent event-ID load in final assembly. It produced no result; failure record SHA-256 `B376798BE9AE9F9CE3DAF47C56F21EB504BABE3333A8FCF33EECD0DCD2A865E8`.
- Attempt 04 changed only the supported checker defects above and passed. A later PowerShell artifact-inventory command had a parse-only pipeline error before executing its body; that auxiliary failure is preserved at `postcheck-01/failure.md`, SHA-256 `E7D245F5D593501C5B4957EC7B24B70BAADCECBDC027493493FE40908C9341C4`, and the corrected read-only inventory completed. The first final-contract check then assumed CRLF separators for the LF report and stopped at its prefix assertion; `postcheck-02/failure.md`, SHA-256 `EFABFFED636B3A92413728471B7DE5ACDD7578EE316BED4881E1A37D6FD986C1`, preserves that no-write failure. The clean check normalizes newlines before evaluating the same contract.

These checker failures concern reviewer assertions and scripting only; they do not weaken or modify the frozen subject. Static evidence cannot identify the original retail source, compiler-pass history, hidden source contracts, whole-owner behavior, or causes of the remaining frame/text differences. No new pass dump was generated.

The family reconciliation found all 8 W5 targets, all 17 shared W6 targets including complete `func_0022B1F4`, all 7 W7 targets, and all 15 W8 targets. The B438/B894 and EAF0 dependencies remain present. The complete B1F4 owner and every shared-wave dependency remain mandatory.

## Exact next route

The Director may propagate the E16 jump-to-first-CSE reuse boundary, the allocation/scheduling causal exclusion, E04 final-output retention, bounded E04 dump absence, retail recomputation, and separate frame question as Supported diagnostic research. Production remains with W7's sole writer.

After W7 releases its production/build surface, the Director may leave this evidence queued or issue a separate static diagnostic assignment for the exact E04 three-stage capture described above. That capture must bind E04 source identity `25C2B19614E7C99A026750897005399A09B71796C2652FFB338530C10AAB64ED`, the existing target and compiler records, the unchanged dump flags, and final assembly corresponding to the preserved E04 run except diagnostic provenance. The captured first differing stage must govern any later one-variable source experiment.

Neither this review nor that capture may activate source or accept a candidate. Any resulting candidate must return through the applicable complete-owner linked-byte, ownership, source-class, and final complete-ROM wave gates, with the seventeen-member shared wave and preceding/later dependencies preserved.
