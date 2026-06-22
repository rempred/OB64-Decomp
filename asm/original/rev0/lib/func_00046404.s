/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00046404..0x00046430 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (sll/ori bit-set, sh store), jr $ra at 0x46428 + delay 0x4642C */
func_00046404:
/* 0x00046404 0x800B6004 0x000618C0 */ .word 0x000618C0 # sll $v1, $a2, 3
/* 0x00046408 0x800B6008 0x00661821 */ .word 0x00661821 # addu $v1, $v1, $a2
/* 0x0004640C 0x800B600C 0x00031880 */ .word 0x00031880 # sll $v1, $v1, 2
/* 0x00046410 0x800B6010 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x00046414 0x800B6014 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x00046418 0x800B6018 0x944251CC */ .word 0x944251CC # lhu $v0, 0x51CC($v0)
/* 0x0004641C 0x800B601C 0x34420004 */ .word 0x34420004 # ori $v0, $v0, 0x0004
/* 0x00046420 0x800B6020 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x00046424 0x800B6024 0x00230821 */ .word 0x00230821 # addu $at, $at, $v1
/* 0x00046428 0x800B6028 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004642C 0x800B602C 0xA42251CC */ .word 0xA42251CC # sh $v0, 0x51CC($at)
