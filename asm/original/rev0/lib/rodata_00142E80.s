/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00142E80..0x00142EA0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): ASCII error string 0x4D454D20='MEM ' .. 0x47290A00='G)',LF,NUL. Zero-padded; 1 trailing zero word. [name-token: rodata_str_MEM_Error_c]. */
/* 0x00142E80 0x801B2A80 0x4D454D20 */ .word 0x4D454D20 # op_0x13
/* 0x00142E84 0x801B2A84 0x4572726F */ .word 0x4572726F # cop1_0x2F.fmt11
/* 0x00142E88 0x801B2A88 0x722E2028 */ .word 0x722E2028 # op_0x1C
/* 0x00142E8C 0x801B2A8C 0x556E6974 */ .word 0x556E6974 # bnel $t3, $t6, 0x801CD060
/* 0x00142E90 0x801B2A90 0x55706461 */ .word 0x55706461 # bnel $t3, $s0, 0x801CBC18
/* 0x00142E94 0x801B2A94 0x74654F52 */ .word 0x74654F52 # op_0x1D
/* 0x00142E98 0x801B2A98 0x47290A00 */ .word 0x47290A00 # add.fmt25 $f8, $f1, $f9
/* 0x00142E9C 0x801B2A9C 0x00000000 */ .word 0x00000000 # nop
