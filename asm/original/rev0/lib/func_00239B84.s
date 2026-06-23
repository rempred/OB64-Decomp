/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00231000_00241000.s
 * z64 range: 0x00239B84..0x00239B94 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless compare leaf recovered (plan/parent DB missed). lbu$v1,2($a0); lbu$v0,2($a1); jr$ra; subu$v0,$v1,$v0 (delay). Compares byte at offset 2. Code ends EXACTLY at 0x00239B94 (align nops + float pool = DATA follow). */
/* 0x00239B84 0x802A9784 0x90830002 */ .word 0x90830002 # lbu $v1, 0x2($a0)
/* 0x00239B88 0x802A9788 0x90A20002 */ .word 0x90A20002 # lbu $v0, 0x2($a1)
/* 0x00239B8C 0x802A978C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00239B90 0x802A9790 0x00621023 */ .word 0x00621023 # subu $v0, $v1, $v0
