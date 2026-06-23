/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x00262264..0x002622B4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf split from over-merged parent: fresh non-prologue entry (lui $a0; lhu $a0,0xD64) after the prior delay slot. Internal j 0x8020D6FC/0x8020D6F4 overlay tail-jumps kept internal. jr$ra@0x2622AC + delay 0x2622B0. */
/* 0x00262264 0x802D1E64 0x3C048022 */ .word 0x3C048022 # lui $a0, 0x8022
/* 0x00262268 0x802D1E68 0x94840D64 */ .word 0x94840D64 # lhu $a0, 0xD64($a0)
/* 0x0026226C 0x802D1E6C 0x3402FFFF */ .word 0x3402FFFF # ori $v0, $zero, 0xFFFF
/* 0x00262270 0x802D1E70 0x1082000C */ .word 0x1082000C # beq $a0, $v0, 0x802D1EA4
/* 0x00262274 0x802D1E74 0x000410C0 */ .word 0x000410C0 # sll $v0, $a0, 3
/* 0x00262278 0x802D1E78 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x0026227C 0x802D1E7C 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
/* 0x00262280 0x802D1E80 0x3C038022 */ .word 0x3C038022 # lui $v1, 0x8022
/* 0x00262284 0x802D1E84 0x8C630D6C */ .word 0x8C630D6C # lw $v1, 0xD6C($v1)
/* 0x00262288 0x802D1E88 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x0026228C 0x802D1E8C 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
/* 0x00262290 0x802D1E90 0x00621821 */ .word 0x00621821 # addu $v1, $v1, $v0
/* 0x00262294 0x802D1E94 0x94620000 */ .word 0x94620000 # lhu $v0, 0x0($v1)
/* 0x00262298 0x802D1E98 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x0026229C 0x802D1E9C 0x080835BF */ .word 0x080835BF # j 0x8020D6FC
/* 0x002622A0 0x802D1EA0 0xA4220D64 */ .word 0xA4220D64 # sh $v0, 0xD64($at)
/* 0x002622A4 0x802D1EA4 0x080835BD */ .word 0x080835BD # j 0x8020D6F4
/* 0x002622A8 0x802D1EA8 0x00000000 */ .word 0x00000000 # nop
/* 0x002622AC 0x802D1EAC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002622B0 0x802D1EB0 0x00601021 */ .word 0x00601021 # move $v0, $v1
