/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001B1000_001C1000.s
 * z64 range: 0x001BBF58..0x001BBF94 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Framed: addiu $sp,-0x18; jal 0x80229604; advances stream by 8; jr $ra(0x1BBF8C)+delay addiu $sp,0x18(0x1BBF90). */
func_001BBF58:
/* function boundary candidate: func_001BBF58, size=80, kind=prologue */
func_001BBF58:
/* 0x001BBF58 0x8022BB58 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x001BBF5C 0x8022BB5C 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x001BBF60 0x8022BB60 0x00808021 */ .word 0x00808021 # move $s0, $a0
/* 0x001BBF64 0x8022BB64 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x001BBF68 0x8022BB68 0x8E020008 */ .word 0x8E020008 # lw $v0, 0x8($s0)
/* 0x001BBF6C 0x8022BB6C 0x0C08A581 */ .word 0x0C08A581 # jal 0x80229604
/* 0x001BBF70 0x8022BB70 0x8C440004 */ .word 0x8C440004 # lw $a0, 0x4($v0)
/* 0x001BBF74 0x8022BB74 0x8E020008 */ .word 0x8E020008 # lw $v0, 0x8($s0)
/* 0x001BBF78 0x8022BB78 0x24420008 */ .word 0x24420008 # addiu $v0, $v0, 0x8
/* 0x001BBF7C 0x8022BB7C 0xAE020008 */ .word 0xAE020008 # sw $v0, 0x8($s0)
/* 0x001BBF80 0x8022BB80 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x001BBF84 0x8022BB84 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x001BBF88 0x8022BB88 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x001BBF8C 0x8022BB8C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001BBF90 0x8022BB90 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
