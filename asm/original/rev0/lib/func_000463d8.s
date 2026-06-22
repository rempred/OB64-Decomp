/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x000463D8..0x00046404 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (sll/ori bit-set, sh store), jr $ra at 0x463FC + delay 0x46400 */
func_000463d8:
/* 0x000463D8 0x800B5FD8 0x000618C0 */ .word 0x000618C0 # sll $v1, $a2, 3
/* 0x000463DC 0x800B5FDC 0x00661821 */ .word 0x00661821 # addu $v1, $v1, $a2
/* 0x000463E0 0x800B5FE0 0x00031880 */ .word 0x00031880 # sll $v1, $v1, 2
/* 0x000463E4 0x800B5FE4 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x000463E8 0x800B5FE8 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x000463EC 0x800B5FEC 0x944251CC */ .word 0x944251CC # lhu $v0, 0x51CC($v0)
/* 0x000463F0 0x800B5FF0 0x34420002 */ .word 0x34420002 # ori $v0, $v0, 0x0002
/* 0x000463F4 0x800B5FF4 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x000463F8 0x800B5FF8 0x00230821 */ .word 0x00230821 # addu $at, $at, $v1
/* 0x000463FC 0x800B5FFC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00046400 0x800B6000 0xA42251CC */ .word 0xA42251CC # sh $v0, 0x51CC($at)
