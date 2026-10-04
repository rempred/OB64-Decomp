# Squad inline-template census correction

The initial RTL artifacts contain an unused inline-helper template as well as the
target function. Count each `;; Function` block separately. Whole-file totals do
not describe the target's physical sites.

For resolver controls [A3F5E6D1](../../dossiers/func_001237F0-a3f5e6d13a.md) and
[69A987DA](../../dossiers/func_001237F0-69a987da95.md), authenticated probes
`C39F030F` and `B156CF55` have **13 evaluator sites and 55 total calls in the target
function from RTL through SCHED2**, then **7/40 at JUMP2**. Initial RTL also contains
the `terminal_result` template with two evaluator sites. The previously recorded
15/57 initial-RTL census totals the entire artifact; it does not indicate two
additional target-function calls or their elimination in FLOW. Neither helper is
emitted as an additional compiler owner.

For evaluator helper source `D3EFA316`, authenticated probe `43FC16EA` has **four
divisions and four casts in the target from RTL through SCHED2**, then **three
divisions and two casts at JUMP2**. Its initial RTL additionally contains the
`rectangle_result` template with two casts. The whole-file six-cast count is not
the target's cast count.

All nine artifacts of each probe were rehashed before this correction. The
function-scoped census and exact dump references are saved in
`build/sol-five-family/squad-inline-template-census-20261004.json`.
Existing source, observation metadata and native reports remain intact. The
resolver's eight ordinary masked differences and the evaluator's early sharing
blocker are unchanged; address bindings and the complete ten-member wave remain
unproved. Both production functions remain ASM.

The shared research store also records the correction without rewriting the older
observations:

- raw source: candidate `A3F5E6D13A2D836E35FA2D8F29E1FC6F320762D6A2DCEAE7461E749BDAFDB70A`, correction observation `20E0D42B78AA4F4467E9C3A59569A819DD9F56077DE48F68501EBBA92D8C2804`.
- byte source: candidate `69A987DA955AF933AEB04C339A2F8F28C6FD1724561B14A71F42B93564518F5A`, correction observation `61551FA9A86C3CF230E7F1F06134E6C1FAD2517CB5B80B68BE6F7C91F56F1282`.
