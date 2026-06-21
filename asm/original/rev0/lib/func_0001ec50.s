/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001EC50..0x0001EC80 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0001EC50 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_0001ec50:
/* 0x0001EC50 0x8008E850 0x8C87001C */ .word 0x8C87001C # lw $a3, 0x1C($a0)
/* 0x0001EC54 0x8008E854 0x24020002 */ .word 0x24020002 # addiu $v0, $zero, 0x2
/* 0x0001EC58 0x8008E858 0x14A20007 */ .word 0x14A20007 # bne $a1, $v0, 0x8008E878
/* 0x0001EC5C 0x8008E85C 0x00000000 */ .word 0x00000000 # nop
/* 0x0001EC60 0x8008E860 0x8C820014 */ .word 0x8C820014 # lw $v0, 0x14($a0)
/* 0x0001EC64 0x8008E864 0x24430001 */ .word 0x24430001 # addiu $v1, $v0, 0x1
/* 0x0001EC68 0x8008E868 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
/* 0x0001EC6C 0x8008E86C 0x00471021 */ .word 0x00471021 # addu $v0, $v0, $a3
/* 0x0001EC70 0x8008E870 0xAC830014 */ .word 0xAC830014 # sw $v1, 0x14($a0)
/* 0x0001EC74 0x8008E874 0xAC460000 */ .word 0xAC460000 # sw $a2, 0x0($v0)
/* 0x0001EC78 0x8008E878 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001EC7C 0x8008E87C 0x00001021 */ .word 0x00001021 # move $v0, $zero
