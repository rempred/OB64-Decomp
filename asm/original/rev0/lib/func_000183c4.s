/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x000183C4..0x00018400 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x000183C4 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_000183c4:
/* 0x000183C4 0x80087FC4 0x3C02800B */ .word 0x3C02800B # lui $v0, 0x800B
/* 0x000183C8 0x80087FC8 0x8C429E50 */ .word 0x8C429E50 # lw $v0, -0x61B0($v0)

/* function boundary candidate: func_000183CC, size=48, kind=prologue */
func_000183CC:
/* 0x000183CC 0x80087FCC 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x000183D0 0x80087FD0 0x10400007 */ .word 0x10400007 # beq $v0, $zero, 0x80087FF0
/* 0x000183D4 0x80087FD4 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x000183D8 0x80087FD8 0x0C02208C */ .word 0x0C02208C # jal 0x80088230
/* 0x000183DC 0x80087FDC 0x00000000 */ .word 0x00000000 # nop
/* 0x000183E0 0x80087FE0 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x000183E4 0x80087FE4 0xAC209E50 */ .word 0xAC209E50 # sw $zero, -0x61B0($at)
/* 0x000183E8 0x80087FE8 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x000183EC 0x80087FEC 0xAC209E54 */ .word 0xAC209E54 # sw $zero, -0x61AC($at)
/* 0x000183F0 0x80087FF0 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x000183F4 0x80087FF4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000183F8 0x80087FF8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
/* 0x000183FC 0x80087FFC 0x00000000 */ .word 0x00000000 # nop
