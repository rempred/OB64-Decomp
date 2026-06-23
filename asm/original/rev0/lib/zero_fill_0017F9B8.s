/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00171000_00181000.s
 * z64 range: 0x0017F9B8..0x0017F9C0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 2 pure-zero words (NOP padding) closing Data Island 2 at 0x17F9B8-0x17F9BC; immediately followed by the code3 preamble 'lui $v0, 0x8021' at 0x17F9C0 (region end). (swarm-label: zero_fill_island2_end_pad). */
/* 0x0017F9B8 0x801EF5B8 0x00000000 */ .word 0x00000000 # nop
/* 0x0017F9BC 0x801EF5BC 0x00000000 */ .word 0x00000000 # nop
