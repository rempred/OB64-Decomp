/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00171000_00181000.s
 * z64 range: 0x00177B38..0x00177B44 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Three pure-zero words (0x177B38/0x177B3C/0x177B40 = 0x00000000) padding the NUL-terminated string out to the 4-aligned start of the pointer table. (swarm-label: zero_fill_after_text). */
/* 0x00177B38 0x801E7738 0x00000000 */ .word 0x00000000 # nop
/* 0x00177B3C 0x801E773C 0x00000000 */ .word 0x00000000 # nop
/* 0x00177B40 0x801E7740 0x00000000 */ .word 0x00000000 # nop
