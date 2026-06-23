/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000B1000_000C1000.s
 * z64 range: 0x000BBD50..0x000BBD80 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* RECOVERED frameless leaf; reads $a0, dispatch/byte table 0x801EF2CC, andi 0xF, jr $ra @0xBBD78+nop. */
func_000bbd50:
/* 0x000BBD50 0x8012B950 0x308400FF */ .word 0x308400FF # andi $a0, $a0, 0x00FF
/* 0x000BBD54 0x8012B954 0x2C820051 */ .word 0x2C820051 # sltiu $v0, $a0, 0x51
/* 0x000BBD58 0x8012B958 0x14400003 */ .word 0x14400003 # bne $v0, $zero, 0x8012B968
/* 0x000BBD5C 0x8012B95C 0x00041040 */ .word 0x00041040 # sll $v0, $a0, 1
/* 0x000BBD60 0x8012B960 0x08073CC6 */ .word 0x08073CC6 # j 0x801CF318
/* 0x000BBD64 0x8012B964 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x000BBD68 0x8012B968 0x3C01801F */ .word 0x3C01801F # lui $at, 0x801F
/* 0x000BBD6C 0x8012B96C 0x00220821 */ .word 0x00220821 # addu $at, $at, $v0
/* 0x000BBD70 0x8012B970 0x9022F2CC */ .word 0x9022F2CC # lbu $v0, -0xD34($at)
/* 0x000BBD74 0x8012B974 0x3042000F */ .word 0x3042000F # andi $v0, $v0, 0x000F
/* 0x000BBD78 0x8012B978 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000BBD7C 0x8012B97C 0x00000000 */ .word 0x00000000 # nop
