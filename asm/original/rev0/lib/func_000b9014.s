/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000B1000_000C1000.s
 * z64 range: 0x000B9014..0x000B904C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (parent-undetected). sll $a1; stores to $a0 struct. jr $ra @0xB9044. */
func_000b9014:
/* 0x000B9014 0x80128C14 0x00052C00 */ .word 0x00052C00 # sll $a1, $a1, 16
/* 0x000B9018 0x80128C18 0x00052C03 */ .word 0x00052C03 # sra $a1, $a1, 16
/* 0x000B901C 0x80128C1C 0x00063400 */ .word 0x00063400 # sll $a2, $a2, 16
/* 0x000B9020 0x80128C20 0x00063403 */ .word 0x00063403 # sra $a2, $a2, 16
/* 0x000B9024 0x80128C24 0xAC85002C */ .word 0xAC85002C # sw $a1, 0x2C($a0)
/* 0x000B9028 0x80128C28 0xAC860030 */ .word 0xAC860030 # sw $a2, 0x30($a0)
/* 0x000B902C 0x80128C2C 0x8FA20010 */ .word 0x8FA20010 # lw $v0, 0x10($sp)
/* 0x000B9030 0x80128C30 0x00073C00 */ .word 0x00073C00 # sll $a3, $a3, 16
/* 0x000B9034 0x80128C34 0x00073C03 */ .word 0x00073C03 # sra $a3, $a3, 16
/* 0x000B9038 0x80128C38 0xAC870034 */ .word 0xAC870034 # sw $a3, 0x34($a0)
/* 0x000B903C 0x80128C3C 0x00021400 */ .word 0x00021400 # sll $v0, $v0, 16
/* 0x000B9040 0x80128C40 0x00021403 */ .word 0x00021403 # sra $v0, $v0, 16
/* 0x000B9044 0x80128C44 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000B9048 0x80128C48 0xAC820038 */ .word 0xAC820038 # sw $v0, 0x38($a0)
