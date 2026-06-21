/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001438C..0x000143AC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0001438C (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_0001438c:
/* 0x0001438C 0x80083F8C 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x00014390 0x80083F90 0xAC800038 */ .word 0xAC800038 # sw $zero, 0x38($a0)
/* 0x00014394 0x80083F94 0xAC800034 */ .word 0xAC800034 # sw $zero, 0x34($a0)
/* 0x00014398 0x80083F98 0xAC800074 */ .word 0xAC800074 # sw $zero, 0x74($a0)
/* 0x0001439C 0x80083F9C 0xAC800078 */ .word 0xAC800078 # sw $zero, 0x78($a0)
/* 0x000143A0 0x80083FA0 0xAC800044 */ .word 0xAC800044 # sw $zero, 0x44($a0)
/* 0x000143A4 0x80083FA4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000143A8 0x80083FA8 0xAC800008 */ .word 0xAC800008 # sw $zero, 0x8($a0)
