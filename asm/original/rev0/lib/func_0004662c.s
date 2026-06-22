/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004662C..0x00046640 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (sll/lui, sh store), jr $ra at 0x46638 + delay 0x4663C */
func_0004662c:
/* 0x0004662C 0x800B622C 0x00042080 */ .word 0x00042080 # sll $a0, $a0, 2
/* 0x00046630 0x800B6230 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x00046634 0x800B6234 0x00240821 */ .word 0x00240821 # addu $at, $at, $a0
/* 0x00046638 0x800B6238 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004663C 0x800B623C 0xA4266B00 */ .word 0xA4266B00 # sh $a2, 0x6B00($at)
