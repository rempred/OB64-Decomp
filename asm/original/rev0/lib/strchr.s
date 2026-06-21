/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x00023820..0x00023860 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00023820 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
strchr:
/* function boundary candidate: func_00023820, size=64, kind=leaf */
func_00023820:
/* 0x00023820 0x80093420 0x90830000 */ .word 0x90830000 # lbu $v1, 0x0($a0)
/* 0x00023824 0x80093424 0x80820000 */ .word 0x80820000 # lb $v0, 0x0($a0)
/* 0x00023828 0x80093428 0x00052E00 */ .word 0x00052E00 # sll $a1, $a1, 24
/* 0x0002382C 0x8009342C 0x00052E03 */ .word 0x00052E03 # sra $a1, $a1, 24
/* 0x00023830 0x80093430 0x10450008 */ .word 0x10450008 # beq $v0, $a1, 0x80093454

/* function boundary candidate: func_00023834, size=120, kind=prologue */
func_00023834:
/* 0x00023834 0x80093434 0x27BDFFF0 */ .word 0x27BDFFF0 # addiu $sp, $sp, -0x10
/* 0x00023838 0x80093438 0x14600003 */ .word 0x14600003 # bne $v1, $zero, 0x80093448
/* 0x0002383C 0x8009343C 0x24840001 */ .word 0x24840001 # addiu $a0, $a0, 0x1
/* 0x00023840 0x80093440 0x08024D16 */ .word 0x08024D16 # j 0x80093458
/* 0x00023844 0x80093444 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x00023848 0x80093448 0x80820000 */ .word 0x80820000 # lb $v0, 0x0($a0)
/* 0x0002384C 0x8009344C 0x1445FFFA */ .word 0x1445FFFA # bne $v0, $a1, 0x80093438
/* 0x00023850 0x80093450 0x90830000 */ .word 0x90830000 # lbu $v1, 0x0($a0)
/* 0x00023854 0x80093454 0x00801021 */ .word 0x00801021 # move $v0, $a0
/* 0x00023858 0x80093458 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0002385C 0x8009345C 0x27BD0010 */ .word 0x27BD0010 # addiu $sp, $sp, 0x10
