/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000B1000_000C1000.s
 * z64 range: 0x000B3448..0x000B34A0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless/leaf split at jr $ra boundary; overlay-relocated (linear RAM column is wrong map). */
func_000b3448:
/* 0x000B3448 0x80123048 0x00002821 */ .word 0x00002821 # move $a1, $zero
/* 0x000B344C 0x8012304C 0x00003021 */ .word 0x00003021 # move $a2, $zero
/* 0x000B3450 0x80123050 0x3C038019 */ .word 0x3C038019 # lui $v1, 0x8019
/* 0x000B3454 0x80123054 0x8C636AF8 */ .word 0x8C636AF8 # lw $v1, 0x6AF8($v1)
/* 0x000B3458 0x80123058 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x000B345C 0x8012305C 0x000410C0 */ .word 0x000410C0 # sll $v0, $a0, 3
/* 0x000B3460 0x80123060 0x00441023 */ .word 0x00441023 # subu $v0, $v0, $a0
/* 0x000B3464 0x80123064 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
/* 0x000B3468 0x80123068 0x00441023 */ .word 0x00441023 # subu $v0, $v0, $a0
/* 0x000B346C 0x8012306C 0x00021040 */ .word 0x00021040 # sll $v0, $v0, 1
/* 0x000B3470 0x80123070 0x00621821 */ .word 0x00621821 # addu $v1, $v1, $v0
/* 0x000B3474 0x80123074 0x00651021 */ .word 0x00651021 # addu $v0, $v1, $a1
/* 0x000B3478 0x80123078 0x90421180 */ .word 0x90421180 # lbu $v0, 0x1180($v0)
/* 0x000B347C 0x8012307C 0x24A50001 */ .word 0x24A50001 # addiu $a1, $a1, 0x1
/* 0x000B3480 0x80123080 0x384200FF */ .word 0x384200FF # xori $v0, $v0, 0x00FF
/* 0x000B3484 0x80123084 0x0002102B */ .word 0x0002102B # sltu $v0, $zero, $v0
/* 0x000B3488 0x80123088 0x00C23021 */ .word 0x00C23021 # addu $a2, $a2, $v0
/* 0x000B348C 0x8012308C 0x28A20009 */ .word 0x28A20009 # slti $v0, $a1, 0x9
/* 0x000B3490 0x80123090 0x5440FFF9 */ .word 0x5440FFF9 # bnel $v0, $zero, 0x80123078
/* 0x000B3494 0x80123094 0x00651021 */ .word 0x00651021 # addu $v0, $v1, $a1
/* 0x000B3498 0x80123098 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000B349C 0x8012309C 0x00C01021 */ .word 0x00C01021 # move $v0, $a2
