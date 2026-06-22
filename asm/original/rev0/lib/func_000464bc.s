/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x000464BC..0x000464D0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (sll, sh store), jr $ra at 0x464C8 + delay 0x464CC */
func_000464bc:
/* 0x000464BC 0x800B60BC 0x00042040 */ .word 0x00042040 # sll $a0, $a0, 1
/* 0x000464C0 0x800B60C0 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x000464C4 0x800B60C4 0x00240821 */ .word 0x00240821 # addu $at, $at, $a0
/* 0x000464C8 0x800B60C8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000464CC 0x800B60CC 0xA4266F60 */ .word 0xA4266F60 # sh $a2, 0x6F60($at)
