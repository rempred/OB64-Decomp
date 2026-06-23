/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00131000_00141000.s
 * z64 range: 0x00131C70..0x00131CC4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry: 2-word read-before-write preamble (lui $v0; lw $v0,0x3670 at 0x131C70-0x131C74) feeding inner prologue addiu $sp,-0x18 / beq $v0 at 0x131C78. Folded forward; own label func_00131C70, never inner func_00131C78. Internal jal 0x80079618. jr $ra 0x131CBC + delay 0x131CC0; ends at 0x131CC4 (preamble of next). */
func_00131C70:
/* 0x00131C70 0x801A1870 0x3C02801F */ .word 0x3C02801F # lui $v0, 0x801F
/* 0x00131C74 0x801A1874 0x8C423670 */ .word 0x8C423670 # lw $v0, 0x3670($v0)

/* function boundary candidate: func_00131C78, size=76, kind=prologue */
func_00131C78:
/* 0x00131C78 0x801A1878 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00131C7C 0x801A187C 0x1040000E */ .word 0x1040000E # beq $v0, $zero, 0x801A18B8
/* 0x00131C80 0x801A1880 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00131C84 0x801A1884 0x3C040218 */ .word 0x3C040218 # lui $a0, 0x0218
/* 0x00131C88 0x801A1888 0x3C05801F */ .word 0x3C05801F # lui $a1, 0x801F
/* 0x00131C8C 0x801A188C 0x90A5B2D4 */ .word 0x90A5B2D4 # lbu $a1, -0x4D2C($a1)
/* 0x00131C90 0x801A1890 0x3484E9B4 */ .word 0x3484E9B4 # ori $a0, $a0, 0xE9B4
/* 0x00131C94 0x801A1894 0x0C01E586 */ .word 0x0C01E586 # jal 0x80079618
/* 0x00131C98 0x801A1898 0x2406FFEF */ .word 0x2406FFEF # addiu $a2, $zero, -0x11
/* 0x00131C9C 0x801A189C 0x240200FF */ .word 0x240200FF # addiu $v0, $zero, 0xFF
/* 0x00131CA0 0x801A18A0 0x3C01801F */ .word 0x3C01801F # lui $at, 0x801F
/* 0x00131CA4 0x801A18A4 0xAC203670 */ .word 0xAC203670 # sw $zero, 0x3670($at)
/* 0x00131CA8 0x801A18A8 0x3C01801F */ .word 0x3C01801F # lui $at, 0x801F
/* 0x00131CAC 0x801A18AC 0xA022B2D4 */ .word 0xA022B2D4 # sb $v0, -0x4D2C($at)
/* 0x00131CB0 0x801A18B0 0x3C01801F */ .word 0x3C01801F # lui $at, 0x801F
/* 0x00131CB4 0x801A18B4 0xA020B2D5 */ .word 0xA020B2D5 # sb $zero, -0x4D2B($at)
/* 0x00131CB8 0x801A18B8 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00131CBC 0x801A18BC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00131CC0 0x801A18C0 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
