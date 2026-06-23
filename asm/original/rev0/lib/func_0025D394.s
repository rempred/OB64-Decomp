/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00251000_00261000.s
 * z64 range: 0x0025D394..0x0025D3CC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Framed leaf. Prologue addiu $sp,-0x18; lbu $v1,0($a0); if==0xFF skip; stores $a0 to 0x80220F6C and jal 0x8020DF00. jr $ra at 0x0025D3C4 + delay (addiu $sp,0x18) at 0x0025D3C8. */
/* function boundary candidate: func_0025D394, size=56, kind=prologue */
func_0025D394:
/* 0x0025D394 0x802CCF94 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0025D398 0x802CCF98 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0025D39C 0x802CCF9C 0x90830000 */ .word 0x90830000 # lbu $v1, 0x0($a0)
/* 0x0025D3A0 0x802CCFA0 0x240200FF */ .word 0x240200FF # addiu $v0, $zero, 0xFF
/* 0x0025D3A4 0x802CCFA4 0x10620006 */ .word 0x10620006 # beq $v1, $v0, 0x802CCFC0
/* 0x0025D3A8 0x802CCFA8 0x00000000 */ .word 0x00000000 # nop
/* 0x0025D3AC 0x802CCFAC 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x0025D3B0 0x802CCFB0 0xAC240F6C */ .word 0xAC240F6C # sw $a0, 0xF6C($at)
/* 0x0025D3B4 0x802CCFB4 0x3C048021 */ .word 0x3C048021 # lui $a0, 0x8021
/* 0x0025D3B8 0x802CCFB8 0x0C0837C0 */ .word 0x0C0837C0 # jal 0x8020DF00
/* 0x0025D3BC 0x802CCFBC 0x248481F4 */ .word 0x248481F4 # addiu $a0, $a0, -0x7E0C
/* 0x0025D3C0 0x802CCFC0 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0025D3C4 0x802CCFC4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0025D3C8 0x802CCFC8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
