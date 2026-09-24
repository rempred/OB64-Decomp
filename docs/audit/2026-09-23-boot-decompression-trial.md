# Boot decompression family trial

This is the first bounded trial of Joe's agreed family-based decompilation
process. The frozen scope is 28 physical owners, 18,884 bytes, covering the boot
codec library and its custom bitstream/LZSS support. Shared allocation, I/O and
diagnostic services remain external dependencies. Physical storage cuts do not
define the number of callable functions.

## Acceptance status

The prepared wave passed all canonical per-producer checks and the final combined
structural/full-ROM audit on September 24, 2026 at **05:03:02 UTC**. All 24 new or
converted producers are mechanically `PURE_C`, own their complete accepted
intervals without original-assembly contributions, and produce exact retail bytes.
The complete ROM is byte-identical to the canonical normalized US Rev 0 image.

| Work in this wave | Complete bytes | Accounting |
|---|---:|---|
| LHa adaptation, 21 C producers / 22 physical owners | 14,272 | Accepted new pure C |
| Custom cursor helpers, six bodies in one owner | 800 | Accepted new pure C |
| Custom descriptor decoder | 416 | Accepted new pure C |
| Resource LZSS entry, previously hybrid C | 128 | Accepted pure-C conversion |
| Existing Huffman reset | 36 | Already pure C; excluded from new bytes |
| Custom LZSS owner at A510 | 2,668 | Unfinished; original assembly retained |
| Descriptor encoder owner at 4894 | 564 | Unfinished; original assembly retained |

The wave adds **15,616 exact pure-C bytes** and brings whole-owner coverage in
this frozen scope to **15,652 of 18,884 bytes**, or 26 of 28 physical owners.
The remaining **3,232 bytes are unfinished**. There are zero accepted assembly
exceptions and zero completed whole frozen families. The accepted LHa code
and custom helper work do not make the complete boot family finished.

## What worked

Upstream identification and reuse was the cheapest successful first step for
the library. The complete preserved distribution is
[LHa for UNIX 1.14c](../../third_party/lha/README.md), with all original notices
and distribution terms. The original January 1995 1.14 archive was not located.
Several decoder files also occur unchanged in 1.14e; exact output does not
uniquely prove the historical source version.

The game adaptations remain separate from pristine upstream files. Shared
headers describe observed stream offsets, scalar widths, pointer-backed
tables and callback state. The
[local-change ledger](../../third_party/lha/LOCAL_CHANGES.md) records each
producer's upstream origin and each retained game difference: memory input,
ordinary inline refill and CRC helpers, absent text/verify/UI paths, seven
methods, and the additional state/control-flow differences found in the ROM.

Related functions supplied evidence for each other. Restoring ordinary inline
helpers, rather than replacing them with local blocks or macros, recovered the
compiler's parameter lifetimes across multiple decoder families. Shared types
and state declarations were checked with all selected producers, not inferred
from one convenient function. The retail st0 gate/count split remains explicit;
the source does not silently repair it to resemble upstream.

For custom code, full body coverage and targeted compiler diagnostics were
useful. The cursor bit reader matched after a trace showed that an early jump
pass reordered separate return arms; source order expressing the ready-bit
return first reproduced the retail order. The 76-byte AF30 length reader matched
in isolation when two conditional paths shared one authored block. That partial
result is not credited while its complete owner is unfinished.

The existing resource-entry hybrid converted to ordinary C by passing the
actual format byte to the diagnostic's `%d` argument. This accounts for the
observed argument register without a register-assembly binding; all ten existing
relocations remain unchanged.

Each experiment had a stated prediction. Rejected candidates and traces remain
under ignored `build/boot-decompression-trial-r1/` research paths. Diagnostic
compiler traces were checked for output parity against the unchanged pinned
compiler; forcing switches and altered instructions were not used for accepted
source. No specialized neural model or broad compiler-search framework was
built. This trial supports reuse, family reconstruction and narrow causal
compiler experiments; it supplies no held-out evidence for expanding a general
training or synthesis tool.

## Necessary structural work

The prerequisite [manual-load mapping](2026-09-23-manual-load-mapping-completion.md)
was completed and audited separately in commit `54618660`. It placed all 863
previously unmapped executable slices using actual loader evidence, preserving
existing owners and the 19 fixed overlay descriptors.

The [logical body census](2026-09-23-boot-decode-body-census.md) separates callable
bodies from storage cuts. It accounts for all cursor, LArc and custom LZSS bodies
and retains the encoder tail as unknown. The independently reviewed
[compiler/owner composition change](2026-09-23-multi-owner-function-producers.md)
allows both complete dynamic Huffman bodies to span two unchanged physical
owners. It also preserves the pinned assembler's native relocation order,
including scheduled delay-slot relocations. No bytes, function sizes, ownership
gates or compiler flags were fabricated or weakened to obtain a match.

## Remaining blockers and next experiments

`boot_lzss_decompress`, ROM `A510..AF7C`, contains four bodies. ABE0 (44 bytes)
and AF30 (76 bytes) have exact isolated candidates. The 1,744-byte A510 body and
804-byte AC0C body remain nonmatching, so none of this 2,668-byte owner receives
new matching-C credit.

- A510: traces located excessive tail sharing after reload and a destination/
  command lifetime mismatch. Making one short-case byte block-local changed
  allocation as predicted, but the resulting 1,660-byte candidate remained
  nonexact and was not selected. A read-only follow-up maps H2's early caller
  cursor and its later inline-helper destination as distinct pseudos; the
  original H2 coalesces them, whereas the failed local-byte variant splits them.
  H1's earlier binding is already a nonexact result, not a fresh hypothesis.
  The next specific test would name one short-case output cursor before length/
  distance evaluation and use it in both copy arguments. Reject that explanation
  if expansion/combination still produces the same copy and conflicts. Exact
  mappings, missing H1 dump evidence, best candidates and the failed sequence are
  preserved in `lzss-main-diagnosis/DIAGNOSIS.md`.
- AC0C: the input pointer has the same 24 memory references as retail; retail's
  two extra uses are address arithmetic, not missing input reads. GoldOx's
  follow-up compiler dumps found that common-subexpression elimination kept a
  shifted-length intermediate live and occupied the argument registers wanted
  by the copy counters. Two prediction-driven tests followed. H9 separated the
  length calculation and moved the counter as predicted; H10 used a dictionary
  index in the copy loop, supported by retail's delayed address formation.
  H10 now places the input, dictionary, output and position in their retail
  registers, retains the exact 804-byte length, and reduces differing words
  from 140 to 90 in the diagnostic comparison of 201 words (five unresolved
  jump/call target words excluded). It remains nonexact. Residue includes the
  bits/size register swap, one literal counter and branch-delay scheduling.
  The next hypothesis is whether shift reuses the bits variable in modes 0/3.
  H10 is preserved as the new best in GoldOx's `exp/AC0C_body_h10.c`; H7/H8,
  `AC0C-REGISTER-MAP.md` and the dumps remain recoverable. This scratch progress
  does not change the production wave or its credited bytes.

`boot_bitstream_descriptor_encode`, ROM `4894..4AC8`, has an exact isolated
548-byte principal body and an unresolved 16-byte tail. A scan of all 4,885
mapped executable slices found no direct references or standard immediate
address constructions to its four tail addresses. That negative result does
not prove unreachability, padding, or an empty function. Original object/symbol
provenance or stronger entry evidence is required before changing its structural
interpretation. The complete 564-byte owner remains unfinished.

The stop rule triggered diagnosis and a changed plan for the nonmatching work.
Neither elapsed time nor an isolated partial match grants an assembly exception.

## Verification, time and resources

Each of the 24 producers passed the ordinary `node tools/diff.js <symbol>`
command: mechanical `PURE_C`, exact raw and decoded linked bytes, and matching
actual relocations. One `node tools/audit.js` run then checked the combined
state, including all 650 active source-to-object proofs, structural protection,
sole C ownership and the complete 41,943,040-byte ROM. No separate redundant
full verifier was launched after the audit.

Canonical ROM SHA-256:
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Generated evidence (ignored):

- `build/audit/report.json`, SHA-256
  `857DA572B6CD6AE938297452AD047E30DB99EFCFD5589A6ECE4E66E95E561CE1`.
- `build/current/verification.json`, SHA-256
  `D2854F78BE4356A2DCE1AD5D461E76372A50F0D8CA413560A514145B78A7C2CF`.
- `build/boot-decompression-trial-r1/silverotter/canonical-audit-summary.json`
  joins the 24 canonical diffs to their final complete-owner proofs and checks
  the new-byte accounting; `timing-final.json` records raw timing/resource paths.

Focused tests passed for the active target model, logical function registry,
boot body census, compiler function contracts, diff cache, composed multi-owner
functions, native relocation order, legacy multi-owner text and its full-ROM
fixture. Independent review approved the structural census and composition/order
changes. All 34 vendored upstream files were rehashed against their manifest and
remain pristine.

The first recorded mapping-check monitor began at **02:29:34 UTC**; final audit
completion was **05:03:02 UTC**, a recorded wall window of **2 h 33 min 29 s**.
The source-experiment release at 03:12 to audit completion was **1 h 51 min 3 s**.
These windows include failed attempts, pauses, preparation within the window,
coordination and concurrent work. Preparation before the first recorded monitor
is unmeasured, so neither number is a complete project labor estimate.

Fourteen monitored commands sum to **1 h 40 min 54 s**; their interval union is
**1 h 39 min 44 s**. Overlap means these are not additive to the wall window or
person-hours. GoldOx's corrected 03:12–03:55 checkpoint was 43 wall minutes,
followed by later diagnoses and H9/H10 tests inside the same overall window.
Narrow probe timings are nested observations and are not added again.

Failures and interruptions remain in the measurements: the first mapping audit
exposed a lost cut label; the first dynamic canonical run stopped at the native
relocation-order defect; the first custom intake rejected an unused ROM-valued
binding before compilation; and the initial serial diff runner was stopped after
two passes to resume the remaining work in two isolated lanes. Failed source
hypotheses remain documented above and in their research notes. The final audit
took **26 min 19 s**.

Peak sampled host use was **55.32% CPU** and **34.49% RAM**. The largest additional
disk-use observation within one run was **7.78 GB**; it is not a sum of project
storage or a process-isolated measurement. No resource guard reported a ceiling
violation. The monitors enforced Joe's 80% CPU, 80% RAM and 200 GB additional
storage limits for their command trees.

The Agent Mail watcher remains a local machine process with ten-second,
single-flight polling and failure backoff. SilverOtter and GoldOx coordinated
ownership and results through thread `A1-004`; incoming mail does not itself
expand the authorized family scope.
