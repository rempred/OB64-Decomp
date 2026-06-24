/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002A1000_002B1000.s
 * z64 range: 0x002ADA20..0x002ADA48 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (lui 0x8023 / lw / beq / lh / lh / xor / sltu / jr $ra 0x002ADA40 + nop delay). Un-merged from over-merged idx36. */
/* 0x002ADA20 0x8031D620 0x3C038023 */ .word 0x3C038023 # lui $v1, 0x8023
/* 0x002ADA24 0x8031D624 0x8C63A978 */ .word 0x8C63A978 # lw $v1, -0x5688($v1)
/* 0x002ADA28 0x8031D628 0x10600005 */ .word 0x10600005 # beq $v1, $zero, 0x8031D640
/* 0x002ADA2C 0x8031D62C 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x002ADA30 0x8031D630 0x84620008 */ .word 0x84620008 # lh $v0, 0x8($v1)
/* 0x002ADA34 0x8031D634 0x8463000A */ .word 0x8463000A # lh $v1, 0xA($v1)
/* 0x002ADA38 0x8031D638 0x00431026 */ .word 0x00431026 # xor $v0, $v0, $v1
/* 0x002ADA3C 0x8031D63C 0x0002102B */ .word 0x0002102B # sltu $v0, $zero, $v0
/* 0x002ADA40 0x8031D640 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002ADA44 0x8031D644 0x00000000 */ .word 0x00000000 # nop
