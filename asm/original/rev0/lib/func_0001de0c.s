/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001DE0C..0x0001DE40 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0001DE0C (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_0001de0c:
/* 0x0001DE0C 0x8008DA0C 0x8C87001C */ .word 0x8C87001C # lw $a3, 0x1C($a0)
/* 0x0001DE10 0x8008DA10 0x24020002 */ .word 0x24020002 # addiu $v0, $zero, 0x2
/* 0x0001DE14 0x8008DA14 0x14A20007 */ .word 0x14A20007 # bne $a1, $v0, 0x8008DA34
/* 0x0001DE18 0x8008DA18 0x00000000 */ .word 0x00000000 # nop
/* 0x0001DE1C 0x8008DA1C 0x8C820014 */ .word 0x8C820014 # lw $v0, 0x14($a0)
/* 0x0001DE20 0x8008DA20 0x24430001 */ .word 0x24430001 # addiu $v1, $v0, 0x1
/* 0x0001DE24 0x8008DA24 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
/* 0x0001DE28 0x8008DA28 0x00471021 */ .word 0x00471021 # addu $v0, $v0, $a3
/* 0x0001DE2C 0x8008DA2C 0xAC830014 */ .word 0xAC830014 # sw $v1, 0x14($a0)
/* 0x0001DE30 0x8008DA30 0xAC460000 */ .word 0xAC460000 # sw $a2, 0x0($v0)
/* 0x0001DE34 0x8008DA34 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001DE38 0x8008DA38 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x0001DE3C 0x8008DA3C 0x00000000 */ .word 0x00000000 # nop
