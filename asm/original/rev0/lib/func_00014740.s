/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00014740..0x00014770 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00014740 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00014740:
/* 0x00014740 0x80084340 0x90A30000 */ .word 0x90A30000 # lbu $v1, 0x0($a1)
/* 0x00014744 0x80084344 0x28620080 */ .word 0x28620080 # slti $v0, $v1, 0x80
/* 0x00014748 0x80084348 0x14400006 */ .word 0x14400006 # bne $v0, $zero, 0x80084364
/* 0x0001474C 0x8008434C 0x24A50001 */ .word 0x24A50001 # addiu $a1, $a1, 0x1
/* 0x00014750 0x80084350 0x3063007F */ .word 0x3063007F # andi $v1, $v1, 0x007F
/* 0x00014754 0x80084354 0x90A20000 */ .word 0x90A20000 # lbu $v0, 0x0($a1)
/* 0x00014758 0x80084358 0x00031A00 */ .word 0x00031A00 # sll $v1, $v1, 8
/* 0x0001475C 0x8008435C 0x24A50001 */ .word 0x24A50001 # addiu $a1, $a1, 0x1
/* 0x00014760 0x80084360 0x00621825 */ .word 0x00621825 # or $v1, $v1, $v0
/* 0x00014764 0x80084364 0xA48300AC */ .word 0xA48300AC # sh $v1, 0xAC($a0)
/* 0x00014768 0x80084368 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001476C 0x8008436C 0x00A01021 */ .word 0x00A01021 # move $v0, $a1
