/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x001432C8..0x001432D4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 3 pure-zero words (pad before small int table). [name-token: zero_fill_3w_d]. */
/* 0x001432C8 0x801B2EC8 0x00000000 */ .word 0x00000000 # nop
/* 0x001432CC 0x801B2ECC 0x00000000 */ .word 0x00000000 # nop
/* 0x001432D0 0x801B2ED0 0x00000000 */ .word 0x00000000 # nop
