/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x00205720..0x00205748 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf un-merged from idx28: 4-word 32-bit byteswap (srl/andi/or rotate of $a0); ends jr$ra at 0x00205740 + delay (or $v0,$v0,$a0) at 0x00205744. */
/* 0x00205720 0x80275320 0x00041602 */ .word 0x00041602 # srl $v0, $a0, 24
/* 0x00205724 0x80275324 0x00041A02 */ .word 0x00041A02 # srl $v1, $a0, 8
/* 0x00205728 0x80275328 0x3063FF00 */ .word 0x3063FF00 # andi $v1, $v1, 0xFF00
/* 0x0020572C 0x8027532C 0x00431025 */ .word 0x00431025 # or $v0, $v0, $v1
/* 0x00205730 0x80275330 0x3083FF00 */ .word 0x3083FF00 # andi $v1, $a0, 0xFF00
/* 0x00205734 0x80275334 0x00031A00 */ .word 0x00031A00 # sll $v1, $v1, 8
/* 0x00205738 0x80275338 0x00431025 */ .word 0x00431025 # or $v0, $v0, $v1
/* 0x0020573C 0x8027533C 0x00042600 */ .word 0x00042600 # sll $a0, $a0, 24
/* 0x00205740 0x80275340 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00205744 0x80275344 0x00441025 */ .word 0x00441025 # or $v0, $v0, $a0
