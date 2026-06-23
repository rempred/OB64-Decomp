/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00251000_00261000.s
 * z64 range: 0x0025F73C..0x0025F74C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf accessor: lui $v0,0x8022; addu $v0,$v0,$a0; jr$ra; lbu $v0,0xF450($v0) in delay slot (byte table at 0x8021F450). */
/* 0x0025F73C 0x802CF33C 0x3C028022 */ .word 0x3C028022 # lui $v0, 0x8022
/* 0x0025F740 0x802CF340 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x0025F744 0x802CF344 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0025F748 0x802CF348 0x9042F450 */ .word 0x9042F450 # lbu $v0, -0xBB0($v0)
