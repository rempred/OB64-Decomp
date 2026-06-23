/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000E1000_000F1000.s
 * z64 range: 0x000EACFC..0x000EAD04 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (2 instr): return $a0 & 0xFFFF; jr $ra 0xEACFC + delay EAD00 */
/* 0x000EACFC 0x8015A8FC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000EAD00 0x8015A900 0x3082FFFF */ .word 0x3082FFFF # andi $v0, $a0, 0xFFFF
