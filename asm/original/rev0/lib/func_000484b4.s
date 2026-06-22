/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x000484B4..0x000484C0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* un-merged frameless leaf: lui $at / jr $ra at 0x484B8 / delay sh $a0,0x7B08($at). [adv-review fix: include jr $ra delay slot 0x484BC] */
func_000484b4:
/* 0x000484B4 0x800B80B4 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x000484B8 0x800B80B8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000484BC 0x800B80BC 0xA4247B08 */ .word 0xA4247B08 # sh $a0, 0x7B08($at)
