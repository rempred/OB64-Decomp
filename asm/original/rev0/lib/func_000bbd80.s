/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000B1000_000C1000.s
 * z64 range: 0x000BBD80..0x000BBDAC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* RECOVERED frameless leaf; reads $a0, dispatch/byte table 0x801EF2CD, jr $ra @0xBBDA4+nop. Ends at slice boundary. */
func_000bbd80:
/* 0x000BBD80 0x8012B980 0x308400FF */ .word 0x308400FF # andi $a0, $a0, 0x00FF
/* 0x000BBD84 0x8012B984 0x2C820051 */ .word 0x2C820051 # sltiu $v0, $a0, 0x51
/* 0x000BBD88 0x8012B988 0x14400003 */ .word 0x14400003 # bne $v0, $zero, 0x8012B998
/* 0x000BBD8C 0x8012B98C 0x00041040 */ .word 0x00041040 # sll $v0, $a0, 1
/* 0x000BBD90 0x8012B990 0x08073CD1 */ .word 0x08073CD1 # j 0x801CF344
/* 0x000BBD94 0x8012B994 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x000BBD98 0x8012B998 0x3C01801F */ .word 0x3C01801F # lui $at, 0x801F
/* 0x000BBD9C 0x8012B99C 0x00220821 */ .word 0x00220821 # addu $at, $at, $v0
/* 0x000BBDA0 0x8012B9A0 0x9022F2CD */ .word 0x9022F2CD # lbu $v0, -0xD33($at)
/* 0x000BBDA4 0x8012B9A4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000BBDA8 0x8012B9A8 0x00000000 */ .word 0x00000000 # nop
