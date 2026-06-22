/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00046568..0x0004657C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (sll/lui), jr $ra at 0x46574 + delay 0x46578 */
func_00046568:
/* 0x00046568 0x800B6168 0x00042080 */ .word 0x00042080 # sll $a0, $a0, 2
/* 0x0004656C 0x800B616C 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x00046570 0x800B6170 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00046574 0x800B6174 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00046578 0x800B6178 0x90426B03 */ .word 0x90426B03 # lbu $v0, 0x6B03($v0)
