/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x000143AC..0x000143DC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x000143AC (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_000143ac:
/* 0x000143AC 0x80083FAC 0x90A60000 */ .word 0x90A60000 # lbu $a2, 0x0($a1)
/* 0x000143B0 0x80083FB0 0x30C20080 */ .word 0x30C20080 # andi $v0, $a2, 0x0080
/* 0x000143B4 0x80083FB4 0x10400006 */ .word 0x10400006 # beq $v0, $zero, 0x80083FD0
/* 0x000143B8 0x80083FB8 0x24A50001 */ .word 0x24A50001 # addiu $a1, $a1, 0x1
/* 0x000143BC 0x80083FBC 0x90A30000 */ .word 0x90A30000 # lbu $v1, 0x0($a1)
/* 0x000143C0 0x80083FC0 0x24A50001 */ .word 0x24A50001 # addiu $a1, $a1, 0x1
/* 0x000143C4 0x80083FC4 0x30C2007F */ .word 0x30C2007F # andi $v0, $a2, 0x007F
/* 0x000143C8 0x80083FC8 0x00021200 */ .word 0x00021200 # sll $v0, $v0, 8
/* 0x000143CC 0x80083FCC 0x00623025 */ .word 0x00623025 # or $a2, $v1, $v0
/* 0x000143D0 0x80083FD0 0xA48600AE */ .word 0xA48600AE # sh $a2, 0xAE($a0)
/* 0x000143D4 0x80083FD4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000143D8 0x80083FD8 0x00A01021 */ .word 0x00A01021 # move $v0, $a1
