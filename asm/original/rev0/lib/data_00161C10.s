/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00161000_00171000.s
 * z64 range: 0x00161C10..0x00161C38 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 0xDF000000 0x00000000 marker then a short high-entropy block: 0xAD5EAD1F,0x945B83D5,0xACDF8C17,0x941B0000 followed by four zero words (0x00000000 x4 at 0x161C28-0x161C34). No ascii. HYPOTHESIS: small packed header/record with trailing zero padding. [name-token: data_00161C10_block_DF]. */
/* 0x00161C10 0x801D1810 0xDF000000 */ .word 0xDF000000 # ld $zero, 0x0($t8)
/* 0x00161C14 0x801D1814 0x00000000 */ .word 0x00000000 # nop
/* 0x00161C18 0x801D1818 0xAD5EAD1F */ .word 0xAD5EAD1F # sw $s8, -0x52E1($t2)
/* 0x00161C1C 0x801D181C 0x945B83D5 */ .word 0x945B83D5 # lhu $k1, -0x7C2B($v0)
/* 0x00161C20 0x801D1820 0xACDF8C17 */ .word 0xACDF8C17 # sw $ra, -0x73E9($a2)
/* 0x00161C24 0x801D1824 0x941B0000 */ .word 0x941B0000 # lhu $k1, 0x0($zero)
/* 0x00161C28 0x801D1828 0x00000000 */ .word 0x00000000 # nop
/* 0x00161C2C 0x801D182C 0x00000000 */ .word 0x00000000 # nop
/* 0x00161C30 0x801D1830 0x00000000 */ .word 0x00000000 # nop
/* 0x00161C34 0x801D1834 0x00000000 */ .word 0x00000000 # nop
