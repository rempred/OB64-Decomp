/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x00265CD0..0x00265CF0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Tiny wrapper: jal 0x80210E78 with addiu$a0,0x18; jr$ra@0x00265CE8 + delay@0x00265CEC. */
/* function boundary candidate: func_00265CD0, size=32, kind=prologue */
func_00265CD0:
/* 0x00265CD0 0x802D58D0 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00265CD4 0x802D58D4 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00265CD8 0x802D58D8 0x0C08439E */ .word 0x0C08439E # jal 0x80210E78
/* 0x00265CDC 0x802D58DC 0x24840018 */ .word 0x24840018 # addiu $a0, $a0, 0x18
/* 0x00265CE0 0x802D58E0 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00265CE4 0x802D58E4 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x00265CE8 0x802D58E8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00265CEC 0x802D58EC 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
