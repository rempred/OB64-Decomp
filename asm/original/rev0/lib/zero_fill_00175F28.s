/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00171000_00181000.s
 * z64 range: 0x00175F28..0x00175F30 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Two pure-zero words at island start: 0x00000000, 0x00000000 (boundary pad between code1 jr $ra/addiu epilogue at 0x175F20 and the packed payload that follows). (swarm-label: zero_fill_island1_lead). */
/* 0x00175F28 0x801E5B28 0x00000000 */ .word 0x00000000 # nop
/* 0x00175F2C 0x801E5B2C 0x00000000 */ .word 0x00000000 # nop
