/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001A1000_001B1000.s
 * z64 range: 0x001A2B6C..0x001A2B80 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Inline data island D1 part 1: pad nop@0x1A2B6C then ASCII strings. 0x1A2B70=0x536F6C64 0x1A2B74=0x69657200 -> "Soldier\x00"; 0x1A2B78=0x54687275 0x1A2B7C=0x73740000 -> "Thrust\x00\x00". Not executed (sits after func_001A2990, which ends just before 0x1A2B6C).. */
/* 0x001A2B6C 0x8021276C 0x00000000 */ .word 0x00000000 # nop
/* 0x001A2B70 0x80212770 0x536F6C64 */ .word 0x536F6C64 # beql $k1, $t7, 0x8022D904
/* 0x001A2B74 0x80212774 0x69657200 */ .word 0x69657200 # ldl $a1, 0x7200($t3)
/* 0x001A2B78 0x80212778 0x54687275 */ .word 0x54687275 # bnel $v1, $t0, 0x8022F150
/* 0x001A2B7C 0x8021277C 0x73740000 */ .word 0x73740000 # op_0x1C
