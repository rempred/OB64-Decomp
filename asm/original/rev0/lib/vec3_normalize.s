/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x00028FC0..0x00029020 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00028FC0 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
vec3_normalize:
/* function boundary candidate: func_00028FC0, size=84, kind=leaf */
func_00028FC0:
/* 0x00028FC0 0x80098BC0 0xC4840000 */ .word 0xC4840000 # lwc1 $f4, 0x0($a0)
/* 0x00028FC4 0x80098BC4 0xC4A60000 */ .word 0xC4A60000 # lwc1 $f6, 0x0($a1)
/* 0x00028FC8 0x80098BC8 0xC4C80000 */ .word 0xC4C80000 # lwc1 $f8, 0x0($a2)
/* 0x00028FCC 0x80098BCC 0x46042282 */ .word 0x46042282 # mul.s $f10, $f4, $f4
/* 0x00028FD0 0x80098BD0 0x3C083F80 */ .word 0x3C083F80 # lui $t0, 0x3F80
/* 0x00028FD4 0x80098BD4 0x46063402 */ .word 0x46063402 # mul.s $f16, $f6, $f6
/* 0x00028FD8 0x80098BD8 0x46105480 */ .word 0x46105480 # add.s $f18, $f10, $f16
/* 0x00028FDC 0x80098BDC 0x46084402 */ .word 0x46084402 # mul.s $f16, $f8, $f8
/* 0x00028FE0 0x80098BE0 0x46128280 */ .word 0x46128280 # add.s $f10, $f16, $f18
/* 0x00028FE4 0x80098BE4 0x44889000 */ .word 0x44889000 # mtc1 $t0, $f18
/* 0x00028FE8 0x80098BE8 0x46005404 */ .word 0x46005404 # sqrt.s $f16, $f10
/* 0x00028FEC 0x80098BEC 0x46109283 */ .word 0x46109283 # div.s $f10, $f18, $f16
/* 0x00028FF0 0x80098BF0 0x460A2402 */ .word 0x460A2402 # mul.s $f16, $f4, $f10
/* 0x00028FF4 0x80098BF4 0x00000000 */ .word 0x00000000 # nop
/* 0x00028FF8 0x80098BF8 0x460A3482 */ .word 0x460A3482 # mul.s $f18, $f6, $f10
/* 0x00028FFC 0x80098BFC 0x00000000 */ .word 0x00000000 # nop
/* 0x00029000 0x80098C00 0x460A4102 */ .word 0x460A4102 # mul.s $f4, $f8, $f10
/* 0x00029004 0x80098C04 0xE4900000 */ .word 0xE4900000 # swc1 $f16, 0x0($a0)
/* 0x00029008 0x80098C08 0xE4B20000 */ .word 0xE4B20000 # swc1 $f18, 0x0($a1)
/* 0x0002900C 0x80098C0C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00029010 0x80098C10 0xE4C40000 */ .word 0xE4C40000 # swc1 $f4, 0x0($a2)
/* 0x00029014 0x80098C14 0x00000000 */ .word 0x00000000 # nop
/* 0x00029018 0x80098C18 0x00000000 */ .word 0x00000000 # nop
/* 0x0002901C 0x80098C1C 0x00000000 */ .word 0x00000000 # nop
