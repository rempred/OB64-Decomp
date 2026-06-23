/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000F1000_00101000.s
 * z64 range: 0x000FB83C..0x000FB854 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless: toggle/test 0x88. jr ra @0xFB84C, delay @0xFB850; 0xFB854 belongs to next fn. */
/* 0x000FB83C 0x8016B43C 0x3C02801B */ .word 0x3C02801B # lui $v0, 0x801B
/* 0x000FB840 0x8016B440 0x8C423390 */ .word 0x8C423390 # lw $v0, 0x3390($v0)
/* 0x000FB844 0x8016B444 0x90420088 */ .word 0x90420088 # lbu $v0, 0x88($v0)
/* 0x000FB848 0x8016B448 0x38420001 */ .word 0x38420001 # xori $v0, $v0, 0x0001
/* 0x000FB84C 0x8016B44C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000FB850 0x8016B450 0x0002102B */ .word 0x0002102B # sltu $v0, $zero, $v0
