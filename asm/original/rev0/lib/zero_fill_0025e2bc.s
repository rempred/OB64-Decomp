/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00251000_00261000.s
 * z64 range: 0x0025E2BC..0x0025E2C0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Single 0x00000000 padding/alignment word preceding the pointer table.. */
/* 0x0025E2BC 0x802CDEBC 0x00000000 */ .word 0x00000000 # nop
