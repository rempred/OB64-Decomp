# CB28 retained tail tracing r1

Completed: the first retained scheduling pass moves the type0 format2/3 line/F5 calculation late. The later jump2 pass first merges the longer suffix. These are distinct transformations. The preserved diagnostic assembly agrees with production instructions, so the retained trace applies to this frozen candidate. The matcher can evaluate the single bounded representation discriminator below; no source change or matching acceptance occurred here.

## Identity and diagnostic comparability

Launch COMBAT-DRAW-CB28-TAIL-PREPARATION-20260907-01; receiver /root/boot_conversion_preparation; Director /root, native01a07262-aeca-7341-ad10-2dba705ff988; local. Fresh atomic claim records activation8b0b5e37556a2b1915dcd71fd5ca45b58f281d3c. Coordination baseline is f8f89c852142e2007b57ddd918deb8541ed5c631; accepted source remains W7 at469a1416918592749d61dc34e3e079796f7b673c.

All four explicitly bound C/assembly hashes matched the prompt before pass analysis. The diagnostic command and every supplied dump also received exact identities in input-identities.json. Required unchanged guides and the frozen final-pair note were reused. Its report hash6E11AF009B782B30D538A4FB8E3C2D146EF7E6963987FD3EE695829EDB18DBA8 and original ASM hashDF406460F26C06817519F5C2EB572298C6D8BE1154DC3EDD45DC3FD1CEE6C7B7 matched.

The production source contains M2C_FIELD calls; the diagnostic source expands that literal macro and removes blank lines. A bounded textual expansion, ignoring whitespace, gives equality. This was an offline text operation, not compiler preprocessing. Full differences are retained in comparison-c.txt.

The two assembly files differ only in the .file path and the comment listing -da. Removing filename/comment lines gives identical remaining assembly text, SHA2568AC9C4D201A5650D07C8074FD85CF224EBF7891B9B3D5C1B7A7282FF2C88212E. Full differences are in comparison-s.txt. This establishes comparability of these frozen outputs, not a general guarantee that diagnostic flags never affect compilation.

The diagnostic command records KMC cc1, O2, big-endian MIPS3, gp32/fp32, G0, no PIC/abicalls/builtin, unsigned char and -da. Its recorded status is0. No compiler was invoked in this task.

## Retail and candidate starting distinction

| Observation | Address or identity | Evidence role |
|---|---|---|
| Retail type0/format2 line calculation | ROM001FCBBC..001FCBD0 | Computes masked line before flag packing |
| Retail format2 F5 prefix/OR | ROM001FCC3C..001FCC40 | Forms retained line/F5 value after cursor+16 |
| Retail type0/format3 line calculation | ROM001FCD38..001FCD4C | Same early line shape |
| Retail format3 F5 prefix/OR | ROM001FCDB8..001FCDBC | Forms retained line/F5 value |
| Retail shared final store | ROM001FD554 | Stores v1 at command+0x34 |
| Candidate shared suffix | diagnostic label .L26 / RTL label1459 | Starts with line OR prefix, followed by multiple calculations/stores |

The matcher description is substantially supported, with one refinement: retail computes the line field early, but adds the F5 prefix later. It does not compute the entire F5 word before the initial flag packing. The original type0 paths separately store their +8 and +0x28 words near their tails, then jump to the common final +0x34 store.

The frozen candidate source instead expresses the entire line/F5 word together after the cursor+16 store. Thus source expansion already differs from retail's split lifetime before any retained optimizer pass. The pass analysis below concerns the subsequent additional sinking and sharing, not the original provenance of every retail/candidate difference.

## First retained changes

Instruction UIDs are retained dump identifiers, not ROM addresses. The two formats use parallel UID groups:

| Role | Format2 UIDs | Format3 UIDs |
|---|---|---|
| Cursor+16 store | 102 | 287 |
| Line calculation chain | 105,108,110,111,112,113 | 290,293,295,296,297,298 |
| F5 constant | 115 | 300 |
| Line OR F5 value | 116, pseudo97 | 301, pseudo172 |
| Command+4 store | 119 | 304 |
| Command+0x2C store | 189 | 374 |
| Cursor+56 store | 194 | 379 |
| F5 stores at+8 /+0x28 | 199 /215 | 384 /400 |
| Final+0x34 store | 225 | 410 |
| Exit jump | 227 | 412 |

From .rtl through .jump, .cse, .loop, .cse2, .flow and .combine, the line/F5 chain remains between cursor+16 and command+4. Both format tails are still separate. CSE simplifies copies and combine changes instruction expressions, but neither creates the late chain or shared suffix at issue.

In .sched, the chain first appears after command+0x2C and cursor+56. For format2, ordering changes from102,105..116,119,...189,194 to102,119,...189,194,105..116. Format3 similarly moves290..301 after379. This shortens the computed F5 value's lifetime and keeps its source operands live longer. The pattern survives .lreg and .greg. This is the earliest retained transition supporting the requested lifetime finding.

The .sched2 output rearranges the remaining tail stores/calculations but still retains both ORs and both full tails. Format2 still has116,199,215,...225,227; format3 still has301,384,400,...410,412. Therefore the longer sharing is not already established by scheduling or register allocation alone.

In .jump2, format2 retains its line chain and constant115, then jump227 targets label1459. Format3 likewise retains its chain and constant300, then jump412 targets1459. Their separate ORs116/301 and duplicated tail stores are gone. Label1459 begins with UID1296, the shared line OR prefix. Its following instructions calculate endpoint fields and perform stores+8,+0x28,+0x14,+0x1C,+0x24,+0x30,+0x34. The shared tail comes from another retained format path; it is not a new external helper.

The .dbr pass moves each path-specific F5 constant into its jump delay slot. The emitted .L26 suffix matches the jump2 sharing. This is later delay-slot filling, not the first lifetime or sharing change.

pass-trace.json preserves selected blocks and their order across all thirteen dumps. Missing selected UIDs in .dbr do not imply missing operations: nested sequence instructions require reading their containing jump block. The full authenticated dump remains the authority.

## One bounded discriminator

Evaluate only a split line-field/F5-word lifetime representation for these two type0 branches. Express the masked, shifted line field as an early scalar before flag packing. Add the path-specific F5 prefix at the later cursor+16 point, retaining existing command-store order. This mirrors retail's two-stage value lifetime instead of the candidate's single later expression. It does not require volatile accesses, barriers, register bindings or invented operations.

Prediction: a useful result keeps the line-only value earlier in the first scheduled output and reduces the portion eligible for the later common suffix. Falsifier: .sched sinks the same chain after cursor+56 and .jump2 again joins at the line OR. If that happens, the split spelling alone is not a discriminator for this compiler state. The matcher should not repeat equivalent spellings solely on this note's authority.

This is a supported experiment boundary, not proof that the spelling will change allocation or match retail. Moving a pure expression earlier in source does not force machine scheduling. The retained dumps establish transformation order, but do not prove the scheduler's internal priority cause. No single variable declaration can be claimed to disable tail merging from this evidence alone.

## Limits and release

This result applies only to the supplied frozen explicit-paths candidate and retained command. It establishes no reusable compiler/tooling fact, semantic acceptance, source class or matching result. No mutable W8 candidate, other experiment, Resolver file or generated production state was inspected. The full fourteen-target W8 and its single final complete-wave verifier remain required; no review gate is added.

| Output | SHA256 |
|---|---|
| input-identities.json | 59E951015DE6FDB7B186B28A6987EAEF32890F2174A2FF4B84A2A6EAC26AF345 |
| pass-trace.json | C26B848BF8DFFB49E68BAE1B64EB98B0DBF1DB55516CE46EB4C293CF3A60FD9E |

Ignored output root is build/combat-draw-cb28-tail-preparation-r1/. It contains input identities, comparison text, selected pass evidence, equivalence evidence and three offline parsing scripts. Each retained dump's exact hash is recorded individually. Reproduction uses inspect.py, trace.py and equivalence.py with python -B; none invokes a compiler.

One wildcard rg path was rejected by Windows; an explicit directory/glob search replaced it. No compiler/source experiment was attempted. Only the fresh claim, report and ignored output root were written. No C candidate, production/shared-tool edit, compiler/link/build/verifier/source-policy operation, runtime/GUI/bridge/database action, agent or Git mutation occurred.

All commands have finished. The Director receives this bounded finding and the sole W8 writer owns any source experiment. All assigned writes are released to /root at terminal handoff.
