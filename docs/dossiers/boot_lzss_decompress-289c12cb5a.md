# boot_lzss_decompress: portable-ac0c-local-promotion-count-and-offset-lifetimes

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `289C12CB5A56E6B0963F8E2244187F9AEF686B2B413F400997EBA1194FCE91CA`
- Observation: `0203D57C7A2B4FEC91F8062B4BD052448C9A7FD908B7C760679401535277787B`
- Source: [exact C](../archive/matching-c-candidates/2026-10-06-boot_lzss_decompress-289c12cb5a.c)
- Metadata: [curated observation](boot_lzss_decompress-289c12cb5a.observation.json)

Portable AC0C effect pair with DE9F9F4972. Normalized source is a new identity; raw experiment remains recoverable. Private global-function evidence is separate from canonical LOCAL acceptance.

## Source context

Complete four-body global-function producer paired with the clean baseline DE9F9F4972E2F539F61A6500812009CC9F4E094F4BABFD1A683645B52A2FF8DB. Primary 1732 bytes and both readers are unchanged between the pair. Canonical ownership and full-ROM acceptance are separate.

Normalize LF and EOF whitespace as a new source identity. In AC0C mode 0, promote code to a branch-local word, shift through the existing len variable, and use a separate branch-local offset. In the final mode, guard a promoted decoded literal count before shifting, then copy it to the byte-sized working counter.

## Recorded observation

The changes remove all 16 differing nonrelocated AC0C words at its correct 804-byte length. All 194 compared nonrelocated words agree; seven actual relocation words are excluded. Earlier branch-local promotion alone reached nine differences, and decoded-word/working-byte separation reached two. The complete producer remains 2656 bytes because A510 is 12 bytes short. Native clean source output is checked against original candidate 01BBDBC98F.

## Remaining failure

Primary A510 remains nonexact. The global-function research representation has no canonical ownership, placement or full-ROM acceptance. The integrated canonical source uses LOCAL secondary functions under its complete compiler/relocation contract.

Research role: effect-example; selected emitted best: false.

Replay: `node tools/match.js probe boot_lzss_decompress --source docs/archive/matching-c-candidates/2026-10-06-boot_lzss_decompress-289c12cb5a.c`. Check the metadata's expanded/header identities before interpreting its dumps.
