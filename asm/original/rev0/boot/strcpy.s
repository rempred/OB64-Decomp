/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_0000F22C_00011000.s
 * z64 range: 0x0000F850..0x0000F87C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0000F850 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
strcpy:
/* 0x0000F850 0x8007F450 0x90A60000 */ .word 0x90A60000 # lbu $a2, 0x0($a1)
/* 0x0000F854 0x8007F454 0x00801021 */ .word 0x00801021 # move $v0, $a0
/* 0x0000F858 0x8007F458 0x10C00006 */ .word 0x10C00006 # beq $a2, $zero, 0x8007F474
/* 0x0000F85C 0x8007F45C 0x00401821 */ .word 0x00401821 # move $v1, $v0
/* 0x0000F860 0x8007F460 0x24A50001 */ .word 0x24A50001 # addiu $a1, $a1, 0x1
/* 0x0000F864 0x8007F464 0xA0660000 */ .word 0xA0660000 # sb $a2, 0x0($v1)
/* 0x0000F868 0x8007F468 0x90A60000 */ .word 0x90A60000 # lbu $a2, 0x0($a1)
/* 0x0000F86C 0x8007F46C 0x14C0FFFC */ .word 0x14C0FFFC # bne $a2, $zero, 0x8007F460
/* 0x0000F870 0x8007F470 0x24630001 */ .word 0x24630001 # addiu $v1, $v1, 0x1
/* 0x0000F874 0x8007F474 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0000F878 0x8007F478 0xA0600000 */ .word 0xA0600000 # sb $zero, 0x0($v1)
