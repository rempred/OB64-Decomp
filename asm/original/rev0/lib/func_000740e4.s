/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00071000_00081000.s
 * z64 range: 0x000740E4..0x00074110 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Hidden frameless leaf after idx6's return (queue accessor: lui $a1,...780C, inc 0x1A, store via index). Ends jr $ra at 0x74108 + delay 0x7410C (sh $a0). Same idiom as func_00072f10. */
func_000740e4:
/* 0x000740E4 0x800E3CE4 0x3C058019 */ .word 0x3C058019 # lui $a1, 0x8019
/* 0x000740E8 0x800E3CE8 0x8CA5780C */ .word 0x8CA5780C # lw $a1, 0x780C($a1)
/* 0x000740EC 0x800E3CEC 0x94A2001A */ .word 0x94A2001A # lhu $v0, 0x1A($a1)
/* 0x000740F0 0x800E3CF0 0x24430001 */ .word 0x24430001 # addiu $v1, $v0, 0x1
/* 0x000740F4 0x800E3CF4 0xA4A3001A */ .word 0xA4A3001A # sh $v1, 0x1A($a1)
/* 0x000740F8 0x800E3CF8 0x94A30000 */ .word 0x94A30000 # lhu $v1, 0x0($a1)
/* 0x000740FC 0x800E3CFC 0x00021040 */ .word 0x00021040 # sll $v0, $v0, 1
/* 0x00074100 0x800E3D00 0x00451021 */ .word 0x00451021 # addu $v0, $v0, $a1
/* 0x00074104 0x800E3D04 0xA4430006 */ .word 0xA4430006 # sh $v1, 0x6($v0)
/* 0x00074108 0x800E3D08 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0007410C 0x800E3D0C 0xA4A40000 */ .word 0xA4A40000 # sh $a0, 0x0($a1)
