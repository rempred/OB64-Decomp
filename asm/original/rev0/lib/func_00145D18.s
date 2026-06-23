/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00145D18..0x00145D3C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless initializer leaf: lui $at; sw $zero to -0x25E8/-0x25E4/-0x25E0 then jr $ra at 0x00145D34 + delay sb $zero,-0x25DC at 0x00145D38. Was wrongly merged into parent idx 13. */
/* 0x00145D18 0x801B5918 0x3C018020 */ .word 0x3C018020 # lui $at, 0x8020
/* 0x00145D1C 0x801B591C 0xAC20DA18 */ .word 0xAC20DA18 # sw $zero, -0x25E8($at)
/* 0x00145D20 0x801B5920 0x3C018020 */ .word 0x3C018020 # lui $at, 0x8020
/* 0x00145D24 0x801B5924 0xAC20DA1C */ .word 0xAC20DA1C # sw $zero, -0x25E4($at)
/* 0x00145D28 0x801B5928 0x3C018020 */ .word 0x3C018020 # lui $at, 0x8020
/* 0x00145D2C 0x801B592C 0xAC20DA20 */ .word 0xAC20DA20 # sw $zero, -0x25E0($at)
/* 0x00145D30 0x801B5930 0x3C018020 */ .word 0x3C018020 # lui $at, 0x8020
/* 0x00145D34 0x801B5934 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00145D38 0x801B5938 0xA020DA24 */ .word 0xA020DA24 # sb $zero, -0x25DC($at)
