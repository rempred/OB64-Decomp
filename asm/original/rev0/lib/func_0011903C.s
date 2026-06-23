/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00111000_00121000.s
 * z64 range: 0x0011903C..0x00119068 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* lui/lw load 0x801F0E04->$a0 and 0x801F0E00->$a1 (read by jal 0x801D2A14 inside the addiu $sp,-0x18 prologue body). Folded forward; inner parent label func_0011904C embedded in body. */
func_0011903C:
/* 0x0011903C 0x80188C3C 0x3C04801F */ .word 0x3C04801F # lui $a0, 0x801F
/* 0x00119040 0x80188C40 0x8C840E04 */ .word 0x8C840E04 # lw $a0, 0xE04($a0)
/* 0x00119044 0x80188C44 0x3C05801F */ .word 0x3C05801F # lui $a1, 0x801F
/* 0x00119048 0x80188C48 0x8CA50E00 */ .word 0x8CA50E00 # lw $a1, 0xE00($a1)

/* function boundary candidate: func_0011904C, size=28, kind=prologue */
func_0011904C:
/* 0x0011904C 0x80188C4C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00119050 0x80188C50 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00119054 0x80188C54 0x0C074A85 */ .word 0x0C074A85 # jal 0x801D2A14
/* 0x00119058 0x80188C58 0x00003021 */ .word 0x00003021 # move $a2, $zero
/* 0x0011905C 0x80188C5C 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00119060 0x80188C60 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00119064 0x80188C64 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
