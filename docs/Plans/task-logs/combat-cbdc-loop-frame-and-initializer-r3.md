# CBDC: loop frame and initializer contexts

The complete `func_0020CBDC` reconstruction now has a canonical focused PURE_C exact result.
The useful path included a worse intermediate that recovered the frame, a compiler-dump
comparison explaining its unused allocation, and a loop-specific initializer boundary.
No padding, assembler mechanism, compiler change or structural exception was introduced.

| Preserved input | Authored SHA-256 | Bytes / frame | Different bytes / words |
| --- | --- | --- | --- |
| lf-boundary | `C1A1C2FE82C95D9AA234D6A165F268F215155B8BB7C1D9A7B674D78F9A879A57` | 2136 / 80 | 93 / 62 |
| conditional-step-while | `53650FEC901E880F0064E456289E2EADD1C435379646D6A5B669F5ED5B16A0A9` | 2132 / 88 | 1308 / 424 |
| loop-first-callback-parameter | `FAE349923B7E0F4032D9ABB19A7CCCEDC985FA76B57843EB21CD715AC5A89269` | 2136 / 88 | 2 / 2 |
| final-clean | `0D0F25C035C238F7A7D43DA1837A1496E925ECAF385B283299D4748A2C05CE57` | 2136 / 88 | 0 / 0 |

All four inputs are mechanically PURE_C and have 80 candidate relocations. Table measurements
come from their private one-owner links; final-clean also passes the canonical focused check.

The first pair changes an explicitly guarded do-loop into a while-loop. The while input
matches every retail stack-access offset, including outputs at 18/1C, mode at 24 and saved
registers at 30..57, without adding local memory traffic. It instead fills an originally empty
branch delay slot with cursor setup and hoists table setup before the count call. That filled
slot accounts for its four-byte shortage; it does not omit constructor work.

The accepted probe pair has complete pinned-output agreement after normalizing only the file
directive and requested diagnostic-option comments. In the while input, jump's copied entry
comparison uses SI pseudo398. Combine eliminates that comparison but retains a non-emitting
USE398. Global allocation gives it an unused home at sp+2C; the existing eight-byte allocation
alignment accounts for the additional frame space. The guarded input lacks that home. This
is evidence about these source/compiler inputs, not proof of the retail source or a reason to
invent a padding array. Probe records and agreement are under the R3 CBDC evidence directory;
the exact probe IDs are `D8C5B71A485BB054D76F06F75A0A3C6D30BBE283A8A4795304BF6DF85BDB8CF9`
and `21A14343D8AE5A0EF036E15B5C2E02231FE3DAAEF0EEE9BB6D8A82A5D9AF16D3`.

Two connected source changes recover the rest of the structure. Replacing the constant-false
macro loops with ordinary blocks changes retained loop notes and allocation weighting;
all call sites remain standalone within existing braced arms, with no break, continue or
dangling-else change. This fixes the nonloop allocation in the measured context. Shared
loop-local indexed slot and table pointers then retain one induction pointer per array and
the useful copied entry test while recovering the correct setup and extent. The intermediate
`AA1BF7456419FC5F6462D53ACB0E186B425D6C4F0989A5446D243EB62AED7395` has 21 differing bytes in
ten words. These are supported steps through different source contexts, not general macro or
pointer-style rules.

The final pair addresses the counted initializer. Keeping the primary callback as an inline
parameter while assigning the secondary callback directly leaves only the 255 constant and
its halfword store using t0 instead of v1 at offsets 24C/250. Making that existing constant
local to the loop helper recovers both words. The cleaned exact source also normalizes LF,
indentation and explanatory comments; it preserves all original calls, memory widths and
store order. Its expanded input is `AEEFFEBE6DE6E1D038015ED84ABCE026559A9875188C2383BD4C6F99F2CC9DC3`.

Canonical final-clean is PURE_C and EXACT: sole 2136-byte C contribution to `.ob64.r3908`,
accepted placement, no original-ASM fallback or fill, matching actual relocation contract and
all 80 relocated words, and zero differing target bytes. Linked and expected SHA-256 are
`01FC951CC281DA8992F097F26DB8C3A76B9549B0B669189357D4146A88B1417C`.
The full thirteen-target supplement verifier remains pending; this is provisional.

Frozen evidence is under `build/combat-discovery-supplement-r3/0020CBDC/`, in the four named
directories and the probe records. Final focused-report SHA-256 is
`FA548CE8B8E4AB12EACA6719425954A90F750F133D6266BAD7D3E994A8BB68DC`; final policy-report
SHA-256 is `D41D574D2DEBC94945B1D22B416A9E5BB551E450037D9ABA4B350730751C84EF`.
Normal research intake preserves the exact source contexts and comparisons. Earlier null-helper
and cursor-step pairs remain available without rewriting their historical observations.
