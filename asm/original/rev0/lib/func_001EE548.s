/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001E1000_001F1000.s
 * z64 range: 0x001EE548..0x001EE574 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Tiny framed polling leaf: addiu $sp,-0x18 @0x1EE548; loops jal 0x80089A10 / jal 0x801B7B7C with beq $v0,$zero,0x8025E150 back-branch @0x1EE560; returns jr $ra @0x1EE56C + delay addiu $sp,0x18 @0x1EE570. Ends at 0x1EE574 where the data region begins. */
/* function boundary candidate: func_001EE548, size=44, kind=prologue */
func_001EE548:
/* 0x001EE548 0x8025E148 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x001EE54C 0x8025E14C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x001EE550 0x8025E150 0x0C022684 */ .word 0x0C022684 # jal 0x80089A10
/* 0x001EE554 0x8025E154 0x00000000 */ .word 0x00000000 # nop
/* 0x001EE558 0x8025E158 0x0C06DEDF */ .word 0x0C06DEDF # jal 0x801B7B7C
/* 0x001EE55C 0x8025E15C 0x00000000 */ .word 0x00000000 # nop
/* 0x001EE560 0x8025E160 0x1040FFFB */ .word 0x1040FFFB # beq $v0, $zero, 0x8025E150
/* 0x001EE564 0x8025E164 0x00000000 */ .word 0x00000000 # nop
/* 0x001EE568 0x8025E168 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x001EE56C 0x8025E16C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001EE570 0x8025E170 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
