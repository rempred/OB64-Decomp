/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00181000_00191000.s
 * z64 range: 0x0018BA8C..0x0018BAB4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf. Starts move $v1,$zero; loops 0x100 halfwords lhu $v0,0($a0) -> sh $v0,0($a1) straight copy with post-increment. jr $ra at 0x18BAAC + delay-slot nop at 0x18BAB0 kept with it. */
func_0018BA8C:
/* 0x0018BA8C 0x801FB68C 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x0018BA90 0x801FB690 0x94820000 */ .word 0x94820000 # lhu $v0, 0x0($a0)
/* 0x0018BA94 0x801FB694 0x24840002 */ .word 0x24840002 # addiu $a0, $a0, 0x2
/* 0x0018BA98 0x801FB698 0x24630001 */ .word 0x24630001 # addiu $v1, $v1, 0x1
/* 0x0018BA9C 0x801FB69C 0xA4A20000 */ .word 0xA4A20000 # sh $v0, 0x0($a1)
/* 0x0018BAA0 0x801FB6A0 0x28620100 */ .word 0x28620100 # slti $v0, $v1, 0x100
/* 0x0018BAA4 0x801FB6A4 0x1440FFFA */ .word 0x1440FFFA # bne $v0, $zero, 0x801FB690
/* 0x0018BAA8 0x801FB6A8 0x24A50002 */ .word 0x24A50002 # addiu $a1, $a1, 0x2
/* 0x0018BAAC 0x801FB6AC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0018BAB0 0x801FB6B0 0x00000000 */ .word 0x00000000 # nop
