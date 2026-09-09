# CBDC: cursor updates in the real mode branches

This pair preserves a useful intermediate in the PURE_C reconstruction of `func_0020CBDC`.
The complete surrounding sources differ only in placement of the slot-cursor increment:
`factor-read-order` increments after the conditional mode stores, whereas
`conditional-cursor-step` increments separately in both real mode arms. Each executed path
still advances the cursor once. Table-cursor and count updates remain common.

| Input | Authored SHA-256 | Expanded SHA-256 | Bytes / frame | Different bytes / words |
| --- | --- | --- | --- | --- |
| factor-read-order | `DAD0103CFA9E8F9C66F72D15749D29F9F74030364D9126A2B60CEB37319BADD7` | `BF4D40036463040C2F4B9F1ECA9CE39BEC899B925AB6C1F0C40F049B788B9092` | 2180 / 80 | 1309 / 411 |
| conditional-cursor-step | `F4B948AEAD9FF570E396A571E7C3CE20BE748A65CF46870D00A0C87E02C3F820` | `CAD71AD37236615D20A2B662A34C18E953D057A215D80F6387510C8B910D2494` | 2184 / 80 | 1346 / 412 |

These are private one-owner comparisons against 2136 retail bytes, not canonical ownership or
completed-wave acceptance. The first input has 80 candidate relocations; the second has 81.
Both are mechanically PURE_C. The second input is larger and has more differing bytes, but
removes the extra derived secondary-slot pointer and restores the retail s0 through s8 roles
in the counted constructor loop, including the constant 2 kept in s8. Its explicit mode jump,
frame and further instruction-layout differences remain unresolved at this boundary.

The source question came from a bounded read of the historical compiler's loop optimizer.
Its handling distinguishes the bare induction cursor from cursor-plus-offset address forms,
and its reduction cost includes induction updates. That code supplied the prediction that
duplicating the real update could change reduction profitability. The measured pair establishes
the output change in this source context. Without corresponding pass identities, it does not
prove the compiler's complete internal decision history or the retail source expression.

This is why a worse aggregate score need not end an experiment: the changed source recovers a
specific required allocation while retaining other work to do. Preserve the earlier best and
both complete inputs. A future experiment should refine the real mode fallthrough before
discarding the recovered cursor relationship. This is not a blanket rule to duplicate updates.

Evidence is under `build/combat-discovery-supplement-r3/0020CBDC/` in the two named directories
and their keyed `compiles/` entries. The respective `result.json` SHA-256 values are
`B5D80FD23F11A8950B154716AFD939E7B00A2FC9B905AF3363E3FBE19045ED19` and
`F332DE74E215CEB88753BBF7B193207159E10024B692F16C58E943760F2C7120`.
Compiler assembly SHA-256 values are respectively
`2E4903045F250B23967ACFF1461511A565F4BDCA3E7902E97B4BE94DF3E8E3BF` and
`50C2A3A844BD240AC42C1CC15327B54420032F462D5CBBB3B4CFAEA1E668AF69`.
The complete thirteen-target supplement and all final verification gates remain required.
