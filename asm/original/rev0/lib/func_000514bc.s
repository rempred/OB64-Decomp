/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00051000_00061000.s
 * z64 range: 0x000514BC..0x000514E0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf: lbu flag, beq branch selecting one of two addiu pointer values; jr $ra at 0x514D8; delay move $v0,$v1. Un-merged from parent idx1 cluster. */
func_000514bc:
/* 0x000514BC 0x800C10BC 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x000514C0 0x800C10C0 0x904236E0 */ .word 0x904236E0 # lbu $v0, 0x36E0($v0)
/* 0x000514C4 0x800C10C4 0x3C038019 */ .word 0x3C038019 # lui $v1, 0x8019
/* 0x000514C8 0x800C10C8 0x10400003 */ .word 0x10400003 # beq $v0, $zero, 0x800C10D8
/* 0x000514CC 0x800C10CC 0x2463FD64 */ .word 0x2463FD64 # addiu $v1, $v1, -0x29C
/* 0x000514D0 0x800C10D0 0x3C038019 */ .word 0x3C038019 # lui $v1, 0x8019
/* 0x000514D4 0x800C10D4 0x2463FD78 */ .word 0x2463FD78 # addiu $v1, $v1, -0x288
/* 0x000514D8 0x800C10D8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000514DC 0x800C10DC 0x00601021 */ .word 0x00601021 # move $v0, $v1
