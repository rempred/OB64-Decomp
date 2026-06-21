/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00013410..0x0001342C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00013410 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00013410:
/* 0x00013410 0x80083010 0x8C830040 */ .word 0x8C830040 # lw $v1, 0x40($a0)
/* 0x00013414 0x80083014 0x908200BD */ .word 0x908200BD # lbu $v0, 0xBD($a0)
/* 0x00013418 0x80083018 0xA08000D9 */ .word 0xA08000D9 # sb $zero, 0xD9($a0)
/* 0x0001341C 0x8008301C 0x30420040 */ .word 0x30420040 # andi $v0, $v0, 0x0040
/* 0x00013420 0x80083020 0xAC830094 */ .word 0xAC830094 # sw $v1, 0x94($a0)
/* 0x00013424 0x80083024 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00013428 0x80083028 0xA08200DA */ .word 0xA08200DA # sb $v0, 0xDA($a0)
