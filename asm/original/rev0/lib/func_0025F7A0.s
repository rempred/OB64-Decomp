/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00251000_00261000.s
 * z64 range: 0x0025F7A0..0x0025F7C0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frame -0x18, saves $ra. jal 0x801C8FE8; lw $v0,0x60($v0). jr$ra at 0x0025F7B8 + delay addiu$sp. */
/* function boundary candidate: func_0025F7A0, size=40, kind=prologue */
func_0025F7A0:
/* 0x0025F7A0 0x802CF3A0 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0025F7A4 0x802CF3A4 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0025F7A8 0x802CF3A8 0x0C0723FA */ .word 0x0C0723FA # jal 0x801C8FE8
/* 0x0025F7AC 0x802CF3AC 0x00000000 */ .word 0x00000000 # nop
/* 0x0025F7B0 0x802CF3B0 0x8C420060 */ .word 0x8C420060 # lw $v0, 0x60($v0)
/* 0x0025F7B4 0x802CF3B4 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0025F7B8 0x802CF3B8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0025F7BC 0x802CF3BC 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
