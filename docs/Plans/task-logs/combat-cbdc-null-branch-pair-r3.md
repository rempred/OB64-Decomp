# CBDC: explicit null return and branch layout

This pair records one source change in `func_0020CBDC` before the remaining loop experiments.
Both sources are PURE_C and nonexact. The private one-owner comparisons guide experiments;
they do not establish canonical ownership, matching acceptance or completed-wave acceptance.

The only source change replaces the inline helper expression
`return actor ? actor->field_4C == 1 : 0;` with an explicit null return followed by the field
equality return. The complete surrounding source is retained in each archived input. Both
forms retain the null case and the same field access on the nonnull path.

| Input | Authored SHA-256 | Expanded SHA-256 | Bytes / frame | Different bytes / words |
| --- | --- | --- | --- | --- |
| R2 first | `B1B8E759F4B7811E35169DD070A17068FDF9E26455F579809A6EF736B5F8E6AD` | `8CE33D9F78A6B48DEECC70FDC6821A219F42B5F711D2AC38AF25845738BCE581` | 2164 / 88 | 1337 / 420 |
| R3 explicit-kind | `C3F9E2C0E5B7285C791A27786FB3801911C78B5AB13EA7C736F56F6312B2D866` | `B807AE034016A472C2836F5CFF0008CA3622294CB5480B9D0BD41870755BC385` | 2164 / 88 | 1318 / 414 |

Retail extent is 2136 bytes. Both inputs have 77 candidate relocations. The explicit return
corrects the branch arrangement beginning at offset 0x184. Its first remaining differing word
is at 0x1A0: the branch destination differs because subsequent code layout remains different.
The following loop still changes induction variables, allocation, instruction order and extent.
This local improvement is not a general guarantee about conditional expressions or early returns.

The explicit-kind canonical `diff.js` attempt failed the existing object-section shape check.
That failure is preserved in `build/combat-discovery-supplement-r3/cbdc-early.stdout.txt` and
`cbdc-early.stderr.txt`; it supplies no canonical exact result. Private measurements are under
`build/combat-discovery-supplement-r2/0020CBDC/first/` and
`build/combat-discovery-supplement-r3/0020CBDC/explicit-kind/`.
Their `result.json` SHA-256 values are respectively
`6D45C6388D14FE51843A2FE157E48100973C6C0F035B204C2424548F03703BD8` and
`57CA70D62200203B1C0EF6326343055AE09E557E8F6E7E81657C5C6FB248D3D6`.
The latter directory's `word-diff.txt` records the remaining word comparison.

Both policy records bind the same `include/game/combat_types.h` dependency, SHA-256
`DD2B627C22F084DB4F668D27E8DE3C3F3D8FDFC352F690034FE3E1A5655959D6`.
Use normal research intake for the exact source pair. Preserve authored line endings and the
source context when reusing it. Later loop candidates may supersede this local best without
invalidating the measured pair. The full thirteen-target supplement remains required.
