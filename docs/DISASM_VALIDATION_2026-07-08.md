# Disassembler Cross-Validation (2026-07-08)

One-time validation of the decode comments embedded in the tracked `.s` files
(produced by `tools/lib/mips.js` via `tools/extract_original_mips.js`) against
an independent disassembler: GNU `mips64-elf-objdump` 2.39 from the pinned
project toolchain (`-D -b binary -m mips:4300 -EB -M no-aliases`).

This closes the "disassembly comments have never been cross-checked" caveat in
AGENTS.md "Known Gate Limitations". Method and scope:

- Input: `build/baserom.us_rev0.z64` slice of the evidenced executable extent
  `0x00001000..0x002B89B4` (712,301 words), joined by ROM offset against every
  `.word` decode-comment line from the tracked manifest parts in that range.
- Code/data discrimination by part-name prefix: parts named `data_`,
  `zero_fill_`, `rodata_`, `table_`, `jumptable_`, `rsp_ucode_`, `float_` were
  excluded from mnemonic comparison (their decode comments are acknowledged
  noise); 608,395 instruction rows in code-classified parts were compared.

## Verdict: consistent — zero genuine decode disagreements

| Check | Result |
| --- | --- |
| Word values (tracked `.word` vs ROM bytes at offset) | 712,301/712,301 match; the 10,222 offsets absent from objdump output are all-zero words elided by objdump's `...` run compression — 0 real differences |
| Mnemonics (608,395 code rows) | 0 genuine disagreements; 55,217 differences, ALL pseudo-instruction rendering variants (see below) |
| Operands (469,476 non-control-flow rows) | 0 genuine disagreements; 893 differences, ALL field-rendering conventions (see below) |
| `op_0xNN` unknown-opcode fallbacks in code parts | 0 |
| Rows missing a decode comment | 0 |

### Mnemonic difference classes (all benign)

| mips.js | objdump `-M no-aliases` | Count | Same instruction? |
| --- | --- | --- | --- |
| `move rd, rs` | `addu rd,rs,zero` | 31,628 | yes — pseudo vs raw |
| `nop` | `sll zero,zero,0x0` | 21,449 | yes — pseudo vs raw |
| `subu rd, $zero, rt` | `negu rd,rt` | 1,460 | yes — raw vs pseudo |
| `ori rt, $zero, imm` | `dli rt,imm` | 592 | yes — raw vs pseudo |
| `move` | `or rd,rs,zero` | 83 | yes — pseudo vs raw |
| `cop0_0x10` | `tlbwi` / `tlbr` / `tlbp` / `eret` | 5 | yes — mips.js renders COP0 CO-bit ops generically (coverage gap, not a misname); all 5 sit in libultra OS exception/TLB code |

### Operand difference classes (all benign)

| Class | Count | Explanation |
| --- | --- | --- |
| `break` code field | 579 | mips.js prints the full 20-bit code field (`break 0x01C00`), objdump prints the upper 10-bit sub-field (`break 0x7`); `0x7 << 10 == 0x1C00` — identical bits |
| `div`/`divu`/`mult` 2-operand form | 309 | mips.js prints the standard 2-op HI/LO form (`div $v0, $v1`), objdump prints the raw 3-op encoding (`div zero,v0,v1`) |
| COP0/COP1 control register naming | 5 | register-name convention on `mfc0`/`mtc0`-family control registers |

## Durable conclusions

- The `tools/lib/mips.js` decode comments are trustworthy as analysis aids
  across the executable extent: every one of the 608,395 code-row comments
  names the same instruction objdump names, and every operand difference is a
  rendering convention, not a decode error.
- Residual limits: (1) the validation covers the executable extent only — the
  data tail's comments remain acknowledged noise by design; (2) mips.js
  renders the 5 COP0 CO-bit instructions generically as `cop0_0x10` instead of
  `tlbwi`/`tlbr`/`tlbp`/`eret`; anyone reading libultra exception/TLB code
  should keep that in mind (or fix mips.js if it starts to matter).
- Validation artifact: scratchpad-generated, method recorded here; re-run by
  slicing the extent from `build/baserom.us_rev0.z64`, disassembling with the
  pinned toolchain objdump, and joining decode comments by ROM offset from the
  manifest parts.
