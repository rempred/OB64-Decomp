/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00051000_00061000.s
 * z64 range: 0x00051450..0x0005148C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (char-class/range check on a0: andi $v1,$a0,0xFF; sltiu); jr $ra 0x51484. Un-merged from over-merged func_00050F98 [adv-review] */
func_00051450:
/* 0x00051450 0x800C1050 0x308300FF */ .word 0x308300FF # andi $v1, $a0, 0x00FF
/* 0x00051454 0x800C1054 0x2C620081 */ .word 0x2C620081 # sltiu $v0, $v1, 0x81
/* 0x00051458 0x800C1058 0x1440000A */ .word 0x1440000A # bne $v0, $zero, 0x800C1084
/* 0x0005145C 0x800C105C 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x00051460 0x800C1060 0x24820060 */ .word 0x24820060 # addiu $v0, $a0, 0x60
/* 0x00051464 0x800C1064 0x304200FF */ .word 0x304200FF # andi $v0, $v0, 0x00FF
/* 0x00051468 0x800C1068 0x2C420040 */ .word 0x2C420040 # sltiu $v0, $v0, 0x40
/* 0x0005146C 0x800C106C 0x2C6300FD */ .word 0x2C6300FD # sltiu $v1, $v1, 0xFD
/* 0x00051470 0x800C1070 0x38630001 */ .word 0x38630001 # xori $v1, $v1, 0x0001
/* 0x00051474 0x800C1074 0x00431025 */ .word 0x00431025 # or $v0, $v0, $v1
/* 0x00051478 0x800C1078 0x14400002 */ .word 0x14400002 # bne $v0, $zero, 0x800C1084
/* 0x0005147C 0x800C107C 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x00051480 0x800C1080 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x00051484 0x800C1084 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00051488 0x800C1088 0x00000000 */ .word 0x00000000 # nop
