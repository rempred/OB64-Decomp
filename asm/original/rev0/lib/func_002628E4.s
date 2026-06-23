/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x002628E4..0x00262910 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Preamble-orphan folded forward: 0x2628E4-0x2628E8 (lui $a1; lw $a1,0xFE8) loads $a1 read by 'lw $v0,0x4($a1)'@0x2628F4 in framed body at 0x2628EC; jalr $v0 callback internal. jr$ra@0x262908 + delay 0x26290C. */
func_002628E4:
/* 0x002628E4 0x802D24E4 0x3C058022 */ .word 0x3C058022 # lui $a1, 0x8022
/* 0x002628E8 0x802D24E8 0x8CA50FE8 */ .word 0x8CA50FE8 # lw $a1, 0xFE8($a1)

/* function boundary candidate: func_002628EC, size=36, kind=prologue */
func_002628EC:
/* 0x002628EC 0x802D24EC 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x002628F0 0x802D24F0 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x002628F4 0x802D24F4 0x8CA20004 */ .word 0x8CA20004 # lw $v0, 0x4($a1)
/* 0x002628F8 0x802D24F8 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x002628FC 0x802D24FC 0x0040F809 */ .word 0x0040F809 # jalr $v0
/* 0x00262900 0x802D2500 0x24A50024 */ .word 0x24A50024 # addiu $a1, $a1, 0x24
/* 0x00262904 0x802D2504 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00262908 0x802D2508 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0026290C 0x802D250C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
