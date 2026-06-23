/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000D1000_000E1000.s
 * z64 range: 0x000DA66C..0x000DA69C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Recovered frameless leaf (move $v1,$zero entry; no stack frame), jr $ra@0xDA694 + delay slot andi@0xDA698. */
func_000da66c:
/* 0x000DA66C 0x8014A26C 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x000DA670 0x8014A270 0x3C048019 */ .word 0x3C048019 # lui $a0, 0x8019
/* 0x000DA674 0x8014A274 0x8C846AF8 */ .word 0x8C846AF8 # lw $a0, 0x6AF8($a0)
/* 0x000DA678 0x8014A278 0x908210DC */ .word 0x908210DC # lbu $v0, 0x10DC($a0)
/* 0x000DA67C 0x8014A27C 0x10400005 */ .word 0x10400005 # beq $v0, $zero, 0x8014A294
/* 0x000DA680 0x8014A280 0x00000000 */ .word 0x00000000 # nop
/* 0x000DA684 0x8014A284 0x24630001 */ .word 0x24630001 # addiu $v1, $v1, 0x1
/* 0x000DA688 0x8014A288 0x2862000A */ .word 0x2862000A # slti $v0, $v1, 0xA
/* 0x000DA68C 0x8014A28C 0x1440FFFA */ .word 0x1440FFFA # bne $v0, $zero, 0x8014A278
/* 0x000DA690 0x8014A290 0x2484000E */ .word 0x2484000E # addiu $a0, $a0, 0xE
/* 0x000DA694 0x8014A294 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000DA698 0x8014A298 0x306200FF */ .word 0x306200FF # andi $v0, $v1, 0x00FF
