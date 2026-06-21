/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x0002CD70..0x0002CDA0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0002CD70 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
memset_0002cd70:
/* function boundary candidate: func_0002CD70, size=44, kind=leaf */
func_0002CD70:
/* 0x0002CD70 0x8009C970 0x00C01825 */ .word 0x00C01825 # move $v1, $a2
/* 0x0002CD74 0x8009C974 0x00801025 */ .word 0x00801025 # move $v0, $a0
/* 0x0002CD78 0x8009C978 0x10C00006 */ .word 0x10C00006 # beq $a2, $zero, 0x8009C994
/* 0x0002CD7C 0x8009C97C 0x24C6FFFF */ .word 0x24C6FFFF # addiu $a2, $a2, -0x1
/* 0x0002CD80 0x8009C980 0x00C01825 */ .word 0x00C01825 # move $v1, $a2
/* 0x0002CD84 0x8009C984 0xA0450000 */ .word 0xA0450000 # sb $a1, 0x0($v0)
/* 0x0002CD88 0x8009C988 0x24420001 */ .word 0x24420001 # addiu $v0, $v0, 0x1
/* 0x0002CD8C 0x8009C98C 0x14C0FFFC */ .word 0x14C0FFFC # bne $a2, $zero, 0x8009C980
/* 0x0002CD90 0x8009C990 0x24C6FFFF */ .word 0x24C6FFFF # addiu $a2, $a2, -0x1
/* 0x0002CD94 0x8009C994 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0002CD98 0x8009C998 0x00801025 */ .word 0x00801025 # move $v0, $a0
/* 0x0002CD9C 0x8009C99C 0x00000000 */ .word 0x00000000 # nop
