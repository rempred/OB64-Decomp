/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x001432D4..0x001432E4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 4 sequential int words 0x00000001, 0x00000002, 0x00000003, 0x00000004 (index sequence). Packed int data, not pointers/floats. [name-token: data_small_int_seq]. */
/* 0x001432D4 0x801B2ED4 0x00000001 */ .word 0x00000001 # special_0x01
/* 0x001432D8 0x801B2ED8 0x00000002 */ .word 0x00000002 # srl $zero, $zero, 0
/* 0x001432DC 0x801B2EDC 0x00000003 */ .word 0x00000003 # sra $zero, $zero, 0
/* 0x001432E0 0x801B2EE0 0x00000004 */ .word 0x00000004 # sllv $zero, $zero, $zero
