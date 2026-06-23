/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001B1000_001C1000.s
 * z64 range: 0x001BBF94..0x001BBFA8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf on $a0: lw 0x8($a0); addiu +8; jr $ra(0x1BBFA0)+delay move $v0,$zero(0x1BBFA4). No-op stream advance handler. */
func_001BBF94:
/* 0x001BBF94 0x8022BB94 0x8C820008 */ .word 0x8C820008 # lw $v0, 0x8($a0)
/* 0x001BBF98 0x8022BB98 0x24420008 */ .word 0x24420008 # addiu $v0, $v0, 0x8
/* 0x001BBF9C 0x8022BB9C 0xAC820008 */ .word 0xAC820008 # sw $v0, 0x8($a0)
/* 0x001BBFA0 0x8022BBA0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001BBFA4 0x8022BBA4 0x00001021 */ .word 0x00001021 # move $v0, $zero
