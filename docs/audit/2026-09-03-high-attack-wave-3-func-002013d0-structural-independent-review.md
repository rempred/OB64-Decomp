# High Attack Battle Stream Wave 3 `func_002013D0` Structural Independent Review

Date: 2026-09-03

Review branch: `codex/high-attack-wave-3-structural-review`

Frozen subject: `00fa27cea1dbe80106521e58feb86d0cf4bd6b6c`

Subject base: `aca0a60728cbcfa141f8e84b27af359fad817f4b`

Verdict: **Accepted**

No blocking or non-blocking correctness finding was identified. The frozen subject safely narrows
the executable owner of accepted row 3758 to the 84-byte function body, retains the 12-byte zero
tail under the original assembly owner as non-executable padding, and activates the exact body as
`PURE_C`. The new fixed-overlay range mechanism is fail-closed for the reviewed configuration and
external build evidence, affects no other accepted fixed overlay, and leaves the accepted
`func_0021C8DC` split-row contract intact.

## Scope and independence

I reviewed the complete frozen delta `aca0a607..00fa27c`, including all three subject commits and
all twelve changed paths. I read the worker report as an index, not as proof. The conclusions below
were recreated from the baserom, authenticated descriptor and Phase 5A evidence, accepted owner
model, source, current map/ELF/layout/source-object artifacts, focused tests, and independent
mutations.

The accepted `func_0021C8DC` comparison contract was taken only from its direct boundary evidence
and final accepted layout-verifier re-review. That contract requires an executable C-owned prefix,
a non-executable assembly-owned tail, exact ROM/VMA contiguity, exact section and `PT_LOAD` flags,
and equality of every accepted external-layout provenance field.

The frozen subject was not amended, rebased, or changed during review. The only tracked reviewer
change is this report.

## Independent structural evidence

### ROM, boundary, and entry evidence

The normalized 40 MiB baserom independently hashed to
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Descriptor 10 was decoded directly from ROM `0x00038950..0x00038978`. Its raw SHA-256 is
`1D7654735ED7CAE2A9226E64B45FBD76AEE84C79F36970CCCFFD0174DB6FEA68`, matching both accepted
overlay inputs. Its relevant fields are:

| Field | Value |
| --- | --- |
| ROM image | `0x001F0A30..0x00213B10` |
| Text ROM | `0x001F0A30..0x00211D20` |
| VRAM base | `0x801AD5A0` |
| Row 3758 ROM | `0x002013D0..0x00201430` |
| Row 3758 mapped VRAM | `0x801BDF40..0x801BDFA0` |

The accepted semantic ledger and assembly manifest preserve row 3758 as one 96-byte tracked
source owner, followed immediately by row 3759 and `func_00201430` at ROM `0x00201430`. The
structural correction therefore changes executable and link-slice treatment without rewriting the
accepted source-part boundary.

Direct baserom words establish the narrower executable extent:

```text
0x0020141C  0x03E00008  jr $ra
0x00201420  0x27BD0018  return delay-slot stack restore
0x00201424  0x00000000  padding
0x00201428  0x00000000  padding
0x0020142C  0x00000000  padding
0x00201430  0x308400FF  first word of accepted successor func_00201430
```

The independently calculated hashes are:

| Range | Bytes | SHA-256 |
| --- | ---: | --- |
| `0x002013D0..0x00201424` | 84 | `18ACA89C612392942718624B1792D58238FAB2AC1FE6F3F95D6777D6AF2E11B1` |
| `0x00201424..0x00201430` | 12 | `15EC7BF0B50732B49F8228E07D24365338F9E3AB994B00AF08E5A3BFFE55FD8B` |
| `0x002013D0..0x00201430` | 96 | `1D5E4D5613EEA1E4D33A84C03FC45BA0F744BE37EE42749B1813148F2BC3A06F` |

The accepted Phase 5A product manifest has SHA-256
`F004C4C09D611671935BD0D7927D514EAC1E05C347FBB271A523C424AFDB1D04`. I authenticated and
queried the relevant products directly:

- `return-delay-slots.jsonl`, SHA-256
  `75C739AA2D19205970822AF6CE14ECA58C2140E7712B3B30CDBD606FE347E9F0`, records the return at
  `0x0020141C`, delay slot at `0x00201420`, and next ROM at `0x00201424`;
- `function-dispositions.jsonl`, SHA-256
  `7812CA48DA2ABD17E569C15C5CD47D3DE235D94A01FC35E26FAA41A8869F3A9E`, records the accepted
  source owner at `0x002013D0`, the internal return and delay-slot labels, and the accepted
  successor at `0x00201430`; it contains no candidate start at `0x00201424`, `0x00201428`, or
  `0x0020142C`; and
- `control-flow-edges.jsonl`, SHA-256
  `C94748D69E7C2E3E2326DD56DF2EFBD8CF320BBBEAE00647E2BB08453C9722E4`, records the call at ROM
  `0x00200170` to live address `0x801BDF40` and no target at the padding addresses.

The call's descriptor-group back-map is ambiguous in that historical product, so I used its live
target only as corroboration. I separately decoded every direct jump, call, integer branch, and
COP1 branch in descriptor 10's complete raw text range using descriptor 10's ROM-to-VRAM mapping;
none targets `0x801BDF94..0x801BDFA0`. An aligned scan of the complete ROM also found no word equal
to `0x801BDF94`, `0x801BDF98`, or `0x801BDF9C`. These negative scans support the return sequence
and accepted successor boundary; they do not claim to disprove every possible computed address.

### Accepted model and generic isolation

`fixedOverlayNonExecutableRanges` has one exact record:

```text
id                   func-002013d0-alignment-padding
descriptor           10
overlay section      text
ROM                   0x00201424..0x00201430
```

The validator requires the configured count, an exact record schema, unique range IDs across both
fixed-overlay and non-descriptor execution ranges, safe aligned endpoints, containment in exactly
the named descriptor, confinement to descriptor text, and no overlap. Model construction cuts at
both endpoints, rejects partial or multiple execution treatments, and verifies that the treatment
still resolves to the named descriptor and section.

Only `.ob64.r3758.s1` carries the new range ID. No slice in any other fixed overlay carries it.
The row is conserved without a gap or overlap:

| Slice | ROM | VRAM | Bytes | Accepted execution | Base input kind |
| --- | --- | --- | ---: | --- | --- |
| `.ob64.r3758.s0` | `0x002013D0..0x00201424` | `0x801BDF40..0x801BDF94` | 84 | executable | `tracked-assembly` |
| `.ob64.r3758.s1` | `0x00201424..0x00201430` | `0x801BDF94..0x801BDFA0` | 12 | non-executable | `tracked-assembly` |

The Phase 8 layout changes the effective input kind of `.s0` to `matching-c` and preserves `.s1`
as `tracked-assembly`; the row is explicitly `mixed-matching-c-and-assembly`. Phase 8 compares the
fixed-range summary and every accepted slice provenance field, including both accepted and
effective input kinds.

The unrelated accepted `func_0021C8DC` row remains independently exact: 140 executable bytes in
`.ob64.r4033.s0` are solely C-owned, eight non-executable bytes in `.ob64.r4033.s1` are solely
assembly-owned, the full row is contiguous, and its target SHA-256 remains
`58A0D8F0D763A659AC0E489FC9F6F117B2C628496F07F7E42F37304B59EAB19C`. Its established
non-descriptor range ID is also reserved against reuse by the new fixed-overlay range validator.

### Link ownership, placement, and execution

The fresh strict CURRENT build gave the following concrete result:

| Slice | Sole map owner | ELF type/flags | VMA | `PT_LOAD` LMA | `PT_LOAD` flags |
| --- | --- | --- | --- | --- | --- |
| `.ob64.r3758.s0` | `objects/c/func_002013D0.o` | `PROGBITS`, `ALLOC|EXEC` (`6`) | `0x801BDF40` | `0x002013D0` | `R|X` (`5`) |
| `.ob64.r3758.s1` | `objects/assembly/chunk_032.o` | `PROGBITS`, `ALLOC` (`2`) | `0x801BDF94` | `0x00201424` | `R` (`4`) |

Each section has one exact load header and one map contribution. The C object contains only the
84-byte executable owner section for this row; it does not contain the padding section. Fallback
pruning removes the assembly `.s0` input while retaining `.s1`. The linked padding bytes equal the
baserom padding hash above.

The external Phase 8 layout records the original tracked source provenance, the mixed row kind,
the two effective slice kinds, exact ROM/VMA endpoints, descriptor 10 text placement, execution
flags and range IDs, source/fallback identity, and final linked owners. The Phase 7 and Phase 8
verifiers both reject contradictions in those records.

### Exact C and relocation contract

`src/lib/func_002013D0.c` has SHA-256
`22AE9F69A59A7DBE93BB7D873B6E077F9AF8745B8281585F367D15C11C1D5C5C`. Raw and preprocessed
source classification is `PURE_C`; the source contains no assembler mechanism. The untouched
compiler assembly is section-adjusted only by replacing its `.text` directive, with
`compilerAssemblyRewritten: false`.

The source-object proof contains exactly one global 84-byte compiler function and the reviewed
eleven load-relevant relocations:

| Offsets | Relocation | Symbol |
| --- | --- | --- |
| `0x08` | `R_MIPS_26` | `func_00201108` |
| `0x10`, `0x2C` | `R_MIPS_HI16` | `D_801CE8C0` |
| `0x14`, `0x30` | `R_MIPS_LO16` | `D_801CE8C0` |
| `0x18`, `0x1C` | `R_MIPS_HI16`, `R_MIPS_LO16` | `D_801976DC` |
| `0x24`, `0x40` | `R_MIPS_26` | `func_00209774` |
| `0x34`, `0x38` | `R_MIPS_HI16`, `R_MIPS_LO16` | `D_801976E8` |

The normalized records equal the canonical linkage contract. The final linked target is exactly
84 bytes at ROM `0x002013D0`, VMA `0x801BDF40`, has zero differing bytes and instruction words,
and hashes to the expected executable-body SHA-256. The full rebuilt ROM is exact.

## Independent adversarial mutations

A reviewer-owned harness first accepted the unmodified fresh CURRENT layout, map, ELF, target
bytes, complete ROM, and `func_0021C8DC` control. It then rejected all 24 mutations below through
the indicated production verifier or an independent raw-ROM control-flow guard:

| Falsifier group | Mutations rejected |
| --- | --- |
| Fixed-range validation | wrong descriptor; wrong section/kind; ID collision with `func_0021C8DC` |
| External fixed-range provenance | wrong descriptor summary; wrong ROM start; wrong ROM end |
| Slice provenance and contiguity | wrong executable ROM start; wrong padding ROM end; wrong padding VRAM start/end; wrong retained range ID; wrong effective input kind; ROM/VMA gap; ROM/VMA overlap |
| Accepted provenance | accepted row changed from `tracked-assembly` to `splat-data` |
| Ownership | C owns padding in layout; C owns padding in map; assembly owns executable bytes in map |
| ELF/program headers | padding section executable; padding `PT_LOAD` executable; padding LMA shifted; executable C section made non-executable |
| Control flow | injected `beq $zero,$zero,0x801BDF94` at ROM `0x002013D0`; descriptor scan detected the new padding entry and exact-ROM verification rejected the changed byte |

The generated mutation report is ignored build evidence at
`build/reviewer/func_002013D0_structural_mutations_report.json`, SHA-256
`4BE2063251E8966BB06DD702BDE04B5613E823F7AE2C04503471B219190654DF`.

The subject's end-to-end split-row test independently rejected all 39 `func_002013D0` mutations,
including the complete twelve-field accepted-layout matrix and both accepted/effective input kinds.
The same run rejected all 38 established `func_0021C8DC` mutations.

## Command outcomes

| Command | Outcome |
| --- | --- |
| `node tests/active_targets.js` | Pass; 521 active targets; both split-row owner/extent contracts resolved |
| `node tests/split_row_phase8.js` | Pass; exact 84+12 and 140+8 builds; 39 and 38 mutations rejected; both complete ROMs exact |
| `node tests/phase7_conventional_build.js --output <fresh accepted Phase 7 output>` | Pass; baseline verified; fixed-range schema, descriptor, execution, VMA/LMA, overlap, and retained `func_0021C8DC` mutations rejected |
| `node tools/diff.js func_002013D0` | `EXACT`; `PURE_C`; 0 differing bytes/words; relocation contract `MATCH` |
| `node tools/source_policy.js --target func_002013D0` | Pass; one `PURE_C`, zero hybrid/ASM/unknown |
| `node tools/verify.js --target func_002013D0 --require-pure` | Pass; sole C ownership, placement, eleven relocations, exact target, and exact full ROM; `RESULT: MATCHING C` |
| reviewer mutation harness | Pass; unmodified artifacts accepted and all 24 independent falsifiers rejected |
| `node tools/audit.js` | Pass; structural protections and CURRENT exact ROM |
| `git diff --check aca0a607..00fa27c` | Pass |

Fresh generated evidence identities include:

- split-row `func_002013D0` report:
  `1F33C9CE54E2E9F55E587036175A4C691AEA1113EDC745237DA9A05FB696E9BC`;
- split-row `func_0021C8DC` control report:
  `204B915EBCD78E0A3DD2BFAB5F5A0C0F35451A9933FD7185F1194DE142E4937C`;
- target diff report:
  `30CD7DAC3CDC70753D01D96F3229A2C5CFDBCFCC3DFCADBE7BD58CDDA4A9A836`;
- strict CURRENT verification:
  `D6C407027EF493F9FCD7519B4E1E5CEB74B05C7A77FD4B4E31EC136A72EA55E4`;
- target source-object proof:
  `365DE3499FDDF2F66063DF02A8008FB942B46F9894774C488736B560579D9DF1`;
- structural audit:
  `FEB2A044395EE5260F79CE8E1B9E92B06916C055180A1FB75D4C24352B718725`.

The verified CURRENT fingerprint is
`050B793EDF4D6F5BF1A504B466F5F5A4E3E8F120DA9EF4FABD19656C5AF5EB4F`. It contains 459 exact
`PURE_C` functions / 31,904 bytes and 62 exact `HYBRID_C` functions / 33,724 bytes, with zero
compiler-assembly rewrites. The final ROM SHA-256 is the canonical hash above.

## Residual risks and limits

- The absence of direct targets and aligned pointer words cannot prove that no computed
  `jr`/`jalr` address could ever reach padding. The accepted classification rests on the decoded
  return and delay slot, three zero words, the immediate accepted successor, absence of any
  accepted/static entry, and fail-closed linked execution/ownership proof.
- Descriptor 10 and the Phase 5A owner/entry products remain authenticated structural inputs. This
  review re-read their raw identities and relevant records but did not repeat the historical
  runtime overlay-capture campaign.
- The generic fixed-overlay range type currently has one accepted record. Any additional record or
  changed endpoint is new structural work and requires its own direct boundary/entry evidence,
  focused mutations, and audit; exact ROM output alone would not justify it.
- This verdict establishes structural ownership and machine-code acceptance only. It does not
  establish a semantic name, original source authorship, or gameplay meaning for the function.

Subject `00fa27cea1dbe80106521e58feb86d0cf4bd6b6c` is accepted for integration, subject to normal
intake hygiene.
