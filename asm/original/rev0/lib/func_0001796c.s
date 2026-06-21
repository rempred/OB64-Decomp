/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001796C..0x00017990 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_0001796C, size=32, kind=prologue */
func_0001796C:
/* 0x0001796C 0x8008756C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00017970 0x80087570 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00017974 0x80087574 0x0C021C36 */ .word 0x0C021C36 # jal 0x800870D8
/* 0x00017978 0x80087578 0x00000000 */ .word 0x00000000 # nop
/* 0x0001797C 0x8008757C 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00017980 0x80087580 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x00017984 0x80087584 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00017988 0x80087588 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
/* 0x0001798C 0x8008758C 0x00000000 */ .word 0x00000000 # nop
