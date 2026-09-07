# Combat capture input parsing r1

Status: complete; all assigned writes released.

## Outcome and scope

Both assigned parent archives are byte-identical to their cited historical archive hashes. Both
embedded Project64 ROM headers equal the verified US Rev 0 identity. Both Project64 state headers
also equal the later historical state-header records. The documented stable-field reader returned
a complete value for each of its supported fields from both states.

This is literal offline parsing only. It does not establish gameplay state, selector reachability,
code placement, execution, a runtime owner, or candidate preference.

## Baseline

- Assignment: `combat-capture-input-parsing`, revision 1.
- Launch ID: `COMBAT-CAPTURE-INPUT-PARSING-20260907-01`.
- Receiving task: `/root/combat_data_retrieval` on host `local`.
- Director task: `01a07262-aeca-7341-ad10-2dba705ff988`.
- Canonical branch and activation HEAD: `main` at
  `ba0966ade62e14e79c9611294a76c9ecd8444c30`.
- Parent read-only HEAD: `f940a2825ac97453746d3e9cef9c5cabc60a8dd2`.
- Frozen retrieval input: commit `bdf03d8aac7583f9ded491ac3e74b03cdcae41f3`,
  report Git blob `f98b5225b130dbd83d061f2201f79bb2c5f23f1d`.
- Inventory profile: `NORMAL`.
- The fresh claim, report, and ignored output root were absent immediately before activation. The
  claim was created atomically with create-only semantics before this report and parser outputs.

The boot worker's disjoint production edit was preserved. All original archives, shared parsers,
source, tools, configuration, databases, runtime assets, and prior reports remained read-only.

## Archive and member identities

| Input | Current bytes | Current SHA-256 | Historical SHA-256 | Equal |
|---|---:|---|---|---|
| `runtime-states/vanilla/rev0/battle/battle_active/Battle Start magic on both sides.pj.zip` | 1,069,912 | `DE2022F3AF7DA5E4CA7C1DF2FF976915FA3CA585A54A3D18C7178B4293AC8ECF` | `DE2022F3AF7DA5E4CA7C1DF2FF976915FA3CA585A54A3D18C7178B4293AC8ECF` | yes |
| `runtime-states/vanilla/rev0/battle/battle_loading_or_intro/Battle Scene Loaded FIGHT IT OUT gone ANIMATIONS ON.pj.zip` | 1,407,896 | `464BCC227F8C8151F78572ED92F40F5CD0F4692308C837B8762FEDEC28CEE583` | `464BCC227F8C8151F78572ED92F40F5CD0F4692308C837B8762FEDEC28CEE583` | yes |

Each archive has exactly two members, exactly one of which is a `.pj` member. No member name is
absolute, contains `..`, or contains a Windows drive prefix. Enumeration did not extract or execute
any member.

| Archive | Member | Uncompressed bytes | Compressed bytes | ZIP method | ZIP CRC-32 |
|---|---|---:|---:|---:|---|
| magic | `Battle Start magic on both sides.pj` | 4,205,152 | 1,069,538 | 8 | `C03BB907` |
| magic | `Battle Start magic on both sides.dat` | 360 | 58 | 8 | `886F48A8` |
| animations-on | `Battle Scene Loaded FIGHT IT OUT gone ANIMATIONS ON.pj` | 4,205,152 | 1,407,446 | 8 | `A9B7C219` |
| animations-on | `Battle Scene Loaded FIGHT IT OUT gone ANIMATIONS ON.dat` | 360 | 58 | 8 | `64F06F65` |

The authenticated Total Resolver identity parser also recorded the decompressed `.pj` identities:

| Input | `.pj` SHA-256 |
|---|---|
| magic | `225917C455B8A2CC83EBFBA557FCA09D68FF073A12D6ACE172D6868C23921480` |
| animations-on | `AC323E329F14B6DE627EC09CBAD2D086EA22490DE45EB0FF05CA5BA989D226F4` |

## ROM and Project64 state headers

Both `.pj` members decode identically:

| Field | Magic | Animations-on | Expected verified Rev 0 / historical state header | Equal |
|---|---|---|---|---|
| image name | `OgreBattle64` | `OgreBattle64` | `OgreBattle64` | yes |
| CRC1 | `E6419BC5` | `E6419BC5` | `E6419BC5` | yes |
| CRC2 | `69011DE3` | `69011DE3` | `69011DE3` | yes |
| country | `0x45` | `0x45` | `0x45` | yes |
| version | `0` | `0` | `0` | yes |
| Project64 save ID | `0x25EF3FAC` | `0x25EF3FAC` | `0x25EF3FAC` | yes |
| declared RDRAM bytes | 4,194,304 | 4,194,304 | 4,194,304 | yes |
| `.pj` member bytes | 4,205,152 | 4,205,152 | 4,205,152 | yes |

The verified ROM comparison comes from canonical `docs/runtime-state-catalog.md`,
`docs/REV0_SCOPE.md`, and the Total Resolver header parser. Historical state-header values come
from parent
`wiki/combat-body-animation-normal-mode2-selector-override-patch-model-20260727/runtime-fixture-correction/screening-summary.json`.

## Supported stable load-readback fields

The existing parent `tools/read_pj64_state.py` parser converts the stored Project64 RDRAM words to
native order, anchors its 4 MiB view at the documented roster record, and reads these fixed fields.
The table reports the parser's literal values. `locGate` is the raw byte; it has not been masked or
interpreted.

| Parser field | Physical RDRAM offset | Type | Magic | Animations-on |
|---|---:|---|---:|---:|
| `scenario(cur)` | `0x0E8350` | `u8` | `7` (`0x07`) | `0` (`0x00`) |
| `scenario(prog)` | `0x1936A7` | `u8` | `7` (`0x07`) | `1` (`0x01`) |
| `location` | `0x1936AA` | `u8` | `9` (`0x09`) | `6` (`0x06`) |
| `locGate` | `0x196A9A` | `u8` | `137` (`0x89`) | `134` (`0x86`) |
| `chaosFrame` | `0x1936A9` | `u8` | `68` (`0x44`) | `51` (`0x33`) |
| `goth` | `0x196A6C` | `u32` big-endian | `12,817` (`0x00003211`) | `1,000` (`0x000003E8`) |

The same parser returned these roster-name byte fields from physical base `0x193BF8`, 56-byte
records:

- Magic, 26 records: `Magnus`, `Colin`, `Tyler`, `Jodie`, `Garnet`, `Lovell`, `Khafi`, `Gail`,
  `Bif`, `Nikita`, `Partha`, `Dio`, `Drake`, `Droite`, `Bonaparte`, `Imie`, `Kimble`, `Tira`,
  `Alkmene`, `Leia`, `Samus`, `Nora`, `Simone`, `Celine`, `Reeves`, `Troi`.
- Animations-on, 18 records: `Magnus`, `Vaudville`, `Carmine`, `Flaune`, `Partha`, `Randy`,
  `Hudson`, `Deacon`, `Zeppelin`, `Sophia`, `Dio`, `Dude`, `Wyatt`, `Mario`, `Hanna`, `Celine`,
  `Meena`, `Isqus`.

For the magic archive, all fields available in parent
`wiki/b52-magic-damaging-fixture-review-correction-20260720/candidate-inventory.json`—both
scenario bytes, location, Chaos Frame, Goth, and all 26 roster names—equal this parse. That
historical manifest does not record the raw `locGate` byte. The cited animations-on AAR and frozen
retrieval report do not contain an equivalent stable-field tuple, so historical equality for that
tuple is unavailable.

Neither selected documented offline parser exposes a saved program counter. Saved PC is therefore
reported as unavailable. No code address, placement, execution, or post-load readback is inferred
from these offline fields.

## Claims and evidence grade

| Claim | Evidence grade | Review status | Exact scope |
|---|---|---|---|
| Each current archive equals its cited historical archive SHA-256. | Verified | pending | Two exact files only; full-file SHA-256 equality. |
| Each embedded ROM header equals the documented verified US Rev 0 identity. | Verified | pending | Offline `.pj` header identity only. |
| Project64 save ID, declared RDRAM size, and member length equal the historical header manifest. | Verified | pending | Two exact `.pj` members only. |
| The stable-field table is reproduced from the documented offline reader. | Candidate for meaning; literal values reproduced | pending | Six fixed fields and roster names; no gameplay or execution claim. |

The first three claims are mechanical identity claims. They do not promote the filename labels or
the stable fields into behavioral evidence.

## Deterministic evidence package

| Artifact or input | SHA-256 |
|---|---|
| `build/combat-capture-input-parsing-r1/parse_two_states.py` | `1F24D14CD0D431F5EE23D1378A3DD591F4EA3EC73FDAD32B25E16219AF9B6248` |
| `build/combat-capture-input-parsing-r1/two-state-identity.json` | `2A366FE48C7D7D330D8D27134B274DF466D305E3AFDEBBC7CCC5E8F3F910CC90` |
| `docs/Plans/task-logs/combat-capture-input-parsing-r1.claim.json` | `EDAC4B54495E3299C73D39C9260BC84E486B2C397D0CF1D1346E2BC8656A4648` |
| canonical `tools/total_resolver/identities.py` | `BC3BF45C68A684FB018DE594D8AA3D96C4DD0D89C4A2F072387A4D3BDA162888` |
| parent `tools/read_pj64_state.py` | `8F82BED4AC04F6F3EB953E7D513D038FC97730244DB3DCB377C0A2ED76B85C7A` |
| parent state-header reader | `C233D3E1304E85EA75A6273372C006B60C2BF0C170FA4C382D3C391A88D6A76B` |
| parent magic historical manifest | `549B1D08DA046713E51594B7E9B55F8263B87D7081A19F306EEB13954E9100D4` |
| parent two-state historical header manifest | `00B35A82BB1259E60D28E4A268E978FB9B5BF236FC475F2B6E0F7EFDD3B2B775` |
| canonical `docs/runtime-state-catalog.md` | `299C87F01B8FCCABB9EF7317B42355229A7A5E604D7489C875BBB98FE227A7DA` |
| canonical `docs/REV0_SCOPE.md` | `13754F61884C29B906F49D3F8D1FCB5E6D8F5756718D81142C08DA6EE52E3452` |

The JSON package contains every member record, exact archive and `.pj` hashes, field-by-field
historical and Rev 0 comparisons, stable-field addresses and values, complete rosters, parser
identities, and explicit unavailability/limit records.

## Verification summary

- The parser was run twice from the same inputs. Both runs produced JSON SHA-256
  `2A366FE48C7D7D330D8D27134B274DF466D305E3AFDEBBC7CCC5E8F3F910CC90`.
- Package assertions passed for two inputs, two safe member names per input, one `.pj` per input,
  both historical archive hashes, both Rev 0 headers, both historical Project64 headers, the full
  historical magic stable-field tuple, and explicit missing PC fields.
- `python -B -m unittest tools.total_resolver.tests.test_identities` passed 2/2 tests.
- No Project64 process, bridge, database, build, or GUI was contacted.

## Failed path and limits

The first task-owned wrapper invocation failed before opening an input because Python started with
the ignored script directory on `sys.path` and could not import canonical `tools.total_resolver`.
The wrapper was corrected to add the canonical repository root before importing the unchanged
module. The clean run then passed; no failed-run output artifact was created and no shared file was
changed.

- Only the two assigned archives were opened.
- Members were enumerated and `.pj` bytes were decompressed in memory. Nothing was extracted.
- ZIP central-directory metadata was used for the `.dat` members; their contents were not parsed.
- Stable readbacks cover only fields already supported by `tools/read_pj64_state.py`.
- Header equality proves embedded identity, not that an emulator would load the state into a
  desired gameplay point or retain these values after advancing.
- Saved PC, selector trigger, function placement, execution provenance, and runtime ownership are
  unavailable at this evidence scope.

## Changed surfaces and protocol

The only writes are the assigned claim, this report, and ignored
`build/combat-capture-input-parsing-r1/` parser outputs. No source, shared tool, configuration,
database, runtime asset, prior report, or other worker surface changed. No staging, commit, push,
branch, worktree, agent, runtime operation, or controller action occurred.

There were no protocol deviations. No canonical documentation change is proposed: this assignment
adds a task-scoped literal qualification packet only. The next action belongs to the Director and
the separate preparation worker; they may use these values as input identity checks while retaining
the explicit missing-PC and no-execution limits.

## Activity log

- Read the complete assignment, canonical and parent agent guides, parent worker workflow,
  applicable Total Resolver instructions, and frozen retrieval report at `bdf03d8`.
- Found no nested `AGENTS.md` beneath the two input paths or parent parser paths.
- Confirmed fresh write surfaces and created/read back the complete claim atomically.
- Used only documented existing parsers and a task-owned ignored wrapper.
- Sent the literal qualification checkpoint to `/root/combat_discovery` without making candidate
  or route choices.
- Completed verification and released every assigned write.
