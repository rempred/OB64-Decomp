/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00049390..0x000493D4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, move $v1,$zero / andi $a0,$a0,0xFF table search; jr $ra at 0x000493CC + delay nop 0x000493D0. Un-merged from parent idx62. */
func_00049390:
/* 0x00049390 0x800B8F90 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x00049394 0x800B8F94 0x308400FF */ .word 0x308400FF # andi $a0, $a0, 0x00FF
/* 0x00049398 0x800B8F98 0x306200FF */ .word 0x306200FF # andi $v0, $v1, 0x00FF
/* 0x0004939C 0x800B8F9C 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x000493A0 0x800B8FA0 0x00220821 */ .word 0x00220821 # addu $at, $at, $v0
/* 0x000493A4 0x800B8FA4 0x9022367C */ .word 0x9022367C # lbu $v0, 0x367C($at)
/* 0x000493A8 0x800B8FA8 0x54440003 */ .word 0x54440003 # bnel $v0, $a0, 0x800B8FB8
/* 0x000493AC 0x800B8FAC 0x24630001 */ .word 0x24630001 # addiu $v1, $v1, 0x1
/* 0x000493B0 0x800B8FB0 0x0805CD33 */ .word 0x0805CD33 # j 0x801734CC
/* 0x000493B4 0x800B8FB4 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x000493B8 0x800B8FB8 0x306200FF */ .word 0x306200FF # andi $v0, $v1, 0x00FF
/* 0x000493BC 0x800B8FBC 0x2C420005 */ .word 0x2C420005 # sltiu $v0, $v0, 0x5
/* 0x000493C0 0x800B8FC0 0x1440FFF6 */ .word 0x1440FFF6 # bne $v0, $zero, 0x800B8F9C
/* 0x000493C4 0x800B8FC4 0x306200FF */ .word 0x306200FF # andi $v0, $v1, 0x00FF
/* 0x000493C8 0x800B8FC8 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x000493CC 0x800B8FCC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000493D0 0x800B8FD0 0x00000000 */ .word 0x00000000 # nop
