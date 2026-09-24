# Complete compiler producers across preserved storage cuts

The boot dynamic Huffman decoder has two logical functions but two different
physical storage cuts. The first body is ROM `E3F0..E6F8` (776 bytes); the second
is `E6F8..EA98` (928 bytes). Existing assembly owners remain `E3F0..E708` (792
bytes) and `E708..EA98` (912 bytes). The second function begins 16 bytes before
the cut. Neither a new entry at E708 nor shortening either body is justified.

`third_party/lha/ob64/decode_dyn.c` emits the complete 1,704-byte producer in
ordinary C. The existing single-function multi-owner representation rejected
its authentic first-function size and inspected only the first section when
checking local functions. This change composes two independently complete
partitions: compiler functions and unchanged physical owners.

## Preserved contracts

- The first compiler function is global; every secondary remains local.
  Actual `st_size` values are preserved, including a function spanning a cut.
- Raw, projected and linked function censuses must exactly match the complete
  reviewed offsets, sizes, bindings and visibility. A later-owner function
  cannot disappear from the census.
- Original physical continuation labels are separately authenticated zero-size
  global function markers. Only these exact records are excluded from the
  compiler census; arbitrary zero-size functions still fail.
- Complete owners remain contiguous in ROM and runtime space, with their
  original section alignment, byte lengths, fallback identities and placement.
- Projection changes section-relative offsets and section indices only. It
  retains code bytes, addends, authentic symbol sizes and the original text
  section-symbol anchor. Cross-owner HI16/LO16 pairs still fail.
- Canonical compilation, independently recreated source proof and diff-cache
  reconstruction use the same contract. Existing implementation fingerprints
  invalidate objects prepared by the old implementation. Evidence field
  meanings and compiler flags are unchanged.

The concrete new contract is `boot_decode_huffman_symbol`, rows 125/126,
runtime `8007DFF0..8007E698`. Its canonical bytes hash to
`31456DD83B4A8BAABCA3E9DC1EC53A48B9BBB8AC7BFA93E32FE3E55E93192EB7`.
The secondary `E6F8` entry has a fixed callback pointer at ROM `38B88`; the
driver actually loads and calls that callback field. This does not require
exporting an additional compiler function.

## Native relocation order

The real object exposed a separate monotonic-offset assumption in the splitter.
Pinned GNU 2.6 can serialize a HI16, its scheduled delay-slot LO16, then the
preceding jump's R_MIPS_26. The four descents in this producer are `E8→E4`,
`1F8→1F4`, `468→464` and `578→574`. They are valid native order, not malformed
instructions or relocations. All 88 HI16 records pair with subsequent
same-symbol LO16 records in the same physical owner.

The splitter now retains each owner's exact native subsequence rather than
requiring increasing instruction offsets. It never sorts ELF records. This
preserves the pinned linker's forward same-symbol LO16 search. It rejects
unmatched or cross-owner pairs, unsupported types, duplicated or unaligned
places, and out-of-range or truncated records. Supported independent R_MIPS_32
and R_MIPS_26 relocations remain supported alongside HI16/LO16.

## Review and checks

Independent review confirmed the complete-partition design, authentic raw
census, concrete owner geometry, strict/cache paths, marker authentication and
native-order remedy. The reviewer independently compared the retained raw and
projected decoder ELFs at two placements; their payloads agree, and the retail
placement agrees with the canonical ROM.

Focused tests cover:

- `tests/multi_owner_functions.js`: a straddling local function and a third
  function beginning in the later owner; exact function and marker rejection
  controls; raw/projected links at two placements.
- `tests/multi_owner_relocation_order.js`: a separate pinned-assembler scheduling
  fixture with genuine offset descents, absolute and section-relative R_MIPS_32
  values, exact native subsequences and section anchoring at two placements;
  nine malformed or order-sensitive controls.
- Existing `compiler_text_functions`, `multi_owner_text`, `active_targets` and
  `diff_object_cache` regression suites.

These focused checks passed, including the existing `multi_owner_phase8` complete-ROM
regression. The real C producer also passes raw versus projected links at
`8007DFF0` and `8027DFF0` and its ordinary canonical linked diff.

The combined `node tools/audit.js` run passed on September 24, 2026 at 05:03:02 UTC.
It verified all 650 active source-to-object proofs, complete ownership and the
exact retail ROM, including this 1,704-byte PURE_C producer. ROM SHA-256:
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
`build/audit/report.json` and `build/current/verification.json` retain the generated
evidence; the [trial report](2026-09-23-boot-decompression-trial.md) records the
wave's acceptance and limitations.
