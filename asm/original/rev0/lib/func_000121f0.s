/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x000121F0..0x00012218 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x000121F0 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_000121f0:
/* 0x000121F0 0x80081DF0 0x10800006 */ .word 0x10800006 # beq $a0, $zero, 0x80081E0C
/* 0x000121F4 0x80081DF4 0x00000000 */ .word 0x00000000 # nop
/* 0x000121F8 0x80081DF8 0x8C820010 */ .word 0x8C820010 # lw $v0, 0x10($a0)
/* 0x000121FC 0x80081DFC 0x04410003 */ .word 0x04410003 # bgez $v0, 0x80081E0C
/* 0x00012200 0x80081E00 0x00000000 */ .word 0x00000000 # nop
/* 0x00012204 0x80081E04 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x00012208 0x80081E08 0xAC241828 */ .word 0xAC241828 # sw $a0, 0x1828($at)
/* 0x0001220C 0x80081E0C 0x3C02800B */ .word 0x3C02800B # lui $v0, 0x800B
/* 0x00012210 0x80081E10 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00012214 0x80081E14 0x8C421828 */ .word 0x8C421828 # lw $v0, 0x1828($v0)
