/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020BCE0..0x0020BCF4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Un-merged frameless leaf setter: stores pointer (801D.FC74) into 801D.0810. Ends jr $ra @0x0020BCEC + delay 0x0020BCF0. */
/* 0x0020BCE0 0x8027B8E0 0x3C02801D */ .word 0x3C02801D # lui $v0, 0x801D
/* 0x0020BCE4 0x8027B8E4 0x2442FC74 */ .word 0x2442FC74 # addiu $v0, $v0, -0x38C
/* 0x0020BCE8 0x8027B8E8 0x3C01801D */ .word 0x3C01801D # lui $at, 0x801D
/* 0x0020BCEC 0x8027B8EC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020BCF0 0x8027B8F0 0xAC220810 */ .word 0xAC220810 # sw $v0, 0x810($at)
