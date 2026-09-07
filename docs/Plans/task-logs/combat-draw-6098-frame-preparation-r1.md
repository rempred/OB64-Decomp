# Combat draw 001F6098 frame preparation r1

Completed bounded assistance for COMBAT-DRAW-6098-FRAME-PREPARATION-20260907-01. Receiver /root/boot_conversion_preparation, Director /root (native 01a07262-aeca-7341-ad10-2dba705ff988), local, Astra Medium. The fresh claim was created atomically and read back before other writes. Ready 1faeb63f7ec6dc58996d04fbf039ed38394001bc; activation 8e1511abd04a1f81801e6ed52740947812347337. Coordination baseline 874544ccddb31dad1315d9d713589437a9104e7d; accepted source W7 469a1416918592749d61dc34e3e079796f7b673c.

The 48-byte frame difference is wholly below the saved-register block. Both owners have 23 directly accessed scalar homes. Retail distributes them across 29 eight-byte-spaced positions; the candidate uses 23. Six retail positions have no emitted accesses. This accounts for the size difference, but does not establish why the original compiler reserved those positions or identify six missing source objects.

## Authentication and scope

inputs.json records all 21 supplied file identities before pass interpretation. Production C SHA256 6AAC2F686168AA4309593744578DD45B9A4AE7CC32DCB0A20345062418F05DCA and assembly SHA256 99172015101C2FE64A8A6768DEF005EE8AA89CC8B6D2433A66E5E516B9EDDBFD match the assignment. The diagnostic assembly is identical after excluding comments and .file directives. Offline expansion of the entire frozen function body matches diagnostic candidate.c after removing comments/whitespace: 16 HALF, 3 WORD, 12 BYTE, 33 PAIR and 23 FIELD expansions plus the two cursor aliases. Expansion uses the supplied diagnostic forms, without reading mutable headers. This authenticates applicability of the retained passes; it is not a compiler or source-policy run.

All 1,037 original words match the accepted W7 ASM blob (SHA256 63304127A1DECEDF5AD1253390FEEB1A68D54A4B237EFFA71CDD006143722924), the derived original.s aid, and actual in-memory normalized ROM. Raw ROM SHA256 6CA0A1AFE224831E202857AD64EF26BD429A034A4EA48404BB09621641A07B12; normalized SHA256 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A. The prior full-owner note and evidence hashes match the prompt. Only frame-relevant operations were interpreted. Candidate size/difference totals were not independently measured by assembly/linking.

## Frame account

Offsets below are hexadecimal, relative to the adjusted sp; interval ends are exclusive.

| Region | Retail | Frozen candidate | Evidence and limit |
|---|---|---|---|
| Outgoing argument region | 00..20, 32 bytes inferred | 00..20, 32 bytes explicit | candidate.s line20 says args=32. Both emit arguments at10,14,18 for the seven-argument calls. 00..10 is the reserved register-argument area; 1C..20 has no direct access. No incoming stack argument is used. |
| Fixed local region | 20..B8, 152 bytes inferred by matching anchors | 20..B8, 152 bytes | See fixed objects below. Includes ten bytes of inter-object rounding space. |
| Scalar-home region | B8..1A0, 232 bytes | B8..170, 184 bytes | Accessed words occupy offsets BC+8n. Retail has six unaccessed positions. Eight-byte slot envelopes are a layout account, not proof of original object sizes. |
| Saved GPRs | 1A0..1C8, 40 bytes | 170..198, 40 bytes | Same s0..s7,s8/fp,ra, four bytes each, identical order. All save and restore offsets differ by30. No saved FP registers. |
| Total | 1C8 = 456 | 198 = 408 | Retail entry ROM1F6098 subtracts1C8; return delay slot1F70C8 adds1C8. Candidate .frame and prologue/epilogue use408. Both totals are 8-byte aligned. |

The candidate's explicit vars=336 equals152+184; args32 plus registers40 gives408. The analogous retail local-region size384 equals152+232; 32+384+40=456. No extra trailing alignment is needed in either account. Counting a four-byte accessed word as an eight-byte source scalar would overstate the evidence: the spacing is observed, while source size is not.

Fixed object counterparts are supported by matching address arguments and accessed fields:

| Region | Frozen source object / observed use | Evidence |
|---|---|---|
| 20..44 | decoded, 36-byte indexed record | Address20 passed to decoder/image helper; fields24/28/2C/34/38/3C accessed. Candidate address materialization at candidate.s430; record pointer retained at16C. Retail pointer stored at19C at ROM1F6600. The source declaration establishes candidate size; escaped pointer accesses do not reconstruct every retail byte. |
| 44..48 | rounding gap | No direct access; next object begins48. |
| 48..88 | matrix[4][4], 64 bytes | candidate.s96 forms sp+72; retail passes sp+48. Matrix translation writes78/7C/80 in both. Initial RTL UID143 forms reg69+40; final sp offset is72. |
| 88..90 | interpolated[4], 8 bytes | Address88 passed as output; reads88/8A/8C. Last element has no direct caller access. |
| 90..A2 | interpolation[9], 18 bytes | Address90 passed as input; writes90/92/94/96/9A/9C/9E. Unwritten98/A0 are not permission to invent initialization. |
| A2..A8 | rounding gap | No direct access; next object beginsA8. |
| A8..B8 | blendState, 16 bytes | FloatsA8/AC/B0 and byteB4 have counterparts. AddressB4 escapes to image helper. Candidate struct declaration includes tail rounding; retail need not have used that exact aggregate spelling. |

## Active scalar-home counterparts

correspondences.json gives every retail/candidate access with original ROM instruction or candidate assembly line. These are value/dataflow correspondences in this supplied snapshot, not a claim of identical source variables or schedules.

| Retail home | Candidate home | Supported role/evidence |
|---|---|---|
| BC | BC | Item index: initialization0, decoder argument and loop increment. Candidate .lreg UID667 is pseudo76; .greg stores at188. |
| C4 / CC | C4 / CC | Object+40 actor pointer / object+44 interior address. |
| D4 / DC / E4 / EC | same | Captured signed half4E / actor words48,4C / helper low16 result. |
| F4 / FC / 104 | same | Three persistent integer components; matching halfword origins and later loads/stores. No color-expression analysis performed. |
| 10C / 114 | same | Initial factor / secondary vertical offset. Same homes, not an assertion that every store's schedule matches. |
| 11C | 11C | Negated decoded field08; ROM1F68BC and candidate store284 after negating sp+28. |
| 124 | 15C | Full decoded field04+field0C; ROM1F68CC versus candidate store348. Later subtract1 and narrow for right x. |
| 12C | register16, then134 for bit1 only | Retail stores full field14 at1F68C4 and reloads/masks it. Candidate initially keeps full field14 in16, then stores masked bit1 at308. This is a partial-value memory counterpart, not a full-flags spill equivalence. |
| 134 | 124 | Accumulated rows: initial0 at retail1F694C / candidate sw0,292 in guScale delay slot; later subtraction from top and increment. Candidate pseudo94 UID1086 becomes this home in .greg. |
| 13C | 12C | Primary image helper return: retail1F66B4; candidate UID768 pseudo95 becomes store300 in .greg. |
| 144 / 14C | 13C / 144 | Signed-halfword left x / selected left u. Matching shift16/arithmetic-shift16 origins and first/third vertex arguments. |
| 154 / 15C | 14C / 154 | Signed-halfword right-minus1 / selected right u. Matching narrowing and second/fourth vertex arguments. |
| 17C | 164 | Source y = negated top: retail1F69E8; candidate sw11,356 after negating the loaded top. |
| 19C | 16C | Address sp+20: retail1F6600 and later helper arguments; candidate .greg UID2365 stores364, UID762 reloads into a2 with REG_EQUAL frame+32. |

Candidate secondary pointer is register22/s6 in the prologue and .greg disposition pseudo73->22, agreeing with retail. The early C4..114 home anchors agree, but these are predominantly scalar spill homes, distinct from the fixed aggregate-local region belowB8.

## Unaccessed positions and USE limit

The six missing retail lattice positions are164,16C,174,184,18C,194. Their natural eight-byte envelopes are160..178 and180..198:48 bytes total. Retail17C remains an active source-y home between those groups; retail19C remains the active decoded-record pointer. Neither emitted sp-relative accesses nor the supplied pointer materializations target the six positions. There are23 active four-byte scalar homes in each owner, not six additional observed retail scalar values.

The supplied thirteen candidate dumps contain no memory-operand USE establishing an otherwise unaccessed home. The standalone USEs are sp at UIDs617/636/657 and return-register uses (initial66/2219, later2229). They carry no stack-slot offset; they are metadata, not emitted loads/stores and cannot be charged as six homes. pass-stack-evidence.json preserves those nodes and all stack-memory nodes; spill-origins.json records .lreg/.greg changes. Candidate scalar homes appear in .greg allocation/reload evidence, while initial fixed-local references use reg69. No original-retail RTL or allocation log is supplied. Therefore a hypothesis that the six retail positions were compiler-only USE homes, deleted spills, or different original temporaries remains unproved. The exact missing artifact for that attribution is original-compilation frame allocation/lifetime evidence, not another arithmetic guess from the frame size.

No padding, fabricated storage, artificial references, source spelling, or compiler experiment is proposed. This account is complete at the observed-layout level and explicitly limited at original allocation causation. Newer matcher-attributed progress (4148 bytes/frame408,140 nonrelocation differences after separate flags/packet/preload changes) is context only; no new package was read and none of the proven correspondences is rebound to it.

## Release

Only the assigned claim, this report and ignored evidence root were written. No production/source/configuration, compiler/build/verifier/source-policy, runtime/bridge/DB, Git mutation or agent action occurred. All fourteen W8 members and the existing single final complete-wave verifier remain required. This is ordinary matching assistance, not independent review or reusable semantic/compiler acceptance. All assigned writes are released at direct collaboration handoff; records then remain frozen.

Output identities (SHA256); all21 supplied input files were rehashed unchanged before release. outputs.json also records exact sizes.

| Artifact | SHA256 |
|---|---|
| accepted-original.s | 63304127A1DECEDF5AD1253390FEEB1A68D54A4B237EFFA71CDD006143722924 |
| analyze.py | 8CB4082B4D7F80263EB0C17C80291CFBD2A5E24F0CBA6A7D5851EAFDD5812619 |
| candidate-homes.json | 939210B8B31AF3F97C5E86BDC67FD6D1D52F002EF0DFCF0028A989E96B78FD46 |
| correspond.py | FC1C1058763D8441DAC5F10F28DC7B05BF81FA45DE55DADB0C9063624D181DB8 |
| correspondences.json | 2B5EFFBA7A4C2A11F4F4CB6E882C54BC06D4DBF1DB5BE15537E67404008A4A17 |
| expansion.json | 4BD1F679740079C25F11E18F3A4503BD0947241074A46EB9042B0BCDB5442CAA |
| expansion.py | 7CB8C85A7747628B9043E1FCD0751844214ADD1C717B9F18FA8B83FB6CF71047 |
| finalize.py | 77BC1BA2EDC74BF30421F37811D4FD2948C74AB86C46E7B076E8A967453A0842 |
| homes.py | 99D8D740681A8A231DE3EC7AD8D91E1CD7F285822157FCCC53B55F0CE7CEE6D3 |
| inputs.json | CBF36B5EB4065B7A7CDEB7A1B5ED3BF45068AFDE653C0E7D6DE56ED9D033B5A9 |
| pass-stack-evidence.json | B5337AD0DC18DB90515154C50F65630D59E769C8A564BC1EEC25702F50B25766 |
| passes.py | 2DB891ABF0BA2E6A4D0B10CA0FB5094B5D92033DC37AF066F45CF9EE6B6BFA6D |
| retail-homes.json | 11D221A65721DD584D75AE3187554F09BA8BFC660C9F4F34EC7D58D185279949 |
| spill-origins.json | CAA111AF6AF89E9BF60DE7A326B6143C41FABCB96B3F7DF968C7744CBA394BD7 |
| spills.py | B055480C59BF737C35E979F388B45A091FD442E8019CB6F687E6443DF6E57D4B |
| outputs.json | A2B190439897A739A043FFBC67521DF66A7F6BFFE2E8D27F12E7EEA44F3E17C7 |
