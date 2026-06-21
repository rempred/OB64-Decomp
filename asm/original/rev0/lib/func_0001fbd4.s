/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001FBCC..0x0001FBFC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0001FBCC (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_0001fbd4:
/* 0x0001FBCC 0x8008F7CC 0x3C02800B */ .word 0x3C02800B # lui $v0, 0x800B
/* 0x0001FBD0 0x8008F7D0 0x8C42A710 */ .word 0x8C42A710 # lw $v0, -0x58F0($v0)

/* function boundary candidate: func_0001FBD4, size=120, kind=prologue */
func_0001FBD4:
/* 0x0001FBD4 0x8008F7D4 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0001FBD8 0x8008F7D8 0x10400005 */ .word 0x10400005 # beq $v0, $zero, 0x8008F7F0
/* 0x0001FBDC 0x8008F7DC 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0001FBE0 0x8008F7E0 0x0C023FD8 */ .word 0x0C023FD8 # jal 0x8008FF60
/* 0x0001FBE4 0x8008F7E4 0x00000000 */ .word 0x00000000 # nop
/* 0x0001FBE8 0x8008F7E8 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x0001FBEC 0x8008F7EC 0xAC20A710 */ .word 0xAC20A710 # sw $zero, -0x58F0($at)
/* 0x0001FBF0 0x8008F7F0 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0001FBF4 0x8008F7F4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001FBF8 0x8008F7F8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
