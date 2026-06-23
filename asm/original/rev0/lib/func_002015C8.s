/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x002015C8..0x0020161C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf. Table lookup, internal j 0x801BE168 tail; jr$ra@0x00201614 + delay andi@0x00201618. */
func_002015C8:
/* 0x002015C8 0x802711C8 0x000410C0 */ .word 0x000410C0 # sll $v0, $a0, 3
/* 0x002015CC 0x802711CC 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x002015D0 0x802711D0 0x000210C0 */ .word 0x000210C0 # sll $v0, $v0, 3
/* 0x002015D4 0x802711D4 0x3C018018 */ .word 0x3C018018 # lui $at, 0x8018
/* 0x002015D8 0x802711D8 0x00220821 */ .word 0x00220821 # addu $at, $at, $v0
/* 0x002015DC 0x802711DC 0x90227C59 */ .word 0x90227C59 # lbu $v0, 0x7C59($at)
/* 0x002015E0 0x802711E0 0x10450003 */ .word 0x10450003 # beq $v0, $a1, 0x802711F0
/* 0x002015E4 0x802711E4 0x00051880 */ .word 0x00051880 # sll $v1, $a1, 2
/* 0x002015E8 0x802711E8 0x0806F85A */ .word 0x0806F85A # j 0x801BE168
/* 0x002015EC 0x802711EC 0x00061040 */ .word 0x00061040 # sll $v0, $a2, 1
/* 0x002015F0 0x802711F0 0x00061040 */ .word 0x00061040 # sll $v0, $a2, 1
/* 0x002015F4 0x802711F4 0x00041880 */ .word 0x00041880 # sll $v1, $a0, 2
/* 0x002015F8 0x802711F8 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x002015FC 0x802711FC 0x3C03801D */ .word 0x3C03801D # lui $v1, 0x801D
/* 0x00201600 0x80271200 0x8C630690 */ .word 0x8C630690 # lw $v1, 0x690($v1)
/* 0x00201604 0x80271204 0x00471021 */ .word 0x00471021 # addu $v0, $v0, $a3
/* 0x00201608 0x80271208 0x00021040 */ .word 0x00021040 # sll $v0, $v0, 1
/* 0x0020160C 0x8027120C 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x00201610 0x80271210 0x94420000 */ .word 0x94420000 # lhu $v0, 0x0($v0)
/* 0x00201614 0x80271214 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00201618 0x80271218 0x30420FFF */ .word 0x30420FFF # andi $v0, $v0, 0x0FFF
