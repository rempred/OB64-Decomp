/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x00028430..0x00028450 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_00028430, size=28, kind=prologue */
func_00028430:
/* 0x00028430 0x80098030 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00028434 0x80098034 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00028438 0x80098038 0x0C0269DC */ .word 0x0C0269DC # jal 0x8009A770
/* 0x0002843C 0x8009803C 0x00002021 */ .word 0x00002021 # move $a0, $zero
/* 0x00028440 0x80098040 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00028444 0x80098044 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00028448 0x80098048 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
/* 0x0002844C 0x8009804C 0x00000000 */ .word 0x00000000 # nop
