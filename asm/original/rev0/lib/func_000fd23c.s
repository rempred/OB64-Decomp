/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000F1000_00101000.s
 * z64 range: 0x000FD23C..0x000FD258 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* FRAMELESS LEAF: stores 0xFF/0 to +0x18/+0x1A/+0x1C/+0x1E/+0x20($a0); jr $ra@0x000FD250. */
/* 0x000FD23C 0x8016CE3C 0x240200FF */ .word 0x240200FF # addiu $v0, $zero, 0xFF
/* 0x000FD240 0x8016CE40 0xA4820020 */ .word 0xA4820020 # sh $v0, 0x20($a0)
/* 0x000FD244 0x8016CE44 0xA482001E */ .word 0xA482001E # sh $v0, 0x1E($a0)
/* 0x000FD248 0x8016CE48 0xA4820018 */ .word 0xA4820018 # sh $v0, 0x18($a0)
/* 0x000FD24C 0x8016CE4C 0xA480001C */ .word 0xA480001C # sh $zero, 0x1C($a0)
/* 0x000FD250 0x8016CE50 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000FD254 0x8016CE54 0xA480001A */ .word 0xA480001A # sh $zero, 0x1A($a0)
