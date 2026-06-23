/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x00261D00..0x00261D24 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Preamble-orphan folded forward: 0x261D00-0x261D04 (lui $a0,0x8022; lw $a0,0xD58) loads $a0 consumed live by jal 0x800712C4 in the addiu$sp,-0x18 body @0x261D08; read-before-write. */
func_00261D00:
/* 0x00261D00 0x802D1900 0x3C048022 */ .word 0x3C048022 # lui $a0, 0x8022
/* 0x00261D04 0x802D1904 0x8C840D58 */ .word 0x8C840D58 # lw $a0, 0xD58($a0)

/* function boundary candidate: func_00261D08, size=160, kind=prologue */
func_00261D08:
/* 0x00261D08 0x802D1908 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00261D0C 0x802D190C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00261D10 0x802D1910 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x00261D14 0x802D1914 0x00000000 */ .word 0x00000000 # nop
/* 0x00261D18 0x802D1918 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00261D1C 0x802D191C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00261D20 0x802D1920 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
