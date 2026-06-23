/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001A1000_001B1000.s
 * z64 range: 0x001AB72C..0x001AB768 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Prologue addiu $sp,-0x18. Stores two jal 0x8009DD38 results to globals -0x1C34/-0x1C30($at,0x8022). Terminal jr $ra @0x1AB760 + delay addiu $sp,0x18 @0x1AB764. End 0x1AB768 = next preamble start (8B gap before 0x1AB770 prologue, owned by func_001AB770). */
func_001AB72C:
/* function boundary candidate: func_001AB72C, size=60, kind=prologue */
func_001AB72C:
/* 0x001AB72C 0x8021B32C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x001AB730 0x8021B330 0x3C0401DF */ .word 0x3C0401DF # lui $a0, 0x01DF
/* 0x001AB734 0x8021B334 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x001AB738 0x8021B338 0x0C02774E */ .word 0x0C02774E # jal 0x8009DD38
/* 0x001AB73C 0x8021B33C 0x34847BF8 */ .word 0x34847BF8 # ori $a0, $a0, 0x7BF8
/* 0x001AB740 0x8021B340 0x3C0401DC */ .word 0x3C0401DC # lui $a0, 0x01DC
/* 0x001AB744 0x8021B344 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x001AB748 0x8021B348 0xAC22E3CC */ .word 0xAC22E3CC # sw $v0, -0x1C34($at)
/* 0x001AB74C 0x8021B34C 0x0C02774E */ .word 0x0C02774E # jal 0x8009DD38
/* 0x001AB750 0x8021B350 0x34842EE8 */ .word 0x34842EE8 # ori $a0, $a0, 0x2EE8
/* 0x001AB754 0x8021B354 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x001AB758 0x8021B358 0xAC22E3D0 */ .word 0xAC22E3D0 # sw $v0, -0x1C30($at)
/* 0x001AB75C 0x8021B35C 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x001AB760 0x8021B360 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001AB764 0x8021B364 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
