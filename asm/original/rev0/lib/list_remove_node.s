/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x00025000..0x00025040 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00025000 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
list_remove_node:
/* function boundary candidate: func_00025000, size=52, kind=leaf */
func_00025000:
/* 0x00025000 0x80094C00 0x8C820000 */ .word 0x8C820000 # lw $v0, 0x0($a0)
/* 0x00025004 0x80094C04 0x10400009 */ .word 0x10400009 # beq $v0, $zero, 0x80094C2C
/* 0x00025008 0x80094C08 0x00000000 */ .word 0x00000000 # nop
/* 0x0002500C 0x80094C0C 0x54450004 */ .word 0x54450004 # bnel $v0, $a1, 0x80094C20
/* 0x00025010 0x80094C10 0x00402021 */ .word 0x00402021 # move $a0, $v0
/* 0x00025014 0x80094C14 0x8C420000 */ .word 0x8C420000 # lw $v0, 0x0($v0)
/* 0x00025018 0x80094C18 0x0802530B */ .word 0x0802530B # j 0x80094C2C
/* 0x0002501C 0x80094C1C 0xAC820000 */ .word 0xAC820000 # sw $v0, 0x0($a0)
/* 0x00025020 0x80094C20 0x8C420000 */ .word 0x8C420000 # lw $v0, 0x0($v0)
/* 0x00025024 0x80094C24 0x1440FFF9 */ .word 0x1440FFF9 # bne $v0, $zero, 0x80094C0C
/* 0x00025028 0x80094C28 0x00000000 */ .word 0x00000000 # nop
/* 0x0002502C 0x80094C2C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00025030 0x80094C30 0x00000000 */ .word 0x00000000 # nop
/* 0x00025034 0x80094C34 0x00000000 */ .word 0x00000000 # nop
/* 0x00025038 0x80094C38 0x00000000 */ .word 0x00000000 # nop
/* 0x0002503C 0x80094C3C 0x00000000 */ .word 0x00000000 # nop
