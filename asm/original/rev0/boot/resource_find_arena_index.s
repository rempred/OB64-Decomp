/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000018D4_00011000.s
 * z64 range: 0x00001F9C..0x00002004 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_00001F9C, size=104, kind=leaf */
func_00001F9C:
/* 0x00001F9C 0x80071B9C 0x3C02800B */ .word 0x3C02800B # lui $v0, 0x800B
/* 0x00001FA0 0x80071BA0 0x9442EDE0 */ .word 0x9442EDE0 # lhu $v0, -0x1220($v0)

/* function boundary candidate: func_00001FA4, size=96, kind=prologue */
func_00001FA4:
/* 0x00001FA4 0x80071BA4 0x27BDFFF8 */ .word 0x27BDFFF8 # addiu $sp, $sp, -0x8
/* 0x00001FA8 0x80071BA8 0x18400013 */ .word 0x18400013 # blez $v0, 0x80071BF8
/* 0x00001FAC 0x80071BAC 0x00002821 */ .word 0x00002821 # move $a1, $zero
/* 0x00001FB0 0x80071BB0 0x00403021 */ .word 0x00403021 # move $a2, $v0
/* 0x00001FB4 0x80071BB4 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x00001FB8 0x80071BB8 0x3C02800B */ .word 0x3C02800B # lui $v0, 0x800B
/* 0x00001FBC 0x80071BBC 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x00001FC0 0x80071BC0 0x8C42EDB0 */ .word 0x8C42EDB0 # lw $v0, -0x1250($v0)
/* 0x00001FC4 0x80071BC4 0x0082102B */ .word 0x0082102B # sltu $v0, $a0, $v0
/* 0x00001FC8 0x80071BC8 0x54400008 */ .word 0x54400008 # bnel $v0, $zero, 0x80071BEC
/* 0x00001FCC 0x80071BCC 0x24A50001 */ .word 0x24A50001 # addiu $a1, $a1, 0x1
/* 0x00001FD0 0x80071BD0 0x3C02800B */ .word 0x3C02800B # lui $v0, 0x800B
/* 0x00001FD4 0x80071BD4 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x00001FD8 0x80071BD8 0x8C42EDB4 */ .word 0x8C42EDB4 # lw $v0, -0x124C($v0)
/* 0x00001FDC 0x80071BDC 0x0082102B */ .word 0x0082102B # sltu $v0, $a0, $v0
/* 0x00001FE0 0x80071BE0 0x14400006 */ .word 0x14400006 # bne $v0, $zero, 0x80071BFC
/* 0x00001FE4 0x80071BE4 0x00A01021 */ .word 0x00A01021 # move $v0, $a1
/* 0x00001FE8 0x80071BE8 0x24A50001 */ .word 0x24A50001 # addiu $a1, $a1, 0x1
/* 0x00001FEC 0x80071BEC 0x00A6102A */ .word 0x00A6102A # slt $v0, $a1, $a2
/* 0x00001FF0 0x80071BF0 0x1440FFF1 */ .word 0x1440FFF1 # bne $v0, $zero, 0x80071BB8
/* 0x00001FF4 0x80071BF4 0x2463000C */ .word 0x2463000C # addiu $v1, $v1, 0xC
/* 0x00001FF8 0x80071BF8 0x00A01021 */ .word 0x00A01021 # move $v0, $a1
/* 0x00001FFC 0x80071BFC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00002000 0x80071C00 0x27BD0008 */ .word 0x27BD0008 # addiu $sp, $sp, 0x8
