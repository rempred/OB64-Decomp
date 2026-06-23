/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00121000_00131000.s
 * z64 range: 0x0012896C..0x00128980 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Fall-through frameless leaf using caller $a0 (sb 2,0x91($a0); sw 0x5A,0x88($a0)). Ends jr $ra @0x00128978 + delay 0x0012897C. Not a branch target of the prior func. */
/* 0x0012896C 0x8019856C 0x24020002 */ .word 0x24020002 # addiu $v0, $zero, 0x2
/* 0x00128970 0x80198570 0xA0820091 */ .word 0xA0820091 # sb $v0, 0x91($a0)
/* 0x00128974 0x80198574 0x2402005A */ .word 0x2402005A # addiu $v0, $zero, 0x5A
/* 0x00128978 0x80198578 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0012897C 0x8019857C 0xAC820088 */ .word 0xAC820088 # sw $v0, 0x88($a0)
