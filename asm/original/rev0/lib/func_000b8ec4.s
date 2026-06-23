/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000B1000_000C1000.s
 * z64 range: 0x000B8EC4..0x000B8F00 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* gap3 leaf 4 (frameless). move $a2,$zero/lui 0x8019. jr $ra @0xB8EF8. */
func_000b8ec4:
/* 0x000B8EC4 0x80128AC4 0x00003021 */ .word 0x00003021 # move $a2, $zero
/* 0x000B8EC8 0x80128AC8 0x24050009 */ .word 0x24050009 # addiu $a1, $zero, 0x9
/* 0x000B8ECC 0x80128ACC 0x3C078019 */ .word 0x3C078019 # lui $a3, 0x8019
/* 0x000B8ED0 0x80128AD0 0x8CE76AF8 */ .word 0x8CE76AF8 # lw $a3, 0x6AF8($a3)
/* 0x000B8ED4 0x80128AD4 0x24040F98 */ .word 0x24040F98 # addiu $a0, $zero, 0xF98
/* 0x000B8ED8 0x80128AD8 0x00E41821 */ .word 0x00E41821 # addu $v1, $a3, $a0
/* 0x000B8EDC 0x80128ADC 0x906200E6 */ .word 0x906200E6 # lbu $v0, 0xE6($v1)
/* 0x000B8EE0 0x80128AE0 0x50400003 */ .word 0x50400003 # beql $v0, $zero, 0x80128AF0
/* 0x000B8EE4 0x80128AE4 0x24A5FFFF */ .word 0x24A5FFFF # addiu $a1, $a1, -0x1
/* 0x000B8EE8 0x80128AE8 0x08073126 */ .word 0x08073126 # j 0x801CC498
/* 0x000B8EEC 0x80128AEC 0x00603021 */ .word 0x00603021 # move $a2, $v1
/* 0x000B8EF0 0x80128AF0 0x04A1FFF9 */ .word 0x04A1FFF9 # bgez $a1, 0x80128AD8
/* 0x000B8EF4 0x80128AF4 0x2484FEF8 */ .word 0x2484FEF8 # addiu $a0, $a0, -0x108
/* 0x000B8EF8 0x80128AF8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000B8EFC 0x80128AFC 0x00C01021 */ .word 0x00C01021 # move $v0, $a2
