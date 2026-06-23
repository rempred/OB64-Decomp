/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00271000_00281000.s
 * z64 range: 0x00275704..0x00275710 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 12-byte zero span between the overlay pointer table and the double constant pool.. */
/* 0x00275704 0x802E5304 0x00000000 */ .word 0x00000000 # nop
/* 0x00275708 0x802E5308 0x00000000 */ .word 0x00000000 # nop
/* 0x0027570C 0x802E530C 0x00000000 */ .word 0x00000000 # nop
