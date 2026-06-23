/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x00261D60..0x00261D7C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf: stores zeros into $v1 record. Returns jr$ra@0x00261D74 + delay sw@0x00261D78. */
/* 0x00261D60 0x802D1960 0xA0620018 */ .word 0xA0620018 # sb $v0, 0x18($v1)
/* 0x00261D64 0x802D1964 0x24620004 */ .word 0x24620004 # addiu $v0, $v1, 0x4
/* 0x00261D68 0x802D1968 0xAC600010 */ .word 0xAC600010 # sw $zero, 0x10($v1)
/* 0x00261D6C 0x802D196C 0xAC60000C */ .word 0xAC60000C # sw $zero, 0xC($v1)
/* 0x00261D70 0x802D1970 0xAC600008 */ .word 0xAC600008 # sw $zero, 0x8($v1)
/* 0x00261D74 0x802D1974 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00261D78 0x802D1978 0xAC600014 */ .word 0xAC600014 # sw $zero, 0x14($v1)
