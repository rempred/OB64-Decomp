/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00231000_00241000.s
 * z64 range: 0x0023E708..0x0023E744 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf un-merged from plan idx25 (over-merge). Entry move $a1,$zero; move $a0,$zero; lui $v1; lw $v1; no $sp adjust. Counts records with flag 0x10 set, returns xori/sltiu predicate. Ends jr $ra at 0x0023E73C + delay (sltiu $v0,$v0,0x1) at 0x0023E740 = slice end 0x0023E744. */
/* 0x0023E708 0x802AE308 0x00002821 */ .word 0x00002821 # move $a1, $zero
/* 0x0023E70C 0x802AE30C 0x00002021 */ .word 0x00002021 # move $a0, $zero
/* 0x0023E710 0x802AE310 0x3C03801F */ .word 0x3C03801F # lui $v1, 0x801F
/* 0x0023E714 0x802AE314 0x8C63FE48 */ .word 0x8C63FE48 # lw $v1, -0x1B8($v1)
/* 0x0023E718 0x802AE318 0x94620060 */ .word 0x94620060 # lhu $v0, 0x60($v1)
/* 0x0023E71C 0x802AE31C 0x24840001 */ .word 0x24840001 # addiu $a0, $a0, 0x1
/* 0x0023E720 0x802AE320 0x30420010 */ .word 0x30420010 # andi $v0, $v0, 0x0010
/* 0x0023E724 0x802AE324 0x0002102B */ .word 0x0002102B # sltu $v0, $zero, $v0
/* 0x0023E728 0x802AE328 0x00A22821 */ .word 0x00A22821 # addu $a1, $a1, $v0
/* 0x0023E72C 0x802AE32C 0x28820004 */ .word 0x28820004 # slti $v0, $a0, 0x4
/* 0x0023E730 0x802AE330 0x1440FFF9 */ .word 0x1440FFF9 # bne $v0, $zero, 0x802AE318
/* 0x0023E734 0x802AE334 0x24630068 */ .word 0x24630068 # addiu $v1, $v1, 0x68
/* 0x0023E738 0x802AE338 0x38A20004 */ .word 0x38A20004 # xori $v0, $a1, 0x0004
/* 0x0023E73C 0x802AE33C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0023E740 0x802AE340 0x2C420001 */ .word 0x2C420001 # sltiu $v0, $v0, 0x1
