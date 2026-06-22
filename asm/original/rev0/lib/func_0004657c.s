/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004657C..0x00046590 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (sll/lui), jr $ra at 0x46588 + delay 0x4658C */
func_0004657c:
/* 0x0004657C 0x800B617C 0x00042080 */ .word 0x00042080 # sll $a0, $a0, 2
/* 0x00046580 0x800B6180 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x00046584 0x800B6184 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00046588 0x800B6188 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004658C 0x800B618C 0x94426B00 */ .word 0x94426B00 # lhu $v0, 0x6B00($v0)
