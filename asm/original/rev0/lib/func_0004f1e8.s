/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004F1E8..0x0004F228 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* preamble-orphan folded: lui/lw at 0x0004F1E8 read-before-write of -0x6460(0x800F) consumed by addiu at 0x0004F1F8; prologue at 0x0004F1F0, jr $ra at 0x0004F220 + delay 0x0004F224 */
func_0004f1e8:
/* 0x0004F1E8 0x800BEDE8 0x3C03800F */ .word 0x3C03800F # lui $v1, 0x800F
/* 0x0004F1EC 0x800BEDEC 0x8C639BA0 */ .word 0x8C639BA0 # lw $v1, -0x6460($v1)

/* function boundary candidate: func_0004F1F0, size=188, kind=prologue */
func_0004F1F0:
/* 0x0004F1F0 0x800BEDF0 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004F1F4 0x800BEDF4 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004F1F8 0x800BEDF8 0x24620008 */ .word 0x24620008 # addiu $v0, $v1, 0x8
/* 0x0004F1FC 0x800BEDFC 0x3C01800F */ .word 0x3C01800F # lui $at, 0x800F
/* 0x0004F200 0x800BEE00 0xAC229BA0 */ .word 0xAC229BA0 # sw $v0, -0x6460($at)
/* 0x0004F204 0x800BEE04 0x3C02DE00 */ .word 0x3C02DE00 # lui $v0, 0xDE00
/* 0x0004F208 0x800BEE08 0xAC620000 */ .word 0xAC620000 # sw $v0, 0x0($v1)
/* 0x0004F20C 0x800BEE0C 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x0004F210 0x800BEE10 0x2442FC80 */ .word 0x2442FC80 # addiu $v0, $v0, -0x380
/* 0x0004F214 0x800BEE14 0x0C05E4D5 */ .word 0x0C05E4D5 # jal 0x80179354
/* 0x0004F218 0x800BEE18 0xAC620004 */ .word 0xAC620004 # sw $v0, 0x4($v1)
/* 0x0004F21C 0x800BEE1C 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004F220 0x800BEE20 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004F224 0x800BEE24 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
