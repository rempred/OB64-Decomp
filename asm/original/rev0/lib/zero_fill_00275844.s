/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00271000_00281000.s
 * z64 range: 0x00275844..0x00275850 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 3 alignment zero words trailing the jump table.. */
/* 0x00275844 0x802E5444 0x00000000 */ .word 0x00000000 # nop
/* 0x00275848 0x802E5448 0x00000000 */ .word 0x00000000 # nop
/* 0x0027584C 0x802E544C 0x00000000 */ .word 0x00000000 # nop
