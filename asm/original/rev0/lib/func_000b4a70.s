/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000B1000_000C1000.s
 * z64 range: 0x000B4A70..0x000B4AB0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* preamble-orphan lui $v1/lw $v1,0x6AF8 (0xB4A70-0xB4A78) read-before-write folded in; body 0xB4A78 prologue; jr $ra at 0xB4AA8. */
func_000b4a70:
/* 0x000B4A70 0x80124670 0x3C038019 */ .word 0x3C038019 # lui $v1, 0x8019
/* 0x000B4A74 0x80124674 0x8C636AF8 */ .word 0x8C636AF8 # lw $v1, 0x6AF8($v1)

/* function boundary candidate: func_000B4A78, size=56, kind=prologue */
func_000B4A78:
/* 0x000B4A78 0x80124678 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x000B4A7C 0x8012467C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x000B4A80 0x80124680 0x90620098 */ .word 0x90620098 # lbu $v0, 0x98($v1)
/* 0x000B4A84 0x80124684 0x10400004 */ .word 0x10400004 # beq $v0, $zero, 0x80124698
/* 0x000B4A88 0x80124688 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x000B4A8C 0x8012468C 0x90630099 */ .word 0x90630099 # lbu $v1, 0x99($v1)
/* 0x000B4A90 0x80124690 0x14620002 */ .word 0x14620002 # bne $v1, $v0, 0x8012469C
/* 0x000B4A94 0x80124694 0x00002821 */ .word 0x00002821 # move $a1, $zero
/* 0x000B4A98 0x80124698 0x24050001 */ .word 0x24050001 # addiu $a1, $zero, 0x1
/* 0x000B4A9C 0x8012469C 0x0C071FA4 */ .word 0x0C071FA4 # jal 0x801C7E90
/* 0x000B4AA0 0x801246A0 0x24060001 */ .word 0x24060001 # addiu $a2, $zero, 0x1
/* 0x000B4AA4 0x801246A4 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x000B4AA8 0x801246A8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000B4AAC 0x801246AC 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
