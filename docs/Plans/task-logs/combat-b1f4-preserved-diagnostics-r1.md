# B1F4 preserved event-time diagnostics R1

Completed. E16 first loses the second event-time recomputation between its jump and first CSE dumps.
The reused sum already crosses event 8 before register allocation.
E04's final assembly has the same retention, but its responsible pass remains unknown because source-matched dumps were absent in the bounded surfaces.
The Director can route a diagnostic-only E04 RTL/jump/CSE capture after production ownership permits it.
No source recipe, compiler defect or acceptance is established.

## Scope and authentication

Task combat-b1f4-preserved-diagnostics, revision 1, launch COMBAT-B1F4-PRESERVED-DIAGNOSTICS-20260907-01.
Receiver /root/boot_conversion_preparation; Director /root, native 01a07262-aeca-7341-ad10-2dba705ff988; local.
Starting main: 10d6eb3980111cf122c46a577cf15f124b615412.
Accepted source baseline remains 0e1191013aeebed2929c9caff7c1f139169ad7f3.
The complete fresh claim was created atomically and read back before evidence writes.
W7 production and disjoint review records were inventoried and preserved; provisional production files were not research inputs.

The frozen preparation report and input manifest match their assigned SHA-256 values:
26C6BAE4FFAC8FDAB6FE5982FAFD92EE3C9A97BAE8E3DF29D955D79ADB1035CB and
787FF01F9B50FBA493B189FFF9FB139F16629DDD59824FF49C9C56A9634F2288.
Governing canonical/parent rules and Worker-workflow were read in this continuing worker context.
Current assignment and frozen preparation define the evidence boundary.

## Candidate-specific result

P04 is probe 93A46B0D3C89F37023582D452B8DEEAC22AB66883F37AAE4ADA2C9827923C108.
Its identity.sourceText hashes to E16's BDD3B1A20DF1B8F7D2219775F665C93A4318238B00D09EE391F882C4965D6B18.
E04 source is 25C2B19614E7C99A026750897005399A09B71796C2652FFB338530C10AAB64ED.
These are different inputs; E16 pseudo and instruction IDs below apply only to P04.

The relevant E16 source makes two separately written left-associated expressions:
event 8 receives temp_s6_230 + var_s8_30 + sp9C;
event 9 receives that expression followed by + spA4.
E04 additionally names tailTime before code selection, while still writing event 9's expression separately.
Neither source requests that event 8 modify these automatic scalar values.

| E16 stage | Preserved observation |
|---|---|
| RTL | UID 2177 sets pseudo 415 = 122 + 144; UID 2179 sets 416 = 415 + 84. UID 2185 passes 416 to event 8. |
| RTL, after call UID 2191 | UID 2194 sets 417 = 122 + 144; UID 2196 sets 418 = 417 + 84; UID 2198 sets 419 = 418 + 85. |
| Jump | Both post-call additions 2194 and 2196 remain, with the same inputs. |
| First CSE | 2194 and 2196 disappear; UID 2198 instead sets 419 = 416 + 85. Event 8's pre-call sum is reused directly. |
| Flow | Pseudo 416 is reported used three times across eight instructions and crossing one call. |
| Global allocation | The retained sum occupies s0. A compiler spill load from stack decimal 156 supplies sp9C before event 8. |
| Final assembly | Event 8 passes s0; event 9 adds the stack-decimal-164 duration to s0. It does not reconstruct the base sum. |

CSE means common-subexpression elimination.
The earliest supported boundary is jump output to first CSE output.
The dumps do not expose the exact internal CSE routine or cost decision.
The result falsifies an allocation-only or final-scheduling-only origin for E16's reuse.
Allocation later chooses storage for a lifetime already present in the first CSE output.

The post-call source expression was genuinely expanded separately in E16 RTL.
Thus this is not merely a source alias whose only definition already occurs before the call.
UID 2191 remains an ordinary call to func_0021D25C with its argument-register uses.
The shared arithmetic inputs are automatic scalar pseudos, not fresh owner-memory reads in that tail.
There is no intervening definition of those inputs in the shown sequence.
Later stack loads arise from compiler spill handling; they do not prove an original source object must be volatile.

The source previously assigns spA4 from func_002223E0.
Other components come from earlier local computations or reads, before this two-event sequence.
The call receives arg0, so it could affect pointed-to state; no hidden effect on the independent automatic scalars is established.
This evidence supports explaining the optimization's availability, not assuming arbitrary calls are side-effect-free.
No alias, nonalias, signed-overflow domain or original-source declaration is inferred.

## Retail and E04 limits

The original complete owner at z64 [0x0022B1F4,0x0022BFF8) is 3,588 bytes.
Accepted loaded entry is RAM 0x801E7F24 under resource-loader-0022a280.
Original split PC comments are not placement authority.

Retail computes the event-8 time before the code-selection branch at ROM 0x0022BF08..0x0022BF20.
After event 8, ROM 0x0022BF40 recomputes s6 + s8.
ROM 0x0022BF44 and 0x0022BF48 reload stack 0x9C and 0xA4.
ROM 0x0022BF58 and the event-9 delay slot at 0x0022BF60 add those components.
This establishes emitted recomputation, not why retail's source/compiler retained it.

E04's candidate.compiler.s shows the first sum before its branch, retained in s0.
After event 8 it reloads only the duration component and adds it to s0.
This is a final-output fact, not proof that E04's first CSE made the same transformation.
The frozen fourteen changed words at relative 0xD08..0xD40 compare E04 with E16, not with retail.

## Bounded absence and precise missing artifact

Searched only:
- ../high-attack-wave-5/build/matching/runs/FCF102FE514D73F54E8864EC937275388742347221848819B0310EB7CCA812D2/;
- ../high-attack-wave-5/build/matching/targets/func_0022B1F4/probes/, including the three existing probe-report identities and file lists.

The E04 run contains candidate.compiler.s, candidate.input.c, candidate.o, candidate.s and workbench-report.json.
It contains no pass dumps.
The three probe sourceText hashes are:
- 8BA2C928... -> 6AA5BD7D58B00CBD6948714F7822C3700EF2744919E23AA71DD074885F189F8E;
- 93A46B0D... -> BDD3B1A20DF1B8F7D2219775F665C93A4318238B00D09EE391F882C4965D6B18;
- B879FC8F... -> 8E1348C7A2CA8B4653B22FF7A011DEA70EE0027F4758FC1318A8346DAD4B0B0F.

None binds E04. This is a path-bounded absence, not a claim that no E04 dump exists anywhere.
The exact missing minimum is E04-authenticated RTL, jump and first-CSE output plus source/compiler/flag identities and unchanged final-assembly parity.
No new dumps were generated.

Next narrow experiment, for later authorization:
capture those three E04 stages with the authenticated unchanged compiler and source.
Require final assembly to reproduce the preserved run except allowed diagnostic provenance.
If E04 has separate post-call sums through jump and reuses tailTime by first CSE, the same stage is implicated.
If reuse already exists in RTL, that falsifies transfer of E16's stage result.
If separate sums survive first CSE, inspect only the next retained stages until the first reuse appears.
Only then choose one source experiment with a predicted stage-specific effect.
Do not repeat carrier spellings, duplicate-branch recipes or unsigned-negation identities without such discrimination.

For E16, a future anti-retention hypothesis must show post-call recomputation surviving first CSE.
Changing only the chosen saved register while reusing pseudo 416 does not address this origin.
A source variant that adds memory accesses, changes call arguments or introduces unrelated prefix drift fails the proposed isolation.
No legal source fix is established by these observations.

## Frame allocation remains separate

Preserve P04's twelve directly occupied spill slots:
140, 148, 156, 164, 172, 180, 191, 199, 207, 215, 220 and 228 decimal.
Four are byte accesses.
The retained candidate frame is 272 bytes; retail is 280.
Retail has no direct access at 0xE8 or 0xEC and begins saved registers at 0xF0; candidate saves begin at 0xE8.
No omitted accessed local follows from that gap.
The first-CSE reuse result does not explain the extra eight frame bytes.
A frame hypothesis still needs an actual allocation event or eliminated-object provenance.
No filler, invalid access or invented local is authorized.

## Evidence package and terminal limits

Owned ignored package: build/combat-b1f4-preserved-diagnostics-r1/.
evidence.json records every P04 file and E04 run artifact's absolute path, length and SHA-256, plus the bounded probe inventory.
SHA-256: D24479CEC72756316CD94DC98BEA0D372D1BA346075F49ABC56F2CF6CCCDB066.
event-time-pass-extracts.txt retains the identified event-time instructions across RTL, jump, CSE, CSE2, combine, schedule1, local/global allocation, schedule2 and delay slots.
SHA-256: 35EAF1C1397F3B1A502D709AD87CB11B6C1F514C76906790987EC474392AD364.
The extraction is an offline text selection, not a compiler invocation or substitute verifier.

Evidence grade: supported candidate-specific stage distinction; new causal interpretation remains review pending.
No compiler authentication or fresh ROM measurement occurred.
No current source classification, match, semantic name or structural approval is claimed.
Only claim, report and ignored offline evidence were written.
No candidate C, production edits, compilation, linked diff, build, verifier, source-policy generator, runtime/GUI/bridge/database operation, agent or Git mutation occurred.

Keep the complete seventeen-member shared action-mode wave and preceding/later dependencies from the frozen preparation.
The complete B1F4 owner remains mandatory; this tail is not a replacement wave.
The eight-byte frame question remains open independently.
All owned writes are released to /root at terminal handoff. No command remains running.
