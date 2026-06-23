/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001F1000_00201000.s
 * z64 range: 0x001FF830..0x001FF868 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Un-merged frameless leaf setter (fall-through entry after prior jr+delay; addiu $v0,1 then sh $a0..$a3 to 0x801D07F4/07F6/07F8/07FA, sb $zero 0x80C, sb $v0 0x80D). Ends jr$ra @0x001FF860 + delay (sb $v0,0x80D, using $at from preceding lui) @0x001FF864. */
/* 0x001FF830 0x8026F430 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x001FF834 0x8026F434 0x3C01801D */ .word 0x3C01801D # lui $at, 0x801D
/* 0x001FF838 0x8026F438 0xA42407F4 */ .word 0xA42407F4 # sh $a0, 0x7F4($at)
/* 0x001FF83C 0x8026F43C 0x3C01801D */ .word 0x3C01801D # lui $at, 0x801D
/* 0x001FF840 0x8026F440 0xA42507F6 */ .word 0xA42507F6 # sh $a1, 0x7F6($at)
/* 0x001FF844 0x8026F444 0x3C01801D */ .word 0x3C01801D # lui $at, 0x801D
/* 0x001FF848 0x8026F448 0xA42607F8 */ .word 0xA42607F8 # sh $a2, 0x7F8($at)
/* 0x001FF84C 0x8026F44C 0x3C01801D */ .word 0x3C01801D # lui $at, 0x801D
/* 0x001FF850 0x8026F450 0xA42707FA */ .word 0xA42707FA # sh $a3, 0x7FA($at)
/* 0x001FF854 0x8026F454 0x3C01801D */ .word 0x3C01801D # lui $at, 0x801D
/* 0x001FF858 0x8026F458 0xA020080C */ .word 0xA020080C # sb $zero, 0x80C($at)
/* 0x001FF85C 0x8026F45C 0x3C01801D */ .word 0x3C01801D # lui $at, 0x801D
/* 0x001FF860 0x8026F460 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001FF864 0x8026F464 0xA022080D */ .word 0xA022080D # sb $v0, 0x80D($at)
