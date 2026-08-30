# `func_002861C8` owner and auxiliary-row structural audit

Date: 2026-08-30

## Scope and baseline

This audit determines the smallest representation that can replace the complete accepted
`func_002861C8` owner without changing its boundary or inventing a second accepted owner. The
authorized base is `ffade1cba3d0fc27b29e19435f4d7e91606c2576`.

Before any structural implementation, `node tools/verify.js` passed with sole ownership, exact
placement and relocations, exact target bytes, and a byte-identical complete Rev 0 ROM. It reported
387 exact `PURE_C` functions / 18,992 bytes and 63 exact `HYBRID_C` functions / 34,592 bytes.
`OB64_PARENT_ROOT=C:\Users\Joe\Projects\OgreBattlel64 node tools/audit.js` also passed. This is the
clean comparison baseline.

## Accepted owner

The accepted model has one tracked-assembly owner:

```text
row:                 5116 (.ob64.r5116)
ROM:                 0x002861C8..0x00286444
live:                0x8022A1F8..0x8022A474
bytes:               0x27C (636)
overlay descriptor:  14
retail SHA-256:       8540ED2F81174D5C9FBFADF6B739539E4EFC4D563677CCDD816603DF88719801
```

No boundary, segmentation, executable classification, overlay descriptor, or accepted owner is
changed by this audit.

Untouched KMC output for the complete C reconstruction naturally divides the owner into three
compiler functions:

| Owner offset | Bytes | Live entry | Static evidence | Contract binding |
|---:|---:|---:|---|---|
| `+0x000` | `0x134` | `0x8022A1F8` | accepted owner and external call | global owner |
| `+0x134` | `0x0FC` | `0x8022A32C` | one internal `jal`, no external direct reference or pointer | local |
| `+0x230` | `0x04C` | `0x8022A428` | fixed-address `jal` from outside the owner | local |

The three ranges are contiguous and total exactly `0x27C`. Only `func_002861C8` remains global.
The other names are compiler-local evidence inside its section; they are not public aliases or new
accepted owners.

## Entry-reference census

The normalized canonical ROM contains these unique direct call words:

| Target | Call word | ROM occurrence | Ownership conclusion |
|---:|---:|---:|---|
| `0x8022A1F8` | `0x0C08A87E` | `0x0028616C` | externally called accepted owner |
| `0x8022A32C` | `0x0C08A8CB` | `0x002862D0` | call is inside this owner only |
| `0x8022A428` | `0x0C08A90A` | `0x002854D0` | externally called local entry |

No direct `j` encoding targets any of the three entries, and there is no aligned `0x8022A32C`
pointer word in the normalized ROM. This does not purport to disprove every hypothetical
runtime-computed call, but there is no static evidence for external secondary-entry ownership at
`+0x134`. A fail-closed regression test rejects a second direct call, a direct jump or materialized
pointer to `+0x134`, removal of the proven `+0x230` call, and removal of any canonical
branch-likely edge.

## Complete owner control flow

The audit records all 35 direct branches, branch-likely transfers, jumps, indirect jumps, calls,
and returns in the owner.
The primary path contains the six-mode indirect dispatch and its shared comparison/failure tails.
The internal call reaches the complete scanner body at `+0x134`. That scanner includes both the
mode-1 forward barrier scan and the normal forward bridge/backward barrier-depth scan. Its two
direct tails converge on the return at live `0x8022A420`. The externally reached `+0x230` scanner
has its own tail to the return at live `0x8022A46C`.

Thus a replacement of only the framed comparison path would omit accepted owner bytes and fail the
entry/body partition, section-size, linked-byte, and complete-ROM gates.

## Six-mode table and shared auxiliary owner

The indirect dispatch indexes six compiler-generated pointers at accepted data row 5131:

```text
accepted row:         .ob64.r5131
row ROM:              0x00286B90..0x00286BD0
row live:             0x8022ABC0..0x8022AC00
existing C fragment:  0x00286B90..0x00286BB0 (func_00283E14, 32 bytes)
new C fragment:       0x00286BB0..0x00286BC8 (func_002861C8, 24 bytes)
assembly tail:        0x00286BC8..0x00286BD0 (8 zero bytes)
```

The six linked words are `0x8022A24C`, `0x8022A268`, `0x8022A284`, `0x8022A2A4`,
`0x8022A2C4`, and `0x8022A2D8`. Their linked SHA-256 is
`8BB46E4A653E8091810D96866D3A5D0CBCECF798DEAE3A6200901709D8642D17`. The normalized
object addends are `+0x54`, `+0x70`, `+0x8C`, `+0xAC`, `+0xCC`, and `+0xE0`, with SHA-256
`A9135899EECACABBA7D375B9AAF0F702020116739459D10E049FF5C6FB884EE5`.

The 24-byte table is already aligned to eight bytes, so the final eight zero bytes are not compiler
alignment padding. They remain the unique read-only assembly tail, with SHA-256
`AF5570F5A1810B7AF78CAF4BC70A660F0DF51E42BAF91D4DE5B2328DE0E83DFC`.

The former one-fragment auxiliary contract cannot represent both active C fragments unchanged: it
requires each target to begin at the accepted row start, retain the entire remainder as its own
tail, and own the row exclusively. The smallest extension permits ordered C fragments to share one
accepted row. It requires contiguous start-to-end coverage, one common read-only shape, linker
order matching ROM order, and at most one tail after the final fragment. The original assembly row
is removed once, and the final linked row remains one read-only `PROGBITS` section and one
read-only `PT_LOAD` with exact retail bytes.

## Fail-closed protections

The structural implementation adds these checks without activating the target:

- explicit compiler-function records must gaplessly partition the accepted text owner;
- the first record must be the accepted global owner at offset zero;
- all additional entries must be local `STT_FUNC` symbols with exact size, offset, visibility,
  binding, source-object value, and linked value;
- missing, extra, moved, resized, exported, hidden, non-function, or wrong-section entries reject;
- shared auxiliary fragments must be ordered, contiguous, same-owner, same-section, and
  read-only;
- gaps, overlaps, reversed link order, incompatible alignment, duplicate tails, and a missing final
  tail reject;
- the complete target control-flow and direct `jal`, direct `j`, and pointer-reference censuses are
  pinned; and
- all pre-existing targets retain their historical primary-symbol rule unless they opt into the
  explicit multi-function contract.

The existing 450-target model and focused mutation suites pass. A complete post-change
`node tools/verify.js` also passes with the same 387 `PURE_C` / 63 `HYBRID_C` counts and a
byte-identical complete ROM.

## Review status

Independent read-only structural review of the final pre-commit diff and fresh generated evidence
returned **ACCEPT** with no blocking findings. The review confirmed the one-owner/local-entry
model, complete 35-transfer census, same-chunk shared-row partition, unique tail, sole ownership,
and fail-closed symbol/map/ELF/proof gates. The fresh complete verifier and heavyweight audit both
passed before matching work began; `build/audit/report.json` recorded all 35 transfers and all eight
rejected target-specific mutations.
