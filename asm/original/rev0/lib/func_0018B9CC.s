/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00181000_00191000.s
 * z64 range: 0x0018B9CC..0x0018BA40 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (no addiu $sp); falls through after prior jr. Starts move $a1,$a0 / move $a2,$zero. Loops 0x100 halfwords doing an RGB555 channel transform with 0x55556 reciprocal multiply. jr $ra at 0x18BA38 + delay-slot nop at 0x18BA3C kept with it. */
func_0018B9CC:
/* 0x0018B9CC 0x801FB5CC 0x00802821 */ .word 0x00802821 # move $a1, $a0
/* 0x0018B9D0 0x801FB5D0 0x00003021 */ .word 0x00003021 # move $a2, $zero
/* 0x0018B9D4 0x801FB5D4 0x3C075555 */ .word 0x3C075555 # lui $a3, 0x5555
/* 0x0018B9D8 0x801FB5D8 0x34E75556 */ .word 0x34E75556 # ori $a3, $a3, 0x5556
/* 0x0018B9DC 0x801FB5DC 0x94A40000 */ .word 0x94A40000 # lhu $a0, 0x0($a1)
/* 0x0018B9E0 0x801FB5E0 0x00041AC2 */ .word 0x00041AC2 # srl $v1, $a0, 11
/* 0x0018B9E4 0x801FB5E4 0x308207C0 */ .word 0x308207C0 # andi $v0, $a0, 0x07C0
/* 0x0018B9E8 0x801FB5E8 0x00021182 */ .word 0x00021182 # srl $v0, $v0, 6
/* 0x0018B9EC 0x801FB5EC 0x00621821 */ .word 0x00621821 # addu $v1, $v1, $v0
/* 0x0018B9F0 0x801FB5F0 0x3082003E */ .word 0x3082003E # andi $v0, $a0, 0x003E
/* 0x0018B9F4 0x801FB5F4 0x00021042 */ .word 0x00021042 # srl $v0, $v0, 1
/* 0x0018B9F8 0x801FB5F8 0x00621821 */ .word 0x00621821 # addu $v1, $v1, $v0
/* 0x0018B9FC 0x801FB5FC 0x00670018 */ .word 0x00670018 # mult $v1, $a3
/* 0x0018BA00 0x801FB600 0x24C60001 */ .word 0x24C60001 # addiu $a2, $a2, 0x1
/* 0x0018BA04 0x801FB604 0x00031FC3 */ .word 0x00031FC3 # sra $v1, $v1, 31
/* 0x0018BA08 0x801FB608 0x00004010 */ .word 0x00004010 # mfhi $t0
/* 0x0018BA0C 0x801FB60C 0x01031823 */ .word 0x01031823 # subu $v1, $t0, $v1
/* 0x0018BA10 0x801FB610 0x000322C0 */ .word 0x000322C0 # sll $a0, $v1, 11
/* 0x0018BA14 0x801FB614 0x00031180 */ .word 0x00031180 # sll $v0, $v1, 6
/* 0x0018BA18 0x801FB618 0x00822021 */ .word 0x00822021 # addu $a0, $a0, $v0
/* 0x0018BA1C 0x801FB61C 0x00031840 */ .word 0x00031840 # sll $v1, $v1, 1
/* 0x0018BA20 0x801FB620 0x00832021 */ .word 0x00832021 # addu $a0, $a0, $v1
/* 0x0018BA24 0x801FB624 0x34840001 */ .word 0x34840001 # ori $a0, $a0, 0x0001
/* 0x0018BA28 0x801FB628 0xA4A40000 */ .word 0xA4A40000 # sh $a0, 0x0($a1)
/* 0x0018BA2C 0x801FB62C 0x28C20100 */ .word 0x28C20100 # slti $v0, $a2, 0x100
/* 0x0018BA30 0x801FB630 0x1440FFEA */ .word 0x1440FFEA # bne $v0, $zero, 0x801FB5DC
/* 0x0018BA34 0x801FB634 0x24A50002 */ .word 0x24A50002 # addiu $a1, $a1, 0x2
/* 0x0018BA38 0x801FB638 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0018BA3C 0x801FB63C 0x00000000 */ .word 0x00000000 # nop
