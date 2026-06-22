/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004DCE8..0x0004DD20 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue fn (saves $s0), jr $ra at 0x0004DD18 + delay 0x0004DD1C */
/* function boundary candidate: func_0004DCE8, size=56, kind=prologue */
func_0004DCE8:
/* 0x0004DCE8 0x800BD8E8 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004DCEC 0x800BD8EC 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x0004DCF0 0x800BD8F0 0x00808021 */ .word 0x00808021 # move $s0, $a0
/* 0x0004DCF4 0x800BD8F4 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x0004DCF8 0x800BD8F8 0x0C05C1E5 */ .word 0x0C05C1E5 # jal 0x80170794
/* 0x0004DCFC 0x800BD8FC 0x24040001 */ .word 0x24040001 # addiu $a0, $zero, 0x1
/* 0x0004DD00 0x800BD900 0x14400003 */ .word 0x14400003 # bne $v0, $zero, 0x800BD910
/* 0x0004DD04 0x800BD904 0x00000000 */ .word 0x00000000 # nop
/* 0x0004DD08 0x800BD908 0x0C0687EB */ .word 0x0C0687EB # jal 0x801A1FAC
/* 0x0004DD0C 0x800BD90C 0x02002021 */ .word 0x02002021 # move $a0, $s0
/* 0x0004DD10 0x800BD910 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x0004DD14 0x800BD914 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x0004DD18 0x800BD918 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004DD1C 0x800BD91C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
