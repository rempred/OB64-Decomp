/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002A1000_002B1000.s
 * z64 range: 0x002AB4DC..0x002AB4FC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Recovered frameless leaf (entry lui $v0,0x8023; lh/sltu predicate). Ends jr $ra 0x002AB4F4 + delay 0x002AB4F8 (and $v0). */
/* 0x002AB4DC 0x8031B0DC 0x3C028023 */ .word 0x3C028023 # lui $v0, 0x8023
/* 0x002AB4E0 0x8031B0E0 0x8C42A974 */ .word 0x8C42A974 # lw $v0, -0x568C($v0)
/* 0x002AB4E4 0x8031B0E4 0x8C4219F0 */ .word 0x8C4219F0 # lw $v0, 0x19F0($v0)
/* 0x002AB4E8 0x8031B0E8 0x84430048 */ .word 0x84430048 # lh $v1, 0x48($v0)
/* 0x002AB4EC 0x8031B0EC 0x0003102B */ .word 0x0003102B # sltu $v0, $zero, $v1
/* 0x002AB4F0 0x8031B0F0 0x00021023 */ .word 0x00021023 # subu $v0, $zero, $v0
/* 0x002AB4F4 0x8031B0F4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002AB4F8 0x8031B0F8 0x00621024 */ .word 0x00621024 # and $v0, $v1, $v0
