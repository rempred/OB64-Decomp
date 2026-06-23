/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00131000_00141000.s
 * z64 range: 0x00139C88..0x00139CE8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* 2-word read-before-write preamble (lui $v0; lw $v0,0x1070($v0)) at 0x139C88 feeds blez $v0 at 0x139C94 of the addiu $sp,-0x8 body at 0x139C90; folded forward. This is the true func_00139C90 entry. Ends jr $ra 0x139CE0 + delay 0x139CE4. */
func_00139C88:
/* 0x00139C88 0x801A9888 0x3C02801F */ .word 0x3C02801F # lui $v0, 0x801F
/* 0x00139C8C 0x801A988C 0x8C421070 */ .word 0x8C421070 # lw $v0, 0x1070($v0)

/* function boundary candidate: func_00139C90, size=300, kind=prologue */
func_00139C90:
/* 0x00139C90 0x801A9890 0x27BDFFF8 */ .word 0x27BDFFF8 # addiu $sp, $sp, -0x8
/* 0x00139C94 0x801A9894 0x18400011 */ .word 0x18400011 # blez $v0, 0x801A98DC
/* 0x00139C98 0x801A9898 0x00002021 */ .word 0x00002021 # move $a0, $zero
/* 0x00139C9C 0x801A989C 0x00403021 */ .word 0x00403021 # move $a2, $v0
/* 0x00139CA0 0x801A98A0 0x00002821 */ .word 0x00002821 # move $a1, $zero
/* 0x00139CA4 0x801A98A4 0x3C038019 */ .word 0x3C038019 # lui $v1, 0x8019
/* 0x00139CA8 0x801A98A8 0x00651821 */ .word 0x00651821 # addu $v1, $v1, $a1
/* 0x00139CAC 0x801A98AC 0x946351CC */ .word 0x946351CC # lhu $v1, 0x51CC($v1)
/* 0x00139CB0 0x801A98B0 0x30620010 */ .word 0x30620010 # andi $v0, $v1, 0x0010
/* 0x00139CB4 0x801A98B4 0x10400005 */ .word 0x10400005 # beq $v0, $zero, 0x801A98CC
/* 0x00139CB8 0x801A98B8 0x30620002 */ .word 0x30620002 # andi $v0, $v1, 0x0002
/* 0x00139CBC 0x801A98BC 0x10400007 */ .word 0x10400007 # beq $v0, $zero, 0x801A98DC
/* 0x00139CC0 0x801A98C0 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x00139CC4 0x801A98C4 0x08079568 */ .word 0x08079568 # j 0x801E55A0
/* 0x00139CC8 0x801A98C8 0x00000000 */ .word 0x00000000 # nop
/* 0x00139CCC 0x801A98CC 0x24840001 */ .word 0x24840001 # addiu $a0, $a0, 0x1
/* 0x00139CD0 0x801A98D0 0x0086102A */ .word 0x0086102A # slt $v0, $a0, $a2
/* 0x00139CD4 0x801A98D4 0x1440FFF3 */ .word 0x1440FFF3 # bne $v0, $zero, 0x801A98A4
/* 0x00139CD8 0x801A98D8 0x24A50024 */ .word 0x24A50024 # addiu $a1, $a1, 0x24
/* 0x00139CDC 0x801A98DC 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x00139CE0 0x801A98E0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00139CE4 0x801A98E4 0x27BD0008 */ .word 0x27BD0008 # addiu $sp, $sp, 0x8
