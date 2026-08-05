# Highway A-C checkpoint 001 S01 promotion review evidence index

Status is completed with verdict `Accepted`. Independent checks confirm an exact 28-plus-6 configuration union and byte-identical builds. Final handoff validation passed. The Parent Director must intake and propagate the accepted review.

## Frozen subject

| Item | Identity |
|---|---|
| Program | `OB64-MC-6LW01-20260803` |
| Review task | `OB64-MC-6LW01-PROMO-AC-CP001-S01-REVIEW-20260805-R1` |
| Checkpoint | `OB64-MC-6LW01-AC-CP001-S01` |
| Reviewed commit | `af478b688233996a2c4495265eadbd6146eff1f1` |
| Reviewed parent | `0a637e4fb34b9f94fb073a06d16e1d9b777493b0` |
| Commit tree | `7929a5c49c56df3b99cad905988b94559429ac3c` |
| Checkpoint manifest SHA-256 | `F298D99C84859AA5F1605A283CE136AC8081DF6ACB55C8DDE150D1694750002B` |
| Starting configuration SHA-256 | `E0D9023BFCA2CD9BE55DEAC6457561D168F1BCA9DE02702F607A4C2C1B6F70D6` |
| Result configuration SHA-256 | `88F544C2054DB6FD1AC048698619D7524B615CF43F940BB7B9F04415740D55C1` |

The reviewed commit has one parent.

Its parent equals the assigned promotion base.

## Changed-path audit

The frozen commit changes eleven paths.

The technical paths are one configuration and six approved C owners.

The remaining paths are the worker's four assigned promotion records.

No assembly fallback, earlier C owner, unrelated record, tool, or canonical document changed.

`git diff --check 0a637e4fb34b9f94fb073a06d16e1d9b777493b0 af478b688233996a2c4495265eadbd6146eff1f1` passed.

## Configuration audit

| Check | Direct result |
|---|---|
| Parent target count | 28 |
| Frozen target count | 34 |
| Earlier target objects | 28 of 28 exact and order-preserved |
| Compiler object | Exact against parent and all six accepted trees |
| Checkpoint target occurrences | Six symbols, one occurrence each |
| Checkpoint bytes | 716 |
| Accepted target objects | Six of six exact |
| Accepted source blobs | Six of six exact |
| Configured source hashes | 34 of 34 exact |
| Configured fallback hashes | 34 of 34 exact |
| Interval length checks | 34 of 34 exact |
| Interval overlaps | 0 |
| Unique symbols, rows, IDs, sections, sources, fallbacks | Pass |

The configuration's compiler manifest hash is `98C8ACC06A8FBF40DADBD25AE20C2539E8765E14EA12895158C37CC413D06C26`.

The KMC executable hash is `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6`.

The compile flags match the parent and every accepted result.

## Checkpoint owners

All addresses are z64 ROM intervals.

| Semantic name | Game meaning | Address | Address space | Evidence role | Bytes | Source SHA-256 |
|---|---|---|---|---|---:|---|
| `func_0024DA10` | Unresolved library routine | `0x0024DA10..0x0024DA50` | z64 ROM interval | Approved checkpoint owner | 64 | `02484EAA4966E464B97550F22F23E417826167C0395BCF06DF136741C4A01448` |
| `func_0015DF10` | Unresolved library routine | `0x0015DF10..0x0015DF68` | z64 ROM interval | Approved checkpoint owner | 88 | `C30F972AD367D92EF34CFA63A34F5921D7D3E19AF11B2B06234CCCD6279E9099` |
| `boot_resource_archive_load_one` | Loads one resource archive entry | `0x0000B29C..0x0000B33C` | z64 ROM interval | Approved checkpoint owner | 160 | `770B977268313E631C6551425FD084285C610F4ACBD875130F91D42034009D0C` |
| `func_0024E490` | Unresolved library routine | `0x0024E490..0x0024E510` | z64 ROM interval | Approved checkpoint owner | 128 | `C6F5C1B00DC83C3B1BDF2226B0F2C094FFE7FEBEA1ADF3CE6DBE991607B9993F` |
| `boot_state_slot_queue_service_gate` | Gates state-slot queue servicing | `0x000071C8..0x00007200` | z64 ROM interval | Approved checkpoint owner | 56 | `E78F1AAF0805548A4883DE6782E5EECDC5C3EBF807E0812C3017C73B46E56DB1` |
| `boot_resource_node_lzss_context_materialize` | Builds one resource decompression context | `0x00009EFC..0x00009FD8` | z64 ROM interval | Approved checkpoint owner | 220 | `46E7B84D3A344BCF23AECE92D2AC81684A43A0593CE72977383431871A19076C` |

Every target object and source blob matches its checkpoint accepted-result tree.

## Frozen provenance audit

Six lifecycle receipts match the checkpoint manifest.

Ten worker and reviewer artifacts support the five hybrid classifications.

All sixteen referenced artifacts exist and match their frozen SHA-256 values.

All eighteen reviewed, verdict, and accepted commit objects exist.

The accepted-result trailers bind each function, lane, lease ordinal, and review commit.

## Authenticated prerequisites

| Input | Direct identity | Result |
|---|---|---|
| KMC compiler | `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6` | Pass |
| Splat Python | `4CCA2027319C08DCA5CC4B64C9BA415CC89205152202CB6805081277C43B610F` | Pass |
| Splat split script | `EED41D3C36AFA4A980A3B22BC76C371569696CADFEF925DBB63606BFB081544E` | Pass |
| asm-differ | Git commit `093360aa31f90e67216ed1971c4087516cc7b940` | Pass |

## Fresh gate results

The exact commands appear in `task-log.md`.

Splat generation passed in the isolated review root.

Phase 7 conventional build and verification passed.

Phase 8 matching-C build and verification passed for 34 targets.

No command timed out.

No verification command failed.

| Result | Phase 7 | Phase 8 |
|---|---:|---:|
| Primary rows | 7,242 | 7,242 |
| Link slices | 7,251 | 7,251 |
| Overlay reservations | 19 | 19 |
| Represented bytes | 41,943,040 | 41,943,040 |
| Matching-C owners | Not applicable | 34 |
| Exact asm-differ targets | Not applicable | 34 |

Phase 8 records `fullRomExact: true`.

Phase 8 records `originalAssemblyTargetsNotLinked: true`.

The 7,242 accepted rows remain preserved.

The 7,251 accepted slices remain preserved.

The 19 overlay descriptors remain preserved.

## Output identities

The isolated root is `C:\Users\Joe\Projects\OgreBattlel64-External-Outputs\OB64-MC-6LW01-20260803\AC-CP001-S01\promotion-review-r1`.

| Artifact | SHA-256 |
|---|---|
| `phase7/phase7.elf` | `D557B2719DDB4E462EE94222F7A7059F020A99B1332509A9B0BE5F7AB4BC75FD` |
| `phase7/phase7.map` | `C1DF1F93B8D11EFF470F637C69C5F1B6008CF96449091F4E5DED1DB120108EF1` |
| `phase7/phase7.us_rev0.z64` | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| `phase7/layout.json` | `64002AC9A84AC695E516ED946FBCF90E073F884FE817C0092FECC9FEE7E9B990` |
| `phase7/build-report.json` | `DFF3D4DE0BBF88829CFECEC88161AA5443AC3F1B87C12314167491706FD29EE7` |
| `phase7/verification.json` | `7CCE232075BCF187789DE424E8DD76CD43186A5B6DE61905C92D771E8A11D89E` |
| `phase8/phase8.elf` | `D88126A024C2E2291DFB3404E7BF22671A52E3A559A0D3FDBC1C48D190F82E06` |
| `phase8/phase8.map` | `A1A8646F58043B7B73A583DD8ED6FEC205CC1379F4FD2988BA0DD3CA0D723B58` |
| `phase8/phase8.us_rev0.z64` | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| `phase8/layout.json` | `5CA588BB23E98CB12322A3659F7BF80707F59CC7E65BBEA23E894FD728CE979A` |
| `phase8/phase8.readelf.txt` | `50EC9A6D291507751617D1A9A2CE516A332FCE4A21C589F5AE70EB9DBA531632` |
| `phase8/objects/manifest.json` | `491A9538A3118675F84166833E3D6744B2EA5FEEC1E4665BC65C720B110ABFE2` |
| `phase8/build-report.json` | `6681EEC0DB13908707AECD493D2EB87234245786D1EBD529284BBA82F0BD5AB1` |
| `phase8/verification.json` | `6E96F2E9B67CA91BB285298EBEFB7C88E7BFE6E79B7E5F22A554A34096827736` |

Each fresh build and verification report matches the corresponding worker report hash.

## Acceptance-test boundary

The assigned claim is exact structural promotion from six accepted result trees.

The supported producer is the canonical promotion workflow.

Its ordinary sequence copies one accepted target and source from each tree.

An extra path, target, or changed baseline object would materially corrupt the canonical baseline.

Exact Git-tree and configuration comparison is the smallest useful falsifier.

The check stays within the claimed `Verified` static evidence grade.

The check stays within the assigned promotion threat model.

This is an ordinary static acceptance test.

## Evidence limits

The review proves structural source integration, configuration identity, linked bytes, placement, and full-ROM identity.

It does not prove gameplay meaning, runtime behavior, editor readiness, or release safety.

## Verdict evidence

No admissible finding exists.

The technical verdict is `Accepted`.

The final handoff validator returned `ok: true` with no errors.
