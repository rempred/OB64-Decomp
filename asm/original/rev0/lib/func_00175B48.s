/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00171000_00181000.s
 * z64 range: 0x00175B48..0x00175B5C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* No stack frame. Clears globals 0x8022AFC0 and 0x8022AFC4. jr $ra at 0x00175B54 + delay 0x00175B58 (sw $zero,-0x503C($at)). */
/* 0x00175B48 0x801E5748 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x00175B4C 0x801E574C 0xAC20AFC0 */ .word 0xAC20AFC0 # sw $zero, -0x5040($at)
/* 0x00175B50 0x801E5750 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x00175B54 0x801E5754 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00175B58 0x801E5758 0xAC20AFC4 */ .word 0xAC20AFC4 # sw $zero, -0x503C($at)
