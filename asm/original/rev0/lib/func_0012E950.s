/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00121000_00131000.s
 * z64 range: 0x0012E950..0x0012E968 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* tiny frameless leaf: returns -1 if $a0<0x32 else $a0; ends jr $ra at 0x0012E960 + delay 0x0012E964. Parent DB merged this into func_0012E8EC. */
/* 0x0012E950 0x8019E550 0x28830032 */ .word 0x28830032 # slti $v1, $a0, 0x32
/* 0x0012E954 0x8019E554 0x10600002 */ .word 0x10600002 # beq $v1, $zero, 0x8019E560
/* 0x0012E958 0x8019E558 0x2402FFFF */ .word 0x2402FFFF # addiu $v0, $zero, -0x1
/* 0x0012E95C 0x8019E55C 0x00801021 */ .word 0x00801021 # move $v0, $a0
/* 0x0012E960 0x8019E560 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0012E964 0x8019E564 0x00000000 */ .word 0x00000000 # nop
