/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x00262C80..0x00262C94 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Tiny frameless accessor (lw FE8; lw +0x14; jr$ra; sh zero,+0x1A). jr$ra@0x262C8C + delay 0x262C90. */
/* 0x00262C80 0x802D2880 0x3C028022 */ .word 0x3C028022 # lui $v0, 0x8022
/* 0x00262C84 0x802D2884 0x8C420FE8 */ .word 0x8C420FE8 # lw $v0, 0xFE8($v0)
/* 0x00262C88 0x802D2888 0x8C420014 */ .word 0x8C420014 # lw $v0, 0x14($v0)
/* 0x00262C8C 0x802D288C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00262C90 0x802D2890 0xA440001A */ .word 0xA440001A # sh $zero, 0x1A($v0)
