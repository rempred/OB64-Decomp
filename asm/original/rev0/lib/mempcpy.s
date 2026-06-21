/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x00023908..0x00023940 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00023908 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
mempcpy:
/* function boundary candidate: func_00023908, size=96, kind=prologue */
func_00023908:
/* 0x00023908 0x80093508 0x27BDFFE0 */ .word 0x27BDFFE0 # addiu $sp, $sp, -0x20
/* 0x0002390C 0x8009350C 0xAFB10014 */ .word 0xAFB10014 # sw $s1, 0x14($sp)
/* 0x00023910 0x80093510 0x00808821 */ .word 0x00808821 # move $s1, $a0
/* 0x00023914 0x80093514 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x00023918 0x80093518 0xAFBF0018 */ .word 0xAFBF0018 # sw $ra, 0x18($sp)
/* 0x0002391C 0x8009351C 0x0C024D21 */ .word 0x0C024D21 # jal 0x80093484
/* 0x00023920 0x80093520 0x00C08021 */ .word 0x00C08021 # move $s0, $a2
/* 0x00023924 0x80093524 0x02301021 */ .word 0x02301021 # addu $v0, $s1, $s0
/* 0x00023928 0x80093528 0x8FBF0018 */ .word 0x8FBF0018 # lw $ra, 0x18($sp)
/* 0x0002392C 0x8009352C 0x8FB10014 */ .word 0x8FB10014 # lw $s1, 0x14($sp)
/* 0x00023930 0x80093530 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x00023934 0x80093534 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00023938 0x80093538 0x27BD0020 */ .word 0x27BD0020 # addiu $sp, $sp, 0x20
/* 0x0002393C 0x8009353C 0x00000000 */ .word 0x00000000 # nop
