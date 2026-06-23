/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000F1000_00101000.s
 * z64 range: 0x000FD258..0x000FD26C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* FRAMELESS LEAF: stores $a2/$a3/$a1/0 to +0x1A..+0x20($a0); jr $ra@0x000FD264. */
/* 0x000FD258 0x8016CE58 0xA486001E */ .word 0xA486001E # sh $a2, 0x1E($a0)
/* 0x000FD25C 0x8016CE5C 0xA4870020 */ .word 0xA4870020 # sh $a3, 0x20($a0)
/* 0x000FD260 0x8016CE60 0xA485001C */ .word 0xA485001C # sh $a1, 0x1C($a0)
/* 0x000FD264 0x8016CE64 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000FD268 0x8016CE68 0xA480001A */ .word 0xA480001A # sh $zero, 0x1A($a0)
