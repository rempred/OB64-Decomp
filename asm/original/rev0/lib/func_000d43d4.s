/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000D1000_000E1000.s
 * z64 range: 0x000D43D4..0x000D4400 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf recovered between two adjacent jr $ra returns: fresh entry after jr $ra@0xD43CC + epilogue@0xD43D0; no prologue (lui $v1,0x8019 / lw $v1,0x6AF8($v1) read-before-write, direct stores); ends jr $ra@0xD43F8 + delay sh $v0,0x10C6($v1)@0xD43FC. */
func_000d43d4:
/* 0x000D43D4 0x80143FD4 0x3C038019 */ .word 0x3C038019 # lui $v1, 0x8019
/* 0x000D43D8 0x80143FD8 0x8C636AF8 */ .word 0x8C636AF8 # lw $v1, 0x6AF8($v1)
/* 0x000D43DC 0x80143FDC 0x24020002 */ .word 0x24020002 # addiu $v0, $zero, 0x2
/* 0x000D43E0 0x80143FE0 0xA06210B9 */ .word 0xA06210B9 # sb $v0, 0x10B9($v1)
/* 0x000D43E4 0x80143FE4 0x3C038019 */ .word 0x3C038019 # lui $v1, 0x8019
/* 0x000D43E8 0x80143FE8 0x8C636AF8 */ .word 0x8C636AF8 # lw $v1, 0x6AF8($v1)
/* 0x000D43EC 0x80143FEC 0x24020309 */ .word 0x24020309 # addiu $v0, $zero, 0x309
/* 0x000D43F0 0x80143FF0 0xAC6210BC */ .word 0xAC6210BC # sw $v0, 0x10BC($v1)
/* 0x000D43F4 0x80143FF4 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x000D43F8 0x80143FF8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000D43FC 0x80143FFC 0xA46210C6 */ .word 0xA46210C6 # sh $v0, 0x10C6($v1)
