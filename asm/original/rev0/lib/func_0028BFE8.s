/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x0028BFE8..0x0028C014 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless display-list leaf un-merged from parent idx32 tail; lui 0x800F + lw/sw 0x800F9BA0 GBI cursor, lui 0xDE00 command immediate. jr $ra@0x0028C00C + delay sw@0x0028C010. CODE. */
/* 0x0028BFE8 0x802FBBE8 0x3C03800F */ .word 0x3C03800F # lui $v1, 0x800F
/* 0x0028BFEC 0x802FBBEC 0x8C639BA0 */ .word 0x8C639BA0 # lw $v1, -0x6460($v1)
/* 0x0028BFF0 0x802FBBF0 0x24620008 */ .word 0x24620008 # addiu $v0, $v1, 0x8
/* 0x0028BFF4 0x802FBBF4 0x3C01800F */ .word 0x3C01800F # lui $at, 0x800F
/* 0x0028BFF8 0x802FBBF8 0xAC229BA0 */ .word 0xAC229BA0 # sw $v0, -0x6460($at)
/* 0x0028BFFC 0x802FBBFC 0x3C02DE00 */ .word 0x3C02DE00 # lui $v0, 0xDE00
/* 0x0028C000 0x802FBC00 0xAC620000 */ .word 0xAC620000 # sw $v0, 0x0($v1)
/* 0x0028C004 0x802FBC04 0x3C028024 */ .word 0x3C028024 # lui $v0, 0x8024
/* 0x0028C008 0x802FBC08 0x2442DF48 */ .word 0x2442DF48 # addiu $v0, $v0, -0x20B8
/* 0x0028C00C 0x802FBC0C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0028C010 0x802FBC10 0xAC620004 */ .word 0xAC620004 # sw $v0, 0x4($v1)
