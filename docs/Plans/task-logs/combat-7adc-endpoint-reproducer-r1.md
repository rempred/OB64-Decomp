# 7ADC endpoint reproducer research

Completed bounded research; independent research review pending. Worker `/root/db10_allocation_trace`, Astra Medium; Director `/root`; launch `COMBAT-7ADC-ENDPOINT-REPRODUCER-20260907-01`. Activated prompt at `49f80f05921856ddd496104e9ce3fb78f6b19da8`. Fresh claim was atomically created and read back before other writes. All previous task records and evidence remain frozen.

The endpoint distinction reproduces with SIZE_ROW held fixed in either form. A 46/47-line standalone pair preserves the stronger format-3 scheduling difference: the temporary decrement executes after the endpoint WIDTH call, while the self-decrement executes before the earlier line-width WIDTH call. Both still emit two packed-coordinate stores consuming real WIDTH results. This is a faithful smaller candidate reproducer, not a minimal reproducer, retail compiler history, or a matching source recipe.

## Controlled complete inputs

All evidence is under ignored `build/combat-7adc-endpoint-reproducer-r1/` (R below). `input-authentication.json` verifies every named source, complete input, pass, assembly, command, object, and locating output in the supplied manifest. The locating manifest itself matches `A46F056F30EDD18A8D29DD2CD2D3FB82A9EFFE9E29EF9C2EBA24B89BCD91FBEA`. Its two original packages are copied to `frozen-current-best/` and `frozen-retained-compound-stages/`; originals were not written.

`run.js controls` creates the cross controls by changing exactly the three endpoint statements in each original expanded input. It leaves both final row stores fixed. These are full function compiler inputs, including the original surrounding declarations and context.

| Input directory | Endpoint spelling | Final row spelling | Complete input SHA256 |
| --- | --- | --- | --- |
| full-temp-row | `(endField - 1) * 4` | SIZE_ROW self-update | `444077E9FADE629401A939C6C32B35E0873CB9E3F1DA0EA428944492438003C8` |
| full-self-row | `endField -= 1; endField *= 4` | SIZE_ROW self-update | `363F49701980D04FF368F14ACD7CBFE35AB6520DDBEBC565217A97E8540B19C1` |
| full-temp-expression | `(endField - 1) * 4` | expression store | `1B500BC39E8D67592F902AD78FFC1FCE79C54E0A6F9E0C00E735178073F72460` |
| full-self-expression | `endField -= 1; endField *= 4` | expression store | `B0F82DECC65FDC38B8E9B87C999B573BD68E33EF133F22F4F0AE3CAF787F4743` |

Both original pinned assemblies reproduce byte-for-byte. The table below records first-scheduler (`.sched`) order within each branch: the relevant endpoint WIDTH is that branch's third WIDTH; “after 1” means the decrement precedes its second, earlier line-width WIDTH. These are static pass positions, not execution counts through the complete function's branches.

| Complete control | format 3 | format 1 | other format |
| --- | --- | --- | --- |
| temporary, SIZE_ROW | after 3 WIDTHs | after 3 | after 3 |
| temporary, expression store | after 3 | after 3 | after 3 |
| self-update, SIZE_ROW | after 1 | after 1 | after 1 |
| self-update, expression store | after 1 | after 2 | after 1 |

Thus the original row-store difference is a real scheduling confound for the format-1 self-update: it changes how far the decrement moves. It does not explain away the temporary/self-update distinction, and the format-3 branch provides the same stronger ordering in both row forms. `endpoint-inspection.json` in each directory records originating RTL UIDs and exact combine/sched/greg/sched2/dbr blocks. Do not interpret its global call counts as dynamic counts; delayed-call nesting can change a top-level textual count in later complete-function passes.

After reducing, `finalize-evidence.js retest` compiled all four complete controlled inputs again. `full-retest.json` confirms exact pinned assembly and six complete ordinary pass files (`rtl`, `flow`, `combine`, `sched`, `sched2`, `dbr`) equal the corresponding first control. There was no full-function source activation or new retail-matching proposal.

## Faithful smaller pair and property

The pair is `R/reduced-no-first-packet-temp/candidate.c` (46 lines) and `R/reduced-no-first-packet-self/candidate.c` (47 lines). SHA256 respectively:

- `F46C6464C62154235BF4926A74B7DA36D0672F420FCA57B777FFC890B0D2DCB0`
- `833FEF8CD55BA51A0F43B3FB0287D4043D141752B16B81066D34A20BA39651E3`

They differ only at the endpoint expression. `reduce.js` first extracts the complete format-3 packet sequence and shared tile-size tail into `endpoint_probe(header, row, strip)`, replaces unused surrounding declarations with identical relevant type layouts, and removes the initial image packet. It retains the global command cursor, line-width packet, load/sync packets, endpoint sum/update/mask, render packet, and final tile-size packed endpoint reuse. Four opaque `func_00201E9C` calls remain, in their source order: line width, load endpoint width, render line width, final size width. No artificial use, barrier, volatile, asm, or extra runtime operation was added to maintain the distinction.

The precise retained predicate is:

1. Both inputs contain one live endpoint `(row + strip)` decrement, shift by two, mask by 4095; the initial RTL temporary destination differs from the endpoint pseudo in one form and equals it in the other.
2. In both `.sched` and `.sched2`, the temporary decrement follows the second WIDTH call; the self-decrement precedes the first WIDTH call. This preserves movement across the earlier line-width call, not merely across the immediate endpoint call.
3. Emitted assembly retains four WIDTH calls. Accounting for branch delay slots, the decrement executes after two completed calls in the temporary form and before any completed call in the self form.
4. Two emitted stores combine the shifted/masked live endpoint with the second and fourth WIDTH return values, respectively. Thus the property cannot succeed by deleting the relevant calls or dead-code-eliminating the endpoint.

`property.js` checks this bounded predicate on the two straight-line probes; each `property.json` preserves the successful result. Its assembly analysis is a deliberately narrow provenance checker for the instructions emitted by these probes, not a general MIPS interpreter, numeric semantic proof, or shared-tooling addition. It follows register moves, arithmetic/bit operations and spill slots, treats calls as caller-register clobbers with fresh WIDTH return provenance, and executes each call delay instruction before advancing the call count. It fails on an unexpected opcode or missing endpoint/call/store condition.

Concrete output: temporary UID 123 sets pseudo 118 from endpoint 75; assembly decrements `$3 = $21 - 1` after WIDTH 2. Self UID 123 updates pseudo 75; assembly decrements `$18 = $18 - 1` before WIDTH 1. Both store packed endpoint plus WIDTH 2 at `12($17)` and packed endpoint plus WIDTH 4 at `4($17)` in their respective assembly. Their pinned assembly hashes are `F5B85ECCB7E3F97D60D03D291A71BB07A17326210A2A7E68A6062AB9BA4C4704` and `AD084F0B5781C3C35E1D8C4287828B4A0B053AD891DFF4A6907328D4C3CF428C`.

Defined-input domain for the reduced diagnostic: valid aligned header, valid command buffers/cursor throughout all calls and six emitted command records, and for example `0 <= row, strip <= 65535`. These bounds make the signed endpoint/row arithmetic representable. WIDTH arithmetic is unsigned as in the complete input. An opaque WIDTH implementation must preserve validity of objects that later operations access; it need not be pure or return the same value on each call. The reduced code neither introduces uninitialized values nor depends on signed overflow. Pointer-parameter failed controls additionally require their negative-index packet elements to belong to the same valid array. No runtime behavior was tested or newly claimed.

## Retained reduction controls and limit

All seven pairs and their output/pass agreement records remain available. Reduction was manual and bounded, not an exhaustive minimality search.

| Pair prefix | First-scheduler temporary/self position | Strong fidelity |
| --- | --- | --- |
| reduced-branch | after 3 / after 1 WIDTHs | retained; extracted branch plus original declaration prefix |
| reduced-types | after 3 / after 1 | retained; only relevant declarations |
| reduced-no-first-packet | after 2 / before first | retained; chosen smaller pair |
| reduced-core | after 1 / before first | lost earlier line WIDTH entirely |
| reduced-two-calls | after 2 / after 1 | lost crossing earlier line WIDTH |
| reduced-three-calls | after 3 / after 2 | lost crossing earlier line WIDTH |
| reduced-no-render-tail | after 3 / after 2 | lost crossing earlier line WIDTH; also removed final endpoint reuse |

The pointer-parameter core variants keep actual packed stores and WIDTH calls, but do not preserve the stronger property. Removing the render/tile-size tail also loses that property. These experiments do not uniquely identify which retained statement causes the extra movement: several context features changed together. No necessity claim for a particular packet or variable follows.

## Candidate compiler correlation and source lead limits

In the chosen pair, `.flow` reports endpoint pseudo 75 crossing three calls in both inputs; temporary pseudo 118 has two uses across two instructions and no crossed call. The temporary `.sched` decrement carries `REG_DEP_ANTI` to the endpoint WIDTH call UID 111; the self-decrement has only its endpoint-sum dependence. The copied, previously reviewed compiler's unchanged `sched.c` lines 1710–1734 contain the pseudo-destination rule that adds a dependence on `last_function_call` when `reg_n_calls_crossed[regno] == 0`. `scheduler-source.json` freezes the exact excerpt and confirms this file equals the authenticated external compiler source.

That source rule and the observed flow/dependency contrast provide a candidate-specific explanation for why the newly created decrement temporary stays behind the call while the already call-crossing live endpoint can move. No additional instrumented execution of this rule was obtained; this is a source/pass correlation, subject to independent research review. It does not explain every scheduler priority, prove that self-update must cross a particular earlier call in another context, or reveal the retail compiler's allocation/history.

The actionable bounded lead is to preserve and inspect the distinction between a short-lived decrement temporary and the already call-crossing live endpoint, while holding row-store form fixed. The smaller probe offers a nonvacuous property for later guided research. The existing self-update spelling already exhibits it in the complete controlled function, but also moves earlier than the immediate endpoint call; this task does not supply a new spelling that both keeps self-update and pins it to a desired retail position. No accepted match or impossible-match conclusion follows.

## Authentication, reproduction and release

Only the pinned executable `C:/Users/Joe/.codex/ob64-phase6-kmc-20260801/clean-d/toolchain/kmc-gcc-2.7.2/cc1.exe`, SHA256 `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6`, compiled these inputs. All invocations retain `-quiet -O2 -meb -mips3 -mgp32 -mfp32 -G 0 -fno-PIC -mno-abicalls -fno-builtin -funsigned-char`. Each input was first compiled without dumps, then with ordinary `-da`; all assemblies agree after removing only `-da` from the options comment. No diagnostic compiler changes were made or needed. The 22 input directories represent 44 successful pinned compiler invocations: four initial complete controls, fourteen reductions, four complete retests. All 22 task-local inputs classify mechanically `PURE_C`; this alone establishes no game matching acceptance.

Per-directory command JSON records exact executable, flags, status, stdout/stderr. `agreement.json` records input/output hashes. To independently reproduce without writing the frozen root, copy a candidate into a fresh authorized output directory as `candidate.c`, run the recorded command there, then the `-da` command and comment-only comparison. The scripts use create-new directories intentionally; do not rerun generation against this frozen root. `property.js` describes the standalone predicate and its two preserved result files are the read-only check record. `manifest.json` inventories all task-local evidence files apart from itself.

Writes are released after this report and evidence freeze. Only this new claim/report and assigned ignored root were written. Other W8 and Resolver work was preserved. No production source/configuration/tooling/compiler pin/flag, accepted boundary/linkage, runtime, Git, canonical linked diff, build, or verifier changes were performed. Independent review is required before propagating the new reproduction/causal research claim; it does not add a review gate to ordinary matching. All fourteen W8 targets and their final complete-wave verifier, later families, and no-push instruction remain unchanged.
