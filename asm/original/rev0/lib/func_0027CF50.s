/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00271000_00281000.s
 * z64 range: 0x0027CF50..0x0027CFAC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf un-merged from idx15. Reads 0x8023D0F0/0x8023D148, multiply-by-constant index math, stores back to 0x8023D0F0. jr $ra at 0x27CFA4, delay 0x27CFA8 (sh $v0,-0x2F10). */
func_0027CF50:
/* 0x0027CF50 0x802ECB50 0x3C028023 */ .word 0x3C028023 # lui $v0, 0x8023
/* 0x0027CF54 0x802ECB54 0x9442D0F0 */ .word 0x9442D0F0 # lhu $v0, -0x2F10($v0)
/* 0x0027CF58 0x802ECB58 0x3C038023 */ .word 0x3C038023 # lui $v1, 0x8023
/* 0x0027CF5C 0x802ECB5C 0x8C63D148 */ .word 0x8C63D148 # lw $v1, -0x2EB8($v1)
/* 0x0027CF60 0x802ECB60 0xAC800008 */ .word 0xAC800008 # sw $zero, 0x8($a0)
/* 0x0027CF64 0x802ECB64 0xA4800010 */ .word 0xA4800010 # sh $zero, 0x10($a0)
/* 0x0027CF68 0x802ECB68 0xA4820006 */ .word 0xA4820006 # sh $v0, 0x6($a0)
/* 0x0027CF6C 0x802ECB6C 0x00832023 */ .word 0x00832023 # subu $a0, $a0, $v1
/* 0x0027CF70 0x802ECB70 0x000410C0 */ .word 0x000410C0 # sll $v0, $a0, 3
/* 0x0027CF74 0x802ECB74 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x0027CF78 0x802ECB78 0x00021980 */ .word 0x00021980 # sll $v1, $v0, 6
/* 0x0027CF7C 0x802ECB7C 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x0027CF80 0x802ECB80 0x000210C0 */ .word 0x000210C0 # sll $v0, $v0, 3
/* 0x0027CF84 0x802ECB84 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x0027CF88 0x802ECB88 0x00021BC0 */ .word 0x00021BC0 # sll $v1, $v0, 15
/* 0x0027CF8C 0x802ECB8C 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x0027CF90 0x802ECB90 0x000210C0 */ .word 0x000210C0 # sll $v0, $v0, 3
/* 0x0027CF94 0x802ECB94 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x0027CF98 0x802ECB98 0x00021023 */ .word 0x00021023 # subu $v0, $zero, $v0
/* 0x0027CF9C 0x802ECB9C 0x000210C3 */ .word 0x000210C3 # sra $v0, $v0, 3
/* 0x0027CFA0 0x802ECBA0 0x3C018023 */ .word 0x3C018023 # lui $at, 0x8023
/* 0x0027CFA4 0x802ECBA4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0027CFA8 0x802ECBA8 0xA422D0F0 */ .word 0xA422D0F0 # sh $v0, -0x2F10($at)
