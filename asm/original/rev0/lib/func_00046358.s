/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00046358..0x00046374 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (sll/subu index math), jr $ra at 0x4636C + delay 0x46370 */
func_00046358:
/* 0x00046358 0x800B5F58 0x000410C0 */ .word 0x000410C0 # sll $v0, $a0, 3
/* 0x0004635C 0x800B5F5C 0x00441023 */ .word 0x00441023 # subu $v0, $v0, $a0
/* 0x00046360 0x800B5F60 0x000210C0 */ .word 0x000210C0 # sll $v0, $v0, 3
/* 0x00046364 0x800B5F64 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x00046368 0x800B5F68 0x00220821 */ .word 0x00220821 # addu $at, $at, $v0
/* 0x0004636C 0x800B5F6C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00046370 0x800B5F70 0x90223BDB */ .word 0x90223BDB # lbu $v0, 0x3BDB($at)
