# func_0021EBBC: scoped-row-indices-and-folded-count-reference

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `13DA29FF0CB73BA8134477C5748B482B3E4460578F9C0019B901C3E09CF956DE`
- Observation: `F65DBB46C5A73312EEDEC243D800A21C31AE9AFD1FAC24821DF5D554AF7A7973`
- Source: [exact C](../archive/matching-c-candidates/2026-10-10-func_0021EBBC-13da29ff0c.c)
- Metadata: [curated observation](func_0021EBBC-13da29ff0c.observation.json)

Best private complete EBBC candidate in scope sequence; native nonmatch and complete-wave gates remain.

## Source context

Complete EBBC10272-byte private reconstruction, current03D1204B/E9E49D47; no canonical activation.

From667: give the three row traversals separate pointer scopes; reuse the main unsigned index for setup row traversals but retain a separate nested child index. Add the mathematically exact unsigned (count|firstEnd)&count identity at the terminating byte store, outside the nested first-row loop.

## Recorded observation

13DA29FF/sourceA8DA9D0D is PURE_C10268/frame744/vars664/457 text relocations/204 calls/native1047E36E, one word short/2091 absolute-offset masked differences. The three steps emit2103 (872),2097 (1F945) and2091 differences respectively, versus preserved5DD2106. CurrentX case2 remains396-byte dispatch-aligned masked-exact. The latest identity restores firstEndS4/sourceS6 with no extra instructions or native extent change. The first setup traversal now has indexS3/countS2; the original FIRST traversal actually requires indexS2/countS3. Later setup traversals require indexS3. Earlier priority-note prose generalized the later roles incorrectly; its source-bound numeric measurements remain valid.

## Remaining failure

Selected over5DD for the smaller native difference count, with the same four-byte deficit. First-row scopeBC7CF is a useful next intermediate but not selected: its extent deficit increases. Original source ownership, actual final relocated tables/operands, five data aliases, future4813C/BF8C corrections and complete W8/W6/W7 acceptance remain. No linked acceptance.

Research role: emitted-best; selected emitted best: true.

Replay: `node tools/match.js probe func_0021EBBC --source docs/archive/matching-c-candidates/2026-10-10-func_0021EBBC-13da29ff0c.c`. Check the metadata's expanded/header identities before interpreting its dumps.
