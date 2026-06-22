/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00046430..0x0004645C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (sll/andi bit-clear, sh store), jr $ra at 0x46454 + delay 0x46458 */
func_00046430:
/* 0x00046430 0x800B6030 0x000618C0 */ .word 0x000618C0 # sll $v1, $a2, 3
/* 0x00046434 0x800B6034 0x00661821 */ .word 0x00661821 # addu $v1, $v1, $a2
/* 0x00046438 0x800B6038 0x00031880 */ .word 0x00031880 # sll $v1, $v1, 2
/* 0x0004643C 0x800B603C 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x00046440 0x800B6040 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x00046444 0x800B6044 0x944251CC */ .word 0x944251CC # lhu $v0, 0x51CC($v0)
/* 0x00046448 0x800B6048 0x3042FFF9 */ .word 0x3042FFF9 # andi $v0, $v0, 0xFFF9
/* 0x0004644C 0x800B604C 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x00046450 0x800B6050 0x00230821 */ .word 0x00230821 # addu $at, $at, $v1
/* 0x00046454 0x800B6054 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00046458 0x800B6058 0xA42251CC */ .word 0xA42251CC # sh $v0, 0x51CC($at)
