/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x000149B8..0x00014A00 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x000149B8 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_000149b8:
/* 0x000149B8 0x800845B8 0x90A60000 */ .word 0x90A60000 # lbu $a2, 0x0($a1)
/* 0x000149BC 0x800845BC 0x28C20080 */ .word 0x28C20080 # slti $v0, $a2, 0x80
/* 0x000149C0 0x800845C0 0x14400006 */ .word 0x14400006 # bne $v0, $zero, 0x800845DC
/* 0x000149C4 0x800845C4 0x24A50001 */ .word 0x24A50001 # addiu $a1, $a1, 0x1
/* 0x000149C8 0x800845C8 0x30C6007F */ .word 0x30C6007F # andi $a2, $a2, 0x007F
/* 0x000149CC 0x800845CC 0x90A20000 */ .word 0x90A20000 # lbu $v0, 0x0($a1)
/* 0x000149D0 0x800845D0 0x00063200 */ .word 0x00063200 # sll $a2, $a2, 8
/* 0x000149D4 0x800845D4 0x24A50001 */ .word 0x24A50001 # addiu $a1, $a1, 0x1
/* 0x000149D8 0x800845D8 0x00C23025 */ .word 0x00C23025 # or $a2, $a2, $v0
/* 0x000149DC 0x800845DC 0x8C820074 */ .word 0x8C820074 # lw $v0, 0x74($a0)
/* 0x000149E0 0x800845E0 0x00061840 */ .word 0x00061840 # sll $v1, $a2, 1
/* 0x000149E4 0x800845E4 0x8C42001C */ .word 0x8C42001C # lw $v0, 0x1C($v0)
/* 0x000149E8 0x800845E8 0x00661821 */ .word 0x00661821 # addu $v1, $v1, $a2
/* 0x000149EC 0x800845EC 0x00031840 */ .word 0x00031840 # sll $v1, $v1, 1
/* 0x000149F0 0x800845F0 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x000149F4 0x800845F4 0xAC820084 */ .word 0xAC820084 # sw $v0, 0x84($a0)
/* 0x000149F8 0x800845F8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000149FC 0x800845FC 0x00A01021 */ .word 0x00A01021 # move $v0, $a1
