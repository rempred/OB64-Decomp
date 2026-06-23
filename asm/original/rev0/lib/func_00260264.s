/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00251000_00261000.s
 * z64 range: 0x00260264..0x00260270 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Tiny parent-MISSED frameless stub: lui $at,0x8022; jr $ra; delay sh $zero,0xE60($at) (clears counter). */
/* 0x00260264 0x802CFE64 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x00260268 0x802CFE68 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0026026C 0x802CFE6C 0xA4200E60 */ .word 0xA4200E60 # sh $zero, 0xE60($at)
