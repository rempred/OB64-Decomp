/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x00029CC0..0x00029CE0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00029CC0 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00029cc0:
/* 0x00029CC0 0x800998C0 0x3C03800B */ .word 0x3C03800B # lui $v1, 0x800B
/* 0x00029CC4 0x800998C4 0x8C63A400 */ .word 0x8C63A400 # lw $v1, -0x5C00($v1)
/* 0x00029CC8 0x800998C8 0x10600003 */ .word 0x10600003 # beq $v1, $zero, 0x800998D8
/* 0x00029CCC 0x800998CC 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x00029CD0 0x800998D0 0x3C02800B */ .word 0x3C02800B # lui $v0, 0x800B
/* 0x00029CD4 0x800998D4 0x8C42A408 */ .word 0x8C42A408 # lw $v0, -0x5BF8($v0)
/* 0x00029CD8 0x800998D8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00029CDC 0x800998DC 0x00000000 */ .word 0x00000000 # nop
