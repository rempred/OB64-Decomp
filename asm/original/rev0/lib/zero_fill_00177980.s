/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00171000_00181000.s
 * z64 range: 0x00177980..0x00177990 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Four pure-zero words (alignment/padding) after the 0x15-band index block, before the help-message text region.. */
/* 0x00177980 0x801E7580 0x00000000 */ .word 0x00000000 # nop
/* 0x00177984 0x801E7584 0x00000000 */ .word 0x00000000 # nop
/* 0x00177988 0x801E7588 0x00000000 */ .word 0x00000000 # nop
/* 0x0017798C 0x801E758C 0x00000000 */ .word 0x00000000 # nop
