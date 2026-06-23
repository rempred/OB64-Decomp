/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00101000_00111000.s
 * z64 range: 0x00101A10..0x00101A40 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Final data tail before the 0x801AD878.. RAM-pointer table at 0x101A40 (which lies OUTSIDE this region). Words: 0xE7000000, 0x00000000, 0xE200001C, 0x005041C8, 0xFCFFC7FF, 0xFF8DFEFF, 0xD9FFFFFF, 0x00200404, 0xDF000000, then 3 trailing 0x00000000 alignment/terminator words at 0x101A34/0x101A38/0x101A3C. Mix of 0xE7/0xE2/0xD9/0xDF high-byte data words and 0xFFxx signed words; not pure zero_fill (only the final 3 words are zero). High-byte words are data, not opcodes. No field names asserted. [name-token: data_00101A10_packed_tail]. */
/* 0x00101A10 0x80171610 0xE7000000 */ .word 0xE7000000 # swc1 $f0, 0x0($t8)
/* 0x00101A14 0x80171614 0x00000000 */ .word 0x00000000 # nop
/* 0x00101A18 0x80171618 0xE200001C */ .word 0xE200001C # sc $zero, 0x1C($s0)
/* 0x00101A1C 0x8017161C 0x005041C8 */ .word 0x005041C8 # jr $v0
/* 0x00101A20 0x80171620 0xFCFFC7FF */ .word 0xFCFFC7FF # sd $ra, -0x3801($a3)
/* 0x00101A24 0x80171624 0xFF8DFEFF */ .word 0xFF8DFEFF # sd $t5, -0x101($gp)
/* 0x00101A28 0x80171628 0xD9FFFFFF */ .word 0xD9FFFFFF # ldc2 $31, -0x1($t7)
/* 0x00101A2C 0x8017162C 0x00200404 */ .word 0x00200404 # sllv $zero, $zero, $at
/* 0x00101A30 0x80171630 0xDF000000 */ .word 0xDF000000 # ld $zero, 0x0($t8)
/* 0x00101A34 0x80171634 0x00000000 */ .word 0x00000000 # nop
/* 0x00101A38 0x80171638 0x00000000 */ .word 0x00000000 # nop
/* 0x00101A3C 0x8017163C 0x00000000 */ .word 0x00000000 # nop
