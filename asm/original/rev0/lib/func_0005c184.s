/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00051000_00061000.s
 * z64 range: 0x0005C184..0x0005C190 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf setter stub: lui $at / jr $ra / delay-slot sw $a0,0x6F58. Split from cluster (3 words incl. preceding lui). */
func_0005c184:
/* 0x0005C184 0x800CBD84 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x0005C188 0x800CBD88 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0005C18C 0x800CBD8C 0xAC246F58 */ .word 0xAC246F58 # sw $a0, 0x6F58($at)
