/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00121000_00131000.s
 * z64 range: 0x00127E98..0x00127EAC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Fall-through frameless leaf using caller $a0 (sb 0x91($a0); sw 0x84($a0)). Ends jr $ra @0x00127EA4 + delay 0x00127EA8. Not a branch target of the prior func. */
/* 0x00127E98 0x80197A98 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x00127E9C 0x80197A9C 0xA0820091 */ .word 0xA0820091 # sb $v0, 0x91($a0)
/* 0x00127EA0 0x80197AA0 0x2402FFFF */ .word 0x2402FFFF # addiu $v0, $zero, -0x1
/* 0x00127EA4 0x80197AA4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00127EA8 0x80197AA8 0xAC820084 */ .word 0xAC820084 # sw $v0, 0x84($a0)
