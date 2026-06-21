/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x000143DC..0x000143FC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x000143DC (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_000143dc:
/* 0x000143DC 0x80083FDC 0x90A20000 */ .word 0x90A20000 # lbu $v0, 0x0($a1)
/* 0x000143E0 0x80083FE0 0x24A50001 */ .word 0x24A50001 # addiu $a1, $a1, 0x1
/* 0x000143E4 0x80083FE4 0x10400003 */ .word 0x10400003 # beq $v0, $zero, 0x80083FF4
/* 0x000143E8 0x80083FE8 0xA08200B8 */ .word 0xA08200B8 # sb $v0, 0xB8($a0)
/* 0x000143EC 0x80083FEC 0xC480002C */ .word 0xC480002C # lwc1 $f0, 0x2C($a0)
/* 0x000143F0 0x80083FF0 0xE4800050 */ .word 0xE4800050 # swc1 $f0, 0x50($a0)
/* 0x000143F4 0x80083FF4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000143F8 0x80083FF8 0x00A01021 */ .word 0x00A01021 # move $v0, $a1
