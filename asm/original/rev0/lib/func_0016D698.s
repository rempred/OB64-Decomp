/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00161000_00171000.s
 * z64 range: 0x0016D698..0x0016D6A4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Tiny frameless leaf: lui $v0,0x8022 / jr $ra at 0x0016D69C / delay-slot lbu $v0,-0x10FC($v0) at 0x0016D6A0 (reads a global byte and returns it). Recovered from over-merged parent idx19. */
/* 0x0016D698 0x801DD298 0x3C028022 */ .word 0x3C028022 # lui $v0, 0x8022
/* 0x0016D69C 0x801DD29C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0016D6A0 0x801DD2A0 0x9042EF04 */ .word 0x9042EF04 # lbu $v0, -0x10FC($v0)
