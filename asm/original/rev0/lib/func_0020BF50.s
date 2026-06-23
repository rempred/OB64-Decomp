/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020BF50..0x0020BF6C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Un-merged frameless leaf: same index math on (a0-4). Ends jr $ra @0x0020BF64 + delay 0x0020BF68. */
/* 0x0020BF50 0x8027BB50 0x2484FFFC */ .word 0x2484FFFC # addiu $a0, $a0, -0x4
/* 0x0020BF54 0x8027BB54 0x00041080 */ .word 0x00041080 # sll $v0, $a0, 2
/* 0x0020BF58 0x8027BB58 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x0020BF5C 0x8027BB5C 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
/* 0x0020BF60 0x8027BB60 0x00441023 */ .word 0x00441023 # subu $v0, $v0, $a0
/* 0x0020BF64 0x8027BB64 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020BF68 0x8027BB68 0x00021040 */ .word 0x00021040 # sll $v0, $v0, 1
