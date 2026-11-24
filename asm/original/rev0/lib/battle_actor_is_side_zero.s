/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020C014..0x0020C034 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless flag getter (obj+0x40 bit8 inverted); jr$ra at C02C/delay C030. */
/* 0x0020C014 0x8027BC14 0x50800005 */ .word 0x50800005 # beql $a0, $zero, 0x8027BC2C
/* 0x0020C018 0x8027BC18 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x0020C01C 0x8027BC1C 0x8C820040 */ .word 0x8C820040 # lw $v0, 0x40($a0)
/* 0x0020C020 0x8027BC20 0x00021202 */ .word 0x00021202 # srl $v0, $v0, 8
/* 0x0020C024 0x8027BC24 0x38420001 */ .word 0x38420001 # xori $v0, $v0, 0x0001
/* 0x0020C028 0x8027BC28 0x30420001 */ .word 0x30420001 # andi $v0, $v0, 0x0001
/* 0x0020C02C 0x8027BC2C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020C030 0x8027BC30 0x00000000 */ .word 0x00000000 # nop
