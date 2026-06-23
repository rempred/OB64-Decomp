/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00271000_00281000.s
 * z64 range: 0x00273FFC..0x00274000 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Single leading zero word (alignment/padding before the packed header at 0x274000).. */
/* 0x00273FFC 0x802E3BFC 0x00000000 */ .word 0x00000000 # nop
