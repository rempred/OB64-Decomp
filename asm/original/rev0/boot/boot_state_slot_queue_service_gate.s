/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000071C8_00011000.s
 * z64 range: 0x000071C8..0x00007200 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_000071C8, size=56, kind=leaf */
func_000071C8:
/* 0x000071C8 0x80076DC8 0x3C02800C */ .word 0x3C02800C # lui $v0, 0x800C
/* 0x000071CC 0x80076DCC 0x944249D0 */ .word 0x944249D0 # lhu $v0, 0x49D0($v0)

/* function boundary candidate: func_000071D0, size=48, kind=prologue */
func_000071D0:
/* 0x000071D0 0x80076DD0 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x000071D4 0x80076DD4 0x10400007 */ .word 0x10400007 # beq $v0, $zero, 0x80076DF4
/* 0x000071D8 0x80076DD8 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x000071DC 0x80076DDC 0x0C01DD7B */ .word 0x0C01DD7B # jal 0x800775EC
/* 0x000071E0 0x80076DE0 0x00000000 */ .word 0x00000000 # nop
/* 0x000071E4 0x80076DE4 0x0C01DEFE */ .word 0x0C01DEFE # jal 0x80077BF8
/* 0x000071E8 0x80076DE8 0x00000000 */ .word 0x00000000 # nop
/* 0x000071EC 0x80076DEC 0x0C01E067 */ .word 0x0C01E067 # jal 0x8007819C
/* 0x000071F0 0x80076DF0 0x00000000 */ .word 0x00000000 # nop
/* 0x000071F4 0x80076DF4 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x000071F8 0x80076DF8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000071FC 0x80076DFC 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
