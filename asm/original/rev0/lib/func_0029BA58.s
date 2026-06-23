/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00291000_002A1000.s
 * z64 range: 0x0029BA58..0x0029BA80 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (inverse color unpack); jr@0x29BA78 + delay 0x29BA7C (ori in delay). */
/* 0x0029BA58 0x8030B658 0x00041402 */ .word 0x00041402 # srl $v0, $a0, 16
/* 0x0029BA5C 0x8030B65C 0x3042F800 */ .word 0x3042F800 # andi $v0, $v0, 0xF800
/* 0x0029BA60 0x8030B660 0x00041B42 */ .word 0x00041B42 # srl $v1, $a0, 13
/* 0x0029BA64 0x8030B664 0x306307C0 */ .word 0x306307C0 # andi $v1, $v1, 0x07C0
/* 0x0029BA68 0x8030B668 0x00431025 */ .word 0x00431025 # or $v0, $v0, $v1
/* 0x0029BA6C 0x8030B66C 0x3084F800 */ .word 0x3084F800 # andi $a0, $a0, 0xF800
/* 0x0029BA70 0x8030B670 0x00042282 */ .word 0x00042282 # srl $a0, $a0, 10
/* 0x0029BA74 0x8030B674 0x00441025 */ .word 0x00441025 # or $v0, $v0, $a0
/* 0x0029BA78 0x8030B678 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0029BA7C 0x8030B67C 0x34420001 */ .word 0x34420001 # ori $v0, $v0, 0x0001
