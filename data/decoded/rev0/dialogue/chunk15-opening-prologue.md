# Ogre Battle 64 opening-prologue narration — decoded strings

- Source owner: `asm/original/rev0/lib/rodata_001006f0.s` (raw bytes preserved; this is a companion decode).
- ROM range (z64): `0x001006F0..0x00100E20` (1840 bytes).
- Encoding: ASCII, NUL-terminated, big-endian (z64) byte order; @-prefixed inline control codes left verbatim.
- Strings: 16.
- `@` control codes seen: `@0`×29, `@1`×31, `@w`×16, `@e`×16, `@2`×23, `@3`×21, `@c`×13, `@l`×14.
- Control-code semantics: **UNRESOLVED — @0..@3/@w/@c/@e are inline formatting/control codes; exact runtime meaning not decoded**.
- Confidence: high (printable ASCII text); control-code semantics hypothesis-grade.

Printable ASCII is shown verbatim; `\xHH` = a non-printable byte; NUL terminators/padding are listed as `<NUL×n>`. No control code has been removed or normalized.

| ROM offset | bytes | decoded text (verbatim) |
|---|---:|---|
| `0x001006F0` | 27 | @0Palatinean Year 238@1@w@e |
| `0x0010070B` | 1 | `<NUL×1>` |
| `0x0010070C` | 176 | @0The Holy Lodis Empire, located on the@1@2western region of the continent of Galicia,@3@w@c@0dispatched the Brigade of Radiant Cross@1@2against the neighboring countries@3@l@e |
| `0x001007BC` | 4 | `<NUL×4>` |
| `0x001007C0` | 53 | @0that rejected the teachings of@1@2Lord Lodis.@3@l@e |
| `0x001007F5` | 3 | `<NUL×3>` |
| `0x001007F8` | 121 | @0The purge and conversion of "cults"@1@2by force@1@w@c@0have reached Nirdam,@1@2the kingdom adjacent to Palatinus.@3@l@e |
| `0x00100871` | 3 | `<NUL×3>` |
| `0x00100874` | 102 | @0The noble king of Nirdam declared war@1@2against Lodis,@3@w@c@0but was defeated within a year.@1@l@e |
| `0x001008DA` | 2 | `<NUL×2>` |
| `0x001008DC` | 110 | @0After the fall of Nirdam, Lodis Empire@1@2has selected@1@w@c@0kingdom of Palatinus as the next target.@1@l@e |
| `0x0010094A` | 2 | `<NUL×2>` |
| `0x0010094C` | 119 | @0Having witnessed the formidable@1@2strength of Lodis,@3@w@c@0King Procus surrendered without@1@2much resistance@3@l@e |
| `0x001009C3` | 1 | `<NUL×1>` |
| `0x001009C4` | 56 | @0and signed the peace treaty offered@1@2by Lodis.@3@w@e |
| `0x001009FC` | 4 | `<NUL×4>` |
| `0x00100A00` | 173 | @0While forced to convert religion,@1@2introduce class system and pledge@3@w@c@0loyalty to Lodis Empire,@1@w@c@0Procus was granted to keep his position@1@2as the king.@3@l@e |
| `0x00100AAD` | 3 | `<NUL×3>` |
| `0x00100AB0` | 118 | @0Although supervised by the Triumvirate@1@2sent from Lodis, Palatinus@3@w@c@0was able to maintain its autonomy.@1@l@e |
| `0x00100B26` | 2 | `<NUL×2>` |
| `0x00100B28` | 117 | @0Six months later,@1@2Lodis ordered the subjugation of@3@w@c@0the uncivilized Southern Region@1@2of Palatinus.@3@l@e |
| `0x00100B9D` | 3 | `<NUL×3>` |
| `0x00100BA0` | 135 | @0The lower class, including the Bolmaukans,@1@2were forced into labor.@3@w@c@0People of the Eastern Region@1@2who worship Berthe@3@l@e |
| `0x00100C27` | 1 | `<NUL×1>` |
| `0x00100C28` | 147 | @0and the lower class joined forces to@1@2oppose the oppression,@3@w@c@0but were unable to overcome the power@1@2of the king backed by Lodis.@3@l@e |
| `0x00100CBB` | 1 | `<NUL×1>` |
| `0x00100CBC` | 147 | @0Taking the matter seriously,@1@2the Triumvirate of Lodis deprived@3@w@c@0the lower class of much rights,@1@2while rewarding the upper class@3@l@e |
| `0x00100D4F` | 1 | `<NUL×1>` |
| `0x00100D50` | 98 | @0with previleges to ensure their status...@1@w@2the inane status as the puppets of Lodis...@3@l@e |
| `0x00100DB2` | 2 | `<NUL×2>` |
| `0x00100DB4` | 106 | @0It required ten years for a streak of@1@2light to shine through the dark,@3@w@c@0ominous clouds...@1@l@e |
| `0x00100E1E` | 2 | `<NUL×2>` |
