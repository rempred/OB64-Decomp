/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00231000_00241000.s
 * z64 range: 0x0023B220..0x0023B234 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Recovered frameless leaf the plan missed. lui$v0,0x801F; addiu$v0,-0x350; lui$at,0x801D; jr$ra@0x0023B22C + delay sw$v0,0x810($at)@0x0023B230. Stores a function/data pointer to 801D0810. */
/* 0x0023B220 0x802AAE20 0x3C02801F */ .word 0x3C02801F # lui $v0, 0x801F
/* 0x0023B224 0x802AAE24 0x2442FCB0 */ .word 0x2442FCB0 # addiu $v0, $v0, -0x350
/* 0x0023B228 0x802AAE28 0x3C01801D */ .word 0x3C01801D # lui $at, 0x801D
/* 0x0023B22C 0x802AAE2C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0023B230 0x802AAE30 0xAC220810 */ .word 0xAC220810 # sw $v0, 0x810($at)
