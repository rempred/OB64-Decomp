/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001A1000_001B1000.s
 * z64 range: 0x001A4020..0x001A404C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Prologue 'addiu $sp,-0x18'. Three back-to-back jals: 0x80215B1C, 0x8021608C, 0x80215D30 (init/teardown sequence). Ends jr $ra @0x1A4044 + delay addiu $sp,0x18 @0x1A4048. */
func_001A4020:
/* function boundary candidate: func_001A4020, size=56, kind=prologue */
func_001A4020:
/* 0x001A4020 0x80213C20 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x001A4024 0x80213C24 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x001A4028 0x80213C28 0x0C0856C7 */ .word 0x0C0856C7 # jal 0x80215B1C
/* 0x001A402C 0x80213C2C 0x00000000 */ .word 0x00000000 # nop
/* 0x001A4030 0x80213C30 0x0C085823 */ .word 0x0C085823 # jal 0x8021608C
/* 0x001A4034 0x80213C34 0x00000000 */ .word 0x00000000 # nop
/* 0x001A4038 0x80213C38 0x0C08574C */ .word 0x0C08574C # jal 0x80215D30
/* 0x001A403C 0x80213C3C 0x00000000 */ .word 0x00000000 # nop
/* 0x001A4040 0x80213C40 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x001A4044 0x80213C44 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001A4048 0x80213C48 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
