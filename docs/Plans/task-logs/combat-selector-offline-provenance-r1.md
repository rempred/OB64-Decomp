# Combat selector offline provenance r1

Completed: this bounded offline triage found no qualified selector consumer or discriminating follow-up experiment in the inspected leads. The consumer-provenance gate remains open. The Director can retain the current gate and route a later qualified observation. Findings below are review pending.

## Scope and identities

Launch: COMBAT-SELECTOR-OFFLINE-PROVENANCE-20260907-01. Worker: /root/combat_discovery, Astra Medium. Director: /root, native 01a07262-aeca-7341-ad10-2dba705ff988, local.
The fresh claim was created atomically at 2026-09-07T04:48:10.8647735Z before evidence writes.
Accepted source baseline: d70fd853fdffacf71290b24763e010a549276a55. No W6 provisional source was used.

The accepted discovery R2 subject is 1f68aa001c612e2a7ce160e0cdf1d83a0c8b2048. Its independent review explicitly retains this selector gate.
Current input hashes, including that report and review, are recorded in build/combat-selector-offline-provenance-r1/input-evidence.json.
The checker verifies all 671 words in fourteen inspected original owners against the authenticated normalized Rev 0 ROM.
It also compares those owners with the accepted baseline, allowing only CRLF/LF normalization.
Normalized ROM SHA-256: 571e83396bc81e70da4c0a20313d82dbd7dfe685f2c37418c8e27f927e2cc67a.
Original split assembly RAM comments are not placement authority. All instruction addresses below are z64 ROM offsets.

## Bounded lead inspection

The existing R2 enumeration retained thirteen JALR sites. I inspected their immediate target sources in the original owners.
This is source triage, not a new whole-program call graph or proof that these sites cannot reach the selector.

| Sites | Observed target origin | Limit |
| --- | --- | --- |
| 001F396C, 001F3AB0 | Object word +0 supplies t1 or a1. The relevant loads are 001F3914 and 001F37E4. The call passes the object in a0. | No selector-valued object field or publisher chain was established. |
| 0020BD18, 0020BD48, 0020BD78, 0020BDA8, 0020BDE8, 0020BE1C | Global RAM 801D0810 supplies a table pointer; successive owners load slots +0,+4,+8,+C,+10,+14. | Table indirection is concrete; a selector-valued slot under compatible placement is not established. |
| 0020D9F4 | Load a0 from the iterated entry +C0 at 0020D9EC, then target v0 from a0+0 at 0020D9F0. | Object callback provenance remains unknown. |
| 0020FE50 | Target v1 comes from stack +14, where incoming a3 was saved at 0020FE00. Arguments are temporary and element addresses. | This caller-supplied comparison path does not identify the supplied target. |
| 0020FFB8, 00210004, 00210140 | Target t3 comes from stack +7C, where incoming a3 was saved at 0020FF34. Arguments are addresses in the copy/swap routine. | No assignment of the selector as that argument was established. |

The comparison paths test signed v0 after calls. The selector returns an unsigned byte, so it would never supply a negative comparison result.
That mismatch weakens the proposed comparison-callback lead. It does not prove impossibility, valid caller arguments, or non-use.

One focused source lookup examined direct stores with displacement 0810, prompted by the table root above.
Three short setters show exact absolute root stores: 0020BCE0, 00213B10, and 0023B220.
They publish RAM pointers 801CFC74, 801E5AA0, and 801EFCB0 respectively to RAM 801D0810.
The first value uses signed ADDIU FC74; it is not 801DFC74 despite the original comment.
The other two setters are outside descriptor-10 text. Their existence alone supplies neither compatible loaded ownership nor selector-valued table contents.
Other displacement matches were not treated as the same global. This lookup is not an exhaustive alias or writer analysis.
No new table mapping, decoded-code placement, or callback target assignment was inferred from numerical similarity.

These observations organize concrete indirect origins. They do not produce a selector-specific lead that warrants another broad pointer scan or speculative symbolic execution.
No stronger exclusion or semantic name follows. A future exact table-slot publication or caller-argument definition could make a bounded offline experiment useful.

## Preserved limits and competing interpretations

The accepted descriptor-10 scan covers aligned encoded direct transfers into all eight selector words, not indirect targets or external owners.
Its thirteen JALRs and twenty-four other non-return JRs remain unresolved as selector provenance.
The accepted original-ASM, literal, short-construction, and decoded-corpus negative scans were not rerun.
The prior 244 saved signature placements remain residence evidence. Prior empty capture queries remain bounded misses; no database was opened here.

Indirect invocation, synthesized or relocated targets, an external compatible caller, interior entry, and runtime-written state remain possible.
Non-use also remains possible but is not established. No ordering of these alternatives is justified by this triage.
The raw resource table and accessor arithmetic remain accepted facts; argument domains, game meanings, family disposition, and valid bounds remain unresolved.

Claim: no positive selector provenance was established by these named local target-origin reads.
Evidence grade: Supported for the bounded assessment; exact source-word comparisons passed. Review status: pending.
Independent corroboration: accepted R2 supplies the transfer census and placement contract; no independent review of this new triage has occurred.
Falsifier: a compatible published callback slot or argument chain that resolves to the signature-qualified selector would overturn the no-lead assessment.
Product consequence: none. All matching, supplement, shared-family, and unresolved research obligations remain unchanged.

## Remaining observation and handoff

A useful observation must identify a signature-qualified selector invocation and its actual caller or transfer-target origin.
For an indirect call, retain transfer PC, target register/value, and predecessor evidence through the target's last definition or load.
Retain the compatible loaded code identity, a0/a1, initialized root/resource identity, addressed byte, and resulting value.
RA alone does not identify a tail caller. Interior entry requires the exact entry instruction and register state.
The return delay slot performs the byte load, so a pre-JR snapshot alone does not prove the returned value.
Do not filter inputs to a guessed 0..2 range. Later use of the result is additional evidence for behavioral naming.
A previously qualified offline record could satisfy this gate. This triage did not locate such a record and authorizes no new capture.

Verification command: python -B build/combat-selector-offline-provenance-r1/check_inputs.py.
Result: PASS, fourteen original owners, 671 words. input-evidence.json SHA-256: e07a2e4f2c7b15847c23ddd3f966e6f4175afa567e1a06f015fe4820a18fa546.
The checker performs identity and selected-word validation only. It does not repeat a selector-reference scan.
Minor retrieval errors: one guessed filename, func_0020BDBC.s, was absent; the correct owner func_0020BDCC.s was read afterward.
A PowerShell rg config wildcard failed and supplied no evidence. Neither error affects the authenticated owner checks.

Changed surfaces: this report, its claim, and the assigned ignored package only. Proposed canonical-document changes: none before review.
No production edits, compilation, build, verifier, runtime, GUI, bridge, database, capture, queue, recovery, or Git mutation occurred.
All assigned writes are released at terminal handoff. W6 retains sole production ownership.
