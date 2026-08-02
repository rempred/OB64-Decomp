# Evidence index

## Claims

| Claim | Evidence grade | Review status | Supporting artifact | What it proves |
|---|---|---|---|---|
| The target is an accepted 168-byte resource-loader function. | Supported | pending | `target-selection.md`; original assembly; semantic row `105`; assembly manifest | Boundary, subsystem path, and reuse evidence agree. |
| The C behavior follows the target control flow. | Supported | pending | `independent-derivation.md`; original assembly; candidate C | Each branch, field offset, stride, call, and sentinel maps to observed instructions. |
| The compiled candidate text matches the target bytes. | Verified | pending | External `candidate_f4.bin` and `pool-reference-rebuilt.bin` | Both files are 168 bytes with SHA-256 `B5B9786B86B3BA207A56847F26694E126F19667DAB49498E93607F9C4939A0C9`. |
| The candidate has link-time references that resolve to the target addresses. | Supported | pending | External `readelf -Wr` output; `candidate_f4.elf`; `independent-derivation.md` | Thirteen `.rel.text` entries represent the pool symbol, allocator, free routine, and local loop reference. |
| The focused link preserves target placement and symbol size. | Verified | pending | External `readelf -Ws` and `readelf -SW` output for `candidate_tracked.elf` | `func_0000B33C` is global at boot RAM `0x8007AF3C` with size `168`; `.text` is `0xA8` bytes. |
| The canonical setup baseline passed before source edits. | Verified | pending | External setup log and report | The required setup command passed with canonical ROM and code-region identities. |
| The pinned Phase 6 compiler manifest is restored exactly. | Verified | pending | Canonical manifest; frozen integration commit b22815518f060425519c08df19b617af8b5099a7; source blob 2d4cddd4ee381da7e767a7f0580de1ab67573919 | Canonical and authorized source copies are both 5883 bytes with SHA-256 98C8ACC06A8FBF40DADBD25AE20C2539E8765E14EA12895158C37CC413D06C26. |
| The multi-target Phase 8 correction is reproducible. | Verified | pending | Fresh roots C:\Users\Joe\.codex\ob64-matching-c-wave1-20260802-r2-a and C:\Users\Joe\.codex\ob64-matching-c-wave1-20260802-r2-b; verification reports; reproducibility report | Both targets compile, link, verify, and produce identical output identities. |
| The conventional ROM remains exact. | Verified | pending | Accepted Phase 7 conventional output; verify_phase7_conventional.js result | The conventional full-ROM SHA-256 remains 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A. |
| The required post-integration setup gate passes. | Verified | pending | verify_setup.js result; setup report | All 21 setup checks pass with zero unknown coverage bytes, code-region SHA-256 40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409, and canonical ROM identity. |

## Artifact identities

### Revision 2 artifact identities

| Artifact | Path | SHA-256 |
|---|---|---|
| Canonical compiler manifest | C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\docs\external-intake\phase6-kmc-reproduction-20260801\reproduction-manifest.json | 98C8ACC06A8FBF40DADBD25AE20C2539E8765E14EA12895158C37CC413D06C26 |
| Pool production C source | C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\src\boot\boot_resource_pool_acquire_release.c | 9A176F6860CB0D5F3E3B4627B2DAC9D8C2AC8A3B5FEF956FA040BEF354C68F62 |
| Phase 8 build report | r2-a and r2-b build-report.json | BECCF6CDCBFCDAFB68D93F140002D6E570F800C11BB3C0E9D548F5398734314D |
| Phase 8 verification report | r2-a and r2-b verification.json | F8F8CC3BA73CB924BC88C8B58710DDF104C4645ADE9003A9E458B49F51879FBF |
| Phase 8 ROM | r2-a and r2-b canonical output ROM | 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A |
| Phase 8 code region | Fresh-root ROM code region | 40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409 |
| Phase 8 reproducibility report | r2-a reproducibility.json | 6A3CFA9646E116F91D293E617F9E7C3F2E789F7FA6B24DE886ED341591FD11A6 |
| Setup verification report | C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\build\setup\verify-setup-report.json | B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D |

### Prior revision 1 artifacts

| Artifact | Path | SHA-256 |
|---|---|---|
| Setup log | `C:\\Users\\Joe\\.codex\\ob64-matching-c-wave1-20260802\\setup-baseline-r2.log` | `864413BFE2EB64EE0D3BCACDE68FC5DDFDE4CFC2E2A941692907BDCFAE1BC006` |
| Setup report | `C:\\Users\\Joe\\.codex\\ob64-matching-c-wave1-20260802\\setup-baseline-report.json` | `B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D` |
| Target reference bytes | `C:\\Users\\Joe\\.codex\\ob64-matching-c-wave1-20260802\\pool-reference-rebuilt.bin` | `B5B9786B86B3BA207A56847F26694E126F19667DAB49498E93607F9C4939A0C9` |
| Candidate C source | `C:\\Users\\Joe\\Projects\\OgreBattlel64\\OB64 Decomp\\docs\\matching-c\\high-value-wave1-20260802\\candidate\\boot_resource_pool_acquire_release.c` | `9A176F6860CB0D5F3E3B4627B2DAC9D8C2AC8A3B5FEF956FA040BEF354C68F62` |
| Candidate compiler assembly | `C:\\Users\\Joe\\.codex\\ob64-matching-c-wave1-20260802\\candidate_tracked.s` | `473D32FDDB26DC4B019F9017C34F95DDB7D9A7DDF01AC882611A01CB27F920DD` |
| Candidate object | `C:\\Users\\Joe\\.codex\\ob64-matching-c-wave1-20260802\\candidate_tracked.o` | `28FD79C70BBE67F11C7651C318D70E440EC48BEAAE1B986EED5F6A9FBB94548E` |
| Candidate linked ELF | `C:\\Users\\Joe\\.codex\\ob64-matching-c-wave1-20260802\\candidate_tracked.elf` | `C13F81BD60D6CB51FCEBBBA3F427CD71C69B488587CD4A172B314CADB08E72D6` |
| Candidate extracted text | `C:\\Users\\Joe\\.codex\\ob64-matching-c-wave1-20260802\\candidate_tracked.bin` | `B5B9786B86B3BA207A56847F26694E126F19667DAB49498E93607F9C4939A0C9` |
| Candidate relocation output | `C:\\Users\\Joe\\.codex\\ob64-matching-c-wave1-20260802\\candidate_tracked-relocations.txt` | `922F9B1F3D05365C7ED21B0F35DA24818642FD92951566CB535BA803037FF245` |
| Focused linker script | `C:\\Users\\Joe\\.codex\\ob64-matching-c-wave1-20260802\\candidate_pool.ld` | `11691464FFDF6AF5BBA1025DAEBA92C289D62F71222DE38A57F2589C9BF98315` |
| Standard build failure log | `C:\\Users\\Joe\\.codex\\ob64-matching-c-wave1-20260802\\blocked-standard-build.log` | `5D28878A044C318566EAA8FB9C1656155328B697F4334B730B62F700AE967A35` |

## Canonical inputs

- Canonical decomp HEAD: `fdd9b381f025c1887111d74ebdb3f783957962aa`
- Original target source SHA-256: `52E6438AB303533F47BF54079AD3F95822B9904EC356CA4B31E156C85B84108C`
- Canonical ROM SHA-256: `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`
- Canonical code-region SHA-256: `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`
- Pinned compiler manifest SHA-256: `98C8ACC06A8FBF40DADBD25AE20C2539E8765E14EA12895158C37CC413D06C26`

## Verification boundary

The following gates are complete and remain review-pending:

- Multi-target Phase 8 integration.
- Existing matching-C target preservation through the new build.
- Full-ROM conventional build identity.
- Two fresh path-independent external builds.
- Final setup rerun after canonical source and configuration integration.

Independent Critical review remains outstanding and is owned by the Director.
