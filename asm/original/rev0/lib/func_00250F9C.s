/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00241000_00251000.s
 * z64 range: 0x00250F9C..0x00251000 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Straddler head: this function begins here and continues into the next 64 KiB chunk. Outgoing straddler-head. Prologue addiu$sp,-0x18 @0x00250F9C; beq-cascade jump-table dispatcher with j 0x801FC510 overlay tail-jumps. NO jr$ra before 0x00251000; function continues into chunk 37. */
/* function boundary candidate: func_00250F9C, size=324, kind=prologue */
func_00250F9C:
/* 0x00250F9C 0x802C0B9C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00250FA0 0x802C0BA0 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x00250FA4 0x802C0BA4 0x00A08021 */ .word 0x00A08021 # move $s0, $a1
/* 0x00250FA8 0x802C0BA8 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x00250FAC 0x802C0BAC 0x24021000 */ .word 0x24021000 # addiu $v0, $zero, 0x1000
/* 0x00250FB0 0x802C0BB0 0x10820020 */ .word 0x10820020 # beq $a0, $v0, 0x802C0C34
/* 0x00250FB4 0x802C0BB4 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x00250FB8 0x802C0BB8 0x28821001 */ .word 0x28821001 # slti $v0, $a0, 0x1001
/* 0x00250FBC 0x802C0BBC 0x10400007 */ .word 0x10400007 # beq $v0, $zero, 0x802C0BDC
/* 0x00250FC0 0x802C0BC0 0x24020100 */ .word 0x24020100 # addiu $v0, $zero, 0x100
/* 0x00250FC4 0x802C0BC4 0x10820010 */ .word 0x10820010 # beq $a0, $v0, 0x802C0C08
/* 0x00250FC8 0x802C0BC8 0x24020101 */ .word 0x24020101 # addiu $v0, $zero, 0x101
/* 0x00250FCC 0x802C0BCC 0x1082000A */ .word 0x1082000A # beq $a0, $v0, 0x802C0BF8
/* 0x00250FD0 0x802C0BD0 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x00250FD4 0x802C0BD4 0x0807F144 */ .word 0x0807F144 # j 0x801FC510
/* 0x00250FD8 0x802C0BD8 0x00000000 */ .word 0x00000000 # nop
/* 0x00250FDC 0x802C0BDC 0x24021001 */ .word 0x24021001 # addiu $v0, $zero, 0x1001
/* 0x00250FE0 0x802C0BE0 0x1082001C */ .word 0x1082001C # beq $a0, $v0, 0x802C0C54
/* 0x00250FE4 0x802C0BE4 0x24021002 */ .word 0x24021002 # addiu $v0, $zero, 0x1002
/* 0x00250FE8 0x802C0BE8 0x10820036 */ .word 0x10820036 # beq $a0, $v0, 0x802C0CC4
/* 0x00250FEC 0x802C0BEC 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x00250FF0 0x802C0BF0 0x0807F144 */ .word 0x0807F144 # j 0x801FC510
/* 0x00250FF4 0x802C0BF4 0x00000000 */ .word 0x00000000 # nop
/* 0x00250FF8 0x802C0BF8 0x0C0837EE */ .word 0x0C0837EE # jal 0x8020DFB8
/* 0x00250FFC 0x802C0BFC 0x00000000 */ .word 0x00000000 # nop
