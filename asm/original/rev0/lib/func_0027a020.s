/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00271000_00281000.s
 * z64 range: 0x0027A020..0x0027A06C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (region 3 start, after DATA B). lui $v1,0x8019; lbu 0x76DC; index/scale lookup into table 0x801971F0; ends jr $ra @0x27A064 + delay nop @0x27A068. */
/* 0x0027A020 0x802E9C20 0x3C038019 */ .word 0x3C038019 # lui $v1, 0x8019
/* 0x0027A024 0x802E9C24 0x906376DC */ .word 0x906376DC # lbu $v1, 0x76DC($v1)
/* 0x0027A028 0x802E9C28 0x00042400 */ .word 0x00042400 # sll $a0, $a0, 16
/* 0x0027A02C 0x802E9C2C 0x00042403 */ .word 0x00042403 # sra $a0, $a0, 16
/* 0x0027A030 0x802E9C30 0x00031040 */ .word 0x00031040 # sll $v0, $v1, 1
/* 0x0027A034 0x802E9C34 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x0027A038 0x802E9C38 0x000210C0 */ .word 0x000210C0 # sll $v0, $v0, 3
/* 0x0027A03C 0x802E9C3C 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x0027A040 0x802E9C40 0x3C038019 */ .word 0x3C038019 # lui $v1, 0x8019
/* 0x0027A044 0x802E9C44 0x246371F0 */ .word 0x246371F0 # addiu $v1, $v1, 0x71F0
/* 0x0027A048 0x802E9C48 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x0027A04C 0x802E9C4C 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x0027A050 0x802E9C50 0x90430002 */ .word 0x90430002 # lbu $v1, 0x2($v0)
/* 0x0027A054 0x802E9C54 0x2C620064 */ .word 0x2C620064 # sltiu $v0, $v1, 0x64
/* 0x0027A058 0x802E9C58 0x14400002 */ .word 0x14400002 # bne $v0, $zero, 0x802E9C64
/* 0x0027A05C 0x802E9C5C 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x0027A060 0x802E9C60 0x2462FF9D */ .word 0x2462FF9D # addiu $v0, $v1, -0x63
/* 0x0027A064 0x802E9C64 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0027A068 0x802E9C68 0x00000000 */ .word 0x00000000 # nop
