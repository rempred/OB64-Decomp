/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001B1000_001C1000.s
 * z64 range: 0x001BB330..0x001BB36C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf on $a0: lhu 0xC($a0) decrement+index; j 0x8022222C internal tail-jump; jr $ra(0x1BB364)+delay move $v0,$zero(0x1BB368). */
func_001BB330:
/* 0x001BB330 0x8022AF30 0x9482000C */ .word 0x9482000C # lhu $v0, 0xC($a0)
/* 0x001BB334 0x8022AF34 0x14400003 */ .word 0x14400003 # bne $v0, $zero, 0x8022AF44
/* 0x001BB338 0x8022AF38 0x00000000 */ .word 0x00000000 # nop
/* 0x001BB33C 0x8022AF3C 0x0808888B */ .word 0x0808888B # j 0x8022222C
/* 0x001BB340 0x8022AF40 0x00000000 */ .word 0x00000000 # nop
/* 0x001BB344 0x8022AF44 0x9482000C */ .word 0x9482000C # lhu $v0, 0xC($a0)
/* 0x001BB348 0x8022AF48 0x2442FFFF */ .word 0x2442FFFF # addiu $v0, $v0, -0x1
/* 0x001BB34C 0x8022AF4C 0xA482000C */ .word 0xA482000C # sh $v0, 0xC($a0)
/* 0x001BB350 0x8022AF50 0x3042FFFF */ .word 0x3042FFFF # andi $v0, $v0, 0xFFFF
/* 0x001BB354 0x8022AF54 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
/* 0x001BB358 0x8022AF58 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x001BB35C 0x8022AF5C 0x8C420010 */ .word 0x8C420010 # lw $v0, 0x10($v0)
/* 0x001BB360 0x8022AF60 0xAC820008 */ .word 0xAC820008 # sw $v0, 0x8($a0)
/* 0x001BB364 0x8022AF64 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001BB368 0x8022AF68 0x00001021 */ .word 0x00001021 # move $v0, $zero
