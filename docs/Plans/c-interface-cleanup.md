# C interface cleanup

## Scope

Resolve the definite disagreements in the accepted C interface report, starting with the functions responsible for the most findings. PR #3 merged at `fa42b5e8` with 3,370 findings across 313 linked function entries. The opening roster uses that accepted revision. Regenerate the order after each accepted batch from the current report. [Merged baseline](https://github.com/rempred/OB64-Decomp/blob/fa42b5e8465332ffd9731acbfd37c3fbdf3791cc/config/c-interface-baseline.json) Â· [Verification workflow](../WORKFLOW.md#c-interface-consistency-at-the-complete-wave-boundary)

Group findings by linked section and entry address. This distinguishes overlays that use the same RAM address and joins aliases for the same actual entry. Count every distinct finding ID once. Inspect declarations and callback uses as well as direct calls. A caller-file count is a measure of the edit surface. One file can contain multiple calls or accepted targets. From the repository root, PowerShell can reproduce the current ranking.

```powershell
$baseline = Get-Content -Raw config/c-interface-baseline.json | ConvertFrom-Json
$baseline.findings |
    Group-Object { '{0}/{1}' -f $_.linkedIdentity.section, $_.linkedIdentity.value } |
    Sort-Object @{ Expression = 'Count'; Descending = $true }, Name |
    Select-Object Count, @{ Name = 'Function'; Expression = { $_.Group[0].definition.name } }, Name
```

## Opening work

Three Sol 6.2 Extra High workers own private candidates. The dedicated integrator owns production sources, shared headers, configuration and canonical verification. The Director owns dispatch and acceptance. The first three providers account for 1,073 findings in the merged report.

| Lead | Function | Findings | Calling files with findings | First experiment |
| --- | --- | ---: | ---: | --- |
| Sol 1 | `resource_free` | 716 | 169 | Compare a consumer of the return value with a caller that discards it. Trace the null path and pointer representation through the real provider and its aliases before choosing a common declaration. |
| Sol 2 | `func_00262830` | 199 | 54 | The provider stores a halfword. Compare word-sized and narrow parameters at real callers with high bits set, looking for extension instructions and any observable change in the value consumed. |
| Sol 3 | `resource_alloc` | 158 | 68 | Trace the size word and returned pointer. Examine the argument-count disagreement first, then check alignment, zero-size behavior and use of the result before correcting the repeated declarations. |

Thirty calling files have findings in two of these groups. For the opening assignments, reserve each provider for its lead, assign single-interface calling files to that lead, and assign shared files once across eligible workers. The merged opening roster assigns 140 producer files to Sol 1, 55 to Sol 2 and 69 to Sol 3. Together they contain 290 accepted target symbols. Each shared-file owner applies the evidence-backed declarations for all opening interfaces in its file. Check any additional caller, callback or header impact before changing a provider. When that reveals a shared dependency, agree its scope and give it one owner. Integrate coupled changes together before marking an interface complete.

Opening preparation is tracked per physical source file on the verified main checkout. If the private workbench rejects a representation, retain every entry in that file together and record it in its original worker's membership. Continue preparation for unrelated files. The integrator can check an accepted compilation group through the documented whole-group linked diff. A missing or ambiguous original owner needs a cross-check against the accepted ELF and owner rows before a source edit. A stopped batch does not classify the files it never reached. The source leads can investigate argument and return behavior while preparation runs. [Workbench group support](../MATCHING_WORKBENCH.md#setup)

## Round 2

The [accepted opening commit](https://github.com/rempred/OB64-Decomp/commit/0193ad299e565e9828920e5c70828ce707e40b08) cleared all 1,073 assigned findings and reproduced the retail ROM. The canonical report at that commit has 2,297 remaining findings across 310 linked function entries. The three highest-ranked providers have disjoint source assignments.

| Source lead | Provider | Findings at the opening commit | Initially assigned files | First comparison |
| --- | --- | ---: | ---: | --- |
| ROM transfer | `func_0002de50` | 103 | 19 | Trace the ROM address, destination and byte count through a small transfer and a direct transfer. Check how callers use the return register. |
| Resource loading | `func_0002dfb8` | 77 | 27 | Trace a boot materializer through the cached and uncached paths. Check the input buffer, resource key and returned pointer. |
| Node construction | `func_00051eb0` | 77 | 7 | Follow the callback and stack arguments through the constructor and `func_00051f74`. Check where coordinates are widened or narrowed. |

The ROM-transfer source also declares the lower-level DMA routine with a different destination type. Correcting that declaration covers three additional findings in the same file. The node lead owns two further constructor callers and seven callback implementations. The callback dispatcher passes the panel pointer and a pass index. The existing cutscene-panel declaration is a comparison for the proposed shared type. These additions bring the round to 62 distinct source files and 260 known findings. The broader callback checks also cover interfaces that the scanner could not classify.

The integrator checks other callers of the same physical functions, including aliases, for any additional source or shared-header impact. Refresh priorities from the accepted report after each completed group.

## Matching and acceptance

1. The Director ranks the findings in the latest accepted report and selects the highest remaining dependency-ready providers. The integrator prepares verified inputs and guarded preflights for the complete memberships. The Director confirms each worker is running with its own private root and tested native message and stop routes. [Private candidate workflow](../WORKFLOW.md#private-candidate-workers)
2. Trace the arguments and return value through retail callers and the actual provider. Confirm aliases from the linked ELF and overlay context. Give extra attention to values forwarded in registers, signed or narrow arguments, aggregates and callbacks. The P02 attack-presentation example demonstrates why a narrow load in a provider alone cannot establish the return declaration in its callers. [Matching examples](../research/how-matching-works-20261117.md) Â· [Audio corrections](c-interface-verification.md#accepted-audio-corrections)
3. Compare focused objects, bytes, bindings and relocations on the pinned tools. Test meaningful register or behavior differences where byte equality cannot distinguish source contracts. Preserve each existing source class and contributor attribution. A cast, old-style declaration, lost analysis coverage or suppression does not demonstrate that caller and callee now agree.
4. The integrator checks the complete active corpus for new conflicts and coverage changes, reconciles removed debt with actual verified inputs and runs the normal complete-wave target and retail gates. Use the documented independent review and applicable audit for baseline maintenance. Keep candidate checks private and avoid full-ROM builds per function. [Interface verification](../WORKFLOW.md#c-interface-consistency-at-the-complete-wave-boundary) Â· [Structural audit](../AUDIT.md)
5. Re-rank after acceptance. The next assignments go to the highest remaining counts that can proceed without a conflicting source or shared-header edit. Close only on verified repairs and a full retail match. An unresolved definite finding stays open with the retail evidence, owner and next experiment.

The separate coverage inventory includes unparsed inputs, unknown callees and unsupported types. Keep those limitations explicit. For the three legacy channel-word calls from `func_00283564`, verify the runtime owner and actual argument type before changing either side. Investigate a demonstrated mismatch uncovered during a wave even if it falls outside the definite finding list.

## Local work records

The generated roster under `build/interface-cleanup-261121/accepted-roster.json` records the merged report hash, linked identities, complete finding IDs and opening caller ownership. `opening-free.json`, `opening-dc80.json` and `opening-alloc.json` in the same directory map those owned producers to their accepted target symbols. Later waves use the accepted report for their revision. The tracked baseline and ranking command above also work in a contributor checkout.
