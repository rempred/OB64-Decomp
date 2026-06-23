/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001E1000_001F1000.s
 * z64 range: 0x001F0018..0x001F0028 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): IEEE double constant pool: 0x400921FB54442D18 = pi (3.141592653589793). Followed by 0xC0568000 0x00000000 = double -90.0 (0xC056800000000000).. */
/* 0x001F0018 0x8025FC18 0x400921FB */ .word 0x400921FB # mfc0 $t1, $4
/* 0x001F001C 0x8025FC1C 0x54442D18 */ .word 0x54442D18 # bnel $v0, $a0, 0x8026B080
/* 0x001F0020 0x8025FC20 0xC0568000 */ .word 0xC0568000 # ll $s6, -0x8000($v0)
/* 0x001F0024 0x8025FC24 0x00000000 */ .word 0x00000000 # nop
