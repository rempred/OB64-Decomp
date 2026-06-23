/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000B1000_000C1000.s
 * z64 range: 0x000BF228..0x000BF248 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frame -0x18; small wrapper jal returns byte; ends jr $ra@0xBF240+delay */
/* function boundary candidate: func_000BF228, size=32, kind=prologue */
func_000BF228:
/* 0x000BF228 0x8012EE28 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x000BF22C 0x8012EE2C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x000BF230 0x8012EE30 0x0C05BE75 */ .word 0x0C05BE75 # jal 0x8016F9D4
/* 0x000BF234 0x8012EE34 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x000BF238 0x8012EE38 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x000BF23C 0x8012EE3C 0x304200FF */ .word 0x304200FF # andi $v0, $v0, 0x00FF
/* 0x000BF240 0x8012EE40 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000BF244 0x8012EE44 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
