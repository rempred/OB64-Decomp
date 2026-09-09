# Supplement R3: scalar source contexts

Two complete source comparisons recover exact code without assembly. Each result
belongs to its measured function and source context; these are not general type rules.
Both final sources pass their canonical focused checks but await the complete
thirteen-target supplement verifier.

| Function / source | Authored SHA-256 | Bytes / frame | Differing bytes / words |
| --- | --- | --- | --- |
| 1088C halfword-offset | `B2E30D8ED68A023B05FC140902CF0F6FD3BB6475191602AA4572F5DDA4F1FE7E` | 164 / 24 | 39 / 11 |
| 1088C word-offset | `8DC5B5C543ABC9BEE2364C54409254D833FBEF7CCB1CE505D02D258C70375AA1` | 164 / 24 | 0 / 0 |
| 1088C final | `438DA2B41BCA3B48E0D784B6EB02F4B40DF1239389E4C6017CB165D6A83F6577` | 164 / 24 | 0 / 0 |
| 1062C initial | `061A538ACC885BB4DDF1364EDA2FB24BFE9F9DE229D8D204F593E797F18CF533` | 260 / 0 | 1 / 1 |
| 1062C unsigned | `3B95A32412D7B3CA179BC3710E36853E7235684CCF0FCFB4F9E113151C8D8AB2` | 260 / 0 | 0 / 0 |

All five inputs are mechanically PURE_C. The table's measurements come from private
one-owner comparisons; the two final production sources additionally have canonical
focused ownership, placement, relocation and byte evidence.

For `func_0021088C`, the nearest pair changes only the reused local offset from `u16`
to `u32`. All three memory loads remain unsigned halfword loads. Each loaded offset
is still added to the first block's base, with all pointer publication and helper
call order retained. The wider local recovers exact scheduling and allocation in
this context. The cleaned production version only adds an explanatory comment;
word-offset and final have identical expanded input
`D77A2DB2C6503C758E7FFDCDB4F02B4150E7924D31BA082360879D8E609526CF`.

The final 1088C focused report proves a sole 164-byte C contribution to `.ob64.r3949`,
no fallback or fill, all 18 relocation words and contract exact, and target hash
`F0ADF3EEB0184696DCE7BCEDFF8CA96F58F433FA7C9F49DA6983E6FD2CB823BA`.
Focused report SHA-256 is `0223DC5EC89D7C0B05CE79110CFCC8B847BE015E68C23BCE62A7CD4178ABE398`;
policy report is `0531B68BDF074804067C5F954D668F13C0481D099B3F3D5FDB8FAF448518DD0D`.

For `func_0021062C`, the initial signed switch differs at one comparison opcode:
`slti` instead of the retail `sltiu`. The final source explicitly converts the
switch selector to `u32` and expresses each index subtraction with full-width
unsigned operands. It preserves the public three-int interface, the four supported
selector cases and short-circuit byte tests. Since the pair also changes index
arithmetic, it is not an isolated selector-only experiment. The observed emitted
difference is one instruction; do not invent a separate measured effect for the
index conversion. Final expanded input is
`417022AF8ED9BDAFE764C59766251B2D9B46E148C4E029592C5C87BECE2E9A2B`.

The final 1062C focused check proves a sole 260-byte C contribution, no fallback or
fill, all 13 relocation words and contract exact, and target hash
`936FC7C5A999BF439C19AFF8627F32DE5136F5A51B54DE51CF1F7A7CA4254C06`.

Frozen sources, private results and canonical reports are under
`build/combat-discovery-supplement-r3/0021088C/` and `0021062C/`, using the table labels.
Normal research intake preserves the two counterexamples and final sources. These
records establish useful source observations, not completed-wave matching acceptance.
