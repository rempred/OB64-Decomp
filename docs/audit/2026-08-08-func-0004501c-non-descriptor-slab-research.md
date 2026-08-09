# `func_0004501C` cold-boot non-descriptor slab research

Date: 2026-08-08
Scope: structural research and implementation; no accepted owner boundary, segmentation, source-owner, or C-target change
Status: implemented; worker heavyweight audit PASS; independent structural review pending

## Finding

Accepted owner `p0910` / `func_0004501C` is wholly contained in a cold-boot,
manually loaded non-descriptor slab. The exact half-open transfer ranges are:

| Address space | Exact range | Length |
|---|---:|---:|
| z64 ROM | `0x00040E80..0x00066E10` | `0x25F90` / 155,536 bytes |
| physical RDRAM | `0x0016AF80..0x00190F10` | `0x25F90` / 155,536 bytes |
| live KSEG0 | `0x8016AF80..0x80190F10` | `0x25F90` / 155,536 bytes |

The resulting live-address delta is `+0x8012A100`; the physical-RDRAM delta is
`+0x0012A100`.

This conclusion does not come from generalizing the two known p0909/p0910 point mappings.
The transfer endpoints are explicit operands at the responsible retail loader callsite.

## Evidence discipline

The parent workspace's current-only unified resolver R2 was queried according to
`../docs/research-aide-index.md` using:

```text
python -B scripts/query_resolver.py explain func_0004501c \
  --relationship all --limit 500 \
  --db db/resolver-r2.sqlite \
  --registry registry/sources.v1.json \
  --repo-root C:\Users\Joe\Projects\OgreBattlel64
```

The resolver returned candidate placement/static records for p0910 and retained the explicit
caveat that placement is not execution evidence. Those records corroborate the p0910 point
mapping but were not used to infer the slab endpoints.

The accepted overlay atlas similarly contains a conservative byte-equality interval:

```text
ROM:            0x00040E90..0x00065008
physical RDRAM: 0x0016AF90..0x0018F108
delta:          +0x0012A100
boundary kind:  conservative-block-extended
```

That interval is a proper subset of the programmed load. Its comparison edges are not DMA
boundaries. In particular, canonical runtime table mappings at ROM `0x000650E0`,
`0x000654A0`, and `0x0006592C` continue to use the same delta beyond the atlas equality edge.

Retail execution evidence remains separate: the parent report
`../docs/squad-override-retail-callpath-report-20260807.md` records the live p0910 target
`0x8016F11C` in the observed call path. The endpoint proof below comes from canonical accepted
assembly and manifests.

## Responsible loader operation

The responsible logical read is in:

```text
asm/original/rev0/boot/early_boot_resource_loader.s
func_000022B0
callsite z64 0x00002470 / live PC 0x80072070
callee live 0x8009DA50 / func_0002DE50
```

The accepted instructions construct the source and destination directly:

| z64 PC | Relevant operation | Result |
|---:|---|---:|
| `0x000023F4..0x000023F8` | construct `s6` | `0x8016AF80` |
| `0x00002404..0x00002408` | construct `s4` | `0x00040E80` |
| `0x0000240C..0x00002410` | construct `s1` | `0x80190F10` |
| `0x00002414..0x00002418` | construct `s2` | `0x80197B70` |
| `0x0000245C` | `move a0,s4` | source `0x00040E80` |
| `0x00002460..0x00002464` | construct `a1` | destination `0x8016AF80` |
| `0x00002468..0x0000246C` | construct `a2` | ROM end `0x00066E10` |
| `0x00002470` | `jal 0x8009DA50` | resource-read helper |
| `0x00002474` | delay-slot `subu a2,a2,s4` | length `0x25F90` |

Because the subtraction executes in the MIPS `jal` delay slot, the callee receives exactly:

```text
a0 = 0x00040E80
a1 = 0x8016AF80
a2 = 0x00066E10 - 0x00040E80 = 0x25F90
```

`asm/original/rev0/lib/func_0002de50.s` preserves the length and destination. For requests
of at least 16 bytes it passes `(length + 1) & ~1` to the lower transfer helper at
`0x80089F80`. Since `0x25F90` is already even, the effective length remains exactly
`0x25F90`.

`asm/original/rev0/lib/func_0001a380.s` preserves source, destination, and remaining length,
then advances them through requests of at most `0x200` bytes. The logical request therefore
becomes 303 full `0x200` transfers plus one final `0x190` transfer, with no rounded tail beyond
`0x00066E10`.

## Exact calculations

```text
ROM length     = 0x00066E10 - 0x00040E80 = 0x25F90
runtime length = 0x80190F10 - 0x8016AF80 = 0x25F90

start delta = 0x8016AF80 - 0x00040E80 = 0x8012A100
end delta   = 0x80190F10 - 0x00066E10 = 0x8012A100

p0909 start = 0x00044AA4 + 0x8012A100 = 0x8016EBA4
p0910 start = 0x0004501C + 0x8012A100 = 0x8016F11C
```

## Independent start-boundary evidence

The immediately preceding logical read in the same boot function is:

```text
ROM:     0x0003F1B0..0x00040E80
runtime: 0x800F9C20..0x800FB8F0
length:  0x1CD0
delta:   +0x800BAA70
```

It ends exactly at the p0910 slab's ROM start and uses a different runtime destination. The
two programmed source intervals abut but do not overlap.

The final 16 bytes of accepted data owner p0810 are:

```text
ROM 0x00040E80: jr ra
ROM 0x00040E84: nop
ROM 0x00040E88: jr ra
ROM 0x00040E8C: nop
```

The canonical table in `asm/original/rev0/lib/data_00037480.s` contains consecutive live
pointers `0x8016AF80`, `0x8016AF88`, and `0x8016AF90`. Under the proven delta they address
the two return stubs and the p0811 entry at ROM `0x00040E90`. This independently explains why
the loader begins 16 bytes before the first wholly contained code owner.

## Independent end-boundary evidence

The loader constructs `s1 = 0x80190F10`, equal to destination start plus the exact request
length. It separately constructs `s2 = 0x80197B70`, which is fixed descriptor 0's runtime
start, and operates on the `0x6C60`-byte gap between them after the load.

The canonical fixed descriptor table and `config/overlays/us_rev0.json` give descriptor 0:

```text
ROM source:    0x00066E10..0x00069900
runtime range: 0x80197B70..0x8019A670
```

Thus the manual slab's ROM end is exactly the next descriptor source start, while its runtime
end remains `0x6C60` below that descriptor's runtime start.

## Accepted-owner containment

The accepted owner ledger gives 478 wholly contained owners: p0811 through p1288 inclusive.
They comprise 456 code owners and 22 data owners.

| Accepted owner or group | Accepted ROM range | Runtime under the slab mapping | Relationship |
|---|---:|---:|---|
| p0809 | `0x000404B4..0x00040638` | prior-load mapping | outside |
| p0810 | full owner `0x00040638..0x00040E90` | only `0x8016AF80..0x8016AF90` belongs here | partial/straddling |
| p0811-p0907, 97 code owners | `0x00040E90..0x000449EC` | `0x8016AF90..0x8016EAEC` | wholly inside |
| p0908 | `0x000449EC..0x00044AA4` | `0x8016EAEC..0x8016EBA4` | wholly inside |
| p0909 | `0x00044AA4..0x0004501C` | `0x8016EBA4..0x8016F11C` | wholly inside |
| p0910 | `0x0004501C..0x000453E0` | `0x8016F11C..0x8016F4E0` | wholly inside |
| p0911 | `0x000453E0..0x00045400` | `0x8016F4E0..0x8016F500` | wholly inside |
| p0912-p1266, 355 code owners | `0x00045400..0x0005C208` | `0x8016F500..0x80186308` | wholly inside |
| p1267-p1288, 22 data owners | `0x0005C208..0x00066E10` | `0x80186308..0x80190F10` | wholly inside |
| p1289 | begins at `0x00066E10` | descriptor 0 starts at `0x80197B70` | outside |

Relevant accepted primary identities are:

| Owner | Primary ID |
|---|---|
| p0908 | `primary:e94f83cb2e22665c36cc` |
| p0909 | `primary:eb371d1ab63d63faea9b` |
| p0910 | `primary:b49f88930cedbd2ef423` |
| p0911 | `primary:aa78ed68fddbcfabdf5b` |

The start boundary cuts through p0810: its range `0x00040638..0x00040E80` belongs to the
preceding boot transfer, while `0x00040E80..0x00040E90` belongs to this transfer. That fact
does not itself authorize changing the accepted p0810 boundary.

## Descriptor and slab overlap checks

All 19 fixed descriptors in `config/overlays/us_rev0.json` were checked in both ROM and runtime
address spaces. None overlaps the proposed interval.

| Mapping | ROM source | Runtime destination | Relationship |
|---|---:|---:|---|
| preceding boot read | `0x0003F1B0..0x00040E80` | `0x800F9C20..0x800FB8F0` | source abuts start; no overlap |
| p0910-containing slab | `0x00040E80..0x00066E10` | `0x8016AF80..0x80190F10` | proposed record |
| fixed descriptor 0 | `0x00066E10..0x00069900` | `0x80197B70..0x8019A670` | source abuts end; no overlap |
| accepted scenario-loader slab | `0x00195410..0x001977E0` | `0x80214F80..0x80217350` | disjoint |

`config/phase7/conventional-build.json` currently contains only the scenario-loader record.
The new evidence does not overlap it.

## Full-range raw control-flow validation

The scan used the accepted semantic ledger to select code-class owners p0811-p1266 and parsed
the canonical `.word` values from every corresponding original-assembly part. Data owners were
excluded so data words resembling J/JAL encodings were not misclassified as instructions.

Coverage:

```text
accepted code owners: 456
accepted code bytes:  0x1B378
expected words:       27,870
parsed words:         27,870
missing words:        0
duplicate words:      0
```

For each raw opcode 2 or 3, the live target was decoded as:

```text
target = ((live_pc + 4) & 0xF0000000) | ((word & 0x03FFFFFF) << 2)
```

Results:

| Control kind | Count | Internal | External |
|---|---:|---:|---:|
| raw `j` | 746 | 746 | 0 |
| raw `jal` | 697 | 266 | 431 |
| total | 1,443 | 1,012 | 431 |

All 1,012 internal targets were word-aligned and mapped through
`target_rom = target_live - 0x8012A100` to a present accepted code word. There were:

- zero internal targets in accepted data;
- zero internal targets outside the proposed slab;
- zero missing target words; and
- zero alignment failures.

Representative checks span the proposed code extent:

| Source ROM | Live source PC | Raw live target | Inverse-mapped target ROM | Accepted target |
|---:|---:|---:|---:|---|
| `0x00040EA4` | `0x8016AFA4` | `0x8016BF80` | `0x00041E80` | p0822 |
| `0x00045338` | `0x8016F438` | `0x8016EBA4` | `0x00044AA4` | p0909 |
| `0x0005AF84` | `0x80185084` | `0x8016F11C` | `0x0004501C` | p0910 |
| `0x0005C1E8` | `0x801862E8` | `0x80186300` | `0x0005C200` | p1266 |

Within p0910 specifically, accepted raw control includes:

```text
ROM 0x000452EC: j   0x8016F430 -> ROM 0x00045330
ROM 0x00045338: jal 0x8016EBA4 -> ROM 0x00044AA4 / p0909
ROM 0x00045394: j   0x8016F4B4 -> ROM 0x000453B4
```

## Canonical-input corroboration

The files used for owner, overlay, and assembly claims match the hashes pinned in the accepted
Phase 7 conventional configuration:

| Canonical input | SHA-256 |
|---|---|
| `asm/original/rev0/manifest.json` | `EE6A81334FDCFC2867BC7AF63AD56624E08C6B92D992915A45B610B44D3FCF44` |
| `config/overlays/us_rev0.json` | `D4F1FB177822334EB748D6D62B342FB813D8825FEDD912057CF651EB616A5FB6` |
| `config/segments/rev0.yaml` | `0EE7443968414711C081D779E22B58F7291DA73518C7CF56285F9BD236B6AE07` |
| `config/splat/us_rev0.semantic.json` | `44938312F6967E94B527B8B878C01125A2589B1BD28B2DB7E9F06059E2843979` |

The generated segment ledger already carries unresolved candidate
`segcand:098acbf74e43c5d7a9f1` at ROM `0x00040E80..0x00066E10`. Its unresolved
status is preserved by this research.

## Confidence and unresolved structural question

Confidence in the exact transfer endpoints and delta is **high**. Independent evidence agrees:

1. explicit source, destination, and length operands at the cold-boot loader call;
2. exact lower-helper propagation without length expansion;
3. the preceding read ending exactly at the proposed ROM start;
4. fixed descriptor 0 beginning exactly at the proposed ROM end;
5. canonical pointer and data-table mappings using the same delta;
6. observed retail execution at the mapped p0910 entry; and
7. exhaustive internal J/JAL consistency across every accepted code word.

There is no remaining transfer-endpoint uncertainty. The unresolved issue is structural
modeling: the start at `0x00040E80` lies inside accepted data owner p0810. A structural worker
must determine how to add a placement slice at that load boundary while preserving the accepted
owner boundary unless the heavyweight audit independently justifies an ownership change.

The accepted transition DMA artifact did not observe this request because its captures begin
after cold boot. That absence is capture-window bounded and is not contradictory. If independent
dynamic confirmation is desired, trace PC `0x80072070`, record `a0/a1/a2` after the delay slot,
and follow the `0x8009DA50 -> 0x80089F80` request sequence through the cumulative `0x25F90`
bytes. This is additional execution confirmation, not an endpoint blocker.

## Structural handoff

A separate structural worker should use this report as input to `docs/AUDIT.md`. At minimum,
that worker and an independent reviewer should:

1. re-decode the callsite operands and helper length handling from accepted assembly;
2. independently reproduce the complete owner-containment table, including the p0810 split;
3. re-run all 19 descriptor and accepted non-descriptor-slab overlap checks;
4. independently reproduce the full-range J/JAL scan;
5. decide the minimal generic placement representation without a p0910-local override;
6. update generated expectations only through the canonical structural workflow; and
7. run the heavyweight structural verifier and full byte-identical ROM verification.

The research result above did not itself implement or authorize the structural change. The worker
result below records the later implementation and remains subject to independent review.

## Structural implementation result

The structural worker implemented the proven transfer through the existing generic
`nonDescriptorLoadSlabs` model. This section records worker verification only. It is not an
independent structural approval.

### Accepted metadata and generic executable treatment

`config/phase7/conventional-build.json` now retains the accepted
`scenario-loader-00195410` record unchanged and adds:

```text
id:                 cold-boot-loader-00040e80
kind:               loader-dma
ROM:                0x00040E80..0x00066E10
VMA:                0x8016AF80..0x80190F10
length:             0x25F90
delta:              0x8012A100
executable subrange 0x00040E80..0x00040E90
```

The model count is now two non-descriptor slabs. The one new p0810 placement cut increases link
slices from 7,251 to 7,252 and split owners from 9 to 10. Accepted primary owners remain 7,242,
including 6,184 assembly owners and 1,058 data owners; the 19 fixed descriptors are unchanged.

An optional slab-local `executableRanges` list is the smallest generic representation used for
the p0810 tail. Each range has a unique ID and aligned ROM endpoints, must be wholly contained in
its slab, may not overlap another executable range, and contributes link-slice cuts. A configured
range must resolve to exactly one slab placement and is rejected if it redundantly covers a
code-class slice. Generated layouts carry both `executable` and `executableRangeId`, keeping the
accepted source class separate from link/ELF executable treatment. This is not a p0910-local VMA
override and does not create a new accepted function or source owner.

### p0810 source, placement, and executable design

The accepted p0810 primary owner remains exactly:

```text
primary ID: primary:4b3693504d495f021786
ROM owner:  0x00040638..0x00040E90
source:     asm/original/rev0/lib/data_00040638.s
class:      data
```

The one source owner is emitted into two placement/link slices:

| Slice | ROM/LMA | VMA | Placement | ELF/PT_LOAD treatment |
|---|---:|---:|---|---|
| head `.ob64.r0810.s0` | `0x00040638..0x00040E80` | `0x00040638..0x00040E80` | outside the slab; existing `rom-only` fallback | non-executable section; `PF_R` |
| tail `.ob64.r0810.s1` | `0x00040E80..0x00040E90` | `0x8016AF80..0x8016AF90` | `cold-boot-loader-00040e80` | executable section; `PF_R|PF_X` |

The tail remains part of the data-class p0810 source owner. Its executable treatment is justified
only by the two exact `jr $ra; nop` stubs and the canonical consecutive runtime pointers
`0x8016AF80`, `0x8016AF88`, and `0x8016AF90`. The third pointer equals p0811's mapped entry. The
head and tail are contiguous, non-overlapping, total 2,136 bytes, and reproduce every p0810 byte
exactly once from one accepted assembly source.

### Containment, descriptors, and linker evidence

- p0811 through p1288 are 478 wholly contained owners: 456 code and 22 data, totaling `0x25F80`
  bytes. Every generated slice has VMA `ROM + 0x8012A100` and the cold-boot slab ID.
- p1289 begins at `0x00066E10`, has no load-slab ID, and remains in fixed descriptor 0 at
  `0x80197B70`.
- Neither accepted non-descriptor slab overlaps any fixed descriptor ROM source, and the two slab
  ROM sources do not overlap each other. The new cold-boot slab also has no VMA intersection with
  any of the 19 fixed-descriptor runtime reservations.
- Runtime-address reuse is not a global rejection rule for the generic mechanism: the pre-existing
  scenario slab intentionally reuses runtime space associated with fixed descriptors at different
  times. Its accepted metadata and the existing ROM-containment overlap validation were preserved.
- The regenerated linker script, map, ELF section table, and program headers agree. In particular,
  p0810 tail uses VMA `0x8016AF80`, LMA `0x00040E80`, size `0x10`, and `PF_R|PF_X`; p0910 uses
  VMA `0x8016F11C`, LMA `0x0004501C`, size `0x3C4`, and `PF_R|PF_X`; p1288 is `PF_R`; and p1289
  remains descriptor-0 `PF_R|PF_X`.
- The fixed overlay generator reproduced 19 descriptors, 11 groups, and 11 pointers at unchanged
  SHA-256 `D4F1FB177822334EB748D6D62B342FB813D8825FEDD912057CF651EB616A5FB6`.

The focused Phase 7 test independently re-decodes the loader operands and helper length handling,
checks all 478 contained owner VMAs, verifies the p0810 stub words and runtime pointer evidence,
and scans all accepted assembly words in p0811-p1266. The scan reproduced 456 code owners,
`0x1B378` bytes, 27,870 unique words, 746 raw `j` instructions (all internal), and 697 raw `jal`
instructions (266 internal and 431 external). All 1,012 internal targets are aligned, present,
code-class, and inside the mapped code range.

### p0910 remains inactive assembly

The regenerated Phase 7 and Phase 8 layouts both retain p0910 as `tracked-assembly` with assembly
symbol `func_0004501c`. Each map has one p0910 input contribution from
`objects/assembly/chunk_004.o`. Neither `config/matching-c-targets.json` nor the Phase 8 target list
contains p0910. The inactive C draft and accepted assembly were not modified:

```text
src/lib/func_0004501C.c SHA-256:
F71C6AF43EBBB0E492972FEE07E0032D97B2BED422C2889DB058450C207AE0AD

asm/original/rev0/lib/func_0004501c.s SHA-256:
27823BC6474FDEA48A798555B2DF393B09AFE29DE68C8D1F74C787B30AE65DB8
```

No p0910 matching-C claim is made.

### Worker commands and results

The structural worker ran these top-level commands:

| Command | Result |
|---|---|
| `node tools/build.js` | PASS; fresh Phase 7 baseline and Phase 8 CURRENT generated; both full ROMs exact |
| `node tests/phase7_conventional_build.js --output <fresh-phase7>` | PASS; all placement/executable assertions passed and 19 malformed/drift mutations rejected |
| `node tools/generate_overlay_config.js` | PASS; regenerated tracked artifact byte-identically with 19 descriptors, 11 groups, 11 pointers |
| `node tools/audit.js` | PASS; structural protections and CURRENT exact-ROM verification passed |
| `node tests/workflow_acceptance.js --output <current-phase8>` | PASS; exact ROM, deterministic classification, stale fingerprints/proofs rejected |
| `node tools/verify.js` | PASS; baserom, toolchain, source policy, ownership, placement, relocations, target bytes, and full ROM |

`node tools/audit.js` ran every heavyweight setup command below; each returned success, otherwise
the fail-closed audit would have stopped:

| Heavyweight nested command | Result |
|---|---|
| `node tools/verify_baserom.js` | PASS; normalized Rev 0 identity, CRCs, header, game ID, revision, and hash |
| `node tools/verify_overlay_config.js` | PASS; 19 descriptors, 11 groups, 11 pointers, parent rows equal |
| `node tools/verify_phase5b_production_config.js --phase5a-root <accepted-root>` | PASS |
| `node tools/build_rom_coverage_ledger.js` | PASS; 825 archives, zero unknown bytes, known overlap visible |
| `node tools/audit_code_region.js` | PASS; executable extent and data tail evidence retained |
| `node tools/extract_original_mips.js` | PASS |
| `node tests/word_asm_smoke.js` | PASS |
| `node tests/binutils_smoke.js` | PASS; endian, instruction, delay-slot, dialect, and tracked-chunk checks |
| `node tools/check_manifest.js` | PASS |
| `node tools/assemble_original_mips.js` | PASS; 100 tracked composite chunks / 6,184 files; exact code-region hash |
| `node tools/extract_rom_segments.js` | PASS |
| `node tools/rebuild_rom.js` | PASS; exact full ROM |
| `node tools/build_full_source_manifest.js` | PASS; no gap and zero unknown bytes |
| `node tools/extract_non_code_sources.js` | PASS; exact source owners |
| `node tools/rebuild_from_source_manifest.js` | PASS; exact full ROM |
| `node tools/rebuild_rom.js --assembled-code build/assembled/rev0/code.bin --out dist/rebuilt.us_rev0.assembled-code.z64 --report build/rebuild/rev0-assembled-code-rebuild-report.json` | PASS; exact full ROM |

The audit then ran strict CURRENT ownership/placement/relocation/source-policy verification with a
fresh compilation. It reported 5 `PURE_C`, 32 `HYBRID_C`, 0 `ASM`, and 0 `UNKNOWN` active targets;
all 32 hybrid compiler/adapted files were byte-identical with zero hybrid transformations. The
`func_0002CD70` regression gate also passed.

An additional legacy command, `node tests/phase8_matching_c.js --output <current-phase8>`, was run
after the audit and failed its pre-existing hard-coded Phase 2 aggregate expectation of 36 targets,
3 pure, 33 hybrid, and zero total transformations. The current accepted state has 37 targets,
5 pure, 32 hybrid, and 17 eligible pure-C transformations. This structural change does not touch
that test, the Phase 8 target configuration, or dialect logic. The canonical heavyweight audit,
modern workflow-acceptance test, and normal verifier all pass the current accepted invariants. The
legacy test was not weakened or changed as part of this structural implementation.

### Exact-ROM result

The authenticated normalized baserom, regenerated assembly-only Phase 7 baseline, regenerated
Phase 8 current ROM, setup rebuilds, and strict verification rebuild are all 41,943,040 bytes and
byte-identical:

```text
SHA-256 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A
```

The code-region SHA-256 remains:

```text
40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409
```

## Independent structural review handoff

Independent review remains required before acceptance. A different worker should use fresh
external Phase 7 and Phase 8 output roots and try to falsify, at minimum:

1. the loader callsite operands, delay-slot length, helper rounding, chunk count, endpoints, and
   `0x8012A100` delta;
2. p0810 source-owner conservation and the claim that only the 16-byte tail needs executable
   treatment;
3. the runtime pointer basis for executable treatment without reclassifying p0810;
4. p0811-p1288 complete containment and p1289 descriptor-0 exclusion;
5. both slab ROM sources against all 19 fixed descriptors, plus the new slab's runtime interval;
6. the complete accepted-assembly J/JAL scan;
7. linker script, map, ELF section flags, and PT_LOAD VMA/LMA/flags for both p0810 slices, p0910,
   p1288, and p1289;
8. unique p0910 accepted-assembly ownership and continued inactivity of the C draft; and
9. exact Phase 7 baseline, Phase 8 current, and full heavyweight-audit ROM hashes.

The reviewer must not treat this worker result as approval and must not activate p0910 C while
reviewing the structural change.
