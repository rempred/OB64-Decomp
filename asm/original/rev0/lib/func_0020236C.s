/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020236C..0x002023A4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (no prologue), entry andi $v0,$a0,0xF800; RGB565->RGBA8888 expand + sltu/subu mask. Was merged into parent idx10; un-merged. jr$ra @0x20239C, delay (andi) @0x2023A0. */
/* 0x0020236C 0x80271F6C 0x3082F800 */ .word 0x3082F800 # andi $v0, $a0, 0xF800
/* 0x00202370 0x80271F70 0x00021400 */ .word 0x00021400 # sll $v0, $v0, 16
/* 0x00202374 0x80271F74 0x308307C0 */ .word 0x308307C0 # andi $v1, $a0, 0x07C0
/* 0x00202378 0x80271F78 0x00031B40 */ .word 0x00031B40 # sll $v1, $v1, 13
/* 0x0020237C 0x80271F7C 0x00431025 */ .word 0x00431025 # or $v0, $v0, $v1
/* 0x00202380 0x80271F80 0x3083003E */ .word 0x3083003E # andi $v1, $a0, 0x003E
/* 0x00202384 0x80271F84 0x00031A80 */ .word 0x00031A80 # sll $v1, $v1, 10
/* 0x00202388 0x80271F88 0x00431025 */ .word 0x00431025 # or $v0, $v0, $v1
/* 0x0020238C 0x80271F8C 0x30840001 */ .word 0x30840001 # andi $a0, $a0, 0x0001
/* 0x00202390 0x80271F90 0x00441025 */ .word 0x00441025 # or $v0, $v0, $a0
/* 0x00202394 0x80271F94 0x0002102B */ .word 0x0002102B # sltu $v0, $zero, $v0
/* 0x00202398 0x80271F98 0x00021023 */ .word 0x00021023 # subu $v0, $zero, $v0
/* 0x0020239C 0x80271F9C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002023A0 0x80271FA0 0x304200FF */ .word 0x304200FF # andi $v0, $v0, 0x00FF
