/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002B1000_002C1000.s
 * z64 range: 0x002B578C..0x002B57C4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (non-prologue fall-through). Indexes 0x802319F4 table; sets fields 0x50/0x54. Ends j 0x802409BC tail-region then jr $ra@0x002B57BC + nop delay@0x002B57C0. */
func_002B578C:
/* 0x002B578C 0x8032538C 0x3C028023 */ .word 0x3C028023 # lui $v0, 0x8023
/* 0x002B5790 0x80325390 0x8C42A974 */ .word 0x8C42A974 # lw $v0, -0x568C($v0)
/* 0x002B5794 0x80325394 0x00042080 */ .word 0x00042080 # sll $a0, $a0, 2
/* 0x002B5798 0x80325398 0x00822021 */ .word 0x00822021 # addu $a0, $a0, $v0
/* 0x002B579C 0x8032539C 0x8C8319F4 */ .word 0x8C8319F4 # lw $v1, 0x19F4($a0)
/* 0x002B57A0 0x803253A0 0x2402FFFF */ .word 0x2402FFFF # addiu $v0, $zero, -0x1
/* 0x002B57A4 0x803253A4 0x10C20003 */ .word 0x10C20003 # beq $a2, $v0, 0x803253B4
/* 0x002B57A8 0x803253A8 0x00000000 */ .word 0x00000000 # nop
/* 0x002B57AC 0x803253AC 0x0809026F */ .word 0x0809026F # j 0x802409BC
/* 0x002B57B0 0x803253B0 0xAC660054 */ .word 0xAC660054 # sw $a2, 0x54($v1)
/* 0x002B57B4 0x803253B4 0x54A60001 */ .word 0x54A60001 # bnel $a1, $a2, 0x803253BC
/* 0x002B57B8 0x803253B8 0xAC650050 */ .word 0xAC650050 # sw $a1, 0x50($v1)
/* 0x002B57BC 0x803253BC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002B57C0 0x803253C0 0x00000000 */ .word 0x00000000 # nop
