# Combat data retrieval r1

Status: completed; review pending.

This task retrieved literal records for resource key `0x00391270` and selector entry RAM `0x801BE2E8`.
It makes no semantic, family-membership, overlay-identity, execution, or implementation conclusion.
The Director must send these records to an Astra Medium researcher for interpretation.

## Baseline and scope

- Assignment: `combat-data-retrieval`, revision 1.
- Launch ID: `COMBAT-DATA-RETRIEVAL-20260906-01`.
- Receiving task: `/root/combat_data_retrieval` on host `local`.
- Director task: `01a07262-aeca-7341-ad10-2dba705ff988`.
- Decomp branch and activation HEAD: `main` at `dda6aa194b443a7d8d991bb08ca367ffdce7527d`.
- Parent branch and activation HEAD: `main` at `1c3be2509ebffde413be832b68f69e20d4e7d25c`.
- Inventory profile: `NORMAL`.
- Question source: `docs/Plans/combat-discovery-r1.md` frozen at `150c9fca5d371fc7ad9245fcf6f94268cdf25311`.
- The assigned claim, report, and output root were absent before activation.

Production source, tools, configuration, plans, and accepted evidence stayed read-only.
The concurrent tooling worker's files were outside this task's write surfaces.
This task wrote only its claim, this report, and ignored `build/combat-data-retrieval-r1/` artifacts.
Protocol deviation: internal-agent collaboration replaced Codex app transport under the repository's internal decomp-program exception.
There were no other protocol deviations.

## Resource record `0x00391270`

The documented resource formula places the size word at key plus `0x00594280`.
The resulting z64 size-word address is `0x009254F0`.
The stored stream begins at `0x009254F4` and ends exclusively at `0x00929343`.
Its length is 15,951 bytes, or `0x3E4F`.
Its SHA-256 is `FB94E9D648927AF35DE021ABAD5CB909D728953C5C54709FFECD0012D407F3B9`.

The accepted resource decoder consumed all 15,951 stored bytes.
It produced 36,376 bytes, or `0x8E18`.
The decoded SHA-256 is `EFCE5F711D2B772C0B89E9501DE5EB0917FF36A5B09E48AC9425679283D3F870`.
The ignored copy is `build/combat-data-retrieval-r1/resource-00391270.decoded.bin`.

The first eight decoded bytes are `36 34 02 04 00 5A 05 EB`.
Using only the generic header schema in parent `docs/rom-layout.md`, these fields are literal:

| Decoded field | Value |
|---|---:|
| magic | `0x3634` |
| format type | `0x02` |
| sub-format | `0x04` |
| width field | 90, or `0x005A` |
| height field | 1,515, or `0x05EB` |
| bytes after the header | 36,368 |

The documented format table does not define type `0x02`, sub-format `0x04`.
No existing documented parser found in scope can safely interpret its post-header layout.
The exact envelope and generic header are therefore the parser boundary for this task.

The accepted ROM-wide director census independently contains candidate `scan-z64:009254F0`.
It records the same stored length, decoded length, and decoded hash.
Its raw V64 prefix-byte offset is `0x009254F1`.
The row has `strict-success-exact` and `strict-container-exact` dispositions.
It has no resource-boundary or load-key evidence because it arose from the census's ROM-wide scan lane.

The census labels the row `non-director` after a partial parse stops at decoded word zero.
That word is `0x36340204`, reported as an unknown director opcode.
This label addresses only the director grammar and does not identify the resource's game role.

The accepted 76-chain resource atlas has zero `resource` rows and zero chains for logical key `0x00391270`.
This is a bounded atlas-coverage gap, not evidence that the resource is unused.
Its query command was `python scripts/query_atlas.py --resource-key 0x00391270`.

## Decoded-data occurrence

The exact big-endian key bytes `00 39 12 70` occur once in one decoded object.
That object appears in two documented corpora with the same 4,096-byte SHA-256:
`E209E6F762BD942A0FA7B99339426055DB162F6130CDA453DAEAAF18D642E495`.

The accepted ROM-wide census identifies it as candidate `scan-z64:021EDA86`.
Its stored length is 2,759 bytes.
The key occurs at decoded byte offset `0x000005E8`, which is u32 index 378.

The documented 7 MiB extraction identifies the same bytes as:

- `ob64_7mb_blocks/block_2242_0x1c91c4_table.bin`;
- inventory index 2242;
- inventory category `SPRITE_CI8`;
- inventory gap offset `0x1c91c4`; and
- decoded byte offset `0x000005E8`, word aligned.

The 68-byte decoded context from offsets `0x5C8..0x60C` is:

```text
00A659A2 009155BB 008149C6 007B46BD 006C3EBB 005731B3 004D25A9 00411D87
00391270 0038033D 13290008 0F170000 06090000 01020000 00000000 12100000
291B0000
```

This is one unique byte occurrence represented twice, rather than two independent occurrences.
The inventory label and adjacent words are returned as literal records for later interpretation.

## Selector entry records

The accepted overlay atlas has 244 `direct-signature`, medium-confidence placement rows for `func_00201778`.
They span 244 distinct saved-input IDs and share one mapping:

| Address space | Half-open range |
|---|---|
| z64 ROM | `0x00201778..0x00201798` |
| physical RDRAM | `0x001BE2E8..0x001BE308` |
| live KSEG0 | `0x801BE2E8..0x801BE308` |

The canonical ordered row SHA-256 is `CA3D754E756D6AD4BD461F222E7B41FE26073CB9114573D6E1088F80CE38FF67`.
This value frames each sorted row as compact sorted JSON followed by LF.
The rows establish accepted saved placement, not execution or call-time residency.

The original eight-word accessor at z64 `0x00201778..0x00201798` is literal:

- `0x3C03801D`, `0x8C630688` load the pointer stored at RAM `0x801D0688`;
- `0x00041040`, `0x00441021`, `0x00451021` compute `3*a0+a1`;
- `0x00621821` adds that index; and
- `0x03E00008`, `0x90620000` return the selected byte.

The original publisher record is in `func_00201BAC`.
At z64 `0x00201C34`, word `0x94580008` reads a halfword at resource-relative offset `+8`.
At `0x00201C38`, word `0x00586821` adds the resource base.
At `0x00201CAC`, word `0xAC2D0688` stores the result at RAM `0x801D0688`.
These words establish the data rule without identifying an entry consumer.

No tested selector-entry pattern occurs in any searched decoded corpus.
The tested big-endian forms were pointer `80 1B E2 E8`, J word `08 06 F8 BA`, and JAL word `0C 06 F8 BA`.
This is a bounded decoded-data miss and does not close the indirect-consumer gate.

## Existing exact code reference to the resource key

`func_001F0C24` contains the exact key construction at z64 `0x001F0CB0..0x001F0CBC`.
Word `0x3C040039` loads the upper half.
The call word is `0x0C06B583` at `0x001F0CB4`.
Its delay-slot word `0x34841270` completes key `0x00391270`.

The same function builds another `0x3634` header at z64 `0x001F0CE0..0x001F0D08`.
Its literal fields are type `0x02`, sub-format `0x00`, width `0x005A`, and height `0x000F`.
The retrieved resource instead has sub-format `0x04` and height `0x05EB`.
This task records the difference without interpreting the transformation or final draw role.

## Search coverage

| Decoded corpus | Files or streams | Bytes searched | Key hits | Selector-form hits | Identity |
|---|---:|---:|---:|---:|---|
| accepted ROM-wide strict custom-LZ census | 24,588 streams | 101,077,207, including duplicate outputs | 1 | 0 | `DEA841DC2950B25403DA42EA814F13BBC5B6B1CEB0D9E8A32B6D2AFB4F5D9A60` |
| documented 7 MiB decoded blocks | 3,656 files | 12,433,588 | 1, same object | 0 | `50AF05F854848AF3C631311D55ABE7CA050D31C7E084EBB42A95D0620362F553` |
| documented LHA extracted members | 825 files | 12,509,444 | 0 | 0 | `736B2964F97F1C834C0F52E7862766B96050B09EA1B8538A4E767BE4188CEA08` |

The custom-LZ census terminal counts were 168,313 precheck rejects, 57,781 strict failures, and 24,588 exact successes.
Every exact-success stream reproduced its accepted decoded SHA-256 and exact stored-byte consumption.
The census identity frames candidate ID, NUL, u64be length, and binary decoded hash by z64 prefix.

The file-corpus identities frame UTF-8 relative path, NUL, u64be size, and binary file hash.
Files are sorted by relative path.
Every 7 MiB decoded filename and size matched its 3,656-row inventory.
Every LHA extraction directory and member name and size matched the 825-row catalog.

The search tested only exact four-byte big-endian values.
It did not test split immediates, byte permutations, KSEG1 aliases, interior entries, runtime writes, or data-dependent synthesis.
The census scope contains only `strict-success-exact` candidates accepted by its frozen decoder.
The 7 MiB and LHA searches used existing extracted files and did not rerun their generators.
The raw-ROM literal scan from combat discovery was not repeated or presented as new evidence.
No runtime or execution evidence was collected.

## Input and parser identities

| Input or parser | SHA-256 |
|---|---|
| raw US Rev 0 V64 ROM | `6CA0A1AFE224831E202857AD64EF26BD429A034A4EA48404BB09621641A07B12` |
| normalized z64 bytes, in memory | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| `tools/ob64_sprite_bundle_extract.py` | `1AF68DCA8E5B347765F16BE6ADA1F27BDEC1E3669A3EBA6D74DD4808E89FDD20` |
| accepted census database | `3CADBCAA1F56F7F9483529F90DA814D4E583DE360B2B56A6424D8B614BE9ABD0` |
| accepted census decoder | `27D334FA1B97A6D15F9562B7C430F02636FCCA3D1416C9E9222DDC087F8DAAB5` |
| accepted resource-atlas database | `857AA9602425B9CFC2D60572A3D70833DA5794513F91DDF8DDC94C464317AC07` |
| accepted resource-atlas logical content | `316E6F19DE55A6F90E0B31027F8F1828DC24B650A6999E1066BD9D957E77B3DF` |
| accepted resource-atlas query | `4B72DC37239A4AF132F2B06C7B4DAC4E7D78B43F0B9A18A34AF69EF517B936D9` |
| accepted overlay-atlas database | `06B36CDC8917C5C81C99909729AFD138D17DF479CE8963EEABB69C795C6DFC3C` |
| accepted overlay-atlas query | `D62EFC9CD02FA0FAFBD2ACEFCE899634154D1AA64CACA8E757A6E56FE7AF1A30` |
| 7 MiB decoded inventory | `2533BF9B3CA2DD03E360692C21F4145AD379B0D6F04D9080AA29C3C81A444471` |
| LHA archive catalog | `C0622CC8F4E816011C4ECC3222B34D8F4D8B7655142DFD776E7CD734B1E5D627` |
| original `func_001F0C24.s` | `AD1FC66330FCE6B115B4FC892E0EFA7B560C2A11C572F77730962590F03F1F96` |
| original `func_00201778.s` | `F75C471C2E3841991B8C5A6A9C2C39CB17534580F7600BC40E884EF0D84DA9B5` |
| original `func_00201BAC.s` | `87F248C59FD7BA7A9A43C60FCE36AC1DC0BF85A7AA153786529453C754ABCDE4` |

The original assembly comment addresses are decode aids.
The accepted overlay atlas supplies the current saved-placement mapping above.

## Artifacts and verification

| Assigned artifact | SHA-256 |
|---|---|
| `build/combat-data-retrieval-r1/retrieve.py` | `185A1E1D0C8ABE0A3E474BD107B060D89E01DA28BA9CA32CBD2FC9A7ACEF1713` |
| `build/combat-data-retrieval-r1/retrieval.json` | `2023DBAEEC012D857A27326BAB51380FC560B27D742AEB03B7C7CCC54A2C62BA` |
| decoded resource copy | `EFCE5F711D2B772C0B89E9501DE5EB0917FF36A5B09E48AC9425679283D3F870` |

Reproduce with `python -B build/combat-data-retrieval-r1/retrieve.py` from the decomp root.
The final run completed normally in about eleven seconds.
It failed closed on all pinned hashes, inventory sizes, catalog members, decoded hashes, and decoder consumption checks.
The owned claim and report passed a no-index whitespace check.
Repository-wide `git diff --check` reported blank-line findings only in the concurrent tooling worker's files.
Those files remained outside this task's ownership and were not changed here.

Early failed paths were path and PowerShell quoting mistakes, a guessed census column, and one display-limited broad query.
One PowerShell byte-to-u32 display attempt used an unsupported span conversion.
These were command or display problems, not negative game evidence.
No process was terminated.

Claims here are literal **Verified static** retrieval records and remain review pending.
A different pinned input, decoded hash, exact reference, or inventory result would falsify the affected record.
No claim is Editor-ready.

## Proposed canonical follow-up

An Astra Medium researcher should interpret the type `0x02`/sub-format `0x04` resource and the word-aligned key occurrence.
That researcher should determine whether the records qualify `func_001F0C24`'s draw role.
The selector gate remains open because no decoded pointer or encoded entry form appeared in the bounded corpora.
Any runtime alternative remains a separately authorized qualified observation under the frozen gate.

No production mutation, structural change, build, runtime operation, external source, commit, branch, worktree, staging, or push occurred.
