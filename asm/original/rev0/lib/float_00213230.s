/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00211000_00221000.s
 * z64 range: 0x00213230..0x00213250 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): f64 const pool: 0x400921FB54442D18 = pi (x2) separated/followed by 0xC056800000000000 = -90.0 and a 0.0 pad word pair.. */
/* 0x00213230 0x80282E30 0x400921FB */ .word 0x400921FB # mfc0 $t1, $4
/* 0x00213234 0x80282E34 0x54442D18 */ .word 0x54442D18 # bnel $v0, $a0, 0x8028E298
/* 0x00213238 0x80282E38 0xC0568000 */ .word 0xC0568000 # ll $s6, -0x8000($v0)
/* 0x0021323C 0x80282E3C 0x00000000 */ .word 0x00000000 # nop
/* 0x00213240 0x80282E40 0x400921FB */ .word 0x400921FB # mfc0 $t1, $4
/* 0x00213244 0x80282E44 0x54442D18 */ .word 0x54442D18 # bnel $v0, $a0, 0x8028E2A8
/* 0x00213248 0x80282E48 0xC0568000 */ .word 0xC0568000 # ll $s6, -0x8000($v0)
/* 0x0021324C 0x80282E4C 0x00000000 */ .word 0x00000000 # nop
