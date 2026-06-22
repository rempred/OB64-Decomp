/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00045420..0x00045440 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, jr $ra at 0x45438 */
func_00045420:
/* 0x00045420 0x800B5020 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x00045424 0x800B5024 0x00041040 */ .word 0x00041040 # sll $v0, $a0, 1
/* 0x00045428 0x800B5028 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x0004542C 0x800B502C 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
/* 0x00045430 0x800B5030 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x00045434 0x800B5034 0x00220821 */ .word 0x00220821 # addu $at, $at, $v0
/* 0x00045438 0x800B5038 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004543C 0x800B503C 0x9022E6D1 */ .word 0x9022E6D1 # lbu $v0, -0x192F($at)
