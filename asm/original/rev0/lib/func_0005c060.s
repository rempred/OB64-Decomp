/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00051000_00061000.s
 * z64 range: 0x0005C060..0x0005C078 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf: reads global at 0x80197168, ori bit 0, stores back. Ends jr $ra at 0x5C070 with delay-slot sb at 0x5C074. */
func_0005c060:
/* 0x0005C060 0x800CBC60 0x3C038019 */ .word 0x3C038019 # lui $v1, 0x8019
/* 0x0005C064 0x800CBC64 0x24637168 */ .word 0x24637168 # addiu $v1, $v1, 0x7168
/* 0x0005C068 0x800CBC68 0x90620000 */ .word 0x90620000 # lbu $v0, 0x0($v1)
/* 0x0005C06C 0x800CBC6C 0x34420001 */ .word 0x34420001 # ori $v0, $v0, 0x0001
/* 0x0005C070 0x800CBC70 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0005C074 0x800CBC74 0xA0620000 */ .word 0xA0620000 # sb $v0, 0x0($v1)
