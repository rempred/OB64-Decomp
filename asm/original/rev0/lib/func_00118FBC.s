/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00111000_00121000.s
 * z64 range: 0x00118FBC..0x00118FE8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* lui/lw load 0x801F0E00->$a0 and 0x801F0E04->$a1 (read by jal 0x801D2A14 inside the addiu $sp,-0x18 prologue body). Folded forward; inner parent label func_00118FCC embedded in body. */
func_00118FBC:
/* 0x00118FBC 0x80188BBC 0x3C04801F */ .word 0x3C04801F # lui $a0, 0x801F
/* 0x00118FC0 0x80188BC0 0x8C840E00 */ .word 0x8C840E00 # lw $a0, 0xE00($a0)
/* 0x00118FC4 0x80188BC4 0x3C05801F */ .word 0x3C05801F # lui $a1, 0x801F
/* 0x00118FC8 0x80188BC8 0x8CA50E04 */ .word 0x8CA50E04 # lw $a1, 0xE04($a1)

/* function boundary candidate: func_00118FCC, size=28, kind=prologue */
func_00118FCC:
/* 0x00118FCC 0x80188BCC 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00118FD0 0x80188BD0 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00118FD4 0x80188BD4 0x0C074A85 */ .word 0x0C074A85 # jal 0x801D2A14
/* 0x00118FD8 0x80188BD8 0x00003021 */ .word 0x00003021 # move $a2, $zero
/* 0x00118FDC 0x80188BDC 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00118FE0 0x80188BE0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00118FE4 0x80188BE4 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
