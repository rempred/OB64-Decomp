/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x002864F8..0x00286524 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf: beq$a0,$zero branch, lui 0x800C/lhu +0x4B28, and$v0,$a0, sltiu; internal j 0x8022A54C tail-jump. Ends jr$ra@0x28651C + delay nop@0x286520. */
/* 0x002864F8 0x802F60F8 0x10800006 */ .word 0x10800006 # beq $a0, $zero, 0x802F6114
/* 0x002864FC 0x802F60FC 0x00000000 */ .word 0x00000000 # nop
/* 0x00286500 0x802F6100 0x3C02800C */ .word 0x3C02800C # lui $v0, 0x800C
/* 0x00286504 0x802F6104 0x94424B28 */ .word 0x94424B28 # lhu $v0, 0x4B28($v0)
/* 0x00286508 0x802F6108 0x00441024 */ .word 0x00441024 # and $v0, $v0, $a0
/* 0x0028650C 0x802F610C 0x0808A953 */ .word 0x0808A953 # j 0x8022A54C
/* 0x00286510 0x802F6110 0x2C420001 */ .word 0x2C420001 # sltiu $v0, $v0, 0x1
/* 0x00286514 0x802F6114 0x3C02800C */ .word 0x3C02800C # lui $v0, 0x800C
/* 0x00286518 0x802F6118 0x94424B28 */ .word 0x94424B28 # lhu $v0, 0x4B28($v0)
/* 0x0028651C 0x802F611C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00286520 0x802F6120 0x00000000 */ .word 0x00000000 # nop
