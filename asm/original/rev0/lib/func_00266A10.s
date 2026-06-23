/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x00266A10..0x00266A30 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Thin wrapper leaf: jal 0x80211C10 with addiu $a0,$a0,0x14; returns 0. */
/* function boundary candidate: func_00266A10, size=32, kind=prologue */
func_00266A10:
/* 0x00266A10 0x802D6610 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00266A14 0x802D6614 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00266A18 0x802D6618 0x0C084704 */ .word 0x0C084704 # jal 0x80211C10
/* 0x00266A1C 0x802D661C 0x24840014 */ .word 0x24840014 # addiu $a0, $a0, 0x14
/* 0x00266A20 0x802D6620 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00266A24 0x802D6624 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x00266A28 0x802D6628 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00266A2C 0x802D662C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
