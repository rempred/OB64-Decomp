/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00142FC0..0x00142FD4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 5 RAM pointers in the 0x801D9EC0..0x801D9F4C band. Small word-stride pointer table; 1 trailing zero word. [name-token: table_ptr_801D9Exx]. */
/* 0x00142FC0 0x801B2BC0 0x801D9F4C */ .word 0x801D9F4C # lb $sp, -0x60B4($zero)
/* 0x00142FC4 0x801B2BC4 0x801D9B00 */ .word 0x801D9B00 # lb $sp, -0x6500($zero)
/* 0x00142FC8 0x801B2BC8 0x801D9B00 */ .word 0x801D9B00 # lb $sp, -0x6500($zero)
/* 0x00142FCC 0x801B2BCC 0x801D9D3C */ .word 0x801D9D3C # lb $sp, -0x62C4($zero)
/* 0x00142FD0 0x801B2BD0 0x801D9EC0 */ .word 0x801D9EC0 # lb $sp, -0x6140($zero)
