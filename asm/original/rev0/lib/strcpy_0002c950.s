/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x0002C950..0x0002C990 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0002C950 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
strcpy_0002c950:
/* 0x0002C950 0x8009C550 0x90A20000 */ .word 0x90A20000 # lbu $v0, 0x0($a1)
/* 0x0002C954 0x8009C554 0x00801825 */ .word 0x00801825 # move $v1, $a0
/* 0x0002C958 0x8009C558 0x50400008 */ .word 0x50400008 # beql $v0, $zero, 0x8009C57C
/* 0x0002C95C 0x8009C55C 0xA0600000 */ .word 0xA0600000 # sb $zero, 0x0($v1)
/* 0x0002C960 0x8009C560 0xA0620000 */ .word 0xA0620000 # sb $v0, 0x0($v1)
/* 0x0002C964 0x8009C564 0x90A20001 */ .word 0x90A20001 # lbu $v0, 0x1($a1)
/* 0x0002C968 0x8009C568 0x24630001 */ .word 0x24630001 # addiu $v1, $v1, 0x1
/* 0x0002C96C 0x8009C56C 0x24A50001 */ .word 0x24A50001 # addiu $a1, $a1, 0x1
/* 0x0002C970 0x8009C570 0x5440FFFC */ .word 0x5440FFFC # bnel $v0, $zero, 0x8009C564
/* 0x0002C974 0x8009C574 0xA0620000 */ .word 0xA0620000 # sb $v0, 0x0($v1)
/* 0x0002C978 0x8009C578 0xA0600000 */ .word 0xA0600000 # sb $zero, 0x0($v1)
/* 0x0002C97C 0x8009C57C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0002C980 0x8009C580 0x00801025 */ .word 0x00801025 # move $v0, $a0
/* 0x0002C984 0x8009C584 0x00000000 */ .word 0x00000000 # nop
/* 0x0002C988 0x8009C588 0x00000000 */ .word 0x00000000 # nop
/* 0x0002C98C 0x8009C58C 0x00000000 */ .word 0x00000000 # nop
