# Combat Supplement Compositing Source Pairs R4

This fixed research note covers the five released R4 source-batch members
preserved at `5ae68e14`, within the same thirteen-target Combat supplement.
The comparisons below support reusable source experiments. They precede the
complete-wave verifier and do not claim completed-wave acceptance.

The private experiment results below are one-owner link/scoring measurements.
They do not establish canonical ownership or matching acceptance. The focused
canonical reports establish the stated per-target source class, owner, bytes,
and relocation result for their recorded inputs. These five results are
provisional within the incomplete thirteen-target supplement. There is no
standalone five-function verifier. The complete supplement still requires its
single final full-ROM verification, including `PURE_C` classification for all
thirteen assigned targets.

## `func_002071F4`

The writer's A001 source had the accepted 472-byte extent and 48-byte frame. Its
private result, and the corresponding early canonical report, differed by one
linked byte in one instruction word. Both recorded eight relocations. The only
source change in A002 was the inline-counter address expression:

```c
/* A001 */
--((u8 *)record)[0x98 + i]

/* A002 */
--((u8 *)record + i)[0x98]
```

A002 measured exact in the private scorer: 472/472 bytes, zero differing bytes
or words, frame 48, and eight relocations. The canonical production file is
byte-identical to the complete A002 authored source:

- `src/lib/func_002071F4.c` — 1,382 bytes; SHA-256
  `5B04A968FD6AEADEAF55DC025F5C5269314EF31D792A1A2186212A8113991697`
- `build/combat-discovery-supplement-r4/002071F4/A002/authored.c` — 1,382
  bytes; the same SHA-256

The focused canonical result is `PURE_C`, has one 472-byte owner, matches all
472 target bytes, and matches all eight accepted relocations. Its linked target
and expected target SHA-256 are both
`3E5E33B80FC06B8A96D2A55FC853269DDA127BB6BB792C06292286066AF356BC`.

Suggested retained control/final artifacts:

| Role | Complete path | SHA-256 |
|---|---|---|
| one-byte source control | `build/combat-discovery-supplement-r4/002071F4/A001/authored.c` | `49D9622D56804754D67364F8136F73648E71596BA9470AEA1C6D6494F74C4908` |
| one-byte private result | `build/combat-discovery-supplement-r4/002071F4/A001/result.json` | `B91FBB6475665E30089554218C0C21C2EB0F37BB4CA068AFEFCD6B2407A8A57F` |
| exact selected source | `build/combat-discovery-supplement-r4/002071F4/A002/authored.c` | `5B04A968FD6AEADEAF55DC025F5C5269314EF31D792A1A2186212A8113991697` |
| exact private result | `build/combat-discovery-supplement-r4/002071F4/A002/result.json` | `974BBE47FCA912CDB46B2F46BBD0FA09EB9C527CD4528E404ED8443399CBABF8` |
| early canonical control | `build/combat-discovery-supplement-r4/71f4-early.json` | `F1B9FAAD50E505B0DD1C813F38F71592634A6118AD97A6110E74FDF977F781BB` |
| focused canonical final | `build/combat-discovery-supplement-r4/71f4-final.json` | `48A769FC687971E4FA3CBA24DF98C64186E620D78E2E55F773323A32B2E1F7B5` |

## `func_002073CC`

The writer's useful private progression retained the 652-byte owner, 40-byte
frame, and 26 relocations through A023. A007 measured 80 differing bytes in 21
words. A019 gave each published allocation pointer a distinct temporary and
measured 13 differing bytes in four words. A021 placed the copy/decrement after
the free-record branch and measured eight differing bytes in two words. A022
captured the old count, advanced the record, decremented the count, then tested
the old value; it measured exact at 652/652 bytes. A023 expressed that same
sequence as a do-loop with an explicit exit label and also measured exact at
652/652 bytes. A024 replaced the explicit exit with `break`; it grew to 664
bytes and measured 429 differing bytes in 132 words.

The selected production source retains A023's distinct publication temporaries
and explicit-exit do-loop. The production file adds comments and indentation,
so its full-source identity differs from the frozen A023 authored file:

- `src/lib/func_002073CC.c` — 3,274 bytes; SHA-256
  `AEA798F8EBD167E12CC0256A29CFA7E8598C82EA6D8A89A0CCBEBC79CB2FFD51`
- `build/combat-discovery-supplement-r4/002073CC/A023/authored.c` — 3,021
  bytes; SHA-256
  `43FCDFDC767DCD2C1C4C3193AAA7589B8B694AF434FAD6A79D9EED347C3D6D4E`

The focused canonical result for the production file is `PURE_C`, has one
652-byte owner, matches all 652 target bytes, and matches all 26 accepted
relocations. Its linked target and expected target SHA-256 are both
`A07948BF71B53DDD5533EC425E3CD5970C3EB7EF6D1D6F3D7BEF0AA0B0E09BB9`.
The earlier A001 canonical run was rejected for source identity drift and is not
successful byte or ownership evidence.

Suggested retained control/final artifacts:

| Role | Complete path | SHA-256 |
|---|---|---|
| initial measured control | `build/combat-discovery-supplement-r4/002073CC/A007/authored.c` | `CA295150ACD29D67E4F52C52720942492D605BBF4B6D5A0E64EA0B7BE41F4AB9` |
| initial private result | `build/combat-discovery-supplement-r4/002073CC/A007/result.json` | `18341755F35CA250D2BBF308A4C6D0C711723E2376D3E487ACE4A4F79679EE55` |
| publication-temporary control | `build/combat-discovery-supplement-r4/002073CC/A019/authored.c` | `D991AB49C21B5AECCB3F56B82B3099740218DB39072F68D9F38C0D0C58FA0D07` |
| publication-temporary result | `build/combat-discovery-supplement-r4/002073CC/A019/result.json` | `109EE470E40B11CD6A48B102E17BEF16915D9F2A7E86854F69381136B0052CCB` |
| nearest nonexact source | `build/combat-discovery-supplement-r4/002073CC/A021/authored.c` | `F3A5A2689C3DBF0689DCB90C789700665116F6AA44BD33E119C7246098A7F840` |
| nearest nonexact result | `build/combat-discovery-supplement-r4/002073CC/A021/result.json` | `92A2E236F11A4606D5A1845E52DBC91728CAABCF5DDE35740DF455C62862A469` |
| first exact source form | `build/combat-discovery-supplement-r4/002073CC/A022/authored.c` | `811C9F87234DAC5758FA6A7F6CA92F5EB2503D1A713A077F6C3BAA5ED94A3B27` |
| first exact private result | `build/combat-discovery-supplement-r4/002073CC/A022/result.json` | `A8B91AEA84422321230576754C7FD5F25A63A64D883B8973378FA4D21E9114F4` |
| selected exact source form | `build/combat-discovery-supplement-r4/002073CC/A023/authored.c` | `43FCDFDC767DCD2C1C4C3193AAA7589B8B694AF434FAD6A79D9EED347C3D6D4E` |
| selected exact private result | `build/combat-discovery-supplement-r4/002073CC/A023/result.json` | `81A2359086394A010EAB6F3511E5BA6AD35B82943CB9E1380920FB87B15ACEE9` |
| loop-form counterexample | `build/combat-discovery-supplement-r4/002073CC/A024/authored.c` | `30728EA489C964123F661513F0972BE9B246B9B48C63132310444DC9F44C200A` |
| counterexample private result | `build/combat-discovery-supplement-r4/002073CC/A024/result.json` | `4469204ECFA196D6668C37EC550CE1B1F95236A1FB79470DF6CBCCAC7C3AC8DA` |
| focused canonical final | `build/combat-discovery-supplement-r4/73cc-final.json` | `422AF26A2DF367D45A988AE24107F566642EB01A5FA7C90469DA57DC309295A9` |

## `func_00207A70`

A001 used separate `u32 i` and `int j` loop indices. It retained the accepted
408-byte extent, 48-byte frame, and 24 relocations, while measuring 21 differing
bytes in 21 instruction words. A004 used one signed `int i` for both inner
loops. It measured exact at 408/408 bytes with frame 48 and 24 relocations. The
canonical production file is byte-identical to the complete A004 authored
source:

- `src/lib/func_00207A70.c` — 1,083 bytes; SHA-256
  `930BCD5298C5CA5FBB9672D8203485B57B192F45CD5A6273BF65946E24F2DAC3`
- `build/combat-discovery-supplement-r4/00207A70/A004/authored.c` — 1,083
  bytes; the same SHA-256

The focused canonical result is `PURE_C`, has one 408-byte owner, matches all
408 target bytes, and matches all 24 accepted relocations. Its linked target
and expected target SHA-256 are both
`B3E09EBD29788C0CD55F54F6BBD5144C4FED61D79EAF85FD1F988F717F3E89A5`.

Suggested retained control/final artifacts:

| Role | Complete path | SHA-256 |
|---|---|---|
| separate-index control | `build/combat-discovery-supplement-r4/00207A70/A001/authored.c` | `10EC2C67AF1FB99E80B4950BD6C9606A4686F82799D4C3A12B553CA4A2500992` |
| separate-index private result | `build/combat-discovery-supplement-r4/00207A70/A001/result.json` | `C27E9D38AA9D65AA228CD529C748CBC099811FDA37C113D74B870F810D6833DB` |
| exact shared-index source | `build/combat-discovery-supplement-r4/00207A70/A004/authored.c` | `930BCD5298C5CA5FBB9672D8203485B57B192F45CD5A6273BF65946E24F2DAC3` |
| exact shared-index private result | `build/combat-discovery-supplement-r4/00207A70/A004/result.json` | `4833FF9E8CA1C097EB6B580E443C96E49EA6FD40B1AB6BBC8A84850A6710077D` |
| focused canonical final | `build/combat-discovery-supplement-r4/7a70-final.json` | `E7DB19B8AF7FD0AFE816639B8277365E9ABF055F7ABECADC7BCD6E8FCF5C6F39` |

## `func_00207C08`

The first structured source measured exact privately at 552/552 bytes with
frame 48 and 42 relocations. Because there is no discriminating source pair,
portable curation needs only the final source context and focused canonical
report. The frozen A001 authored source and canonical production file are
byte-identical:

- `src/lib/func_00207C08.c` — 1,578 bytes; SHA-256
  `414D31C4E614421BD9E5E37FA5E6C3674282354A19C6112CA8C959E773F60B99`
- `build/combat-discovery-supplement-r4/00207C08/A001/authored.c` — 1,578
  bytes; the same SHA-256

The focused canonical result is `PURE_C`, has one 552-byte owner, matches all
552 target bytes, and matches all 42 accepted relocations. Its linked target
and expected target SHA-256 are both
`11988C5D612C522FD7FC3F3EEE6420BC1EDA9BF7C3A034C21A3409EEC0885101`.
The final report is
`build/combat-discovery-supplement-r4/7c08-final.json`, SHA-256
`8EA3F9D41AAAA7D404A85E790840398FC30C8684B737E756DD3199E0C210BA63`.

## `func_001F0C24`

A011 used indexed traversal for the empty-slot search and `selected * 12` for
both the lookup and publication addresses. It retained the accepted 480-byte
extent, 48-byte frame, and 13 relocations, while measuring two differing bytes
in one instruction word. A016 used the same explicit
`(selected << 3) + (selected << 2)` expression at lookup and publication. It
measured exact at 480/480 bytes with frame 48 and 13 relocations.

The selected production source retains A016's address expressions. Its full
source identity differs because the production file adds comments, formatting,
and the `CombatServiceView` local type name:

- `src/lib/func_001F0C24.c` — 2,746 bytes; SHA-256
  `2A5B8F538BE3E9703D3961D46E785CDE60B846301EC0E776866DF2D07EB04D9E`
- `build/combat-discovery-supplement-r4/001F0C24/A016/authored.c` — 2,040
  bytes; SHA-256
  `B09861DE43E29664013DB690FB7CF818C6245B57EA9DDE9C1DAD0868FD09E836`

The focused canonical result is `PURE_C`, has one 480-byte owner, matches all
480 target bytes, and matches all 13 accepted relocations, including the two
internal section-relative jumps. Its linked target and expected target SHA-256
are both
`B58612399C6983953D103785CA9A77810B58FADCF8BCD6E63F767B40B4C4758B`.

Suggested retained control/final artifacts:

| Role | Complete path | SHA-256 |
|---|---|---|
| one-word multiply control | `build/combat-discovery-supplement-r4/001F0C24/A011/authored.c` | `034BDBADF6759639006C5109743F19BE14DAD0F18B396ACE9552B180AA17B7F1` |
| one-word private result | `build/combat-discovery-supplement-r4/001F0C24/A011/result.json` | `52C34A0D3350971439EE220B2F4DC3949BD64075FD8B5B7D9F7D1F62C7B37700` |
| exact shift/add source | `build/combat-discovery-supplement-r4/001F0C24/A016/authored.c` | `B09861DE43E29664013DB690FB7CF818C6245B57EA9DDE9C1DAD0868FD09E836` |
| exact shift/add private result | `build/combat-discovery-supplement-r4/001F0C24/A016/result.json` | `7C75421DFA665277784364C0E4F1CFF39846A35EB849CCA6131813B3FC5D85C1` |
| focused canonical final | `build/combat-discovery-supplement-r4/0c24-final.json` | `F3E9422FCCCD3538D01C1DAA502DB57BB24C13FEEFC44DBC04CEA57B62F92A28` |

## Batch evidence and remaining gate

`build/combat-discovery-supplement-r4/final-batch-manifest.json`, SHA-256
`AB901528E4C5318FA26A8047F250CF64646D4F2FDBD0DACAFA15CD37D796E3B0`,
binds the five current authored source identities, five focused reports, and 49
authenticated artifact/input copies. It describes five focused-exact
provisional sources in the same incomplete thirteen-target supplement and does
not contain a full-verifier acceptance result. The supplement-wide normal
verifier remains pending.
