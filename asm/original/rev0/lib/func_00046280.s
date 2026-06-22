/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00046280..0x00046290 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (lui), jr $ra at 0x46288 + delay 0x4628C */
func_00046280:
/* 0x00046280 0x800B5E80 0x3C02801A */ .word 0x3C02801A # lui $v0, 0x801A
/* 0x00046284 0x800B5E84 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00046288 0x800B5E88 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004628C 0x800B5E8C 0x9042EE40 */ .word 0x9042EE40 # lbu $v0, -0x11C0($v0)
