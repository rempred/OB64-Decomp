/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00007200_00011000.s
 * z64 range: 0x00007200..0x0000722C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_00007200, size=44, kind=leaf */
func_00007200:
/* 0x00007200 0x80076E00 0x3C04800B */ .word 0x3C04800B # lui $a0, 0x800B
/* 0x00007204 0x80076E04 0x8C84F0B0 */ .word 0x8C84F0B0 # lw $a0, -0xF50($a0)

/* function boundary candidate: func_00007208, size=36, kind=prologue */
func_00007208:
/* 0x00007208 0x80076E08 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0000720C 0x80076E0C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00007210 0x80076E10 0x0C05CEE8 */ .word 0x0C05CEE8 # jal 0x80173BA0
/* 0x00007214 0x80076E14 0x00000000 */ .word 0x00000000 # nop
/* 0x00007218 0x80076E18 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x0000721C 0x80076E1C 0xAC20F0B0 */ .word 0xAC20F0B0 # sw $zero, -0xF50($at)
/* 0x00007220 0x80076E20 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00007224 0x80076E24 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00007228 0x80076E28 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
