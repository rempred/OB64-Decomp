/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x0028A814..0x0028A84C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (bit-test/shift). jr $ra @0x0028A844 +delay (andi) @0x0028A848. */
/* 0x0028A814 0x802FA414 0x00042400 */ .word 0x00042400 # sll $a0, $a0, 16
/* 0x0028A818 0x802FA418 0x00042403 */ .word 0x00042403 # sra $a0, $a0, 16
/* 0x0028A81C 0x802FA41C 0x04810002 */ .word 0x04810002 # bgez $a0, 0x802FA428
/* 0x0028A820 0x802FA420 0x00801821 */ .word 0x00801821 # move $v1, $a0
/* 0x0028A824 0x802FA424 0x24830007 */ .word 0x24830007 # addiu $v1, $a0, 0x7
/* 0x0028A828 0x802FA428 0x000318C3 */ .word 0x000318C3 # sra $v1, $v1, 3
/* 0x0028A82C 0x802FA42C 0x3C028024 */ .word 0x3C028024 # lui $v0, 0x8024
/* 0x0028A830 0x802FA430 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x0028A834 0x802FA434 0x9042E5FF */ .word 0x9042E5FF # lbu $v0, -0x1A01($v0)
/* 0x0028A838 0x802FA438 0x000318C0 */ .word 0x000318C0 # sll $v1, $v1, 3
/* 0x0028A83C 0x802FA43C 0x00831823 */ .word 0x00831823 # subu $v1, $a0, $v1
/* 0x0028A840 0x802FA440 0x00621007 */ .word 0x00621007 # srav $v0, $v0, $v1
/* 0x0028A844 0x802FA444 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0028A848 0x802FA448 0x30420001 */ .word 0x30420001 # andi $v0, $v0, 0x0001
