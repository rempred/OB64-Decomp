/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00151000_00161000.s
 * z64 range: 0x0015DF68..0x0015DF7C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Recovered tiny frameless leaf in parent gap. Two leading alignment nops (0x0015DF68,0x0015DF6C), then entry lui $at @0x0015DF70; jr $ra @0x0015DF74 + delay sw $zero,0x3EE8($at) @0x0015DF78 (zeroes global 0x3EE8). */
/* 0x0015DF68 0x801CDB68 0x00000000 */ .word 0x00000000 # nop
/* 0x0015DF6C 0x801CDB6C 0x00000000 */ .word 0x00000000 # nop
/* 0x0015DF70 0x801CDB70 0x3C018021 */ .word 0x3C018021 # lui $at, 0x8021
/* 0x0015DF74 0x801CDB74 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0015DF78 0x801CDB78 0xAC203EE8 */ .word 0xAC203EE8 # sw $zero, 0x3EE8($at)
