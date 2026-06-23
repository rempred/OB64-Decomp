/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x00201430..0x0020144C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf recovered from parent gap. andi/addiu/sll/lui/addu; jr$ra@0x00201444 + delay lw@0x00201448 (load in delay slot). */
func_00201430:
/* 0x00201430 0x80271030 0x308400FF */ .word 0x308400FF # andi $a0, $a0, 0x00FF
/* 0x00201434 0x80271034 0x24840037 */ .word 0x24840037 # addiu $a0, $a0, 0x37
/* 0x00201438 0x80271038 0x00042100 */ .word 0x00042100 # sll $a0, $a0, 4
/* 0x0020143C 0x8027103C 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x00201440 0x80271040 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00201444 0x80271044 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00201448 0x80271048 0x8C42AA7C */ .word 0x8C42AA7C # lw $v0, -0x5584($v0)
