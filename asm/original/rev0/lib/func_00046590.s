/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00046590..0x000465A4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (sll/lui), jr $ra at 0x4659C + delay 0x465A0 */
func_00046590:
/* 0x00046590 0x800B6190 0x00042080 */ .word 0x00042080 # sll $a0, $a0, 2
/* 0x00046594 0x800B6194 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x00046598 0x800B6198 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x0004659C 0x800B619C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000465A0 0x800B61A0 0x90426B02 */ .word 0x90426B02 # lbu $v0, 0x6B02($v0)
