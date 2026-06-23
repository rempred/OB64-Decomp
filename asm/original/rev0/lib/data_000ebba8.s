/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000E1000_000F1000.s
 * z64 range: 0x000EBBA8..0x000EBBB0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Tail (6 words): 2x 0x00000000 pad at 0x000EBBA8-0x000EBBAC, then 4 non-pointer words 0x3C03800E,0x90637A32,0x3C06800E,0x90C67A33 (lui/lbu against 0x800E base) directly preceding the next code function at 0x000EBBC0. Treated as data per island bounds. [shrunk to 0xEBBB0: trailing 4 lui/lbu words are func_000ebbb0 preamble]. */
/* 0x000EBBA8 0x8015B7A8 0x00000000 */ .word 0x00000000 # nop
/* 0x000EBBAC 0x8015B7AC 0x00000000 */ .word 0x00000000 # nop
