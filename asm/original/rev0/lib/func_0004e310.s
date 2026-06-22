/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004E310..0x0004E344 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue; jr $ra at 0x0004E33C + delay 0x0004E340 */
/* function boundary candidate: func_0004E310, size=52, kind=prologue */
func_0004E310:
/* 0x0004E310 0x800BDF10 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004E314 0x800BDF14 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004E318 0x800BDF18 0x0C01CCDF */ .word 0x0C01CCDF # jal 0x8007337C
/* 0x0004E31C 0x800BDF1C 0x00000000 */ .word 0x00000000 # nop
/* 0x0004E320 0x800BDF20 0x0C06A4E2 */ .word 0x0C06A4E2 # jal 0x801A9388
/* 0x0004E324 0x800BDF24 0x00000000 */ .word 0x00000000 # nop
/* 0x0004E328 0x800BDF28 0x10400003 */ .word 0x10400003 # beq $v0, $zero, 0x800BDF38
/* 0x0004E32C 0x800BDF2C 0x00000000 */ .word 0x00000000 # nop
/* 0x0004E330 0x800BDF30 0x0C06A6C7 */ .word 0x0C06A6C7 # jal 0x801A9B1C
/* 0x0004E334 0x800BDF34 0x00000000 */ .word 0x00000000 # nop
/* 0x0004E338 0x800BDF38 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004E33C 0x800BDF3C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004E340 0x800BDF40 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
