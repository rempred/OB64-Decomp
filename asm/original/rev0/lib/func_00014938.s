/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00014938..0x00014960 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00014938 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00014938:
/* 0x00014938 0x80084538 0x90A20000 */ .word 0x90A20000 # lbu $v0, 0x0($a1)
/* 0x0001493C 0x8008453C 0x24A50001 */ .word 0x24A50001 # addiu $a1, $a1, 0x1
/* 0x00014940 0x80084540 0xA08200D8 */ .word 0xA08200D8 # sb $v0, 0xD8($a0)
/* 0x00014944 0x80084544 0x90A20000 */ .word 0x90A20000 # lbu $v0, 0x0($a1)
/* 0x00014948 0x80084548 0x24A50001 */ .word 0x24A50001 # addiu $a1, $a1, 0x1
/* 0x0001494C 0x8008454C 0xA08200CE */ .word 0xA08200CE # sb $v0, 0xCE($a0)
/* 0x00014950 0x80084550 0x90A20000 */ .word 0x90A20000 # lbu $v0, 0x0($a1)
/* 0x00014954 0x80084554 0xA08200CF */ .word 0xA08200CF # sb $v0, 0xCF($a0)
/* 0x00014958 0x80084558 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001495C 0x8008455C 0x24A20001 */ .word 0x24A20001 # addiu $v0, $a1, 0x1
