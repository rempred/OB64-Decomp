/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00012248..0x000122A4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00012248 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00012248:
/* 0x00012248 0x80081E48 0x14800006 */ .word 0x14800006 # bne $a0, $zero, 0x80081E64

/* function boundary candidate: func_0001224C, size=88, kind=prologue */
func_0001224C:
/* 0x0001224C 0x80081E4C 0x27BDFFF8 */ .word 0x27BDFFF8 # addiu $sp, $sp, -0x8
/* 0x00012250 0x80081E50 0x080207A7 */ .word 0x080207A7 # j 0x80081E9C
/* 0x00012254 0x80081E54 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x00012258 0x80081E58 0x8CA2007C */ .word 0x8CA2007C # lw $v0, 0x7C($a1)
/* 0x0001225C 0x80081E5C 0x080207A7 */ .word 0x080207A7 # j 0x80081E9C
/* 0x00012260 0x80081E60 0x00000000 */ .word 0x00000000 # nop
/* 0x00012264 0x80081E64 0x3C02800B */ .word 0x3C02800B # lui $v0, 0x800B
/* 0x00012268 0x80081E68 0x8C421804 */ .word 0x8C421804 # lw $v0, 0x1804($v0)
/* 0x0001226C 0x80081E6C 0x3C05800B */ .word 0x3C05800B # lui $a1, 0x800B
/* 0x00012270 0x80081E70 0x8CA5180C */ .word 0x8CA5180C # lw $a1, 0x180C($a1)
/* 0x00012274 0x80081E74 0x18400008 */ .word 0x18400008 # blez $v0, 0x80081E98
/* 0x00012278 0x80081E78 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x0001227C 0x80081E7C 0x00403021 */ .word 0x00403021 # move $a2, $v0
/* 0x00012280 0x80081E80 0x8CA20044 */ .word 0x8CA20044 # lw $v0, 0x44($a1)
/* 0x00012284 0x80081E84 0x1044FFF4 */ .word 0x1044FFF4 # beq $v0, $a0, 0x80081E58
/* 0x00012288 0x80081E88 0x24630001 */ .word 0x24630001 # addiu $v1, $v1, 0x1
/* 0x0001228C 0x80081E8C 0x0066102A */ .word 0x0066102A # slt $v0, $v1, $a2
/* 0x00012290 0x80081E90 0x1440FFFB */ .word 0x1440FFFB # bne $v0, $zero, 0x80081E80
/* 0x00012294 0x80081E94 0x24A5013C */ .word 0x24A5013C # addiu $a1, $a1, 0x13C
/* 0x00012298 0x80081E98 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x0001229C 0x80081E9C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000122A0 0x80081EA0 0x27BD0008 */ .word 0x27BD0008 # addiu $sp, $sp, 0x8
