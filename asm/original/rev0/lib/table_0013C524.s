/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00131000_00141000.s
 * z64 range: 0x0013C524..0x0013C534 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): RAM-pointer table, 4 words 0x801E7D64/0x801E7D84/0x801E7DA4/0x801E7DC4, stride 0x20 (hypothesis: per-entry struct base pointers into the 0x801E band). [name-token: table_0013C524_801E_band]. */
/* 0x0013C524 0x801AC124 0x801E7D64 */ .word 0x801E7D64 # lb $s8, 0x7D64($zero)
/* 0x0013C528 0x801AC128 0x801E7D84 */ .word 0x801E7D84 # lb $s8, 0x7D84($zero)
/* 0x0013C52C 0x801AC12C 0x801E7DA4 */ .word 0x801E7DA4 # lb $s8, 0x7DA4($zero)
/* 0x0013C530 0x801AC130 0x801E7DC4 */ .word 0x801E7DC4 # lb $s8, 0x7DC4($zero)
