/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000B1000_000C1000.s
 * z64 range: 0x000BC86C..0x000BC8B0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* RECOVERED frameless leaf (no stack frame): move $t0,$zero; nor $a0; addiu $a3,0x10D4; loop. jr $ra at 0xBC8A8 + nop delay. */
func_000bc86c:
/* 0x000BC86C 0x8012C46C 0x00004021 */ .word 0x00004021 # move $t0, $zero
/* 0x000BC870 0x8012C470 0x00042027 */ .word 0x00042027 # nor $a0, $zero, $a0
/* 0x000BC874 0x8012C474 0x240710D4 */ .word 0x240710D4 # addiu $a3, $zero, 0x10D4
/* 0x000BC878 0x8012C478 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x000BC87C 0x8012C47C 0x8C426AF8 */ .word 0x8C426AF8 # lw $v0, 0x6AF8($v0)
/* 0x000BC880 0x8012C480 0x00473021 */ .word 0x00473021 # addu $a2, $v0, $a3
/* 0x000BC884 0x8012C484 0x90C30001 */ .word 0x90C30001 # lbu $v1, 0x1($a2)
/* 0x000BC888 0x8012C488 0x00A31024 */ .word 0x00A31024 # and $v0, $a1, $v1
/* 0x000BC88C 0x8012C48C 0x14400003 */ .word 0x14400003 # bne $v0, $zero, 0x8012C49C
/* 0x000BC890 0x8012C490 0x25080001 */ .word 0x25080001 # addiu $t0, $t0, 0x1
/* 0x000BC894 0x8012C494 0x00641024 */ .word 0x00641024 # and $v0, $v1, $a0
/* 0x000BC898 0x8012C498 0xA0C20001 */ .word 0xA0C20001 # sb $v0, 0x1($a2)
/* 0x000BC89C 0x8012C49C 0x2902000A */ .word 0x2902000A # slti $v0, $t0, 0xA
/* 0x000BC8A0 0x8012C4A0 0x1440FFF5 */ .word 0x1440FFF5 # bne $v0, $zero, 0x8012C478
/* 0x000BC8A4 0x8012C4A4 0x24E7000E */ .word 0x24E7000E # addiu $a3, $a3, 0xE
/* 0x000BC8A8 0x8012C4A8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000BC8AC 0x8012C4AC 0x00000000 */ .word 0x00000000 # nop
