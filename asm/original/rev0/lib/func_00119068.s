/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00111000_00121000.s
 * z64 range: 0x00119068..0x00119094 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* lui/lw load 0x801F0E00->$a0 and 0x801F0E04->$a1 (read by jal 0x801D2A14 inside the addiu $sp,-0x18 prologue body). Folded forward; inner parent label func_00119078 embedded in body. */
func_00119068:
/* 0x00119068 0x80188C68 0x3C04801F */ .word 0x3C04801F # lui $a0, 0x801F
/* 0x0011906C 0x80188C6C 0x8C840E00 */ .word 0x8C840E00 # lw $a0, 0xE00($a0)
/* 0x00119070 0x80188C70 0x3C05801F */ .word 0x3C05801F # lui $a1, 0x801F
/* 0x00119074 0x80188C74 0x8CA50E04 */ .word 0x8CA50E04 # lw $a1, 0xE04($a1)

/* function boundary candidate: func_00119078, size=28, kind=prologue */
func_00119078:
/* 0x00119078 0x80188C78 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0011907C 0x80188C7C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00119080 0x80188C80 0x0C074A85 */ .word 0x0C074A85 # jal 0x801D2A14
/* 0x00119084 0x80188C84 0x24060001 */ .word 0x24060001 # addiu $a2, $zero, 0x1
/* 0x00119088 0x80188C88 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0011908C 0x80188C8C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00119090 0x80188C90 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
