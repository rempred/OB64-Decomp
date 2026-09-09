# D590: success exit and retry increment

The two complete PURE_C sources use the same accepted four-int CombatPoseBounds
structure-return interface and metadata-helper ABI. They differ only in retry-loop
control flow. The loop remains unbounded until the helper's low return byte equals
one; no output initialization, error branch or input narrowing is introduced.

| Source | Authored SHA-256 | Bytes / frame | Differing bytes / words |
| --- | --- | --- | --- |
| do-loop-abi | `3DC4854463313FA8CD6966490100BBF998684C43E9F942110F379F06E137625C` | 200 / 88 | 63 / 20 |
| break-loop | `991935A92784B9989F7857FF21306D58C0CE74D571E9B48EF3F5AFB246DCB4C1` | 196 / 88 | 0 / 0 |

In the do-loop source, the index increments after every call before the exit test.
That index is unused after success, allowing the compiler to schedule its increment
in the call delay slot. The final source breaks on success before incrementing the
index on the retry path. This retains all calls and their arguments while recovering
the retail backedge scheduling and complete 196-byte extent. The result concerns
this source context; it does not establish that one loop spelling is generally better.

Both inputs have three actual relocations. The final expanded input is
`63C3BDEE1D31E84A2EF354D6A7387684B154B397756AA0B2A22CE00D8B85C2A0`.
Its canonical focused check proves PURE_C, sole C ownership, accepted placement,
no fallback or fill, all three relocated words and contract exact, and target SHA-256
`38270A9B760CBE658A0AF98D94D8DFF3FEC5FB70BAF3260F766F696DEFD91BAA`.
Focused report SHA-256 is `6062F8C5C3BD36ED8C90EBC670F0635460BC61FB00DD318C7837D5ECD541FE14`;
policy report is `42E3F054405F7CE7477932C5374F0B287D664E4F0F2628C60B7339958034B0F6`.
Sources and reports remain under `build/combat-discovery-supplement-r3/0020D590/`.

The source pair is available through normal research intake. This is a provisional
focused match; the complete thirteen-target supplement verifier remains pending.
