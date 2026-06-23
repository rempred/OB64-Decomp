/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x00262830..0x00262840 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Tiny frameless accessor (lui $v0; lw $v0,0xFE8; jr$ra; sh $a0,0x8). jr$ra@0x262838 + delay 0x26283C. */
/* 0x00262830 0x802D2430 0x3C028022 */ .word 0x3C028022 # lui $v0, 0x8022
/* 0x00262834 0x802D2434 0x8C420FE8 */ .word 0x8C420FE8 # lw $v0, 0xFE8($v0)
/* 0x00262838 0x802D2438 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0026283C 0x802D243C 0xA4440008 */ .word 0xA4440008 # sh $a0, 0x8($v0)
