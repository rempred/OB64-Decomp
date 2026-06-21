/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001FBFC..0x0001FC1C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0001FBFC (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
list_insert_head:
/* 0x0001FBFC 0x8008F7FC 0x8CA20000 */ .word 0x8CA20000 # lw $v0, 0x0($a1)
/* 0x0001FC00 0x8008F800 0xAC850004 */ .word 0xAC850004 # sw $a1, 0x4($a0)
/* 0x0001FC04 0x8008F804 0xAC820000 */ .word 0xAC820000 # sw $v0, 0x0($a0)
/* 0x0001FC08 0x8008F808 0x8CA20000 */ .word 0x8CA20000 # lw $v0, 0x0($a1)
/* 0x0001FC0C 0x8008F80C 0x54400001 */ .word 0x54400001 # bnel $v0, $zero, 0x8008F814
/* 0x0001FC10 0x8008F810 0xAC440004 */ .word 0xAC440004 # sw $a0, 0x4($v0)
/* 0x0001FC14 0x8008F814 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001FC18 0x8008F818 0xACA40000 */ .word 0xACA40000 # sw $a0, 0x0($a1)
