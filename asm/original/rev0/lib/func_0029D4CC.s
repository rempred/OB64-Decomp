/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00291000_002A1000.s
 * z64 range: 0x0029D4CC..0x0029D4F0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless-ish small wrapper: arg shuffle + jal 0x801CCA5C. jr$ra@D4E8 + delay@D4EC. */
/* function boundary candidate: func_0029D4CC, size=36, kind=prologue */
func_0029D4CC:
/* 0x0029D4CC 0x8030D0CC 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0029D4D0 0x8030D0D0 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0029D4D4 0x8030D0D4 0x00A01021 */ .word 0x00A01021 # move $v0, $a1
/* 0x0029D4D8 0x8030D0D8 0x00C02821 */ .word 0x00C02821 # move $a1, $a2
/* 0x0029D4DC 0x8030D0DC 0x0C073297 */ .word 0x0C073297 # jal 0x801CCA5C
/* 0x0029D4E0 0x8030D0E0 0x00403021 */ .word 0x00403021 # move $a2, $v0
/* 0x0029D4E4 0x8030D0E4 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0029D4E8 0x8030D0E8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0029D4EC 0x8030D0EC 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
