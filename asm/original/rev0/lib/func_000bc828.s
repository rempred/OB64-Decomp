/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000B1000_000C1000.s
 * z64 range: 0x000BC828..0x000BC86C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* RECOVERED frameless leaf (no stack frame): move $t0,$zero; nor $a0; addiu $a3,0x117C; loop. jr $ra at 0xBC864 + nop delay. */
func_000bc828:
/* 0x000BC828 0x8012C428 0x00004021 */ .word 0x00004021 # move $t0, $zero
/* 0x000BC82C 0x8012C42C 0x00042027 */ .word 0x00042027 # nor $a0, $zero, $a0
/* 0x000BC830 0x8012C430 0x2407117C */ .word 0x2407117C # addiu $a3, $zero, 0x117C
/* 0x000BC834 0x8012C434 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x000BC838 0x8012C438 0x8C426AF8 */ .word 0x8C426AF8 # lw $v0, 0x6AF8($v0)
/* 0x000BC83C 0x8012C43C 0x00473021 */ .word 0x00473021 # addu $a2, $v0, $a3
/* 0x000BC840 0x8012C440 0x90C30001 */ .word 0x90C30001 # lbu $v1, 0x1($a2)
/* 0x000BC844 0x8012C444 0x00A31024 */ .word 0x00A31024 # and $v0, $a1, $v1
/* 0x000BC848 0x8012C448 0x14400003 */ .word 0x14400003 # bne $v0, $zero, 0x8012C458
/* 0x000BC84C 0x8012C44C 0x25080001 */ .word 0x25080001 # addiu $t0, $t0, 0x1
/* 0x000BC850 0x8012C450 0x00641024 */ .word 0x00641024 # and $v0, $v1, $a0
/* 0x000BC854 0x8012C454 0xA0C20001 */ .word 0xA0C20001 # sb $v0, 0x1($a2)
/* 0x000BC858 0x8012C458 0x2902001E */ .word 0x2902001E # slti $v0, $t0, 0x1E
/* 0x000BC85C 0x8012C45C 0x1440FFF5 */ .word 0x1440FFF5 # bne $v0, $zero, 0x8012C434
/* 0x000BC860 0x8012C460 0x24E70036 */ .word 0x24E70036 # addiu $a3, $a3, 0x36
/* 0x000BC864 0x8012C464 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000BC868 0x8012C468 0x00000000 */ .word 0x00000000 # nop
