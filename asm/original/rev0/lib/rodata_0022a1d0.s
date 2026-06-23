/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00221000_00231000.s
 * z64 range: 0x0022A1D0..0x0022A1D8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): ASCII "NULL" (0x4E554C4C) followed by j-shaped word 0x0A000000 (sentinel/terminator marker).. */
/* 0x0022A1D0 0x80299DD0 0x4E554C4C */ .word 0x4E554C4C # op_0x13
/* 0x0022A1D4 0x80299DD4 0x0A000000 */ .word 0x0A000000 # j 0x88000000
