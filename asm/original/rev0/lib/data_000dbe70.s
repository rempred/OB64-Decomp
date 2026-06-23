/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000D1000_000E1000.s
 * z64 range: 0x000DBE70..0x000DBE98 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): HYPOTHESIS: 10-word small-int/flag interlude between two zero runs. Non-zero words: 0x00001820, 0x00002300, then zeros, 0x00080612, 0x0D271F19, 0x15000000. Looks like packed small constants, not pointers or floats. Mnemonics coincidental.. */
/* 0x000DBE70 0x8014BA70 0x00001820 */ .word 0x00001820 # add $v1, $zero, $zero
/* 0x000DBE74 0x8014BA74 0x00002300 */ .word 0x00002300 # sll $a0, $zero, 12
/* 0x000DBE78 0x8014BA78 0x00000000 */ .word 0x00000000 # nop
/* 0x000DBE7C 0x8014BA7C 0x00000000 */ .word 0x00000000 # nop
/* 0x000DBE80 0x8014BA80 0x00000000 */ .word 0x00000000 # nop
/* 0x000DBE84 0x8014BA84 0x00000000 */ .word 0x00000000 # nop
/* 0x000DBE88 0x8014BA88 0x00000000 */ .word 0x00000000 # nop
/* 0x000DBE8C 0x8014BA8C 0x00080612 */ .word 0x00080612 # mflo $zero
/* 0x000DBE90 0x8014BA90 0x0D271F19 */ .word 0x0D271F19 # jal 0x849C7C64
/* 0x000DBE94 0x8014BA94 0x15000000 */ .word 0x15000000 # bne $t0, $zero, 0x8014BA98
