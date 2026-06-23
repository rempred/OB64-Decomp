/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00211000_00221000.s
 * z64 range: 0x00213B10..0x00213B24 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless accessor (per SPECIAL): lui $v0,0x801E; addiu $v0,0x5AA0; lui $at,0x801D; jr $ra @0x213B1C; sw $v0,0x810($at) in delay slot. Ends after delay-slot word. */
/* 0x00213B10 0x80283710 0x3C02801E */ .word 0x3C02801E # lui $v0, 0x801E
/* 0x00213B14 0x80283714 0x24425AA0 */ .word 0x24425AA0 # addiu $v0, $v0, 0x5AA0
/* 0x00213B18 0x80283718 0x3C01801D */ .word 0x3C01801D # lui $at, 0x801D
/* 0x00213B1C 0x8028371C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00213B20 0x80283720 0xAC220810 */ .word 0xAC220810 # sw $v0, 0x810($at)
