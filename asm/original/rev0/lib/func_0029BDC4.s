/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00291000_002A1000.s
 * z64 range: 0x0029BDC4..0x0029BDF8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (lh 0xA/0x8, xor, sltu); jr@0x29BDF0 + delay 0x29BDF4=nop. */
/* 0x0029BDC4 0x8030B9C4 0x3C028023 */ .word 0x3C028023 # lui $v0, 0x8023
/* 0x0029BDC8 0x8030B9C8 0x8C42A974 */ .word 0x8C42A974 # lw $v0, -0x568C($v0)
/* 0x0029BDCC 0x8030B9CC 0x00042080 */ .word 0x00042080 # sll $a0, $a0, 2
/* 0x0029BDD0 0x8030B9D0 0x00822021 */ .word 0x00822021 # addu $a0, $a0, $v0
/* 0x0029BDD4 0x8030B9D4 0x8C830248 */ .word 0x8C830248 # lw $v1, 0x248($a0)
/* 0x0029BDD8 0x8030B9D8 0x10600005 */ .word 0x10600005 # beq $v1, $zero, 0x8030B9F0
/* 0x0029BDDC 0x8030B9DC 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x0029BDE0 0x8030B9E0 0x8462000A */ .word 0x8462000A # lh $v0, 0xA($v1)
/* 0x0029BDE4 0x8030B9E4 0x84630008 */ .word 0x84630008 # lh $v1, 0x8($v1)
/* 0x0029BDE8 0x8030B9E8 0x00431026 */ .word 0x00431026 # xor $v0, $v0, $v1
/* 0x0029BDEC 0x8030B9EC 0x0002102B */ .word 0x0002102B # sltu $v0, $zero, $v0
/* 0x0029BDF0 0x8030B9F0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0029BDF4 0x8030B9F4 0x00000000 */ .word 0x00000000 # nop
