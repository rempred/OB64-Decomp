/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002A1000_002B1000.s
 * z64 range: 0x002A92C8..0x002A92E8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* FRAMELESS LEAF (recovered). Reads 0x48($v0) via 0x19F0 ptr; sltu/subu/and predicate. jr $ra @0x2A92E0 + delay and @0x2A92E4. */
/* 0x002A92C8 0x80318EC8 0x3C028023 */ .word 0x3C028023 # lui $v0, 0x8023
/* 0x002A92CC 0x80318ECC 0x8C42A974 */ .word 0x8C42A974 # lw $v0, -0x568C($v0)
/* 0x002A92D0 0x80318ED0 0x8C4219F0 */ .word 0x8C4219F0 # lw $v0, 0x19F0($v0)
/* 0x002A92D4 0x80318ED4 0x84430048 */ .word 0x84430048 # lh $v1, 0x48($v0)
/* 0x002A92D8 0x80318ED8 0x0003102B */ .word 0x0003102B # sltu $v0, $zero, $v1
/* 0x002A92DC 0x80318EDC 0x00021023 */ .word 0x00021023 # subu $v0, $zero, $v0
/* 0x002A92E0 0x80318EE0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002A92E4 0x80318EE4 0x00621024 */ .word 0x00621024 # and $v0, $v1, $v0
