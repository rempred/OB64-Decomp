/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00291000_002A1000.s
 * z64 range: 0x002A053C..0x002A0548 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf setter un-merged from func_002A0390 tail: lui$at@0x002A053C / jr$ra@0x002A0540 / sh$a0,-0x63F4($at)@0x002A0544 (delay). */
/* 0x002A053C 0x8031013C 0x3C01800F */ .word 0x3C01800F # lui $at, 0x800F
/* 0x002A0540 0x80310140 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002A0544 0x80310144 0xA4249C0C */ .word 0xA4249C0C # sh $a0, -0x63F4($at)
