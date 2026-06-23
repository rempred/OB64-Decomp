/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00191000_001A1000.s
 * z64 range: 0x0019B21C..0x0019B26C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Prologue addiu $sp,-0x8; byte-array accumulate loop; jr $ra@0x19B264 + delay addiu $sp,0x8@0x19B268. */
/* function boundary candidate: func_0019B21C, size=80, kind=prologue */
func_0019B21C:
/* 0x0019B21C 0x8020AE1C 0x27BDFFF8 */ .word 0x27BDFFF8 # addiu $sp, $sp, -0x8
/* 0x0019B220 0x8020AE20 0x308400FF */ .word 0x308400FF # andi $a0, $a0, 0x00FF
/* 0x0019B224 0x8020AE24 0x3C028022 */ .word 0x3C028022 # lui $v0, 0x8022
/* 0x0019B228 0x8020AE28 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x0019B22C 0x8020AE2C 0x8042A11A */ .word 0x8042A11A # lb $v0, -0x5EE6($v0)
/* 0x0019B230 0x8020AE30 0x00002021 */ .word 0x00002021 # move $a0, $zero
/* 0x0019B234 0x8020AE34 0x1840000A */ .word 0x1840000A # blez $v0, 0x8020AE60
/* 0x0019B238 0x8020AE38 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x0019B23C 0x8020AE3C 0x00402821 */ .word 0x00402821 # move $a1, $v0
/* 0x0019B240 0x8020AE40 0x3C028022 */ .word 0x3C028022 # lui $v0, 0x8022
/* 0x0019B244 0x8020AE44 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x0019B248 0x8020AE48 0x9042A114 */ .word 0x9042A114 # lbu $v0, -0x5EEC($v0)
/* 0x0019B24C 0x8020AE4C 0x24630001 */ .word 0x24630001 # addiu $v1, $v1, 0x1
/* 0x0019B250 0x8020AE50 0x00822021 */ .word 0x00822021 # addu $a0, $a0, $v0
/* 0x0019B254 0x8020AE54 0x0065102A */ .word 0x0065102A # slt $v0, $v1, $a1
/* 0x0019B258 0x8020AE58 0x1440FFF9 */ .word 0x1440FFF9 # bne $v0, $zero, 0x8020AE40
/* 0x0019B25C 0x8020AE5C 0x00000000 */ .word 0x00000000 # nop
/* 0x0019B260 0x8020AE60 0x308200FF */ .word 0x308200FF # andi $v0, $a0, 0x00FF
/* 0x0019B264 0x8020AE64 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0019B268 0x8020AE68 0x27BD0008 */ .word 0x27BD0008 # addiu $sp, $sp, 0x8
