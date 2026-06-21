/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_0000F22C_00011000.s
 * z64 range: 0x0000F87C..0x0000F8B0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0000F87C (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
strcmp:
/* 0x0000F87C 0x8007F47C 0x90830000 */ .word 0x90830000 # lbu $v1, 0x0($a0)
/* 0x0000F880 0x8007F480 0x24840001 */ .word 0x24840001 # addiu $a0, $a0, 0x1
/* 0x0000F884 0x8007F484 0x90A20000 */ .word 0x90A20000 # lbu $v0, 0x0($a1)
/* 0x0000F888 0x8007F488 0x306300FF */ .word 0x306300FF # andi $v1, $v1, 0x00FF
/* 0x0000F88C 0x8007F48C 0x304200FF */ .word 0x304200FF # andi $v0, $v0, 0x00FF
/* 0x0000F890 0x8007F490 0x10620003 */ .word 0x10620003 # beq $v1, $v0, 0x8007F4A0
/* 0x0000F894 0x8007F494 0x24A50001 */ .word 0x24A50001 # addiu $a1, $a1, 0x1
/* 0x0000F898 0x8007F498 0x0801FD2A */ .word 0x0801FD2A # j 0x8007F4A8
/* 0x0000F89C 0x8007F49C 0x00621023 */ .word 0x00621023 # subu $v0, $v1, $v0
/* 0x0000F8A0 0x8007F4A0 0x1460FFF6 */ .word 0x1460FFF6 # bne $v1, $zero, 0x8007F47C
/* 0x0000F8A4 0x8007F4A4 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x0000F8A8 0x8007F4A8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0000F8AC 0x8007F4AC 0x00000000 */ .word 0x00000000 # nop
