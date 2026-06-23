/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00241000_00251000.s
 * z64 range: 0x00244710..0x00244740 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): IEEE double-precision constant pool: 0x4066800000000000=182.0 and 0x400921FB54442D18=pi, repeated 3x (182.0,pi pattern). 6 doubles.. */
/* 0x00244710 0x802B4310 0x40668000 */ .word 0x40668000 # cop0_0x03
/* 0x00244714 0x802B4314 0x00000000 */ .word 0x00000000 # nop
/* 0x00244718 0x802B4318 0x400921FB */ .word 0x400921FB # mfc0 $t1, $4
/* 0x0024471C 0x802B431C 0x54442D18 */ .word 0x54442D18 # bnel $v0, $a0, 0x802BF780
/* 0x00244720 0x802B4320 0x40668000 */ .word 0x40668000 # cop0_0x03
/* 0x00244724 0x802B4324 0x00000000 */ .word 0x00000000 # nop
/* 0x00244728 0x802B4328 0x400921FB */ .word 0x400921FB # mfc0 $t1, $4
/* 0x0024472C 0x802B432C 0x54442D18 */ .word 0x54442D18 # bnel $v0, $a0, 0x802BF790
/* 0x00244730 0x802B4330 0x40668000 */ .word 0x40668000 # cop0_0x03
/* 0x00244734 0x802B4334 0x00000000 */ .word 0x00000000 # nop
/* 0x00244738 0x802B4338 0x400921FB */ .word 0x400921FB # mfc0 $t1, $4
/* 0x0024473C 0x802B433C 0x54442D18 */ .word 0x54442D18 # bnel $v0, $a0, 0x802BF7A0
