/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000E1000_000F1000.s
 * z64 range: 0x000E595C..0x000E5968 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless empty-return stub: nop@0xE595C; jr $ra@0xE5960; nop@0xE5964 */
/* 0x000E595C 0x8015555C 0x00000000 */ .word 0x00000000 # nop
/* 0x000E5960 0x80155560 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000E5964 0x80155564 0x00000000 */ .word 0x00000000 # nop
