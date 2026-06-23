/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00231000_00241000.s
 * z64 range: 0x0023B680..0x0023B6C4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Recovered frameless range-check helper the plan missed. addiu$v1,$a0,-0x20; sltiu/xori comparisons against 0x20-0x21, 0x22, 0x23, 0x67; ORs results; jr$ra@0x0023B6BC + delay move$v0,$a1@0x0023B6C0. Returns 1 if $a0 in the checked set else 0. */
/* 0x0023B680 0x802AB280 0x2483FFE0 */ .word 0x2483FFE0 # addiu $v1, $a0, -0x20
/* 0x0023B684 0x802AB284 0x2C630002 */ .word 0x2C630002 # sltiu $v1, $v1, 0x2
/* 0x0023B688 0x802AB288 0x38820022 */ .word 0x38820022 # xori $v0, $a0, 0x0022
/* 0x0023B68C 0x802AB28C 0x2C420001 */ .word 0x2C420001 # sltiu $v0, $v0, 0x1
/* 0x0023B690 0x802AB290 0x00621825 */ .word 0x00621825 # or $v1, $v1, $v0
/* 0x0023B694 0x802AB294 0x14600008 */ .word 0x14600008 # bne $v1, $zero, 0x802AB2B8
/* 0x0023B698 0x802AB298 0x00002821 */ .word 0x00002821 # move $a1, $zero
/* 0x0023B69C 0x802AB29C 0x38830023 */ .word 0x38830023 # xori $v1, $a0, 0x0023
/* 0x0023B6A0 0x802AB2A0 0x2C630001 */ .word 0x2C630001 # sltiu $v1, $v1, 0x1
/* 0x0023B6A4 0x802AB2A4 0x38820067 */ .word 0x38820067 # xori $v0, $a0, 0x0067
/* 0x0023B6A8 0x802AB2A8 0x2C420001 */ .word 0x2C420001 # sltiu $v0, $v0, 0x1
/* 0x0023B6AC 0x802AB2AC 0x00621825 */ .word 0x00621825 # or $v1, $v1, $v0
/* 0x0023B6B0 0x802AB2B0 0x10600002 */ .word 0x10600002 # beq $v1, $zero, 0x802AB2BC
/* 0x0023B6B4 0x802AB2B4 0x00000000 */ .word 0x00000000 # nop
/* 0x0023B6B8 0x802AB2B8 0x24050001 */ .word 0x24050001 # addiu $a1, $zero, 0x1
/* 0x0023B6BC 0x802AB2BC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0023B6C0 0x802AB2C0 0x00A01021 */ .word 0x00A01021 # move $v0, $a1
