/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00046534..0x00046548 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (sll/lui), jr $ra at 0x46540 + delay 0x46544 */
func_00046534:
/* 0x00046534 0x800B6134 0x00042080 */ .word 0x00042080 # sll $a0, $a0, 2
/* 0x00046538 0x800B6138 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x0004653C 0x800B613C 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00046540 0x800B6140 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00046544 0x800B6144 0x90423AC2 */ .word 0x90423AC2 # lbu $v0, 0x3AC2($v0)
