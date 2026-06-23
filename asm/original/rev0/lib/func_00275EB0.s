/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00271000_00281000.s
 * z64 range: 0x00275EB0..0x00275ED8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Prologue func (addiu$sp,-0x18; sw $ra). lw 0x1C($a0); beq; jal 0x8020C074. Ends jr$ra@0x275ED0 + delay addiu$sp,0x18@0x275ED4. */
/* function boundary candidate: func_00275EB0, size=48, kind=prologue */
func_00275EB0:
/* 0x00275EB0 0x802E5AB0 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00275EB4 0x802E5AB4 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00275EB8 0x802E5AB8 0x8C84001C */ .word 0x8C84001C # lw $a0, 0x1C($a0)
/* 0x00275EBC 0x802E5ABC 0x10800003 */ .word 0x10800003 # beq $a0, $zero, 0x802E5ACC
/* 0x00275EC0 0x802E5AC0 0x00000000 */ .word 0x00000000 # nop
/* 0x00275EC4 0x802E5AC4 0x0C08301D */ .word 0x0C08301D # jal 0x8020C074
/* 0x00275EC8 0x802E5AC8 0x00000000 */ .word 0x00000000 # nop
/* 0x00275ECC 0x802E5ACC 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00275ED0 0x802E5AD0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00275ED4 0x802E5AD4 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
