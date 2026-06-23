/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00111000_00121000.s
 * z64 range: 0x0011C874..0x0011C8C8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frame 0x18, leaf-ish predicate helper (reads $a0 incoming arg cleanly, no preamble). jr $ra @0x0011C8C0, delay @0x0011C8C4. */
/* function boundary candidate: func_0011C874, size=84, kind=prologue */
func_0011C874:
/* 0x0011C874 0x8018C474 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0011C878 0x8018C478 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0011C87C 0x8018C47C 0x8C820000 */ .word 0x8C820000 # lw $v0, 0x0($a0)
/* 0x0011C880 0x8018C480 0x30420040 */ .word 0x30420040 # andi $v0, $v0, 0x0040
/* 0x0011C884 0x8018C484 0x14400003 */ .word 0x14400003 # bne $v0, $zero, 0x8018C494
/* 0x0011C888 0x8018C488 0x00000000 */ .word 0x00000000 # nop
/* 0x0011C88C 0x8018C48C 0x0807205E */ .word 0x0807205E # j 0x801C8178
/* 0x0011C890 0x8018C490 0x90820004 */ .word 0x90820004 # lbu $v0, 0x4($a0)
/* 0x0011C894 0x8018C494 0x0C07688A */ .word 0x0C07688A # jal 0x801DA228
/* 0x0011C898 0x8018C498 0x00000000 */ .word 0x00000000 # nop
/* 0x0011C89C 0x8018C49C 0x00021840 */ .word 0x00021840 # sll $v1, $v0, 1
/* 0x0011C8A0 0x8018C4A0 0x00621821 */ .word 0x00621821 # addu $v1, $v1, $v0
/* 0x0011C8A4 0x8018C4A4 0x00031880 */ .word 0x00031880 # sll $v1, $v1, 2
/* 0x0011C8A8 0x8018C4A8 0x00621823 */ .word 0x00621823 # subu $v1, $v1, $v0
/* 0x0011C8AC 0x8018C4AC 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x0011C8B0 0x8018C4B0 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x0011C8B4 0x8018C4B4 0x904269BA */ .word 0x904269BA # lbu $v0, 0x69BA($v0)
/* 0x0011C8B8 0x8018C4B8 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0011C8BC 0x8018C4BC 0x2C420001 */ .word 0x2C420001 # sltiu $v0, $v0, 0x1
/* 0x0011C8C0 0x8018C4C0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0011C8C4 0x8018C4C4 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
