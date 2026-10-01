# F34 caller declaration reconciliation

Director decision for Agent Mail 555, reviewed on `main` at `b7678800`:
permit bounded ordinary-C unused-argument experiments and preserve the current
production one-argument declaration until caller/callee alignment is supported.
No tooling defect or compiler-contract change is established or required.

The complete `func_00106F34` body consumes incoming `a0` only. It overwrites
incoming `a1`, `a3` and `a2` before reading them. This establishes consumed
inputs; it does not prove the historical C declaration had exactly one formal.
The private four-formal callee reproducing the same 448-byte body likewise
cannot establish historical arity, because its extra formals are unused.

Independent read-only review reconciled the complete callee and the four known
original direct call sites:

| Caller / call z64 | Other registers at the call | Interpretation |
|---|---|---|
| `0011D5EC` / `0011D718` | After its loop: `a1=N`, `a2=unit+12*N`, `a3=unit+4*N`; the zero-count path skips `a2/a3` setup. | Loop residues; the proposed indexed-view/target/flag meanings are not universal. |
| `00125460` / `00125B20` | `a1=unit+4*byte20`, `a2=target`, `a3=0`. | The first two values independently serve preceding field operations; unused-argument interpretation remains a hypothesis. |
| `00126D24` / `0012712C` | `a1=unit+4*(word24-1)`; no call-local `a2/a3` preparation. | The latter registers retain caller-clobbered values. Its current one-argument C call is provisionally linked-exact. |
| `0012C788` / `0012CDC0` | Same observed pattern as `00125460`. | The otherwise-unread `a3` writes warrant source experiments, without establishing all four formal meanings. |

In `125460` and `C788`, every path reaching F34 overwrites the earlier `a3=1`
with zero. The argument that these stores require an original call-use list is
a compiler-history inference; original RTL is unavailable. The observed words
remain facts to explain, rather than instructions to invent an extra source use.
The bounded scan found no simple address materialization/direct tail jump in
the original library splits or aligned literal `801B27F4` in the normalized ROM.
Computed indirect references are not excluded, and the external/deferred D5EC
caller is a read-only boundary, not newly authorized implementation scope.

## Source-work direction

- Function prototypes and evidence-backed unused formals/outgoing values are
  permitted ordinary C under [SOURCE_POLICY](../../SOURCE_POLICY.md). Mechanical
  source classification and the existing matching gates still decide acceptance.
- Preserve the selected complete C788 candidate. A worse four-word experiment
  neither becomes the best candidate nor disproves the underlying hypothesis.
  Test real search/publication/flag lifetimes with the existing compiler dumps;
  distinguish observed outgoing words, source hypotheses and original-source claims.
- Before changing the shared production declaration, provide compatible C
  declarations/definitions and supported argument expressions for affected active
  callers, especially the already exact `126D24`. Do not invent values for its
  residual registers, force incompatible function-pointer casts, add synthetic
  reads/references, or bind registers to obtain the desired instruction pattern.
- Validate any eventual coherent source change through focused linked checks
  for the callee and affected active callers, including actual relocations and
  sole ownership. Keep the complete twenty-member movement wave and its one
  final full-ROM verifier. No per-function full build or unchanged audit repeat.

Sol retains sole production source/build ownership and continues unaffected
authorized work. The prior six-interface prerequisite remains closed; this
finding does not weaken its owner/table/tail protections. Review performed no
source/configuration edits, compilation, verifier run or runtime operation.
