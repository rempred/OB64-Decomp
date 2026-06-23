/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00145DE4..0x00145DF8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf: load -0x25E4, xor $a0, sltiu==0 predicate; jr $ra at 0x00145DF0 + delay sltiu $v0 at 0x00145DF4. */
/* 0x00145DE4 0x801B59E4 0x3C028020 */ .word 0x3C028020 # lui $v0, 0x8020
/* 0x00145DE8 0x801B59E8 0x8C42DA1C */ .word 0x8C42DA1C # lw $v0, -0x25E4($v0)
/* 0x00145DEC 0x801B59EC 0x00441026 */ .word 0x00441026 # xor $v0, $v0, $a0
/* 0x00145DF0 0x801B59F0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00145DF4 0x801B59F4 0x2C420001 */ .word 0x2C420001 # sltiu $v0, $v0, 0x1
