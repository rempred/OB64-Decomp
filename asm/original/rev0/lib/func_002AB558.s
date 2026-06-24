/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002A1000_002B1000.s
 * z64 range: 0x002AB558..0x002AB574 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf falling through after prior delay slot: counts $v1 0..0x1C in a bnel loop, jr $ra at 0x002AB56C + trailing alignment nop at 0x002AB570. */
/* 0x002AB558 0x8031B158 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x002AB55C 0x8031B15C 0x24630001 */ .word 0x24630001 # addiu $v1, $v1, 0x1
/* 0x002AB560 0x8031B160 0x2862001C */ .word 0x2862001C # slti $v0, $v1, 0x1C
/* 0x002AB564 0x8031B164 0x5440FFFE */ .word 0x5440FFFE # bnel $v0, $zero, 0x8031B160
/* 0x002AB568 0x8031B168 0x24630001 */ .word 0x24630001 # addiu $v1, $v1, 0x1
/* 0x002AB56C 0x8031B16C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002AB570 0x8031B170 0x00000000 */ .word 0x00000000 # nop
