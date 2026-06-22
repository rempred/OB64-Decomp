/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00071000_00081000.s
 * z64 range: 0x00072F10..0x00072F3C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Hidden frameless leaf inside parent idx4's record (queue/counter accessor: lui $a1,0x51AC, inc 0x1A, store via index). Ends jr $ra at 0x72F34 + delay slot 0x72F38 (sh $a0). */
func_00072f10:
/* 0x00072F10 0x800E2B10 0x3C058019 */ .word 0x3C058019 # lui $a1, 0x8019
/* 0x00072F14 0x800E2B14 0x8CA551AC */ .word 0x8CA551AC # lw $a1, 0x51AC($a1)
/* 0x00072F18 0x800E2B18 0x94A2001A */ .word 0x94A2001A # lhu $v0, 0x1A($a1)
/* 0x00072F1C 0x800E2B1C 0x24430001 */ .word 0x24430001 # addiu $v1, $v0, 0x1
/* 0x00072F20 0x800E2B20 0xA4A3001A */ .word 0xA4A3001A # sh $v1, 0x1A($a1)
/* 0x00072F24 0x800E2B24 0x94A30000 */ .word 0x94A30000 # lhu $v1, 0x0($a1)
/* 0x00072F28 0x800E2B28 0x00021040 */ .word 0x00021040 # sll $v0, $v0, 1
/* 0x00072F2C 0x800E2B2C 0x00451021 */ .word 0x00451021 # addu $v0, $v0, $a1
/* 0x00072F30 0x800E2B30 0xA4430006 */ .word 0xA4430006 # sh $v1, 0x6($v0)
/* 0x00072F34 0x800E2B34 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00072F38 0x800E2B38 0xA4A40000 */ .word 0xA4A40000 # sh $a0, 0x0($a1)
