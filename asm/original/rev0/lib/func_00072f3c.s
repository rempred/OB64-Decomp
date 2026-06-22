/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00071000_00081000.s
 * z64 range: 0x00072F3C..0x00072F68 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Hidden frameless leaf (companion dequeue accessor: lui $v0,0x51AC, dec 0x1A, load via index). Ends jr $ra at 0x72F60 + delay 0x72F64 (sh). Trailing lui/lw 0x72F68 is preamble for next function. */
func_00072f3c:
/* 0x00072F3C 0x800E2B3C 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x00072F40 0x800E2B40 0x8C4251AC */ .word 0x8C4251AC # lw $v0, 0x51AC($v0)
/* 0x00072F44 0x800E2B44 0x9443001A */ .word 0x9443001A # lhu $v1, 0x1A($v0)
/* 0x00072F48 0x800E2B48 0x2463FFFF */ .word 0x2463FFFF # addiu $v1, $v1, -0x1
/* 0x00072F4C 0x800E2B4C 0xA443001A */ .word 0xA443001A # sh $v1, 0x1A($v0)
/* 0x00072F50 0x800E2B50 0x3063FFFF */ .word 0x3063FFFF # andi $v1, $v1, 0xFFFF
/* 0x00072F54 0x800E2B54 0x00031840 */ .word 0x00031840 # sll $v1, $v1, 1
/* 0x00072F58 0x800E2B58 0x00621821 */ .word 0x00621821 # addu $v1, $v1, $v0
/* 0x00072F5C 0x800E2B5C 0x94630006 */ .word 0x94630006 # lhu $v1, 0x6($v1)
/* 0x00072F60 0x800E2B60 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00072F64 0x800E2B64 0xA4430000 */ .word 0xA4430000 # sh $v1, 0x0($v0)
