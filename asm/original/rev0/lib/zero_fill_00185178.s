/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00181000_00191000.s
 * z64 range: 0x00185178..0x00185188 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 4 pure-zero words (0x00000000 x4) leading the packed table. Raw: 0x00000000 0x00000000 0x00000000 0x00000000.. */
/* 0x00185178 0x801F4D78 0x00000000 */ .word 0x00000000 # nop
/* 0x0018517C 0x801F4D7C 0x00000000 */ .word 0x00000000 # nop
/* 0x00185180 0x801F4D80 0x00000000 */ .word 0x00000000 # nop
/* 0x00185184 0x801F4D84 0x00000000 */ .word 0x00000000 # nop
