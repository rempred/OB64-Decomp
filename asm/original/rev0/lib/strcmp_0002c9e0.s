/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x0002C9E0..0x0002CA20 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0002C9E0 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
strcmp_0002c9e0:
/* 0x0002C9E0 0x8009C5E0 0x90820000 */ .word 0x90820000 # lbu $v0, 0x0($a0)
/* 0x0002C9E4 0x8009C5E4 0x90A30000 */ .word 0x90A30000 # lbu $v1, 0x0($a1)
/* 0x0002C9E8 0x8009C5E8 0x24840001 */ .word 0x24840001 # addiu $a0, $a0, 0x1
/* 0x0002C9EC 0x8009C5EC 0x24A50001 */ .word 0x24A50001 # addiu $a1, $a1, 0x1
/* 0x0002C9F0 0x8009C5F0 0x10620003 */ .word 0x10620003 # beq $v1, $v0, 0x8009C600
/* 0x0002C9F4 0x8009C5F4 0x00403825 */ .word 0x00403825 # move $a3, $v0
/* 0x0002C9F8 0x8009C5F8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0002C9FC 0x8009C5FC 0x00E31023 */ .word 0x00E31023 # subu $v0, $a3, $v1
/* 0x0002CA00 0x8009C600 0x5440FFF8 */ .word 0x5440FFF8 # bnel $v0, $zero, 0x8009C5E4
/* 0x0002CA04 0x8009C604 0x90820000 */ .word 0x90820000 # lbu $v0, 0x0($a0)
/* 0x0002CA08 0x8009C608 0x00001025 */ .word 0x00001025 # move $v0, $zero
/* 0x0002CA0C 0x8009C60C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0002CA10 0x8009C610 0x00000000 */ .word 0x00000000 # nop
/* 0x0002CA14 0x8009C614 0x00000000 */ .word 0x00000000 # nop
/* 0x0002CA18 0x8009C618 0x00000000 */ .word 0x00000000 # nop
/* 0x0002CA1C 0x8009C61C 0x00000000 */ .word 0x00000000 # nop
