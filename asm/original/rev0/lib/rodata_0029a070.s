/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00291000_002A1000.s
 * z64 range: 0x0029A070..0x0029A080 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): ASCII string pool 'Saldian\0Viragore\0' (53 61 6C 64 69 61 6E 00 56 69 72 61 67 6F 00).. */
/* 0x0029A070 0x80309C70 0x53616C64 */ .word 0x53616C64 # beql $k1, $at, 0x80324E04
/* 0x0029A074 0x80309C74 0x69616E00 */ .word 0x69616E00 # ldl $at, 0x6E00($t3)
/* 0x0029A078 0x80309C78 0x56697261 */ .word 0x56697261 # bnel $s3, $t1, 0x80326600
/* 0x0029A07C 0x80309C7C 0x676F0000 */ .word 0x676F0000 # daddiu $t7, $k1, 0x0
