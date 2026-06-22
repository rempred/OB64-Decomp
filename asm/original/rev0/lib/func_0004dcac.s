/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004DCAC..0x0004DCE8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue fn, jr $ra at 0x0004DCE0 + delay 0x0004DCE4 */
/* function boundary candidate: func_0004DCAC, size=60, kind=prologue */
func_0004DCAC:
/* 0x0004DCAC 0x800BD8AC 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004DCB0 0x800BD8B0 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004DCB4 0x800BD8B4 0x0C05C1E5 */ .word 0x0C05C1E5 # jal 0x80170794
/* 0x0004DCB8 0x800BD8B8 0x24040001 */ .word 0x24040001 # addiu $a0, $zero, 0x1
/* 0x0004DCBC 0x800BD8BC 0x14400005 */ .word 0x14400005 # bne $v0, $zero, 0x800BD8D4
/* 0x0004DCC0 0x800BD8C0 0x3402800A */ .word 0x3402800A # ori $v0, $zero, 0x800A
/* 0x0004DCC4 0x800BD8C4 0x0C0686D5 */ .word 0x0C0686D5 # jal 0x801A1B54
/* 0x0004DCC8 0x800BD8C8 0x00000000 */ .word 0x00000000 # nop
/* 0x0004DCCC 0x800BD8CC 0x10400003 */ .word 0x10400003 # beq $v0, $zero, 0x800BD8DC
/* 0x0004DCD0 0x800BD8D0 0x3402800A */ .word 0x3402800A # ori $v0, $zero, 0x800A
/* 0x0004DCD4 0x800BD8D4 0x3C01800C */ .word 0x3C01800C # lui $at, 0x800C
/* 0x0004DCD8 0x800BD8D8 0xA4224C26 */ .word 0xA4224C26 # sh $v0, 0x4C26($at)
/* 0x0004DCDC 0x800BD8DC 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004DCE0 0x800BD8E0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004DCE4 0x800BD8E4 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
