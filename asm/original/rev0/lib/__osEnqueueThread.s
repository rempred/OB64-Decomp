/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x000298E4..0x0002992C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x000298E4 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
__osEnqueueThread:
/* 0x000298E4 0x800994E4 0x0080C821 */ .word 0x0080C821 # move $t9, $a0
/* 0x000298E8 0x800994E8 0x8C980000 */ .word 0x8C980000 # lw $t8, 0x0($a0)
/* 0x000298EC 0x800994EC 0x8CAF0004 */ .word 0x8CAF0004 # lw $t7, 0x4($a1)
/* 0x000298F0 0x800994F0 0x8F0E0004 */ .word 0x8F0E0004 # lw $t6, 0x4($t8)
/* 0x000298F4 0x800994F4 0x01CF082A */ .word 0x01CF082A # slt $at, $t6, $t7
/* 0x000298F8 0x800994F8 0x14200007 */ .word 0x14200007 # bne $at, $zero, 0x80099518
/* 0x000298FC 0x800994FC 0x00000000 */ .word 0x00000000 # nop
/* 0x00029900 0x80099500 0x0300C821 */ .word 0x0300C821 # move $t9, $t8
/* 0x00029904 0x80099504 0x8F180000 */ .word 0x8F180000 # lw $t8, 0x0($t8)
/* 0x00029908 0x80099508 0x8F0E0004 */ .word 0x8F0E0004 # lw $t6, 0x4($t8)
/* 0x0002990C 0x8009950C 0x01CF082A */ .word 0x01CF082A # slt $at, $t6, $t7
/* 0x00029910 0x80099510 0x1020FFFB */ .word 0x1020FFFB # beq $at, $zero, 0x80099500
/* 0x00029914 0x80099514 0x00000000 */ .word 0x00000000 # nop
/* 0x00029918 0x80099518 0x8F380000 */ .word 0x8F380000 # lw $t8, 0x0($t9)
/* 0x0002991C 0x8009951C 0xACB80000 */ .word 0xACB80000 # sw $t8, 0x0($a1)
/* 0x00029920 0x80099520 0xAF250000 */ .word 0xAF250000 # sw $a1, 0x0($t9)
/* 0x00029924 0x80099524 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00029928 0x80099528 0xACA40008 */ .word 0xACA40008 # sw $a0, 0x8($a1)
