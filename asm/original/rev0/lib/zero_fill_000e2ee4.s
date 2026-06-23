/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000E1000_000F1000.s
 * z64 range: 0x000E2EE4..0x000E2EFC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 6 zero words separating graphics block 1 from the main stream.. */
/* 0x000E2EE4 0x80152AE4 0x00000000 */ .word 0x00000000 # nop
/* 0x000E2EE8 0x80152AE8 0x00000000 */ .word 0x00000000 # nop
/* 0x000E2EEC 0x80152AEC 0x00000000 */ .word 0x00000000 # nop
/* 0x000E2EF0 0x80152AF0 0x00000000 */ .word 0x00000000 # nop
/* 0x000E2EF4 0x80152AF4 0x00000000 */ .word 0x00000000 # nop
/* 0x000E2EF8 0x80152AF8 0x00000000 */ .word 0x00000000 # nop
