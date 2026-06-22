/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00051000_00061000.s
 * z64 range: 0x000573AC..0x00057404 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Parent file 36. Prologue addiu $sp,-0x8 at 0x000573AC; byte-copy loop; jr $ra at 0x000573FC, delay slot addiu $sp,0x8 at 0x00057400. Body ends 0x00057404; the following 2 words are the next function's preamble (folded into func_00057404). */
/* function boundary candidate: func_000573AC, size=88, kind=prologue */
func_000573AC:
/* 0x000573AC 0x800C6FAC 0x27BDFFF8 */ .word 0x27BDFFF8 # addiu $sp, $sp, -0x8
/* 0x000573B0 0x800C6FB0 0x8C8200D0 */ .word 0x8C8200D0 # lw $v0, 0xD0($a0)
/* 0x000573B4 0x800C6FB4 0x00052880 */ .word 0x00052880 # sll $a1, $a1, 2
/* 0x000573B8 0x800C6FB8 0x30E700FF */ .word 0x30E700FF # andi $a3, $a3, 0x00FF
/* 0x000573BC 0x800C6FBC 0x00A22821 */ .word 0x00A22821 # addu $a1, $a1, $v0
/* 0x000573C0 0x800C6FC0 0x8CA30530 */ .word 0x8CA30530 # lw $v1, 0x530($a1)
/* 0x000573C4 0x800C6FC4 0x18E0000C */ .word 0x18E0000C # blez $a3, 0x800C6FF8
/* 0x000573C8 0x800C6FC8 0x00002021 */ .word 0x00002021 # move $a0, $zero
/* 0x000573CC 0x800C6FCC 0x90620000 */ .word 0x90620000 # lbu $v0, 0x0($v1)
/* 0x000573D0 0x800C6FD0 0x24630001 */ .word 0x24630001 # addiu $v1, $v1, 0x1
/* 0x000573D4 0x800C6FD4 0x24840001 */ .word 0x24840001 # addiu $a0, $a0, 0x1
/* 0x000573D8 0x800C6FD8 0xA0C20000 */ .word 0xA0C20000 # sb $v0, 0x0($a2)
/* 0x000573DC 0x800C6FDC 0x90620000 */ .word 0x90620000 # lbu $v0, 0x0($v1)
/* 0x000573E0 0x800C6FE0 0x24C60001 */ .word 0x24C60001 # addiu $a2, $a2, 0x1
/* 0x000573E4 0x800C6FE4 0x24630001 */ .word 0x24630001 # addiu $v1, $v1, 0x1
/* 0x000573E8 0x800C6FE8 0xA0C20000 */ .word 0xA0C20000 # sb $v0, 0x0($a2)
/* 0x000573EC 0x800C6FEC 0x0087102A */ .word 0x0087102A # slt $v0, $a0, $a3
/* 0x000573F0 0x800C6FF0 0x1440FFF6 */ .word 0x1440FFF6 # bne $v0, $zero, 0x800C6FCC
/* 0x000573F4 0x800C6FF4 0x24C60001 */ .word 0x24C60001 # addiu $a2, $a2, 0x1
/* 0x000573F8 0x800C6FF8 0xA0C00000 */ .word 0xA0C00000 # sb $zero, 0x0($a2)
/* 0x000573FC 0x800C6FFC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00057400 0x800C7000 0x27BD0008 */ .word 0x27BD0008 # addiu $sp, $sp, 0x8
