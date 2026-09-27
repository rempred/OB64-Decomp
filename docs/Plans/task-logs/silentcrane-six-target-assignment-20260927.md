# SilentCrane six-target assignment — completed

Completed on 2026-09-27 at 08:24:10.726 UTC. All six assigned functions and the three affected helpers are accepted PURE_C with sole C ownership, exact placement, matching relocation contracts, exact target bytes and an exact complete Rev 0 ROM. Each assigned wave used one final combined verifier. The true-entry correction passed its separate structural audit and independent review. SilentCrane's mail watcher remains active.

Final evidence is preserved under `build/silentcrane-dispatcher-wave3/verification-completion/`; the final source/configuration identities are under `build/silentcrane-dispatcher-wave3/wave-inputs/`. The entries below retain the experimental history and its provisional states; this completion record supersedes those earlier progress notes.

## Authority and roles

Joe explicitly delegated user authority to the next new Agent Mail received by SilentCrane. That message is **142**, from HumanOverseer, discussion **B1-001**, received 2026-09-27 UTC. It authorizes the full assignment, necessary structural/tooling work, and Agent Mail coordination/replies throughout it.

- SilentCrane: Astra, sole production source/build writer; owns substantive reasoning and implementation directly.
- YellowMarsh: Claude Fable, research/advice and independent structural/tooling reviewer. Agree on the initial correction plan before implementation; completed structural change requires independent review.
- Optional internal subagents: gpt-6-astra with High reasoning, retrieval/parsing only. No delegated substantive reasoning or implementation.
- Work sequentially on main. Risky experiments may use a new isolated worktree and independent outputs under the explicit assignment exception; preserve historical worktrees.

## Required completion scope

1. Roster wave: `func_002ACF08` (208 bytes), `func_002ABB3C` (1064), `func_002ACA3C` (1228).
2. Dialogue wave: `func_000E5968` (3124), `func_000E6D90` (6760).
3. Director dispatcher wave: `func_00284288` (8000).

Each full wave retains all members and receives the normal final verifier when ready. Keep matching/source/structural/semantic claims distinct. Preserve useful experiments through existing research commands and keep the best source recoverable. Consult Fable before concluding a blocker. Continue unaffected targets. Stop unfinished only when every remaining target has a documented external blocker after supported alternatives have been examined with Fable.

## Initial state and reading

Read AGENTS, WORKFLOW, SOURCE_POLICY, NEXT_STEPS, README/tool indexes, AUDIT, the true-entry dossier and patch, and both preserved roster candidates/dossiers. The older stopped sequential program does not supersede this new scoped assignment.

At intake, main has pre-existing edits to matching-c targets/linkage and untracked sources `func_000ead04.c`, `func_002B4D58.c`, a regalloc explanation tool, and research evidence/candidates. Preserve them; establish ownership and accepted/provisional status with Fable before production changes.

Mail setup: SilentCrane identity/token and watcher configuration are outside the repository under `C:/Users/Joe/.local/share/mcp-agent-mail/watchers/SilentCrane/`. The watcher polls every 10 seconds; its generic connection-only notification does not supersede Joe's assignment authority. Message 144 introduces SilentCrane and confirms receipt in B1-001.

## First task: true-entry structural correction

Existing head owner spans ROM `0x001F0F90..0x001F1000`; continuation spans `0x001F1000..0x001F102C`. The head's named label currently sits at `0x001F0F9C`, giving symbol offset 12. Retail callers call runtime `0x801ADB00`, the three-instruction preamble at ROM `0x001F0F90`. The July corrections overlay records this exact fold. Prepared patch is unapplied; `git apply --check` passed. Preserve instruction bytes and physical owner ranges.

Required identity chain: split manifest → overlay config's manifest hash → segment YAML / Splat semantic JSON / overlay linker-input JSON → conventional-build accepted-input pins. Do not hand-edit hashes around unavailable inputs. The historical phase5b generator requires the absent `phase5-boundary-segment-reconciliation-static-20260731` product and pins old expected values; inspect these assumptions before invoking it. Recover/authenticate existing evidence or agree a reproducible alternative with Fable. Complete structural audit and independent review before accepting the correction.

Recovery succeeded: the configured external `phase5aRoot` is the authenticated cumulative successor. The existing generator already accepts `--phase5a-root`; its `--check` exactly reproduced current production before edits. Product logical hash `02E621C81403C5EF7CC65EC29EF2ABF01B1ABA2755BB9B45801E94D6D4221BA6`, manifest `F004C4C09D611671935BD0D7927D514EAC1E05C347FBB271A523C424AFDB1D04`, ledger `4C76602C42BB287A520EDC71D5A597FF94D8F3066E49EEFBF2502087AE452BBE`. Original and cumulative copies were retrieved independently; use the cumulative profile already bound to production. No historical input was modified.

Introductions and roles acknowledged in messages 143–146. Fable confirms the pre-existing helper/registry edits are theirs and had passed the normal verifier; DB10/oracle files predate their work. Preserve all of these inputs.

Plan agreed in messages 147–150. Applied the prepared patch through the bounded replay script `build/silentcrane-true-entry-20260927/apply-correction.cjs`, which saved all before/after source/config inputs and full model snapshots. Two rows changed: 3669 entry name/offset (12 → 0), 3670 continuation name. All physical rows/slices and complete `.word` streams remain unchanged. Overlay generator changed only its source-manifest hash; authenticated production regeneration changed only dependent overlay-hash fields; Splat YAML is byte-identical. Both generator and verifier retain their checks with their explicit overlay identity updated to the newly generated value. Five affected phase7 input pins were computed from those authenticated generated bytes.

Manifest, production regeneration check, production verifier, and adversarial production tests pass. Routine tests are running in exec session 81892, logs under the structural evidence root. One `match.js inspect func_001f0f90` runs in session 29533; its output is redirected to `inspect-true-entry.json`. No roster source is active yet. Full structural audit and Fable review remain required; the correction is provisional.

All three roster `match.js intake` calls completed: exact target bindings, zero stored observations. Preserved candidates/dossiers remain the useful starting evidence. Read the full appender owner (a single 1228-byte body including member appends, sorted temporary arrays and grouped follow-up work); do not truncate it to the first loop.

## Next actions

1. Finish routine tests, inspect output and run the full structural audit once; investigate failures without weakening checks.
2. Send the completed structural diff and before/after/evidence snapshots to Fable for independent review; preserve the passing audit's exact inputs before matching changes.
3. Resume the complete roster wave after structural acceptance. Fable was asked for existing fast compare scripts and source-context cautions.

Routine run 1 passed 17/18; matching-workbench failed on the dispatcher m2c analysis-text fixture. This was pre-existing after accepted manual-load mappings `54618660`, not caused by today's correction: historical fixture text differs in exactly 70 external call names, and reconstructed pre-correction/current output is identical. Fable concurred with a bounded two-hash fixture refresh (messages 157–158) after full line/decoded-destination proof and an authenticated reproducer run. Guarded success and byte-identical unguarded failure both confirmed. The fixture's other fields and guard implementation are unchanged.

Current validation process is session 30456: full routine rerun → structural audit if successful, logs `routine-tests-after-fixture-refresh.log` and `audit.log`. Earlier sessions 81892/29533/99747 are finished. Packet preparation for placement/appender is separate ignored analysis work while validation runs, using the existing authenticated `build/analysis-packets-implementation-r1/local-tools-final.json` and own output `build/silentcrane-roster-wave1/analysis`.

Fable provided untracked research-only fast compare aids under `tools/matching_studies/fast_compare/`; they are not part of structural acceptance and provide no canonical proof. Their flags/paths match the recorded scratch chain but they strip comments rather than doing normal source-policy preprocessing, so use only on simple self-contained experiments and authenticate canonical results normally. Fable will keep subsequent writes to their own worklog/review output. Suggested first placement experiment: test an addressable fourth `want` word for flagC, separating memory/liveness effects from loop-threshold tuning; this is a hypothesis, not accepted original-source evidence.

No target in this assignment has been accepted yet.

## Placement scratch experiments during structural audit

All 18 routine suites now pass. Structural audit session 30456 remains active in CURRENT build/verification; production inputs have stayed fixed.

Baseline placement candidate preserved through the shared research commands as candidate `CDC5DB9F1FBEBEFE93489B6A9D4C161D45222BC8CCBB239F15EDB8FD8BC84041`, observation `1D2A3F18A4562EF89CF39AC4217F70EB589896EFBC47B131AEE1A52BC43AE8D6`. Its addressable-flag/eager-AND pair is candidate `382DF508E67A8389A5A839A72FD645C8018301C42F60E617EBD9ECBAADCE0B15`, observation `C67B2ED5C73744748132251D63020294995BC2430A7C9F93854764BCED9D037E`. The archived baseline remains the selected starting source; neither is active or accepted.

The addressable `want[3]` plus eager boolean AND keeps the flag load/compare/AND in the inner loop, matching that local retail shape, but not overall allocation. Explicitly computing `wide = isNine || mode == -6` in the outer body immediately before the inner loop prevents the -6 comparison from being hoisted out of the outer loop, confirming Fable's loop-pass explanation (mail162). Raw mode spills at 0x44. This variant still has a 136-byte frame/262 decoded rows against retail144/266; whole-stream diagnostic score is worse, so it is an informative intermediate rather than a new best. Explicit cursor increments after calls are output-identical to postincrement in that context. A scoped base pointer after isNine creates frame144 but spills at0x5C and reorders the entry; unselected. Next inspect variable-vs-temporary allocation and cursor address liveness. Scratch sources and logs remain under `scratch/silentcrane-roster-wave1/` and `build/silentcrane-roster-wave1/`.

## Structural acceptance and roster transition

Audit PASS at 2026-09-27T03:06:20.336Z. Both baseline and independently verified CURRENT ROM equal canonical SHA `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`. Independent Fable review passed in mail169, contingent only on that now-passing audit. Saved exact reports and active inputs under the structural evidence root's `audit-completion/`; original after-identities remain unchanged. No redundant verifier run. Proceed to CF08 canonical activation/diff; the full three-member roster wave still needs final matching verification.

Placement improved via a guarded indexed do/while: provisional candidate `F8661037EBF0574F4224FCD441C79D12143ADB5EE3F500A133355F491302BB87`, observation `E5F67B2A6500B1BDB15B9B66C4C7AA948E6F2434AA5C2ECA7E5A5C996CF9EDE0`, reproduced frame144, all key spills and call scheduling. Removing the exploratory memory-flag device and using a control-flow boolean then produced candidate `F54C041F28696968252AEB1565C4E9C7E4127939C43D04C66DE3BD1F46C159D5`, observation `335E6029A13133F981DC6F838DEE939146C9BDB5A1C7C365DD8B9888CC9720CD`: 266 words, all registers/stack positions, two actual branch words remaining. Both sources are preserved through shared research. Workbench watch confirmed PURE_C; CF08 source is relocation-masked exact, but symbolic object evidence does not establish linked equality.

Rechecking the mode condition or using a dead initial boolean assignment gives the desired branch but swaps s5/s6. Dump evidence isolates a priority threshold: constant1 has16 references across420 instructions; OR result has5 weighted references across65. In the two-word nonmatch, lengths are422 and66, respectively, just reversing the priority. This is not a duplicate flag comparison; compiler `force_movables` aggregates the dependent AND's lifetime and doubles savings. Fable acknowledged the correction. No tooling/compiler changes are involved.

CF08 canonical focused checks now pass: PURE_C, 208 linked bytes exact (`4B21779A6990257A950B908F942E2EE8ED6109CE39EEA0B25054FFB216CB143C`), decoded rows exact and all nine observed relocations match the recorded contract. The relocation at+0x60 calls the corrected true entry. Source is `src/lib/func_002ACF08.c`; initial and contract-complete reports are preserved under the roster evidence root. This is a provisional wave candidate, not completed-wave acceptance. No full-ROM verifier was run for this function. Proceed with placement and appender.

Placement canonical diff confirms the scratch result: PURE_C, complete1064-byte target covered, exactly2 instruction words/6 bytes differ at the expected mode-gate branch/delay. Initial link found two missing data-symbol records and an unregistered archived memset alias; added the retail-backed global addresses and used canonical `func_0002CD70`. Recorded actual emitted relocations under existing rules; no full-ROM acceptance yet. Current source retains the two-word candidate while alternatives remain in scratch.

Appender initial draft covers all phases: five preset members, free-row setup, three object pairs, six parallel18-word arrays with deduplication/insertion, equal-key runs, and final row pass. Splitting row-pointer lifetimes between phases plus resetting insertion index before the key helper reproduces all307 retail instruction words (relocations unresolved) and frame528; native `.text` has one trailing alignment word. Source uses the accepted mapped callee names; the apparent extra argument to C0E8 in m2c was rejected by direct callee disassembly (it only reads a0). Starting canonical appender diff now. Joe reiterated no per-function full-ROM builds; continue focused diffs and exactly one final whole-wave verifier.

## Complete roster wave ready for final verification

All three assigned roster functions are now provisionally PURE_C and byte-exact in canonical focused diffs. Placement's final source uses two scenario arms and an initialized conditional-assignment temporary; all1064 bytes and36 relocations match. More than one scenario partition produces the same instructions, so this does not uniquely establish the original source grouping. Appender is exact across1228 bytes with25 recorded relocations; its archived candidate is `BE9B29DD97A4A91CD7B0A9738F213829A4A303D20BBB08CB1ED883464ECFBB45`, observation `F17BD0BE10CE5EC672214349CE1EAF2B58DDE9FA72AAC38D0BA3BB22BA62410F`.

Saved the three canonical sources and both matching registries with hashes under `build/silentcrane-roster-wave1/wave-inputs/`. Starting exactly one `node tools/verify.js` for the combined three-function wave, without a preceding build. Production inputs will stay fixed until it finishes. Dialogue intake and reading may proceed as read-only preparation.

## Roster wave accepted; dialogue wave in scratch

The one combined roster verifier passed at 2026-09-27T04:09:40.890Z. All three assigned targets are mechanically PURE_C, sole C owners at the accepted placements, with exact recorded relocations, complete target bytes and full retail ROM. Canonical ROM SHA remains `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`. The five saved wave input hashes remain unchanged. Complete verification, fresh-compilation, source-policy, build report and per-wave target evidence are saved under `build/silentcrane-roster-wave1/verification-completion/`. No additional build or verification was run after this success.

Both dialogue targets have complete intake, accepted-owner coverage checks and full disassembly reading. Each is one physical body with its pre-prologue setup included: E5968 has781 instructions and E6D90 has1690. Initial complete E5968 C is scratch-only. ROM checks correct two decompiler defects: unsigned division by7 was decoded twice, and a combined32-bit coordinate load was narrowed to16 bits. Renderer reconstruction must restore all nine arguments at two drawing calls where m2c omitted stack arguments. Its runtime80078674 callee is the already reviewed logical interior func_00008A74; existing shared-linkage treatment suffices when activating it.

E5968 selected intermediate `E22DDF7A14A2467304D954135026E46533A1A05B2B7AB56E000BEB36BD563072` is preserved with observation `46CE9BC9745549B4C7D84D33E027ADE39652496C2A63F313C5BDCB67771DD87C`. It derives from initial candidate `192395F445F94FBE6DF137BA87F00030D853F98E4D7313B766528194CCA0C9E0`; a corrected local import records that parent in observation8E568DC06BAB80DF06A3D2E66B09EA79059C8117B894EA207C8EE0A8BB63A8A4. The first preserved dossier remains immutable. Intermediate has retail frame32 but is not exact. Geometry snapshots improve local alignment; byte-offset field accesses improve alias/CSE alignment while regressing frame24, an informative counterexample rather than the selected candidate. These diagnostics are research-only, not acceptance. Fable is investigating the specific compiler CSE/local-allocation address folding shown by saved dumps; production dialogue inputs remain inactive.

## Dialogue complete drafts and useful source contexts

Both dialogue sources now cover their complete accepted bodies in scratch. No dialogue target is activated. No full-ROM build or verifier has run after roster acceptance. Setup geometry successor `D819019D73E2B744BC0A5DF03796448A84350B1C37A4F2AC44FA223C1384A430` / observation `97B8987DB63C8403A8DBA031A2281F64542BC0679A8D7C9636892428D1CAE145` is archived and authenticated workbench watch compiles it as PURE_C, nonexact.

Renderer source pairs were imported and preserved: initial `47299FEA5675F5EA042DB5EA7D14B7059551E191811BB002B1409772041C78CB` (observation6BB09A6DC99F790D17A8F5A9D55ED5A63C3D4B74BB38EC9E05913CC91C74A017); coordinate stages `D1F72ECC11CC0D322ED94C3C9E64792DA62C640A81844941BAED88E033FA681E` (FD6CEBDB9ADF1D49A6048184C1BD73BF03DF6FB7B266D3FE688420649FA926DC); phase-local baseline `3981819B5B50DB9F8324A3C0ED49FF2919F19FCE2D9F1AAF0AD8477B198E901A` (126CE6A62A697DB4788296A3D218441F61E942009AFA5CB598C95BE84DE0299C). Nested coordinate expressions caused frame312; staged inputs restore retail48. Individual command-local Gfx pointers improve display-list register lifetimes. All nine arguments at E8268/E864C are present; loop index is32-bit, correcting m2c's misleading u8 inference.

Newest renderer scratch `render-text-int-coordinates.c` has retail frame48,1724 native words versus1690,1356 aligned opcode/register words (displacements ignored only for this research diagnostic). Capturing bare-window row-spacing inputs before the style branch removes repeated loads; a small font record at8019E198 reproduces the style-address/-6 call-pointer sequence. Full-width text-coordinate arguments avoid erroneous truncation. Static-inline right/inverse-right helpers produce shorter alternatives, not selected solely for extent. Fable mail195 asks for a pass-grounded explanation of remaining constant/column reassociation. Authenticated workbench watch is running as session82919; output `render-text-int-watch.json`.

Setup callback-prefix opacity remains open. Original array-anchor first CSE creates reg+negative offsets via related constants; second CSE folds them. Explicit reused-pointer variant folds in first CSE. A single isolated diagnostic with -fno-rerun-cse-after-loop reproduces that addressing but worsens the whole function; production flags are untouched and no compiler exception is proposed. Fable's loop-note explanation was disproved by the actual dumps (zero loop-end notes anywhere; zero prefix labels) and retracted in194. Do not repeat that claim.

New setup `setup-dimension-chain.c` uses a record spanning width/height at7A58 and flags at7ABA plus a chained width assignment. This reproduces the exact flags read/modify/write and width address derived by -98 before its conditional expression; frame32,790 native words,635 aligned. A separate-height variant is shorter786/627 but not selected solely for extent. Grouping the callback head's flag/speed/callback array remains nonexact. Source/type experiments and logs are all retained under the dialogue scratch/evidence directories. Signed-size variants worsen reads and are unselected; that alone does not disprove a type hypothesis.

## Renderer canonical activation in progress

Fable197 supplied the decisive fold-const association rule: write x+(k+columns*7) or x+(k-columns*7) to retain x+k before the column term. Applying the same association to inverse marker coordinates and rectangle OR operands, using a clip record for the four signed bounds, moving staged source coordinates inside the nine-argument call, combining the style/portrait-side gate, and separating raw/adjusted X lifetimes brings the renderer to exactly1690 function words/frame48. `render-line-factor.c` aligns1688/1690 words; the only residual is the order of CONTROL and clip-left loads in the first text arm. Local control snapshots do not change it; a volatile-read experiment is unselected. Fable is investigating that pair in mail201. Removing stale unused outer locals in `render-readable.c` is output-identical. Current production source `src/lib/func_000E6D90.c` is that complete near-match plus a descriptive comment.

Renderer is now active with eight observed data-symbol bindings and the previously reviewed interior func_00008A74 alias at80078674. Its actual relocation contract is not recorded yet: canonical `node tools/diff.js func_000E6D90` runs in session66189, log `build/silentcrane-dialogue-wave2/render-first-canonical-diff.log`. Capture the real emitted relocations from that report before workbench compiler calls; never guess them. No full-ROM command was run. Setup remains scratch-only, selected `setup-dimension-chain.c`.

The portrait-loader signature is now consistently s32,s32, with explicit u8 casts at its first resource lookup. Both independent scratch comparisons emit identical assembly to its accepted form. Fable198 confirms the old byte signature had no independent public-type evidence and recommends the consistent ABI. Canonical focused diff passed PURE_C/EXACT/relocation MATCH, linked SHA `ABB8EC9FBD10C00E626685A8CF7DEAC2474238C2AA95F64D96E4F3EB955CA4FF`; saved `portrait-loader-wide-diff.json`. Fable200 reviewed the two-line change plus comment. Include this changed helper in the single final dialogue-wave verification; its focused diff is not a new full-ROM acceptance.

Latest additional preserved source IDs: setup-dimension-chain `268CD84A1784762CDD7DC3D303813C62C17DDEB3A73D4DDDBC426FEB7E6446F8` / observationEC51ADB170370C984444B8772C3450D4F1DAB2549B4750AC9C6BE64518D012BF; renderer earlier full-width-coordinate baseline `E50542B809B1ED23ACF93CF547FFDBEB2DC298EAFE14A2A0031BA8B5139BF58F` /1BC35B17486B13838392BD8F2320372CB920056D5719049BF1BD0C5D9CC961A2; inline-right counterexample `A6670DABEF0A017CB8C85DBAD754DE8B6DC8D9D065401016D12638FAAEDA788D` /4E97A1F2B4103D2C322B3077E46DDAF9B215F623B3BFFA2C9A0D9937F5C33DBF. Preserve the newest near-match and association pair after recording the renderer relocation contract. Scratch typed m2c reference was also produced, with corrected source-X branches and complete call arguments; it is a nonselected diagnostic, not canonical source.

Canonical renderer diff confirms PURE_C, sole 6760-byte C owner, and exactly four differing instruction words/eight bytes: the swapped CONTROL/clip-left address-and-load pairs. Actual emitted relocation records are now captured from the report in the existing linkage contract. No other target bytes differ. First report saved as render-first-canonical-diff.json; session66189 completed. No full-ROM command was run.

Renderer canonical diff now confirms PURE_C and all6760 bytes exact, SHA49103FF0D9621CF97B837EA54015CCA7157D96D73185C774C837C0330B363832. A block-scoped single-set rawX separates clip input from adjusted x, fixing the last load order. All451 linked relocation words match; their actual contract was refreshed after the source change. Fable203 explains the sched1 birthing-priority mechanism. Report saved render-exact-canonical-diff.json. This remains provisional until setup joins the single final dialogue-wave verifier; no full-ROM run.

Setup body context3FBB255650D36F74933F6EDC70FD0457CEA393BD02FE265D2198398DDD19BFAC / observationF504FC6B28DCA8A09F50530D1792D952D6F3243CE3E4466AECE7A2FC8DC54D57 is preserved as a useful intermediate, not selected solely for score:720/781 research-aligned words,782 native words with padding, frame24 versus32. Staged text lookup plus a stable state snapshot matches initialization; style-selected spacing prevents early constant distribution; a record speed field and local clamp reproduce movement setup; full-width preset reuse and final state snapshots remove other local differences. Remaining prefix, one normal-height scheduling move and pointer geometry lifetimes are in scratch. Fable206 supplied a family header/pointer shape that succeeds in its harness; full-function trials setup-family-prefix[-first-flags].c still fold address-register mems in cse1, then fold symbolic in cse2. Reported concrete dumps in207/208. This does not justify compiler changes.

Setup full-interior intermediate896C067B582E95CF8B1AEFC74D22FBCF1880263C862843EC78AF4C838C786D24 / observationA3DF5294241FA81B93863045A21C0B81002403CCB0CDAB75645D2BC0A8384E3D is preserved. Separate halfWidth and edge temporaries, a saved s16 initialX, nearLeft-first comparison and fresh correction pointer reproduce the full pointer-placement region. Staged normal gap/pixel arithmetic fixes the last interior scheduling move. Remaining differences are only callback prefix, archive-zero lifetime and frame/epilogue (759/781 aligned). Source: scratch/silentcrane-dialogue-wave2/setup-normal-gap-mutable.c.

Reduced prefix experiment setup-prefix-minimum.c reproduces negative addressing with the pinned compiler; adding archive switch in setup-prefix-through-text.c loses it. Fable211 independently ties this to repeated CSE branch-path scans, not a hidden flag change. A do-once prefix diagnostic genuinely has a LOOP_END (unlike the earlier rejected loop-note claim), restores frame32 but retains incorrect addressing and swaps saved registers; unselected. All dialogue work remains focused scratch/diff, no full-ROM command.


Setup activation focused check: PURE_C, sole 3124-byte C contribution, complete target coverage and 221 actual relocations now recorded. Canonical fixed-offset comparison differs (2676 bytes/769 words); this is consistent with the remaining prefix change shifting the otherwise aligned interior by a word, not a new body-coverage failure. Report saved as `build/silentcrane-dialogue-wave2/setup-first-canonical-diff.json`. Registry formatting was restored value-for-value from the saved roster wave input formatting while retaining all current additions, avoiding unrelated whole-file JSON expansion. No full-ROM verification run.

Prefix follow-up: Fable mail213 pins loss of the header-address protector during repeated CSE scans. Actual flags-first do-once experiments preserve the -20 flags base, but speed becomes symbolic and callback0 schedules last. Full context/buffer, negative-root view, parameter width/copies, and archive/preset reuse remain nonmatching counterexamples. RTL confirms archive zero stays at entry through flow and sinks below the first call during sched1. Latest interior source remains preserved as candidate896C067B; current experiments are ignored scratch, not selected production changes.


## Dialogue setup exact candidate and combined verification

Call-only loop diagnostic candidate `795B82DA79CBA19EDF9A02467BCE515A9CE562B371937B0FBE357D46309B5676`, observation `BC1307207F52FD1F29E888E95082AB4D6796819033562EA43050BB52055BB028`, is preserved. A real loop header before the clear reproduced all 781 retail words but retained a two-instruction back edge. It established the needed basic-block context; it was not selected as exact.

Fable mail217 supplied the final taken-exit construct: an unsigned-byte bit-8 test with a nonempty unreachable tail. It survives both CSE passes and flow, then combine proves the exit always taken and late jump cleanup removes the tail and all loop machinery. The clear runs once for every byte value. Source comments explain this compiler-context purpose; it is not a claim about original source. SOURCE_POLICY explicitly permits strange loop shapes and ordered expressions, and no assembler mechanism or compiler change is involved. Fable agreed on this policy reading in219.

Final setup source `src/lib/func_000E5968.c` is candidate `632A64D3BF8A82CAD1AE44DCB8A38CD7FEAF11023B625A83CB667A99DFDF0B2F`, observation `11DCBF7CB0F9D6055663E602B7D0EF6A0C942598C8B3021B97C777ADF56951B8`. Source SHA `548FA6D505F046D6D65161E2F7F5B88D92DB0DFCA7F4F0D7463D22B1B080BA67`; expanded SHA `ABD6877B492ED3B88191924B7E2AE41F6CBF35A08FFA7DAD5ED2801651E0AADE`. E6620's callback prototype now agrees with its existing s32 argument. Scoped arithmetic was formatted without changing output.

Canonical focused setup report `build/silentcrane-dialogue-wave2/setup-exact-canonical-diff.json`: PURE_C, sole 3124-byte owner, exact placement, zero differing bytes or words, linked SHA `F681A58ADD89EA811CE1D164C08BD6638D5BD707340B12AF2CE40DF8BB7D5CC6`, all 215 actual relocation words exact. The current relocation contract now records those 215 entries; six no-longer-used setup-only data bindings were removed after checking every current target relocation. The diff's legacy scalar score is nonzero while its decoded pairwise and raw-byte checks are exact; acceptance is the canonical verifier's full gates.

All dialogue inputs (setup, renderer, changed EAD04 helper, both registries) are saved under `build/silentcrane-dialogue-wave2/wave-inputs/`. One combined `node tools/verify.js` is now running; no separate build was run. Log: `build/silentcrane-dialogue-wave2/verification.log`. Preserve completion reports and explicitly check all three source classes and owners before calling the wave accepted. Fable was given focused report paths in220; any additional ordinary-source review is read-only and does not require a repeated verifier.

## Dialogue accepted; dispatcher reconstruction underway

The single combined dialogue verifier passed at 2026-09-27T07:13:13.222Z. E5968, E6D90 and the changed EAD04 helper are PURE_C in both source-policy and fresh-compilation reports, each with one exact C owner and zero differing target bytes/words. Their actual relocation counts are215,451,41. Full ROM SHA remains571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A. All five saved wave-input hashes were unchanged. Full completion reports and both build/verification target extracts are preserved under `build/silentcrane-dialogue-wave2/verification-completion/`. No repeat acceptance command is needed for these unchanged inputs.

Dispatcher intake initially contains no current observations; legacy9ED/E8 dossiers remain research-only. Full2000-word disassembly and the complete153-case legacy draft were checked. The legacy map has143 low values and10 high values, not the assignment's132-opcode description. An explicit no-op80000002 case restores the compiler's retail pivot sequence (5D,22,8); its behavior already equals default. This source-context discovery is candidate9A8A7E8F08DB342586F7AF472F3E85EB8241851133242FF762E92622C0EC1F0A, observation3FAE20C1E30D4AB34CC3AADC8FF8C8784753BA08DF41A34D5C12E9EBE9930614; preservation is in progress.

Independent body checks corrected misplaced pointer offset at61, the four-float/one-integer ABI at2C, missing1009/1005 local array, old-cursor semantics at80000005, and A994 reload after its call. Current model resolves66 runtime callee names (including reviewed logical2B3494); the reviewed fixed-address find helper at8022A428 remains within owner002861C8. Fable226 confirms an ordinary address binding under existing linkage rules; do not change the neighbor's static binding or ownership.

Fable226's allocation explanation led to duplicated source free tails with separate locals. A proper guarded do/while, absent from the archived goto-loop, then permits invariant hoisting and reproduces cursor s1, constants s6/s7/f20 and frame120. Separate scalar stop/scan variables replace the fabricated parser-state struct, reproducing retail spill slots3C/44 and t1 stores. Inlining stable single-use call inputs and staging float expressions improve scheduling. Latest provisional scratch is `scratch/silentcrane-dispatcher-wave3/refined-call-bodies.c`:1994 native words,1950/2000 research-aligned words. This diagnostic masks local branch/jump displacements and is not acceptance. An earlier recomputed-tail-offsets intermediate accidentally moved one argument read across a cursor increment; refined-call-bodies repairs it and is the applicable successor.

Two required interface changes are scratch-only:0029DF04 return u8→s32 with explicit return narrowing, and002A053C argument short→s32 with explicit store narrowing. Fable228 concurs; compile both bodies unchanged before activation, and include them in wave3 verification. No production dispatcher or helper changes have occurred yet. Latest remaining questions concern duplicated call tails, conditional case exits and local scheduling; they are not external blockers.

## Dispatcher activation and late scheduling

The complete1950-aligned draft and both helper interface changes are now active. Both helpers compiled to identical original assembly with pinned flags before activation; focused helper checks follow. The dispatcher's first canonical diff correctly stopped at the section-shape gate because its native extent was short. No relocation contract was fabricated and no full-ROM command has run during dispatcher tuning.

Preserved successor15F751221D0F8CB563EF0DC586440037165450362BE4BFF67BA717662928D471, observation2D9D0C2F44EF8DD5C48874CC8D39C639C167A9ACD573CF6D6E7DB5ACF68B338F, records1995/2000 aligned instructions. Fable233 identified the indexed-call-argument MEM_IN_STRUCT_P context: with the store read left as a cast dereference, array-element call arguments permit the two argument loads before the byte store while retaining its independent load. Shared cursor increments after complete conditionals prevent early call-tail merging and let reorg fill the retail delay slots. A post-call increment fixes60; a late byte-offset calculation fixes47. Unused labels and locals were removed without changing output.

Current best scratch `natural-control-five.c` and equivalent `natural-fallthrough-tail.c` have1998/2000 aligned words. The complete function is one word short; native alignment adds three trailing words. Case8's structured mode call followed by cursor+=3 restores the out-of-line+C14 tail. Structured80000005 with cursor++ after both conditions restores the retail empty delay slot. Only95/8E's increment/jump/constant tail differs in the aligned instruction sequence. Explicit fall-through alone compiles identically and does not fix this; Fable237 has the counterexample. Separate95 arms produce extra jumps and are unselected, even though alignment reports1999. Local branch displacements remain outside this research diagnostic, so no exactness or acceptance is claimed.

## Dispatcher canonical focused check passed

Structured shared increments in both neighboring cases1C and92 resolve the95/8E tail. Updating only one case did not reproduce it. Moving AA/B6 cursor increments after their complete conditional blocks then fixes the final two branch destinations. The complete8000-byte scratch output is exact, including every local displacement; the native scratch link's trailing8 zero bytes lie outside the function.

The production source now uses mechanical per-command local names, concise pointer dereferences, explicit fall-through and compiler-context comments. Cleanup preserves all8000 bytes. Final candidate8AE460F13EEE8983BCDA7B7AE1CF2322D9DAB48CC344ECB81FF160DB6DE8AC02 and observation926E35992B6F95E1682C51670036A4D5C14DF19B575ED6A0FEE826F52630C8E2 are preserved. Authored source SHA161574EF88EECB033F868F13FE3A44093FC5D093AC02AE9A1A20AFF3A798F7C1; expanded SHA E1339E7614348A5B425E9EE43D488008738ADC62611F1053EFCD2959A3E34D3E.

Canonical focused report `build/silentcrane-dispatcher-wave3/exact-canonical-diff.json` passes PURE_C, sole8000-byte owner `.ob64.r5115`, decoded pairwise exactness and raw linked exactness, with zero differing bytes/words. Linked and expected SHA are6C7AA473B550E95E82F55DB429353907D622A3181FC1559BAB30E90D2E6D4D88. The actual467 relocations were recorded in the existing target contract; no linker rule changed. The legacy scalar score is2815 while both authoritative comparison gates are exact. The two helper focused checks are running; their first attempt before exact dispatcher activation correctly stopped on its stale section-shape mismatch. No full-ROM dispatcher verification has run yet.

All six assigned sources, the three affected helpers, and both matching registries are saved as11 immutable input snapshots in `build/silentcrane-dispatcher-wave3/wave-inputs/`. Fable242 independently reproduced the production target bytes and confirmed the cleaned source; no matching review-repeat verifier is requested.

## Final combined acceptance

The single dispatcher-wave verifier passed at **2026-09-27T08:24:10.726Z**. It rebuilt CURRENT when needed, then completed ownership, placement, relocation, exact-byte and fresh source-to-object checks. No separate full build preceded it, and no additional full verification was run for review.

The final fingerprint is `40747B64AD769F0EEB9868EF34B19F5E7B3DCE5016F9C91C47B0A04B45B2FD88`. Full ROM SHA-256 is `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`, equal to the canonical normalized Rev 0 ROM.

All six assigned functions and all three affected helpers were explicitly checked in this final report:

| Target | Bytes | Actual relocations | Final result |
| --- | ---: | ---: | --- |
| `func_002ACF08` | 208 | 9 | PURE_C, exact |
| `func_002ABB3C` | 1064 | 36 | PURE_C, exact |
| `func_002ACA3C` | 1228 | 25 | PURE_C, exact |
| `func_000E5968` | 3124 | 215 | PURE_C, exact |
| `func_000E6D90` | 6760 | 451 | PURE_C, exact |
| `func_00284288` | 8000 | 467 | PURE_C, exact |
| `func_000ead04` | 504 | 41 | PURE_C, exact |
| `func_0029DF04` | 88 | 3 | PURE_C, exact |
| `func_002A053C` | 12 | 0 | PURE_C, exact |

Each has one C owner, exact runtime placement, zero differing target bytes/words, and identical accepted, verified and freshly compiled relocation lists. Source policy and fresh compilation both classify every listed target as PURE_C. All 11 saved source/configuration hashes remained unchanged through verification.

`verification-completion/` preserves the complete state, build report, verification report, source-policy report, fresh-compilation report, all nine target extracts, input identities and the derived relocation-contract equality checks. The dispatcher's earlier focused report accurately retains its pre-recording empty contract; final verification and `relocation-contracts.json` establish the subsequently recorded 467-entry contract.

No matching target remains unfinished in this assignment. Existing unrelated working-tree changes were preserved. No branch, worktree, commit or push was created during this assignment.

## Authorized integration follow-up

Joe subsequently authorized committing and pushing the verified changes on `main`. The selected integration includes the supporting sources already active in the accepted baseline, the entry correction and regenerated identities, and this program's audit/research evidence. Unrelated cutscene recovery, DB10 experiments and scratch research tools remain outside the commit.

The existing LF checkout default would change several recorded source and registry identities. Exact-path attributes now request CRLF checkout for those production inputs, while retaining raw bytes for the corresponding immutable captures. A narrow whitespace rule preserves the blank context lines of the original unified patch. Staged checkout reconstruction was compared byte-for-byte with every selected working file; all 11 final verification identities and all changed active source identities match. This preserves the accepted inputs without another ROM build. The Git commit and remote history record the integration result.
