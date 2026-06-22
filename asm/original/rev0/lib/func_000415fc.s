/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x000415FC..0x00041638 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* un-merged from parent 0x41098: frameless leaf, fresh entry move $v1,$zero; jr $ra at 0x41630 + delay nop */
func_000415fc:
/* 0x000415FC 0x800B11FC 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x00041600 0x800B1200 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x00041604 0x800B1204 0x3C058019 */ .word 0x3C058019 # lui $a1, 0x8019
/* 0x00041608 0x800B1208 0x24A56B00 */ .word 0x24A56B00 # addiu $a1, $a1, 0x6B00
/* 0x0004160C 0x800B120C 0x94A20000 */ .word 0x94A20000 # lhu $v0, 0x0($a1)
/* 0x00041610 0x800B1210 0x54440003 */ .word 0x54440003 # bnel $v0, $a0, 0x800B1220
/* 0x00041614 0x800B1214 0x24630001 */ .word 0x24630001 # addiu $v1, $v1, 0x1
/* 0x00041618 0x800B1218 0x0805ADCC */ .word 0x0805ADCC # j 0x8016B730
/* 0x0004161C 0x800B121C 0x3062FFFF */ .word 0x3062FFFF # andi $v0, $v1, 0xFFFF
/* 0x00041620 0x800B1220 0x28620116 */ .word 0x28620116 # slti $v0, $v1, 0x116
/* 0x00041624 0x800B1224 0x1440FFF9 */ .word 0x1440FFF9 # bne $v0, $zero, 0x800B120C
/* 0x00041628 0x800B1228 0x24A50004 */ .word 0x24A50004 # addiu $a1, $a1, 0x4
/* 0x0004162C 0x800B122C 0x240201FF */ .word 0x240201FF # addiu $v0, $zero, 0x1FF
/* 0x00041630 0x800B1230 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00041634 0x800B1234 0x00000000 */ .word 0x00000000 # nop
