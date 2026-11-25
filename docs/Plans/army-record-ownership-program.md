# Army record ownership

**Claimed by the OB64 Decomp team on November 24, 2026.** The team owns matching C for all 33 ROM starts below. We are tracing how deployment, battle and character screens choose the persistent player or enemy record and handle shared Soldier storage. Mission suspend and restore are a separate potential follow-up. [Editor request](editor-function-families-20261120.md)

## Wave membership

All entries are normalized US Rev 0 ROM starts. Each row is a complete wave. Formation and post-battle writeback is the first priority. Other dependency-ready waves can run in parallel.

| Wave | ROM starts |
| --- | --- |
| Formation and post-battle writeback | `00209774`, `00209F74`, `0021C140` |
| Recruitment and scripted transfers | `002142C4`, `00219A14`, `00249D98` |
| Player and enemy record helpers | `000BB34C`, `000BB47C`, `000BD3D0`, `000BD43C`, `000BD4F4`, `000BD60C`, `000BD8C4`, `000BDB74`, `000BDDCC`, `000BE024`, `000BE27C`, `000BE494` |
| Character display and other record consumers | `00055B28`, `00083970`, `00083C5C`, `0008E728`, `00188CDC`, `00189778`, `001ADD4C`, `001AE25C` |
| Squad-source and record-pool selection | `00135EE4`, `00136C38`, `00150550`, `001541C0`, `001587DC`, `00159474`, `00159FD4` |

## Selection source assignments

Joe paused the three previous source workers on November 25. One fresh worker owns all seven Selection functions. It uses [Workflow B](workflow-b.md#run-with-one-source-worker) on one function at a time, testing up to two variants concurrently in `build/matching/wb-army-a` and `build/matching/wb-army-b`. Both roots passed guarded preparation for the complete roster.

| Targets | Starting evidence |
| --- | --- |
| `00150550` | Start with the 2,828-byte candidate covering both rows and the executable 92-byte return tail. The predecessor recorded 36 differing words with seven provisional symbol bindings. |
| `00136C38` | P2626 preserves the complete renderer. P2554 retains a complementary exact dispatch sequence. |
| `00159FD4` | Candidate 127 preserves the retail frame and all 62 calls. Candidate 96 isolates the late texture sync. |
| `001541C0`, `001587DC`, `00159474` | Guarded preparation is complete. Source reconstruction remains open. |
| `00135EE4` | Preserve the private exact 792-byte candidate. Reconcile its screen-state type with the renderer at integration. |

The previous roots retain their final source files, compiler output, reports and lessons. The new worker reads these materials in place and keeps experiments in its own roots. The integrator verifies all seven together.

## Contributor coordination

The Director checked Decomp `1d7c6d9b`, Connor's upstream `a9f9d3e1` and his nine public export-fork branches. The roster excludes existing Decomp C and Connor's published C and parked drafts. Contributors choosing another target can check the [current queue](../NEXT_STEPS.md). [Decomp baseline](https://github.com/rempred/OB64-Decomp/commit/1d7c6d9bb303d4012e42bc595584c45239a2a98c) · [Connor's upstream revision](https://github.com/cosburn92/vibe_ogre_decomp/tree/a9f9d3e1b5c07cc76bca4c774d9dd4f7cf39b5d7)

## First investigation

Trace which source supplies the character record in formation and which destination receives the HP write in `0021C140`. Use the accepted roster writeback as a control for the source index, member index and the two record strides. An Editor comparison can give a player Soldier and an enemy Soldier the same member index and different HP, then check which pool changes. The normal complete-wave verifier establishes the retail match. [Accepted writeback](../../src/battle/battle_roster_write_back_members.c) · [Editor HP checks](https://github.com/rempred/LordlyCaliber/blob/5b418748558ad16f9d1e335e5c7dc24f60d2347f/native/tests/capacity-extra-mips.cjs)
