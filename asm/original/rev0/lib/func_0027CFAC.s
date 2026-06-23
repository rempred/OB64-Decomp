/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00271000_00281000.s
 * z64 range: 0x0027CFAC..0x0027CFC8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Tiny frameless leaf accessor un-merged from idx15. Writes -1/$a1/0/1 into struct at $a0 (offsets 0xE,0xC,0x4,0x10). jr $ra at 0x27CFC0, delay 0x27CFC4 (sh $v0,0x10($a0)). */
func_0027CFAC:
/* 0x0027CFAC 0x802ECBAC 0x2402FFFF */ .word 0x2402FFFF # addiu $v0, $zero, -0x1
/* 0x0027CFB0 0x802ECBB0 0xA482000E */ .word 0xA482000E # sh $v0, 0xE($a0)
/* 0x0027CFB4 0x802ECBB4 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x0027CFB8 0x802ECBB8 0xA485000C */ .word 0xA485000C # sh $a1, 0xC($a0)
/* 0x0027CFBC 0x802ECBBC 0xA4800004 */ .word 0xA4800004 # sh $zero, 0x4($a0)
/* 0x0027CFC0 0x802ECBC0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0027CFC4 0x802ECBC4 0xA4820010 */ .word 0xA4820010 # sh $v0, 0x10($a0)
