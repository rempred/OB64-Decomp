/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000E1000_000F1000.s
 * z64 range: 0x000E4930..0x000E495C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless display-list builder (parent-undetected); jr $ra@0xE4954 */
/* 0x000E4930 0x80154530 0x3C03800F */ .word 0x3C03800F # lui $v1, 0x800F
/* 0x000E4934 0x80154534 0x8C639BA0 */ .word 0x8C639BA0 # lw $v1, -0x6460($v1)
/* 0x000E4938 0x80154538 0x24620008 */ .word 0x24620008 # addiu $v0, $v1, 0x8
/* 0x000E493C 0x8015453C 0x3C01800F */ .word 0x3C01800F # lui $at, 0x800F
/* 0x000E4940 0x80154540 0xAC229BA0 */ .word 0xAC229BA0 # sw $v0, -0x6460($at)
/* 0x000E4944 0x80154544 0x3C02DE00 */ .word 0x3C02DE00 # lui $v0, 0xDE00
/* 0x000E4948 0x80154548 0xAC620000 */ .word 0xAC620000 # sw $v0, 0x0($v1)
/* 0x000E494C 0x8015454C 0x3C028018 */ .word 0x3C028018 # lui $v0, 0x8018
/* 0x000E4950 0x80154550 0x24426D90 */ .word 0x24426D90 # addiu $v0, $v0, 0x6D90
/* 0x000E4954 0x80154554 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000E4958 0x80154558 0xAC620004 */ .word 0xAC620004 # sw $v0, 0x4($v1)
