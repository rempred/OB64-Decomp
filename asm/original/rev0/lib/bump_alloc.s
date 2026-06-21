/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001FC90..0x0001FCE0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0001FC90 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
bump_alloc:
/* function boundary candidate: func_0001FC90, size=72, kind=leaf */
func_0001FC90:
/* 0x0001FC90 0x8008F890 0x8FA20010 */ .word 0x8FA20010 # lw $v0, 0x10($sp)
/* 0x0001FC94 0x8008F894 0x00E20018 */ .word 0x00E20018 # mult $a3, $v0
/* 0x0001FC98 0x8008F898 0x00003812 */ .word 0x00003812 # mflo $a3
/* 0x0001FC9C 0x8008F89C 0x8CC30008 */ .word 0x8CC30008 # lw $v1, 0x8($a2)
/* 0x0001FCA0 0x8008F8A0 0x8CC20000 */ .word 0x8CC20000 # lw $v0, 0x0($a2)
/* 0x0001FCA4 0x8008F8A4 0x2404FFF0 */ .word 0x2404FFF0 # addiu $a0, $zero, -0x10
/* 0x0001FCA8 0x8008F8A8 0x8CC50004 */ .word 0x8CC50004 # lw $a1, 0x4($a2)
/* 0x0001FCAC 0x8008F8AC 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x0001FCB0 0x8008F8B0 0x24E7000F */ .word 0x24E7000F # addiu $a3, $a3, 0xF
/* 0x0001FCB4 0x8008F8B4 0x00E43824 */ .word 0x00E43824 # and $a3, $a3, $a0
/* 0x0001FCB8 0x8008F8B8 0x00A72021 */ .word 0x00A72021 # addu $a0, $a1, $a3
/* 0x0001FCBC 0x8008F8BC 0x0044102B */ .word 0x0044102B # sltu $v0, $v0, $a0
/* 0x0001FCC0 0x8008F8C0 0x14400003 */ .word 0x14400003 # bne $v0, $zero, 0x8008F8D0
/* 0x0001FCC4 0x8008F8C4 0x00004021 */ .word 0x00004021 # move $t0, $zero
/* 0x0001FCC8 0x8008F8C8 0x00A04021 */ .word 0x00A04021 # move $t0, $a1
/* 0x0001FCCC 0x8008F8CC 0xACC40004 */ .word 0xACC40004 # sw $a0, 0x4($a2)
/* 0x0001FCD0 0x8008F8D0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001FCD4 0x8008F8D4 0x01001021 */ .word 0x01001021 # move $v0, $t0
/* 0x0001FCD8 0x8008F8D8 0x00000000 */ .word 0x00000000 # nop
/* 0x0001FCDC 0x8008F8DC 0x00000000 */ .word 0x00000000 # nop
