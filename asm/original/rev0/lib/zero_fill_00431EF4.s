/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00431000_00441000.s
 * z64 range: 0x00431EF4..0x00431F08 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): WaveTables bank TERMINATOR: the 5-word zero run that closes the chunk-66 audio bank's WaveTables sample payload (byte-precise run 0x431EF1..0x431F09, 24 B; word-aligned 20 B here). parsed (all-zero). After this the bank's PtrTablesV2/WaveTables structure ends.. */
/* 0x00431EF4 0x804A1AF4 0x00000000 */ .word 0x00000000 # nop
/* 0x00431EF8 0x804A1AF8 0x00000000 */ .word 0x00000000 # nop
/* 0x00431EFC 0x804A1AFC 0x00000000 */ .word 0x00000000 # nop
/* 0x00431F00 0x804A1B00 0x00000000 */ .word 0x00000000 # nop
/* 0x00431F04 0x804A1B04 0x00000000 */ .word 0x00000000 # nop
