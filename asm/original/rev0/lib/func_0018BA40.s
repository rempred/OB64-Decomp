/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00181000_00191000.s
 * z64 range: 0x0018BA40..0x0018BA8C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf. Starts move $a1,$a0 / move $a2,$zero; loops 0x100 halfwords doing a different RGB555 bit-repack (srl/sll/andi recombination). jr $ra at 0x18BA84 + delay-slot nop at 0x18BA88 kept with it. */
func_0018BA40:
/* 0x0018BA40 0x801FB640 0x00802821 */ .word 0x00802821 # move $a1, $a0
/* 0x0018BA44 0x801FB644 0x00003021 */ .word 0x00003021 # move $a2, $zero
/* 0x0018BA48 0x801FB648 0x94A40000 */ .word 0x94A40000 # lhu $a0, 0x0($a1)
/* 0x0018BA4C 0x801FB64C 0x24C60001 */ .word 0x24C60001 # addiu $a2, $a2, 0x1
/* 0x0018BA50 0x801FB650 0x00041B02 */ .word 0x00041B02 # srl $v1, $a0, 12
/* 0x0018BA54 0x801FB654 0x00031AC0 */ .word 0x00031AC0 # sll $v1, $v1, 11
/* 0x0018BA58 0x801FB658 0x00041042 */ .word 0x00041042 # srl $v0, $a0, 1
/* 0x0018BA5C 0x801FB65C 0x304203C0 */ .word 0x304203C0 # andi $v0, $v0, 0x03C0
/* 0x0018BA60 0x801FB660 0x00621821 */ .word 0x00621821 # addu $v1, $v1, $v0
/* 0x0018BA64 0x801FB664 0x00042042 */ .word 0x00042042 # srl $a0, $a0, 1
/* 0x0018BA68 0x801FB668 0x3084001E */ .word 0x3084001E # andi $a0, $a0, 0x001E
/* 0x0018BA6C 0x801FB66C 0x00641821 */ .word 0x00641821 # addu $v1, $v1, $a0
/* 0x0018BA70 0x801FB670 0x34630001 */ .word 0x34630001 # ori $v1, $v1, 0x0001
/* 0x0018BA74 0x801FB674 0xA4A30000 */ .word 0xA4A30000 # sh $v1, 0x0($a1)
/* 0x0018BA78 0x801FB678 0x28C20100 */ .word 0x28C20100 # slti $v0, $a2, 0x100
/* 0x0018BA7C 0x801FB67C 0x1440FFF2 */ .word 0x1440FFF2 # bne $v0, $zero, 0x801FB648
/* 0x0018BA80 0x801FB680 0x24A50002 */ .word 0x24A50002 # addiu $a1, $a1, 0x2
/* 0x0018BA84 0x801FB684 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0018BA88 0x801FB688 0x00000000 */ .word 0x00000000 # nop
