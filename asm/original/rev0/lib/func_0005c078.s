/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00051000_00061000.s
 * z64 range: 0x0005C078..0x0005C090 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf: reads global at 0x80197168, andi 0xFE clear bit, stores back. Ends jr $ra at 0x5C088 with delay-slot sb at 0x5C08C. */
func_0005c078:
/* 0x0005C078 0x800CBC78 0x3C038019 */ .word 0x3C038019 # lui $v1, 0x8019
/* 0x0005C07C 0x800CBC7C 0x24637168 */ .word 0x24637168 # addiu $v1, $v1, 0x7168
/* 0x0005C080 0x800CBC80 0x90620000 */ .word 0x90620000 # lbu $v0, 0x0($v1)
/* 0x0005C084 0x800CBC84 0x304200FE */ .word 0x304200FE # andi $v0, $v0, 0x00FE
/* 0x0005C088 0x800CBC88 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0005C08C 0x800CBC8C 0xA0620000 */ .word 0xA0620000 # sb $v0, 0x0($v1)
