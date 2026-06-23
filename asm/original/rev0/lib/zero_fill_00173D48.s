/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00171000_00181000.s
 * z64 range: 0x00173D48..0x00173D50 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Two zero/nop words (0x00000000) of inter-function alignment padding between the prior fn epilogue and the func_00173D50 prologue (leadingGap). Not executed.. */
/* 0x00173D48 0x801E3948 0x00000000 */ .word 0x00000000 # nop
/* 0x00173D4C 0x801E394C 0x00000000 */ .word 0x00000000 # nop
