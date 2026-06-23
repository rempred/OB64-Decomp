/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000D1000_000E1000.s
 * z64 range: 0x000DE234..0x000DE250 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 7 consecutive zero words (28 bytes) embedded between the small-int arrays and the command-record stream. Pure zero fill / padding.. */
/* 0x000DE234 0x8014DE34 0x00000000 */ .word 0x00000000 # nop
/* 0x000DE238 0x8014DE38 0x00000000 */ .word 0x00000000 # nop
/* 0x000DE23C 0x8014DE3C 0x00000000 */ .word 0x00000000 # nop
/* 0x000DE240 0x8014DE40 0x00000000 */ .word 0x00000000 # nop
/* 0x000DE244 0x8014DE44 0x00000000 */ .word 0x00000000 # nop
/* 0x000DE248 0x8014DE48 0x00000000 */ .word 0x00000000 # nop
/* 0x000DE24C 0x8014DE4C 0x00000000 */ .word 0x00000000 # nop
