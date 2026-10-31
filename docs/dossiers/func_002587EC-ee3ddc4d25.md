# func_002587EC: p05-shared-byte-before-pointer-read

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `EE3DDC4D25D4C5708E9CCF40FED1F79B32A5C3F04D56A398F00A71E93A9CA425`
- Observation: `E107C40A97C29ADF8E955F350D875BB4C450D2C4FEE3DF849B50FDCD8B2A04E8`
- Source: [exact C](../archive/matching-c-candidates/2026-10-31-func_002587EC-ee3ddc4d25.c)
- Metadata: [curated observation](func_002587EC-ee3ddc4d25.observation.json)

P05 source-pair publication. Original source/native artifacts remain at the referenced paths. Matching acceptance applies separately to the final canonical descendant and complete wave.

## Source context

Complete572B seven-command dispatcher r4537, frame64/39REL. First F25EA2C7/run4A1E5DF6 PURE_C572/frame64 covers all143 words/15 external calls. Seven masked native differences confined to1002 shared parameter writes: typed field4 pointer read/globalpointer store precede byteglobalSB, byteSB occupiesAB0 delay. Publication preserves the original source context; the canonically reconciled descendant is separately bound by the complete P05 wave report.

Replace only p01_pointer_80220F6C=state->values_04 with p01_pointer_80220F6C=*(u8**)((u8*)state+4). Keep first-byte expression, global lvalues, callback, waits and all other source unchanged; explain scalar view beside read.

## Recorded observation

Watch02 440A981C/runCA4EA959 stays PURE_C572/frame64/39REL, full raw relocation-masked equality. All7 native differences1D8/1DC/1E0/1E4/1E8/1EC/1F8(hex) resolve: byteSB before pointerLW, pointerSW inAB0 delay. This establishes a local source effect, not a universal alias/scheduler mechanism or original syntax. Related515B4 scalar halfword source pair supplied a qualified transfer lead.

## Remaining failure

Private symbolic-object only. NewD9ED8/+6 aliases remain originaldata_0025e890; D180 void* return/minimalprefix and own58178 callback ordinary interface reconciliation, complete-wave canonical ownership/placement/REL/PURE_C/target/full-ROM gates pending. The complete canonical descendant wave now has linked/full-ROM acceptance; historical controls and authored effect claims are not certified by that acceptance.

Research role: emitted-best; selected emitted best: true.

Replay: `node tools/match.js probe func_002587EC --source docs/archive/matching-c-candidates/2026-10-31-func_002587EC-ee3ddc4d25.c`. Check the metadata's expanded/header identities before interpreting its dumps.
