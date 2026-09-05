# Allocator source probe: sequential carrier

## Scope and boundary

This is one diagnostic source probe for `func_002158E4`, the smallest accepted
allocator/owner-order baseline. It does not run the other baseline functions,
holdouts, or a source-spelling sweep. The active C implementation, headers,
compiler helpers, source-policy implementation, linker ownership, and accepted
scheduler-trace evidence are unchanged.

The driver is
`tools/matching_studies/allocator_source_probe.js`. It invokes the retained
authenticated production and research compilers directly and writes only to
ignored `build/allocator-source-probe/`. It does not import the changing
compiler, source-policy, header, target-model, or workflow modules. The source
receives only a conservative assembler-escape token scan; this study makes no
official `PURE_C` claim.

## Hypothesis stated before execution

The baseline obtains the allocator result directly in `snapshot`. The probe
uses a separate automatic carrier and transfers it only after the owner read.
This is the complete source delta; every other byte remains the authenticated
archive:

```diff
    u8 *snapshot;
+    void *allocation;

-    snapshot = func_80070F30(0x6094);
+    allocation = func_80070F30(0x6094);
    owner = D_801CE8BC;
+    snapshot = allocation;
```

The allocator remains before the global read because the call may change
`D_801CE8BC`; moving that read before the call would not be semantics-justified.
Moving only the automatic pointer copy after the read has no externally
observable side effect and preserves the values used by all later calls. This
separates carrier lifetime from the loop/control-flow scaffolding in the prior
do-while experiment.

The prediction was that calls.c would still create the return copy before the
owner load. If carrier lifetime itself were causal, the later
`allocation`-to-`snapshot` transfer would create a useful direct dependency
without the do-while output regression. If the compiler coalesced the carrier,
the baseline LUID tie would remain.

The declared stop rule was one probe only, stopping if relevant
creation/dependency state was unchanged, if it matched the known do-while
regression, or if extent, relocations, or the residual worsened. An exact
isolated result would instead pause for coordinated official classification and
the normal canonical verifier.

## Authenticated inputs

The run failed closed on every identity below before compiling:

| Input | SHA-256 |
|---|---|
| Archived baseline source | `C59E098C0633E9DE88F4ABB550A6CB124BC315584D254776C4ACE4AEDAFB91A1` |
| Accepted scheduler-trace report | `61B528A347219ADFE776A7CAB1CEABE4B76A7643BADF84F8676CE751FE2551D0` |
| Production KMC cc1 | `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6` |
| Research cc1 | `F675E352B9C9505AB821ED358755E5329BE01D8A6B50ADE57C07DE50F5A4447F` |
| GNU 2.6 assembler | `0831D410AD140F2D2225382273219ACB418EF6EC1E986A3309F034D2A8350A5C` |
| GNU 2.6 linker | `48944635BC840256BC2FBA86D2701A4CA59B2424B924AC8B9F4853D4E1DA609F` |
| GNU 2.6 objdump | `5F5B5822691BFAD87E628BCE4C781459902E4124AB7ED6604CA2DB62075D9816` |
| Retained baseline object | `8166B518268ABA3C409D5E9ABF7F997B3703E7A9CC70DDE20BE16730B02EA61E` |
| Diagnostic linker script | `5096BC4C923BED1F5940EEE5B1B1AD812B2000435F81FA95D6E91B745DC5A6F2` |
| Exact-oracle diagnostic ELF | `EF1C90BCE33E90D766C292E140620CD029B5AA8CF423C577389F5B0E3B54647A` |
| Exact-oracle linked target bytes | `2F0A1C6BC565B80B40015D55DD7944DC2C2C842E488763608D932D9BBCE6A8BD` |

The research compiler instrumentation ID is
`6EDFDE806E62D97C9B6A7C085B94832D9420234B02CBDC87C898954D7EFBF7F1`.
The generated probe source is 1,051 bytes with SHA-256
`9E1D8FAD7D1E3EEA463CA9431DFDAD0615574416EF1AE78EB9026F12D8222577`.

## Control and parity gates

The direct-invocation control reproduced the known baseline before the probe
was interpreted:

- target text: 236 bytes,
  `32630296E7707E4AA6AF916B5CC86CB767D9FAFE72B6AF39AA679A21F3CA353C`;
- 27 relocations,
  `C0C8E70E92B86ED0114A528D8AF5B1F66E0C01B4407586702A37C0871CF25C45`;
- canonical emitted state,
  `7AB4A8AFA47CB78EB730FAF409263BDB76EA77055DD20A5C144B3AB4AAD67F75`;
- the known three-instruction residual at offsets `0x18`, `0x1C`, and
  `0x20`; and
- the accepted normalized creation/dependency signature.

For both the control and probe, production versus research compiler assembly,
adjusted assembly, raw object, target text, relocations, and emitted state were
all byte-for-byte exact. Research stderr was interpreted only after those six
parity checks passed.

## Observation

The carrier changes raw RTL identity but not the causal scheduling state. The
return-copy destination pseudo changes from 74 to 75 and the first context-load
UID changes from 18 to 21. Those are bookkeeping consequences of the extra
automatic variable. The relevant observations remain identical:

- creation order is allocator call, return save, calls.c result copy, then
  owner load;
- owner and save priorities are both 1;
- the save's anti-dependence is kind 14, with raw cost 1, post-adjust cost 0,
  effective cost 1, and class 3;
- the owner has no link and is class 3;
- the owner remains exactly two LUIDs later than the save;
- the comparator still resolves the tie by LUID, prefers the owner, and selects
  it from a ready set of two; and
- there is still no non-free true dependency among the owner, save, and context
  operations.

The normalized causal signature is therefore unchanged at
`23809A8B11ABE9537D02B33CA8FD71B66243BA921A5A8D1E2F613026F51C6167`.
The differing raw-creation signatures are retained in the generated report so
that this normalization does not hide the pseudo-number change.

Production output also collapses completely to the baseline:

| Measure | Probe result |
|---|---|
| Object text | 236 bytes; `32630296E7707E4AA6AF916B5CC86CB767D9FAFE72B6AF39AA679A21F3CA353C` |
| Relocations | 27; `C0C8E70E92B86ED0114A528D8AF5B1F66E0C01B4407586702A37C0871CF25C45` |
| Emitted state | `7AB4A8AFA47CB78EB730FAF409263BDB76EA77055DD20A5C144B3AB4AAD67F75` |
| Linked bytes | `CB2A2D6F8D2B7E24664D6D2F84C13880851B30F8DA3DF46B663B27A69A7312C6` |
| Exact-oracle comparison | 11 differing bytes in 3 instructions, one 12-byte region at `0x18` |

Apart from the `.file` source path, the control and probe production compiler
assembly is identical. The diagnostic linker result is not exact and is not
acceptance-eligible.

## Decision

Stop: the sequential carrier is coalesced before it can create a useful
dependency. It leaves the confirmed baseline LUID decision and final residual
unchanged. No additional spelling, target, family member, or holdout was run,
and no canonical source was changed. Because the probe is not exact, official
source classification and the normal target/complete-ROM verifier were not
invoked.

The complete machine-readable record is
`build/allocator-source-probe/report.json`. Reproduce the bounded run with:

```text
node tools/matching_studies/allocator_source_probe.js
```
