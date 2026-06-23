/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x00262AB0..0x00262AD4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Preamble-orphan folded forward: 0x262AB0-0x262AB4 (lui $a1; lw $a1,0xFE8) loads $a1 as the argument passed through the jal 0x8020DD60 in the framed body at 0x262AB8 (body never writes $a1). jr$ra@0x262ACC + delay 0x262AD0. */
func_00262AB0:
/* 0x00262AB0 0x802D26B0 0x3C058022 */ .word 0x3C058022 # lui $a1, 0x8022
/* 0x00262AB4 0x802D26B4 0x8CA50FE8 */ .word 0x8CA50FE8 # lw $a1, 0xFE8($a1)

/* function boundary candidate: func_00262AB8, size=508, kind=prologue */
func_00262AB8:
/* 0x00262AB8 0x802D26B8 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00262ABC 0x802D26BC 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00262AC0 0x802D26C0 0x0C083758 */ .word 0x0C083758 # jal 0x8020DD60
/* 0x00262AC4 0x802D26C4 0x00000000 */ .word 0x00000000 # nop
/* 0x00262AC8 0x802D26C8 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00262ACC 0x802D26CC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00262AD0 0x802D26D0 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
