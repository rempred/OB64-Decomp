/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002A1000_002B1000.s
 * z64 range: 0x002A4680..0x002A46D0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Preamble-orphan fold-forward: starts at the read-before-write preamble (lui $v0,0x8023 / lw $v0,-0x568C($v0) at 0x002A4680/0x002A4684) consumed by the prologue body at 0x002A4694 (lw $s0,0x1CA4($v0)). Real prologue addiu $sp,-0x18 at 0x002A4688. Returns jr $ra 0x002A46C4 + delay 0x002A46C8; trailing alignment nop at 0x002A46CC attaches here. */
func_002A4680:
/* 0x002A4680 0x80314280 0x3C028023 */ .word 0x3C028023 # lui $v0, 0x8023
/* 0x002A4684 0x80314284 0x8C42A974 */ .word 0x8C42A974 # lw $v0, -0x568C($v0)

/* function boundary candidate: func_002A4688, size=68, kind=prologue */
func_002A4688:
/* 0x002A4688 0x80314288 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x002A468C 0x8031428C 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x002A4690 0x80314290 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x002A4694 0x80314294 0x8C501CA4 */ .word 0x8C501CA4 # lw $s0, 0x1CA4($v0)
/* 0x002A4698 0x80314298 0x12000008 */ .word 0x12000008 # beq $s0, $zero, 0x803142BC
/* 0x002A469C 0x8031429C 0x00000000 */ .word 0x00000000 # nop
/* 0x002A46A0 0x803142A0 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x002A46A4 0x803142A4 0x8E04000C */ .word 0x8E04000C # lw $a0, 0xC($s0)
/* 0x002A46A8 0x803142A8 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x002A46AC 0x803142AC 0x02002021 */ .word 0x02002021 # move $a0, $s0
/* 0x002A46B0 0x803142B0 0x3C028023 */ .word 0x3C028023 # lui $v0, 0x8023
/* 0x002A46B4 0x803142B4 0x8C42A974 */ .word 0x8C42A974 # lw $v0, -0x568C($v0)
/* 0x002A46B8 0x803142B8 0xAC401CA4 */ .word 0xAC401CA4 # sw $zero, 0x1CA4($v0)
/* 0x002A46BC 0x803142BC 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x002A46C0 0x803142C0 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x002A46C4 0x803142C4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002A46C8 0x803142C8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
/* 0x002A46CC 0x803142CC 0x00000000 */ .word 0x00000000 # nop
