# L5 single-owner native-text and readonly-fragment integration

## Decision and authority

Install the independently reviewed eight-file package `6EF101459C5B765155BDCF926D14B8DA7722B4D685059537710D83C8265C4C77` and the complete original L5 wave from frozen manifest `2614F16AA84CC267C52BC178CBEAAF2C02040EE4EB9F3FF0A70D88868DDAC74B`. Astra approved canonical installation after the shared-input drain. Independent package review is `795E32AF41FACAAA80130677DFD5D1B6A9C1679C6F6A3EFB6F2D39858971EF73`. This report records the changed-input structural audit; installed-evidence review remains a separate Director assignment.

## Representation and preserved owners

The new `native-text-single-owner-readonly-fragment-projection` representation preserves the native 960-byte devmgr text owner at ROM `0x1C2B0..0x1C670`: its authentic section-defined GLOBAL function has size 952, followed by eight native zero bytes. The native readonly section contains 28 pointer bytes and four alignment zeros. Only the 28-byte table is projected to `.ob64.r0789` at ROM `0x3EA90..0x3EAAC`; the retail four zeros at `0x3EAAC..0x3EAB0` retain their ASM owner. `__osDevMgrMain` remains an ABS alias at `0x8008BEB0`. Original assembly remains available as fallback/reference.

The full 5,104-byte row789 remains exact. Decoder and scheduler contributors retain their placement and contents. The scheduler's preceding ASM interval and the L2 literal bindings now reference the unique remaining ASM contributor. AI, L2 and VI constants, writable storage and the existing accepted waves retain their owners and bytes. Existing function-owner and composed-owner representation semantics remain unchanged.

The complete 39-producer/45-body wave is installed together. Ordinary configuration reconciliation sorted two normalized relocation lists while preserving raw native REL order, removed duplicate ABS declarations for five existing section-defined GLOBAL providers, and replaced the old `__osSpSetPc` ABS declaration with the new original-name GLOBAL owner. Exact addresses and ELF metadata are recorded in the integration evidence. No L4 sources or activation were imported.

## Validation

All 19 installed regression suites passed. Three integrated linked diffs were exact and mechanically PURE_C, including devmgr fresh compilation and sibling cache miss/hit with the same cache key. One changed-input `node tools/audit.js --profile` completed successfully at 2026-10-16T16:48:12.018Z. Its canonical checks cover structural inputs, baseline/CURRENT, source policy, sole linked C ownership, placement, actual relocations, target bytes, recorded proofs, fresh compilation, prior accepted targets and the complete retail ROM. Every assigned L5 body passed as PURE_C. No unchanged verifier repeat was run for this report.

CURRENT: `CEE5BB9FF24E4FB71EAF0840D52561F7DCF8385439344D422CEBA77D713DB2F3`. Canonical normalized Rev0 ROM SHA-256: `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

Generated reports are authoritative: `build/audit/report.json`, `build/current/verification.json`, `build/current/fresh-compilation.json`, and `build/source-policy/report.json`. Full installed-file hashes, wave membership, custody checks, prior-target comparisons and report hashes are in `build/matching/lib-l5-261016/integration/final-evidence.json`. Test, linked-diff and audit logs remain alongside that file. These generated artifacts are ignored; old accepted evidence and unrelated working changes were preserved.
