/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00251000_00261000.s
 * z64 range: 0x0025F778..0x0025F798 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frame -0x18, saves $ra. jal 0x801C8FE8; lw $v0,0x5C($v0). jr$ra at 0x0025F790 + delay addiu$sp. */
/* function boundary candidate: func_0025F778, size=40, kind=prologue */
func_0025F778:
/* 0x0025F778 0x802CF378 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0025F77C 0x802CF37C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0025F780 0x802CF380 0x0C0723FA */ .word 0x0C0723FA # jal 0x801C8FE8
/* 0x0025F784 0x802CF384 0x00000000 */ .word 0x00000000 # nop
/* 0x0025F788 0x802CF388 0x8C42005C */ .word 0x8C42005C # lw $v0, 0x5C($v0)
/* 0x0025F78C 0x802CF38C 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0025F790 0x802CF390 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0025F794 0x802CF394 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
