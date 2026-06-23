/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00291000_002A1000.s
 * z64 range: 0x00299FE0..0x00299FF0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): ASCII string 'Palatinean Year' (bytes 50 61 6C 61 74 69 6E 65 61 6E 20 59 65 61 72 00), 0-terminated @0x299FEC.. */
/* 0x00299FE0 0x80309BE0 0x50616C61 */ .word 0x50616C61 # beql $v1, $at, 0x80324D68
/* 0x00299FE4 0x80309BE4 0x74696E65 */ .word 0x74696E65 # op_0x1D
/* 0x00299FE8 0x80309BE8 0x616E2059 */ .word 0x616E2059 # daddi $t6, $t3, 0x2059
/* 0x00299FEC 0x80309BEC 0x65617200 */ .word 0x65617200 # daddiu $at, $t3, 0x7200
