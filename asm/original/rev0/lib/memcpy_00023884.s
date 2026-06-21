/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x00023884..0x000238B0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00023884 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
memcpy_00023884:
/* 0x00023884 0x80093484 0x10C00007 */ .word 0x10C00007 # beq $a2, $zero, 0x800934A4
/* 0x00023888 0x80093488 0x00801821 */ .word 0x00801821 # move $v1, $a0
/* 0x0002388C 0x8009348C 0x90A20000 */ .word 0x90A20000 # lbu $v0, 0x0($a1)
/* 0x00023890 0x80093490 0x24A50001 */ .word 0x24A50001 # addiu $a1, $a1, 0x1
/* 0x00023894 0x80093494 0x24C6FFFF */ .word 0x24C6FFFF # addiu $a2, $a2, -0x1
/* 0x00023898 0x80093498 0xA0620000 */ .word 0xA0620000 # sb $v0, 0x0($v1)
/* 0x0002389C 0x8009349C 0x14C0FFFB */ .word 0x14C0FFFB # bne $a2, $zero, 0x8009348C
/* 0x000238A0 0x800934A0 0x24630001 */ .word 0x24630001 # addiu $v1, $v1, 0x1
/* 0x000238A4 0x800934A4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000238A8 0x800934A8 0x00801021 */ .word 0x00801021 # move $v0, $a0
/* 0x000238AC 0x800934AC 0x00000000 */ .word 0x00000000 # nop
