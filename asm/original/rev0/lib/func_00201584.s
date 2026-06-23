/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x00201584..0x002015C8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf: sll $v0,$a0,3 table-index (reads $a0); lui $at,0x8018 table lookup; internal j 0x801BE130 tail; jr$ra@0x002015C0 + delay lbu@0x2015C4. [adversarial: split out of former func_0020156C]. */
func_00201584:
/* 0x00201584 0x80271184 0x000410C0 */ .word 0x000410C0 # sll $v0, $a0, 3
/* 0x00201588 0x80271188 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x0020158C 0x8027118C 0x000210C0 */ .word 0x000210C0 # sll $v0, $v0, 3
/* 0x00201590 0x80271190 0x3C018018 */ .word 0x3C018018 # lui $at, 0x8018
/* 0x00201594 0x80271194 0x00220821 */ .word 0x00220821 # addu $at, $at, $v0
/* 0x00201598 0x80271198 0x90227C59 */ .word 0x90227C59 # lbu $v0, 0x7C59($at)
/* 0x0020159C 0x8027119C 0x10450005 */ .word 0x10450005 # beq $v0, $a1, 0x802711B4
/* 0x002015A0 0x802711A0 0x00000000 */ .word 0x00000000 # nop
/* 0x002015A4 0x802711A4 0x3C02801D */ .word 0x3C02801D # lui $v0, 0x801D
/* 0x002015A8 0x802711A8 0x8C420684 */ .word 0x8C420684 # lw $v0, 0x684($v0)
/* 0x002015AC 0x802711AC 0x0806F84C */ .word 0x0806F84C # j 0x801BE130
/* 0x002015B0 0x802711B0 0x00451021 */ .word 0x00451021 # addu $v0, $v0, $a1
/* 0x002015B4 0x802711B4 0x3C02801D */ .word 0x3C02801D # lui $v0, 0x801D
/* 0x002015B8 0x802711B8 0x8C420684 */ .word 0x8C420684 # lw $v0, 0x684($v0)
/* 0x002015BC 0x802711BC 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x002015C0 0x802711C0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002015C4 0x802711C4 0x90420000 */ .word 0x90420000 # lbu $v0, 0x0($v0)
