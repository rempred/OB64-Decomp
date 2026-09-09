# FC7C retained-tail independent structural review

Date: 2026-09-09

Verdict: **Accepted.** No blocking or non-blocking correctness finding was identified.
The exact retained-ASM classification and activation are supported by direct boundary
evidence, unchanged generic validation, focused falsifiers, exact integrated normal
verification and the completed structural audit.

## Reviewed scope

Reviewed the six-file implementation delta against
`32d9e08d2deb8243a25be3eccb542604ed522222`: the Phase 7 range/count configuration,
FC7C target and five-relocation activation, and the active-target, split-row and
Phase 7 tests. No production tooling, original ASM, manifest boundaries, descriptor,
compiler contract or C source changes are part of this delta.

The reviewer was independent of the proposal and implementation authors. Review
used read-only source, Git diff, ROM, JSON, map and ELF inspection. It did not run a
second build, compiler, test suite or unchanged full verifier. Only this review
document was written by the reviewer.

## Boundary and entry evidence

Independently authenticated the canonical 40 MiB normalized ROM, descriptor 10 raw
bytes and the four Phase 5A evidence products named in the proposal. Compared all
81 original FC7C assembly words with the ROM. The accepted row remains
`0x0020FC7C..0x0020FDC0`, 324 bytes, with the original owner preserved.

Original owner lines 92–94 contain the return at `0x0020FDB4` (`0x03E00008`),
required stack-restore delay slot at `0x0020FDB8` (`0x27BD0020`), and zero word at
`0x0020FDBC`. The accepted successor begins immediately at `0x0020FDC0` with
`0x27BDFFC0`. The unresolved historical interval ending at the delay-slot address
is not adopted. Historical linear PC comments do not control descriptor placement.

An independently implemented read-only scan reproduced 33,980 descriptor-10 raw
text words, 3,919 direct transfers, no direct tail target, and two entry calls at
ROM `0x001F3430` and `0x0020F004`. The complete aligned whole-ROM pointer scan found
no `0x801CC92C`. There are 338 unresolved indirect transfers, including 301
return-encoded instructions. These bounded negatives support the positive entry,
return/delay and successor evidence; they do not establish universal unreachability.

Independently reproduced SHA-256 values:

| Interval | SHA-256 |
| --- | --- |
| Original 324-byte row | `251481811BADC2DDE2541F271D42EBB61BD8398DABB20A32A35B8CA65AEC58E6` |
| 320-byte executable prefix | `015B00C840AF2FC03DAB3688EA6A1E006A1DEC78BBB3F3D47D2ADEC1735DDD3E` |
| Four-byte retained tail | `DF3F619804A92FDB4057192DC43DD748EA778ADC52BC498CE80524C014B81119` |

The accepted 013D0 review establishes the generic representation precedent, not
FC7C's boundary. FC7C's claim is separately supported as above. No original compiler
or assembler alignment mechanism is claimed.

## Implementation and falsifiers

The exact five-field range record adds only `0x0020FDBC..0x0020FDC0` in descriptor
10 text. Original owner counts remain unchanged. Counts increase by one range,
one link slice and one split owner. Generic production validators are unchanged.

The tests address both preparation watchpoints:

- `tests/split_row_phase8.js:535` selects fixed-range provenance mutation by actual
  range membership, so FC7C exercises it alongside 013D0.
- `tests/phase7_conventional_build.js:161` scans complete raw descriptor text,
  including existing non-executable slices. Thirty branch-family controls and
  injected tail edges from both FC7C and 013D0 retained bytes exercise the scanner.

The fixture now links before writing layout (`tests/split_row_phase8.js:418`),
matching production's dependency on the linked ELF. Its C section-name mutation
expects the specific earlier text-contract rejection; it is not a broad error
allowance. Existing mutation cases were preserved. The added relocation mutation
changes a real nonempty contract and requires the load-relevant drift rejection.

Inspected focused reports record exact full ROMs and 40 rejected mutations for
FC7C, 40 for 013D0 and 38 for 21C8DC. Independently parsed all three fixture ELFs
and hashed their generated ROMs. The Phase 7 report records twelve additional FC7C
rejections covering direct entries, return/delay/tail/successor changes, accepted
successor drift, an aligned pointer, execution flags and VMA/LMA drift. Existing
range schema, identity, descriptor, overlap and ownership rejection cases remain.

## Integrated normal verification

The completed normal report from the same audit run is
`build/current/verification.json`, SHA-256
`79D87F6EE73C45366B7A9A437602F03D044275E7864C0B94D88B2CB277BF36AA`.
The policy report is `build/source-policy/report.json`, SHA-256
`0AEA73E76A6AF787CDF23A6459C6BDD26E0A8B68D06009A4EDC9846583D57755`.
Both identities were independently checked.

The reviewer independently checked all thirteen supplement records against the
normal report and policy, including distinct target presence, `PURE_C`, current
source/dependency hashes, expected extents, exact linked bytes, actual relocation
counts and exact relocation words, sole map contributions, zero fallback
contributions and zero fill. This inspects the existing normal gate; it adds no
ordinary source-review gate.

Integrated output is under
`C:/Users/Joe/.codex/ob64-decomp-current/current/cda5b20c88c30f0083dd9bce/build`.
The reviewer independently hashed its ELF, map, layout and ROM against the normal
report, then parsed its FC7C ELF/load records and inspected row 3934 layout:

| Slice | Sole owner | ROM | VMA | Bytes | Section / PT_LOAD flags |
| --- | --- | --- | --- | ---: | --- |
| `.ob64.r3934.s0` | `objects/c/func_0020FC7C.o` | `0x0020FC7C` | `0x801CC7EC` | 320 | 6 (`ALLOC|EXEC`) / 5 (`R|X`) |
| `.ob64.r3934.s1` | `objects/assembly/chunk_032.o` | `0x0020FDBC` | `0x801CC92C` | 4 | 2 (`ALLOC`) / 4 (`R`) |

Both sections have one exact load mapping. The intervals are contiguous in ROM and
VMA, conserve all 324 bytes and retain original-ASM provenance for the tail. The
C text contract has no compiler tail. FC7C's five `R_MIPS_26` relocations remain
at offsets `0x24`, `0x44`, `0x88`, `0xF4`, `0x110`; the first three normalize to
`.text`, followed by `func_0020FA04` and `func_001F0E64`.

The unchanged FC7C source SHA-256 is
`C40F27E8925BCC501EB1F8D2A46BEC79A67393B274918BBA4C149A69A086D2BA`.
The complete integrated ROM SHA-256 is
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

## Terminal audit and acceptance

The same audit completed at `2026-09-09T04:22:27.142Z`. Its terminal output records
structural protections PASS, CURRENT exact ROM PASS and `RESULT: AUDIT PASS`.
The reviewer authenticated `build/audit/report.json` as SHA-256
`6B4CD1821B6D5C457C71EE5D4F4704E07BD53C2C9BF0E818BBA12A291EE861D1`,
confirmed `status: pass`, and inspected its referenced structural subreport and
normal verification report. The structural subreport and all its checks are `ok`.
The audit retains the OR-encoding and Squad migration protections, source-object
and toolchain evidence, and the canonical full-ROM hash.

All six implementation file hashes were checked again against the reviewed
`build/combat-fc7c-retained-tail-r1/implementation-inputs.json` and remain unchanged.
The actual integrated map at lines 87673–87691 independently shows one C prefix
contribution and one original-ASM tail contribution at the accepted addresses.
This review accepts the six-file structural delta on the stated source baseline
and normal-report identities. The complete thirteen-target supplement has its
normal acceptance evidence in that same report; no duplicate full verification
was run for this review. Integration and Git preservation remain the Director's
responsibility. No next wave is activated by this decision.

## Residual limits

Computed destinations, unaligned/materialized pointers and other runtime overlay
contexts remain outside the bounded scans. The review establishes no semantic
name, original source authorship or gameplay behavior. The retained four bytes
remain ASM and do not contribute to matching-C byte accounting.
