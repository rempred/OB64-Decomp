/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020161C..0x00201670 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf. Table lookup, internal j 0x801BE1BC tail; jr$ra@0x00201668 + delay srl@0x0020166C. */
func_0020161C:
/* 0x0020161C 0x8027121C 0x000410C0 */ .word 0x000410C0 # sll $v0, $a0, 3
/* 0x00201620 0x80271220 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00201624 0x80271224 0x000210C0 */ .word 0x000210C0 # sll $v0, $v0, 3
/* 0x00201628 0x80271228 0x3C018018 */ .word 0x3C018018 # lui $at, 0x8018
/* 0x0020162C 0x8027122C 0x00220821 */ .word 0x00220821 # addu $at, $at, $v0
/* 0x00201630 0x80271230 0x90227C59 */ .word 0x90227C59 # lbu $v0, 0x7C59($at)
/* 0x00201634 0x80271234 0x10450003 */ .word 0x10450003 # beq $v0, $a1, 0x80271244
/* 0x00201638 0x80271238 0x00051880 */ .word 0x00051880 # sll $v1, $a1, 2
/* 0x0020163C 0x8027123C 0x0806F86F */ .word 0x0806F86F # j 0x801BE1BC
/* 0x00201640 0x80271240 0x00061040 */ .word 0x00061040 # sll $v0, $a2, 1
/* 0x00201644 0x80271244 0x00061040 */ .word 0x00061040 # sll $v0, $a2, 1
/* 0x00201648 0x80271248 0x00041880 */ .word 0x00041880 # sll $v1, $a0, 2
/* 0x0020164C 0x8027124C 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x00201650 0x80271250 0x3C03801D */ .word 0x3C03801D # lui $v1, 0x801D
/* 0x00201654 0x80271254 0x8C630690 */ .word 0x8C630690 # lw $v1, 0x690($v1)
/* 0x00201658 0x80271258 0x00471021 */ .word 0x00471021 # addu $v0, $v0, $a3
/* 0x0020165C 0x8027125C 0x00021040 */ .word 0x00021040 # sll $v0, $v0, 1
/* 0x00201660 0x80271260 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x00201664 0x80271264 0x94420000 */ .word 0x94420000 # lhu $v0, 0x0($v0)
/* 0x00201668 0x80271268 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020166C 0x8027126C 0x00021302 */ .word 0x00021302 # srl $v0, $v0, 12
