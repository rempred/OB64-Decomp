# Evidence index: high-value matching-C wave 3 independent review

## Outcome

Verdict: `Accepted`.

The independent review reproduced the frozen fourth target, its placement and
relocations, all three earlier accepted targets, and the complete canonical
ROM. No admissible blocking finding remains.

## Frozen subject

| Item | Identity |
|---|---|
| Canonical commit | `b0cdbc4d6efcfc1264214959ca17b3bf8c4b0399` |
| Worker AAR | `docs/matching-c/high-value-wave3-20260802/aar/20260802-ob64-matching-c-high-value-wave3-aar.md` |
| Worker evidence index | `docs/matching-c/high-value-wave3-20260802/evidence-index.md` |
| Review build root | `C:\Users\Joe\.codex\ob64-matching-c-wave3-review-20260802` |
| Review report | `docs/matching-c/high-value-wave3-20260802-independent-review/aar/20260802-ob64-matching-c-high-value-wave3-independent-review.md` |

## Claim index

| Claim reviewed | Independent evidence | Result | Evidence grade and review state |
|---|---|---|---|
| Frozen commit matches the declared worker file set. | Frozen commit diff tree and scoped path inventory. | Seven attributable paths changed: source, configuration, and five handoff files. | Supported; accepted. |
| The selected owner is a bounded resolver boundary. | Local resource dossier, original assembly, and adjacent dispatcher owner. | `func_0000BC8C` is the resolver/load slice; `func_0000BE98` begins at its exclusive end. | Supported static claim; accepted. |
| The owner is 524 bytes with no secondary entry. | Manifest part, assembly labels, object section, and map assertions. | z64 range `0x0000BC8C..0x0000BE98` is `0x20C` bytes. | Supported static claim; accepted. |
| The C target reproduces original linked bytes. | Independent Phase 8 build, verifier, direct range hash, and asm-differ. | Target SHA-256 is `23B9E078BC45A44074A7F23B9C4C8384D8C39D5A8D39951F39739F11BDCC5424`; exact match passed. | Supported static claim; accepted. |
| Target placement and relocations remain exact. | Reviewer map, object sections, readelf output, and verifier. | Symbol value is `0x8007B88C`; `.ob64.r0107` is `0x20C`; 21 `.rel.ob64.r0107` and one `.rel.pdr` entries pass. | Supported static claim; accepted. |
| Signed-low-half aliases preserve encoding and effective addressing. | Linked target words and linker map. | Directory alias resolves to `0x800A8750`; template alias resolves to `0x800AE27C`; original `lui` words remain exact. | Supported static claim; accepted. |
| All three earlier C targets remain byte-exact. | Direct hashes from the reviewer ROM and verifier preservation fields. | 36, 168, and 224-byte accepted ranges match their expected SHA-256 values. | Supported static claim; accepted. |
| The complete canonical ROM remains exact. | Reviewer ROM hash and verifier output. | ROM SHA-256 is `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`. | Supported static claim; accepted. |
| The code-region identity remains exact. | Independent range hash and verifier output. | Code-region SHA-256 is `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`. | Supported static claim; accepted. |
| Repeated builds preserve path-independent identities. | Two reviewer-owned Phase 8 roots and reproducibility comparer. | Reports, ROM, ELF, map, layout, and object manifest identities match. | Supported static claim; accepted. |
| Tool and input provenance remain authenticated. | Phase 8 build report, direct tool hashes, compiler hash, and asm-differ commit. | Accepted compiler, binutils, Splat, and asm-differ identities match recorded values. | Supported provenance claim; accepted. |
| Source derivation respects the clean-room boundary. | Changed-file inventory, source inspection, and worker derivation record. | No external-derived implementation was inspected; the canonical source uses local evidence and constrained assembly only. | Supported provenance claim; accepted. |
| Constrained encoding controls remain inside the boundary. | Source inspection and exact output comparison. | Inline assembly preserves selected encodings and delay slots without copying the original body. | Supported static claim; accepted. |
| The canonical repository contains no prohibited generated artifact. | Frozen commit file set and diff check. | No ROM, object, map, executable, or bulk report entered the commit. | Supported protocol claim; accepted. |
| Every material worker claim has sufficient evidence. | This index, reviewer AAR, independent reports, and reused setup report. | All assigned static claims passed proportional independent checks. | Supported; accepted. |

## Direct artifact identities

| Artifact | SHA-256 or result |
|---|---|
| Reviewer ROM | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Reviewer code region | `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` |
| Reviewer target section | `23B9E078BC45A44074A7F23B9C4C8384D8C39D5A8D39951F39739F11BDCC5424` |
| Reviewer build report | `13A7469457B5909905E34C8DF8E7F2DE96B13628709C7987142B9390D5516FD1` |
| Reviewer verification report | `8AAF145E4FEA0B71708B6665D4AAC53FDAB116E007000B4AC204C582CA1A174E` |
| Reviewer reproducibility result | `status: pass`, `reportsIdentical: true` |
| Target source | `1DD83FE80C651B037F67238CA6E6FF03C441469F869F1630F7316D0C89D73068` |
| Target original assembly | `B77775732A4D474596FCEB6369CF286A784ED86AC2A1442B1D60B94BCC9DB04E` |
| Matching-C configuration | `454AC010D93FD6C583C5C5F8A8F00F3E50D2A79B5A7A8476131648B9F7060BCD` |
| Accepted compiler | `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6` |
| GNU `mips64-elf-readelf.exe` | `52F76F9249F3961AE54A5CEB60AA88E791966A32BE947F8F23F93BA91E1943CF` |
| Splat Python | `4CCA2027319C08DCA5CC4B64C9BA415CC89205152202CB6805081277C43B610F` |
| Splat split script | `EED41D3C36AFA4A980A3B22BC76C371569696CADFEF925DBB63606BFB081544E` |
| asm-differ commit | `093360aa31f90e67216ed1971c4087516cc7b940` |
| asm-differ `diff.py` | `D69AA5916DA99A9D88D3B3156C4ABB1C656E425205644B3DB4726204DC7C2211` |

## Reused frozen evidence

The worker's pre-edit and post-edit setup reports were reused as setup-baseline
evidence. The post-edit report SHA-256 is
`B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D`.

The reviewer did not rerun setup because that command writes generated setup
outputs inside the canonical repository. The independent Phase 8 build and
verifier ran from a fresh reviewer-owned output root.

## Evidence limits

The accepted grade remains `Supported` for static structural correspondence.
The review does not prove runtime behavior, gameplay field meaning, or editor
round-trip safety. No runtime or emulator claim was assigned.

The parent repository moved from the worker baseline through review-routing
coordination commits. The canonical commit, integration evidence HEAD, and
Phase 8 input identities remain the required frozen subjects.
