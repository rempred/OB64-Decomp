/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00071000_00081000.s
 * z64 range: 0x00074110..0x0007413C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Hidden frameless leaf (companion dequeue accessor: lui $v0,...780C, dec 0x1A, load via index). Ends jr $ra at 0x74134 + delay slot 0x74138 (sh, last word of slice). Same idiom as func_00072f3c. */
func_00074110:
/* 0x00074110 0x800E3D10 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x00074114 0x800E3D14 0x8C42780C */ .word 0x8C42780C # lw $v0, 0x780C($v0)
/* 0x00074118 0x800E3D18 0x9443001A */ .word 0x9443001A # lhu $v1, 0x1A($v0)
/* 0x0007411C 0x800E3D1C 0x2463FFFF */ .word 0x2463FFFF # addiu $v1, $v1, -0x1
/* 0x00074120 0x800E3D20 0xA443001A */ .word 0xA443001A # sh $v1, 0x1A($v0)
/* 0x00074124 0x800E3D24 0x3063FFFF */ .word 0x3063FFFF # andi $v1, $v1, 0xFFFF
/* 0x00074128 0x800E3D28 0x00031840 */ .word 0x00031840 # sll $v1, $v1, 1
/* 0x0007412C 0x800E3D2C 0x00621821 */ .word 0x00621821 # addu $v1, $v1, $v0
/* 0x00074130 0x800E3D30 0x94630006 */ .word 0x94630006 # lhu $v1, 0x6($v1)
/* 0x00074134 0x800E3D34 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00074138 0x800E3D38 0xA4430000 */ .word 0xA4430000 # sh $v1, 0x0($v0)
