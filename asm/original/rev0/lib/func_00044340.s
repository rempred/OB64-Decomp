/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00044340..0x00044358 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (lw in delay slot); jr $ra at 0x44350 */
func_00044340:
/* 0x00044340 0x800B3F40 0x308400FF */ .word 0x308400FF # andi $a0, $a0, 0x00FF
/* 0x00044344 0x800B3F44 0x00042100 */ .word 0x00042100 # sll $a0, $a0, 4
/* 0x00044348 0x800B3F48 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x0004434C 0x800B3F4C 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00044350 0x800B3F50 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00044354 0x800B3F54 0x8C42AA7C */ .word 0x8C42AA7C # lw $v0, -0x5584($v0)
