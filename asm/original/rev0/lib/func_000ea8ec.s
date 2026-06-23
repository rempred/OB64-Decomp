/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000E1000_000F1000.s
 * z64 range: 0x000EA8EC..0x000EA930 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf: parse 3 ascii digits (lbu 0/1/2($a0), -0x30 base-mix); ends jr $ra 0xEA928 */
/* 0x000EA8EC 0x8015A4EC 0x90830000 */ .word 0x90830000 # lbu $v1, 0x0($a0)
/* 0x000EA8F0 0x8015A4F0 0x90850001 */ .word 0x90850001 # lbu $a1, 0x1($a0)
/* 0x000EA8F4 0x8015A4F4 0x90840002 */ .word 0x90840002 # lbu $a0, 0x2($a0)
/* 0x000EA8F8 0x8015A4F8 0x2463FFD0 */ .word 0x2463FFD0 # addiu $v1, $v1, -0x30
/* 0x000EA8FC 0x8015A4FC 0x00031040 */ .word 0x00031040 # sll $v0, $v1, 1
/* 0x000EA900 0x8015A500 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x000EA904 0x8015A504 0x000210C0 */ .word 0x000210C0 # sll $v0, $v0, 3
/* 0x000EA908 0x8015A508 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x000EA90C 0x8015A50C 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
/* 0x000EA910 0x8015A510 0x24A5FFD0 */ .word 0x24A5FFD0 # addiu $a1, $a1, -0x30
/* 0x000EA914 0x8015A514 0x00051880 */ .word 0x00051880 # sll $v1, $a1, 2
/* 0x000EA918 0x8015A518 0x00651821 */ .word 0x00651821 # addu $v1, $v1, $a1
/* 0x000EA91C 0x8015A51C 0x00031840 */ .word 0x00031840 # sll $v1, $v1, 1
/* 0x000EA920 0x8015A520 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x000EA924 0x8015A524 0x2442FFD0 */ .word 0x2442FFD0 # addiu $v0, $v0, -0x30
/* 0x000EA928 0x8015A528 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000EA92C 0x8015A52C 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
