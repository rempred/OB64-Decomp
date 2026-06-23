/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x00261F60..0x00261F84 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Preamble-orphan folded forward: 0x261F60-0x261F64 (lui $a0; lw $a0,0xD60) loads the $a0 argument consumed by the jal 0x800712C4 in the framed body at 0x261F68. jr$ra@0x261F7C + delay 0x261F80. */
func_00261F60:
/* 0x00261F60 0x802D1B60 0x3C048022 */ .word 0x3C048022 # lui $a0, 0x8022
/* 0x00261F64 0x802D1B64 0x8C840D60 */ .word 0x8C840D60 # lw $a0, 0xD60($a0)

/* function boundary candidate: func_00261F68, size=28, kind=prologue */
func_00261F68:
/* 0x00261F68 0x802D1B68 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00261F6C 0x802D1B6C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00261F70 0x802D1B70 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x00261F74 0x802D1B74 0x00000000 */ .word 0x00000000 # nop
/* 0x00261F78 0x802D1B78 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00261F7C 0x802D1B7C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00261F80 0x802D1B80 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
