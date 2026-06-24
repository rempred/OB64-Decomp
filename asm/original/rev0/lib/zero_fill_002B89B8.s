/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002B1000_002C1000.s
 * z64 range: 0x002B89B8..0x002B89C0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Alignment padding (2 zero words) after func_002B88C8's epilogue, marking the exact code->data transition at 0x2B89B8. parsed (all-zero).. */
/* 0x002B89B8 0x803285B8 0x00000000 */ .word 0x00000000 # nop
/* 0x002B89BC 0x803285BC 0x00000000 */ .word 0x00000000 # nop
