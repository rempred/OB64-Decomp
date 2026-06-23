/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000B1000_000C1000.s
 * z64 range: 0x000BCEB0..0x000BCEE4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf recovered from parent idx83. move $a0/$v1=0; scans 0x3AC0 lhu table stride 4 to 0xA0; jr $ra at 0xBCEDC. */
func_000bceb0:
/* 0x000BCEB0 0x8012CAB0 0x00002021 */ .word 0x00002021 # move $a0, $zero
/* 0x000BCEB4 0x8012CAB4 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x000BCEB8 0x8012CAB8 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x000BCEBC 0x8012CABC 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x000BCEC0 0x8012CAC0 0x94423AC0 */ .word 0x94423AC0 # lhu $v0, 0x3AC0($v0)
/* 0x000BCEC4 0x8012CAC4 0x54400001 */ .word 0x54400001 # bnel $v0, $zero, 0x8012CACC
/* 0x000BCEC8 0x8012CAC8 0x24840001 */ .word 0x24840001 # addiu $a0, $a0, 0x1
/* 0x000BCECC 0x8012CACC 0x24630004 */ .word 0x24630004 # addiu $v1, $v1, 0x4
/* 0x000BCED0 0x8012CAD0 0x286200A0 */ .word 0x286200A0 # slti $v0, $v1, 0xA0
/* 0x000BCED4 0x8012CAD4 0x1440FFF8 */ .word 0x1440FFF8 # bne $v0, $zero, 0x8012CAB8
/* 0x000BCED8 0x8012CAD8 0x00000000 */ .word 0x00000000 # nop
/* 0x000BCEDC 0x8012CADC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000BCEE0 0x8012CAE0 0x3082FFFF */ .word 0x3082FFFF # andi $v0, $a0, 0xFFFF
