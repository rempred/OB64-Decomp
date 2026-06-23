/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000F1000_00101000.s
 * z64 range: 0x00100298..0x001002C8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* FRAMELESS LEAF recovered. Reads 0x801B3E20-> +0x444/+0x460/+0x47C flags; jr $ra/move $v0,$a0 at 0x001002C0-0x001002C4. */
/* 0x00100298 0x8016FE98 0x3C03801B */ .word 0x3C03801B # lui $v1, 0x801B
/* 0x0010029C 0x8016FE9C 0x8C633E20 */ .word 0x8C633E20 # lw $v1, 0x3E20($v1)
/* 0x001002A0 0x8016FEA0 0x94620444 */ .word 0x94620444 # lhu $v0, 0x444($v1)
/* 0x001002A4 0x8016FEA4 0x10400006 */ .word 0x10400006 # beq $v0, $zero, 0x8016FEC0
/* 0x001002A8 0x8016FEA8 0x00002021 */ .word 0x00002021 # move $a0, $zero
/* 0x001002AC 0x8016FEAC 0x94620460 */ .word 0x94620460 # lhu $v0, 0x460($v1)
/* 0x001002B0 0x8016FEB0 0x10400003 */ .word 0x10400003 # beq $v0, $zero, 0x8016FEC0
/* 0x001002B4 0x8016FEB4 0x00000000 */ .word 0x00000000 # nop
/* 0x001002B8 0x8016FEB8 0x9462047C */ .word 0x9462047C # lhu $v0, 0x47C($v1)
/* 0x001002BC 0x8016FEBC 0x0002202B */ .word 0x0002202B # sltu $a0, $zero, $v0
/* 0x001002C0 0x8016FEC0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001002C4 0x8016FEC4 0x00801021 */ .word 0x00801021 # move $v0, $a0
