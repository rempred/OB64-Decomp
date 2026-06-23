/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00171000_00181000.s
 * z64 range: 0x00171F10..0x00171F1C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* No prologue: lui $v0,0x8021 / jr $ra / lbu $v0,0x4E84($v0) (delay). Frameless accessor returning the byte func_00171EA0 sets. Recovered from over-merge. */
/* 0x00171F10 0x801E1B10 0x3C028021 */ .word 0x3C028021 # lui $v0, 0x8021
/* 0x00171F14 0x801E1B14 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00171F18 0x801E1B18 0x90424E84 */ .word 0x90424E84 # lbu $v0, 0x4E84($v0)
