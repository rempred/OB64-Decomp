/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00145D9C..0x00145DC8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf: appends to list at -0x25EC, increments count -0x25E8; jr $ra at 0x00145DC0 + delay sw $a0,0x0($v0) at 0x00145DC4. Split out of parent over-merge. */
/* 0x00145D9C 0x801B599C 0x3C028020 */ .word 0x3C028020 # lui $v0, 0x8020
/* 0x00145DA0 0x801B59A0 0x8C42DA18 */ .word 0x8C42DA18 # lw $v0, -0x25E8($v0)
/* 0x00145DA4 0x801B59A4 0x3C058020 */ .word 0x3C058020 # lui $a1, 0x8020
/* 0x00145DA8 0x801B59A8 0x8CA5DA14 */ .word 0x8CA5DA14 # lw $a1, -0x25EC($a1)
/* 0x00145DAC 0x801B59AC 0x24430001 */ .word 0x24430001 # addiu $v1, $v0, 0x1
/* 0x00145DB0 0x801B59B0 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
/* 0x00145DB4 0x801B59B4 0x00451021 */ .word 0x00451021 # addu $v0, $v0, $a1
/* 0x00145DB8 0x801B59B8 0x3C018020 */ .word 0x3C018020 # lui $at, 0x8020
/* 0x00145DBC 0x801B59BC 0xAC23DA18 */ .word 0xAC23DA18 # sw $v1, -0x25E8($at)
/* 0x00145DC0 0x801B59C0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00145DC4 0x801B59C4 0xAC440000 */ .word 0xAC440000 # sw $a0, 0x0($v0)
