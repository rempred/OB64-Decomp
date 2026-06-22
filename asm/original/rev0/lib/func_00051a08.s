/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00051000_00061000.s
 * z64 range: 0x00051A08..0x00051A34 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Parent file 8. addiu $sp,-0x18 prologue; jal 0x8019C67C; jr $ra at 0x51A2C + delay slot 0x51A30. Ends where next prologue begins. */
/* function boundary candidate: func_00051A08, size=44, kind=prologue */
func_00051A08:
/* 0x00051A08 0x800C1608 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00051A0C 0x800C160C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00051A10 0x800C1610 0x0C06719F */ .word 0x0C06719F # jal 0x8019C67C
/* 0x00051A14 0x800C1614 0x00000000 */ .word 0x00000000 # nop
/* 0x00051A18 0x800C1618 0x10400003 */ .word 0x10400003 # beq $v0, $zero, 0x800C1628
/* 0x00051A1C 0x800C161C 0x24020009 */ .word 0x24020009 # addiu $v0, $zero, 0x9
/* 0x00051A20 0x800C1620 0x3C01800C */ .word 0x3C01800C # lui $at, 0x800C
/* 0x00051A24 0x800C1624 0xA4224C26 */ .word 0xA4224C26 # sh $v0, 0x4C26($at)
/* 0x00051A28 0x800C1628 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00051A2C 0x800C162C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00051A30 0x800C1630 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
