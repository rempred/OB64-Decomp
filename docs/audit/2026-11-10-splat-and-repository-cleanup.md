# Splat compiler correction and repository cleanup — November 10, 2026

Joe authorized correcting the misleading Splat compiler setting and cleaning redundant
documentation and retained files. No matching wave was started, and no commit or push
was performed. Pre-existing edits and unrelated untracked research remain intact.

## Corrected configuration and acceptance

Changed the production-config generator and generated Splat YAML from `IDO` to `KMC`,
then updated that YAML's accepted hash in `config/phase7/conventional-build.json`.
All 7,242 binary-extraction segments and generated sidecars are unchanged. Actual
KMC GCC 2.7.2 compiler, flags and GNU Binutils identities are unchanged.

Independent Astra review approved the exact three-file change. Regeneration with
`--check` passed. The installed `tools/audit.js --profile` passed structural checks
and fresh CURRENT acceptance on November 10; its total wall time was 1,292.419 seconds.
The 41,943,040-byte ROM remains byte-identical to canonical Rev 0.

| Evidence | SHA-256 / identity |
| --- | --- |
| Corrected Splat YAML | `5DB1B5FFB0589E39153CDC2A92C91B32963CFABE3FAC4CDAB44334C5740011DA` |
| Accepted CURRENT | `081B815B15E33390CB26067C16891AAA20C32FB00415F9D963841A5E37018A8C` |
| ROM | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| `build/audit/report.json` | `066F3F56144DA0B4B886DB479461CB740C6AA0C6E38D209CB3CE1DB7E8050E02` |

`build/current/state.json` binds the fresh-compilation and verification reports;
their hashes and the actual ROM were independently checked after the audit.
Detailed run output is in `build/repo-maintenance-20261110/splat-audit.log`.

## Documentation and retained source

- Reduced `NEXT_STEPS.md` from 1,247 to 107 lines, preserving unresolved scope and
  current priorities while removing completed schedules and obsolete timing goals.
- Reduced `PLATFORM.md` from 728 to 431 lines. Structural inventory remains intact;
  a compact commit index replaces repetitive milestone prose. Repaired navigation.
- Removed 54 byte-identical archived C copies (253,120 bytes). Canonical C now supplies
  those source examples; useful dossier lessons remain. For 51 authenticated records,
  only the source location changed: IDs, authored claims and authenticated evidence did not.
- Removed seven obsolete exact-file `.gitattributes` entries. Checks found no remaining
  references to removed copies. All 30 indexed lessons remain available.
- Authentication of all 83 considered records had zero regressions. Restored eleven
  missing, exact-hash evidence files (215,475 bytes) from an existing archive, repairing
  two old records. Fourteen others retain pre-existing historical-reference drift;
  their original pins and newer canonical files were preserved.

Detailed retention checks are under `build/research/retention-review-20261110/`.
Large logs, controls and original assembly that still support tests, research or
canonical reconstruction were retained. Git preserves removed queue chronology.

## Temporary files

Automatic approval review blocked recursive deletion without a more specific reason.
Following Joe's Recycling preference, safely moved and hash-verified:

| Disposable output | Files | Bytes | Desktop/Recycling folder |
| --- | ---: | ---: | --- |
| 16 old consultation-test roots | 4,670 | 4,519,219 | `ob64-consultation-tests-20261110-b92e7f85` |
| 1,357 stale, plain metadata-test roots | 35,654 | 19,565,261,332 | `ob64-metadata-test-fixtures-20261110-e51d183e` |

These moves clear the repository, not disk space. Recycling was not emptied. Every
selected root, ancestor and descendant was checked without following reparse points.
All 122 excluded fixture junctions, their targets and 163 remaining roots were checked
afterward and remain intact. No shared tools, accepted builds, Total Resolver captures
or production caches were removed. Original/new paths are recorded under
`build/repo-maintenance-20261110/`.

The offline consultation test now uses a module-lifetime `TemporaryDirectory`, outside
the repo by default, retaining the existing parent-directory override. Independent
review and all 18 offline tests passed; an additional override test confirmed that
its temporary contents disappear after normal exit. No production consultation
behavior changed. Existing metadata-test fixture lifecycle cleanup remains in place.
