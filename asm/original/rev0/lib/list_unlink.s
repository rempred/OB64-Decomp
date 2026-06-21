/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001FC1C..0x0001FC50 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0001FC1C (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
list_unlink:
/* 0x0001FC1C 0x8008F81C 0x8C830000 */ .word 0x8C830000 # lw $v1, 0x0($a0)
/* 0x0001FC20 0x8008F820 0x10600003 */ .word 0x10600003 # beq $v1, $zero, 0x8008F830
/* 0x0001FC24 0x8008F824 0x00000000 */ .word 0x00000000 # nop
/* 0x0001FC28 0x8008F828 0x8C820004 */ .word 0x8C820004 # lw $v0, 0x4($a0)
/* 0x0001FC2C 0x8008F82C 0xAC620004 */ .word 0xAC620004 # sw $v0, 0x4($v1)
/* 0x0001FC30 0x8008F830 0x8C830004 */ .word 0x8C830004 # lw $v1, 0x4($a0)
/* 0x0001FC34 0x8008F834 0x10600003 */ .word 0x10600003 # beq $v1, $zero, 0x8008F844
/* 0x0001FC38 0x8008F838 0x00000000 */ .word 0x00000000 # nop
/* 0x0001FC3C 0x8008F83C 0x8C820000 */ .word 0x8C820000 # lw $v0, 0x0($a0)
/* 0x0001FC40 0x8008F840 0xAC620000 */ .word 0xAC620000 # sw $v0, 0x0($v1)
/* 0x0001FC44 0x8008F844 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001FC48 0x8008F848 0x00000000 */ .word 0x00000000 # nop
/* 0x0001FC4C 0x8008F84C 0x00000000 */ .word 0x00000000 # nop
