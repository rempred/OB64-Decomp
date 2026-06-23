/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000B1000_000C1000.s
 * z64 range: 0x000BD318..0x000BD36C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf recovered from parent idx86. addiu $a2,0xB; counts nonzero entries over 0x10D4 table; jr $ra at 0xBD364. */
func_000bd318:
/* 0x000BD318 0x8012CF18 0x2406000B */ .word 0x2406000B # addiu $a2, $zero, 0xB
/* 0x000BD31C 0x8012CF1C 0x00002821 */ .word 0x00002821 # move $a1, $zero
/* 0x000BD320 0x8012CF20 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x000BD324 0x8012CF24 0x000410C0 */ .word 0x000410C0 # sll $v0, $a0, 3
/* 0x000BD328 0x8012CF28 0x00441023 */ .word 0x00441023 # subu $v0, $v0, $a0
/* 0x000BD32C 0x8012CF2C 0x3C038019 */ .word 0x3C038019 # lui $v1, 0x8019
/* 0x000BD330 0x8012CF30 0x8C636AF8 */ .word 0x8C636AF8 # lw $v1, 0x6AF8($v1)
/* 0x000BD334 0x8012CF34 0x00021040 */ .word 0x00021040 # sll $v0, $v0, 1
/* 0x000BD338 0x8012CF38 0x244210D4 */ .word 0x244210D4 # addiu $v0, $v0, 0x10D4
/* 0x000BD33C 0x8012CF3C 0x00621821 */ .word 0x00621821 # addu $v1, $v1, $v0
/* 0x000BD340 0x8012CF40 0x00651021 */ .word 0x00651021 # addu $v0, $v1, $a1
/* 0x000BD344 0x8012CF44 0x90420002 */ .word 0x90420002 # lbu $v0, 0x2($v0)
/* 0x000BD348 0x8012CF48 0x24A50001 */ .word 0x24A50001 # addiu $a1, $a1, 0x1
/* 0x000BD34C 0x8012CF4C 0x384200FF */ .word 0x384200FF # xori $v0, $v0, 0x00FF
/* 0x000BD350 0x8012CF50 0x0002102B */ .word 0x0002102B # sltu $v0, $zero, $v0
/* 0x000BD354 0x8012CF54 0x00C23023 */ .word 0x00C23023 # subu $a2, $a2, $v0
/* 0x000BD358 0x8012CF58 0x28A20005 */ .word 0x28A20005 # slti $v0, $a1, 0x5
/* 0x000BD35C 0x8012CF5C 0x5440FFF9 */ .word 0x5440FFF9 # bnel $v0, $zero, 0x8012CF44
/* 0x000BD360 0x8012CF60 0x00651021 */ .word 0x00651021 # addu $v0, $v1, $a1
/* 0x000BD364 0x8012CF64 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000BD368 0x8012CF68 0x30C200FF */ .word 0x30C200FF # andi $v0, $a2, 0x00FF
