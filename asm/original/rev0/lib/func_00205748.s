/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x00205748..0x00205760 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf: 6-word 16-bit half-swap (andi 0xFF00 / srl 8 / sll 8 / or); ends jr$ra at 0x00205758 + delay (or $v0,$v0,$a0) at 0x0020575C. */
/* 0x00205748 0x80275348 0x3082FF00 */ .word 0x3082FF00 # andi $v0, $a0, 0xFF00
/* 0x0020574C 0x8027534C 0x00021202 */ .word 0x00021202 # srl $v0, $v0, 8
/* 0x00205750 0x80275350 0x308400FF */ .word 0x308400FF # andi $a0, $a0, 0x00FF
/* 0x00205754 0x80275354 0x00042200 */ .word 0x00042200 # sll $a0, $a0, 8
/* 0x00205758 0x80275358 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020575C 0x8027535C 0x00441025 */ .word 0x00441025 # or $v0, $v0, $a0
