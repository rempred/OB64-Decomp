/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x00201B8C..0x00201BAC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf accessor (offset +4). jr$ra@0x00201BA4 + delay lh@0x00201BA8. */
func_00201B8C:
/* 0x00201B8C 0x8027178C 0x3C03801D */ .word 0x3C03801D # lui $v1, 0x801D
/* 0x00201B90 0x80271790 0x8C6306A8 */ .word 0x8C6306A8 # lw $v1, 0x6A8($v1)
/* 0x00201B94 0x80271794 0x00041040 */ .word 0x00041040 # sll $v0, $a0, 1
/* 0x00201B98 0x80271798 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00201B9C 0x8027179C 0x00021040 */ .word 0x00021040 # sll $v0, $v0, 1
/* 0x00201BA0 0x802717A0 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x00201BA4 0x802717A4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00201BA8 0x802717A8 0x84420004 */ .word 0x84420004 # lh $v0, 0x4($v0)
