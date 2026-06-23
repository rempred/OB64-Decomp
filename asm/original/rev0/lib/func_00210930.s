/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x00210930..0x00210970 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* PREAMBLE-ORPHAN folded FORWARD: 2-word read-before-write preamble (lui $a0,0x801D; lw $a0,-0x340($a0)) at 0x00210930 loads $a0 which the addiu$sp,-0x18 body at 0x00210938 passes to jal 0x800712C4 before writing $a0. True entry is 0x00210930. jr$ra@0x00210968 + delay addiu$sp,0x18@0x0021096C. */
func_00210930:
/* 0x00210930 0x80280530 0x3C04801D */ .word 0x3C04801D # lui $a0, 0x801D
/* 0x00210934 0x80280534 0x8C84FCC0 */ .word 0x8C84FCC0 # lw $a0, -0x340($a0)

/* function boundary candidate: func_00210938, size=56, kind=prologue */
func_00210938:
/* 0x00210938 0x80280538 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0021093C 0x8028053C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00210940 0x80280540 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x00210944 0x80280544 0x00000000 */ .word 0x00000000 # nop
/* 0x00210948 0x80280548 0x3C04801D */ .word 0x3C04801D # lui $a0, 0x801D
/* 0x0021094C 0x8028054C 0x8C8406D0 */ .word 0x8C8406D0 # lw $a0, 0x6D0($a0)
/* 0x00210950 0x80280550 0x3C01801D */ .word 0x3C01801D # lui $at, 0x801D
/* 0x00210954 0x80280554 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x00210958 0x80280558 0xAC20FCC0 */ .word 0xAC20FCC0 # sw $zero, -0x340($at)
/* 0x0021095C 0x8028055C 0x3C01801D */ .word 0x3C01801D # lui $at, 0x801D
/* 0x00210960 0x80280560 0xAC2006D0 */ .word 0xAC2006D0 # sw $zero, 0x6D0($at)
/* 0x00210964 0x80280564 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00210968 0x80280568 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0021096C 0x8028056C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
