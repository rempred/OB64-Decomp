# Complete resource-probe record copy/flag wave

VioletMouse, Sol6.1 Extra High, chat01a113a4-5ca1-78d1-acb9-af4184132170;
Director SilentCrane. This original complete assignment has THREE independent
physical owners/C producers and FIVE preserved entries, 528 bytes total.

| Canonical producer | ROM interval | RAM interval | Bytes | Preserved original entries |
| --- | --- | --- | ---: | --- |
| boot_resource_probe_small_record_copy_flag | 5CFC..5D9C | 800758FC..8007599C | 160 | func_00005CFC, func_00005D04 at+8 |
| boot_resource_probe_large_record_copy_flag | 5C58..5CFC | 80075858..800758FC | 164 | func_00005C58, func_00005C60 at+8 |
| boot_resource_probe_indexed_record_copy_flag | 5B8C..5C58 | 8007578C..80075858 | 204 | func_00005B8C |

## Coverage and ABI correction

Manifest/workbench canonical keys are the descriptive producer names above.
Current intake returned no previous candidates for each. All three full original
ASMs, dossiers, accepted dispatch source, materializers, globals and retained
copy/fill ABI were reconciled before tuning. The small and large +8 labels mark
the stack adjustment after the real global-load prefix, inside their complete
single compiler function. No prefix owner, boundary, combined group or reduced
acceptance wave is introduced.

The June [small](../../dossiers/boot-resource-probe-small-record-copy-flag.md),
[large](../../dossiers/boot-resource-probe-large-record-copy-flag.md) and
[indexed](../../dossiers/boot-resource-probe-indexed-record-copy-flag.md) dossiers
reverse the copy direction. [Original memcpy.s](../../../asm/original/rev0/lib/memcpy.s)
loads from a0 and stores through a1 at ROM234BC/234C4; the accepted
[dispatch result builder](../../../src/boot/boot_resource_probe_dispatch_result_build.c)
uses that source-first ABI. All three copy/flag originals preserve the caller
pointer for a0, load the shared buffer for a1, then pass the observed size in a2.
They copy caller data INTO the shared buffer. Indexed destination is
buffer+id*1850+10, length1850; large is buffer+30B0,length4AE8;
small is buffer,length10. This correction supersedes the historical direction
without rewriting the original evidence. It establishes no persistent-storage,
save, dirty/valid, runtime-safety or stronger record-meaning claim.

Each helper allocates8000 bytes when the pointer is null, invokes the retained
RAM8008A0F0 service for100-byte chunks, performs its source-first copy, and stores
byte1 at D_800A83BC. Straight structured C and direct globals generated the
matching nonrelocation instruction shape on the first trial. No compiler
workaround, failed source pair or counterexample was needed or invented.

## Private evidence and protected inputs

The three first watches were mechanically PURE_C and emitted exactly160/164/204
bytes, one GLOBAL native compiler function each, frames32/32/40 and13 actual
relocations each. Prefixes, branches, delay slots and complete tails were covered.
Raw relocation-masked equality passed. Raw byte equality did not, and linked
diagnostics were unavailable for inactive ASM owners. Those private results are
diagnostic evidence only. Source/run/object census remains under ignored
build/matching/probe-copy-20261006. Supported import/preserve publishes the complete
[small source](../../dossiers/boot_resource_probe_small_record_copy_flag-0eb44aba30.md),
[large source](../../dossiers/boot_resource_probe_large_record_copy_flag-63b9cea682.md) and
[indexed source](../../dossiers/boot_resource_probe_indexed_record_copy_flag-e14115f07b.md)
observations. Authenticated source/reference closure is distinct from authored
measurement claims; the archived import route does not claim compiler acceptance.

Original ASMs, accepted resource_alloc, retained fill/copy, accepted dispatch
bindings, materializers539C/553C and original BSS pointer/flag storage are protected.
The original five-family program and excluded descriptor4894..4AC8,
validator18D4..1A44 and checksum5D9C..5FC0 structural leads remain unchanged.
This trio does not call the checksum entries. No shared tooling/compiler/linker
rule, source-policy exception, external decomp source, Editor, Resolver, emulator,
live capture, modified-ROM, branch/worktree or push is involved.

Startup1543 and actual watcher delivery1544/confirmation1546 establish the worker's
own verified identity and mail routing. Complete private readiness with actual
own native/store drain was sent1549; the worker held further checks for the
Director's shared-input integration release1552 after LavenderSpire's actual
native/store drain1551. Director1554 subsequently confirmed GoldOx was available
again; no source blocker or advisory/tooling escalation was needed.

## Canonical acceptance

All three canonical focused diffs passed PURE_C, exact decoded/raw linked bytes
and MATCH relocation contracts. Actual object/link evidence supplies39 real
relocations across the three complete independent producers. Existing5B8C/5CFC
bindings remain; six required global/callee/existing-entry bindings were added
under the unchanged registry. Both+8 aliases remain absolute entries inside their
complete compiler function. No new export/layout rule is used.

ONE normal node tools/verify.js --profile exited0 for the combined original
wave at `2026-10-07T00:51:08.944Z` (October6 local), wall2152.887 seconds.
Every assigned target is PURE_C in the final authoritative source-policy and
independent fresh-compilation reports. Sole C ownership, exact placement,
actual relocations, complete target bytes, fresh source-to-object identity and
complete41943040-byte ROM equality all passed. No preceding build,
per-function full-ROM verifier, ordinary independent review or unchanged proof
repeat was used.

Final native/link evidence retains one full GLOBAL compiler function and one C
map contribution per owner, with zero fill and zero original-ASM fallback.
All five original entry aliases resolve exactly as GLOBAL absolute symbols in
the real final ELF, including5C60=80075860 and5D04=80075904. Saved best,
canonical source, final policy and fresh compilation source hashes agree.
All protected input hashes match their pre-integration values.

| Actual proof | SHA256 / identity |
| --- | --- |
| Accepted CURRENT | `AB95BA2DEA2CB4EAB0268CED12903C5869E3435065ABD954721C647FC597A90D` |
| Unchanged baseline | `F1D9FEF423CFE385A84F9CFA92C47CA46A45A2AC48E39332C3305ACE9B2409C6` |
| Complete canonical ROM | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Verification report | `4237AF2C177169CFD91864F6FF656F8E4F139EE54ECDBE6AC8865DE924633761` |
| Independent fresh-compilation report | `5FA8D059D5BE4DF9F7F70AD41CFDAF3F41A0F7064EF2E85AA81F4E36B54EF206` |
| Final source-policy report | `2F3B5DA9B30CC424646B0CEF6E4BEB654823A25D944DB0CEADB155E5F82697A2` |

Exact state/reports, bounded source/owner/function/entry census and protected-input
confirmation are retained under ignored build/matching/probe-copy-20261006/
copy-final-*.json; CLI copy-verify.log.
All own native/CPP/diff/verify/import/preserve/store/guard jobs exited before the
complete-wave proof handoff1557. Director1558 confirmed the actual reports and
entry/owner census, released the independent animation worker's native checks,
and approved the completed writer's release after the scoped local commit.

## Continuation

The entire original assignment is accepted. Close only the scoped local
source/evidence commit, obtain the Director's completed-wave ownership release,
then stop only the verified own watcher and preserve its state. No self-assigned
next wave or unchanged verifier repeat. All parked original five-family obligations
and excluded structural leads remain under the [queue](../../NEXT_STEPS.md),
[program](../sequential-main-program.md) and [family scope](../sequential-family-scope.md).
