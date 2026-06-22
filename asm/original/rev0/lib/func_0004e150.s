/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004E150..0x0004E180 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue, jr $ra at 0x0004E178 + delay 0x0004E17C */
/* function boundary candidate: func_0004E150, size=48, kind=prologue */
func_0004E150:
/* 0x0004E150 0x800BDD50 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004E154 0x800BDD54 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004E158 0x800BDD58 0x0C08A15F */ .word 0x0C08A15F # jal 0x8022857C
/* 0x0004E15C 0x800BDD5C 0x00000000 */ .word 0x00000000 # nop
/* 0x0004E160 0x800BDD60 0x00021400 */ .word 0x00021400 # sll $v0, $v0, 16
/* 0x0004E164 0x800BDD64 0x10400003 */ .word 0x10400003 # beq $v0, $zero, 0x800BDD74
/* 0x0004E168 0x800BDD68 0x3402FFFE */ .word 0x3402FFFE # ori $v0, $zero, 0xFFFE
/* 0x0004E16C 0x800BDD6C 0x3C01800C */ .word 0x3C01800C # lui $at, 0x800C
/* 0x0004E170 0x800BDD70 0xA4224C26 */ .word 0xA4224C26 # sh $v0, 0x4C26($at)
/* 0x0004E174 0x800BDD74 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004E178 0x800BDD78 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004E17C 0x800BDD7C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
