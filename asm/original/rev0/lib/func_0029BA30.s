/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00291000_002A1000.s
 * z64 range: 0x0029BA30..0x0029BA58 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (RGBA5551->RGBA8888 pack); jr@0x29BA50 + delay 0x29BA54 (ori in delay). */
/* 0x0029BA30 0x8030B630 0x3082F800 */ .word 0x3082F800 # andi $v0, $a0, 0xF800
/* 0x0029BA34 0x8030B634 0x00021400 */ .word 0x00021400 # sll $v0, $v0, 16
/* 0x0029BA38 0x8030B638 0x308307C0 */ .word 0x308307C0 # andi $v1, $a0, 0x07C0
/* 0x0029BA3C 0x8030B63C 0x00031B40 */ .word 0x00031B40 # sll $v1, $v1, 13
/* 0x0029BA40 0x8030B640 0x00431025 */ .word 0x00431025 # or $v0, $v0, $v1
/* 0x0029BA44 0x8030B644 0x3084003E */ .word 0x3084003E # andi $a0, $a0, 0x003E
/* 0x0029BA48 0x8030B648 0x00042280 */ .word 0x00042280 # sll $a0, $a0, 10
/* 0x0029BA4C 0x8030B64C 0x00441025 */ .word 0x00441025 # or $v0, $v0, $a0
/* 0x0029BA50 0x8030B650 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0029BA54 0x8030B654 0x344200FF */ .word 0x344200FF # ori $v0, $v0, 0x00FF
