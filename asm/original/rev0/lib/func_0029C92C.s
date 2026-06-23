/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00291000_002A1000.s
 * z64 range: 0x0029C92C..0x0029C950 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf accessor: lui/lw table[0x168]>0 test; jr$ra@C940 + delay sltu@C944; two trailing alignment nops (C948,C94C) attach here. */
/* 0x0029C92C 0x8030C52C 0x3C028023 */ .word 0x3C028023 # lui $v0, 0x8023
/* 0x0029C930 0x8030C530 0x8C42A974 */ .word 0x8C42A974 # lw $v0, -0x568C($v0)
/* 0x0029C934 0x8030C534 0x00042080 */ .word 0x00042080 # sll $a0, $a0, 2
/* 0x0029C938 0x8030C538 0x00822021 */ .word 0x00822021 # addu $a0, $a0, $v0
/* 0x0029C93C 0x8030C53C 0x8C820168 */ .word 0x8C820168 # lw $v0, 0x168($a0)
/* 0x0029C940 0x8030C540 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0029C944 0x8030C544 0x0002102B */ .word 0x0002102B # sltu $v0, $zero, $v0
/* 0x0029C948 0x8030C548 0x00000000 */ .word 0x00000000 # nop
/* 0x0029C94C 0x8030C54C 0x00000000 */ .word 0x00000000 # nop
