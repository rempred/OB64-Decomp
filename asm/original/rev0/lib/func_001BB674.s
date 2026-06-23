/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001B1000_001C1000.s
 * z64 range: 0x001BB674..0x001BB698 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf on $a0: lw 0x8($a0) chain; stores into 0x8023A82C global; jr $ra(0x1BB690)+delay move $v0,$zero(0x1BB694). */
func_001BB674:
/* 0x001BB674 0x8022B274 0x8C830008 */ .word 0x8C830008 # lw $v1, 0x8($a0)
/* 0x001BB678 0x8022B278 0x8C820008 */ .word 0x8C820008 # lw $v0, 0x8($a0)
/* 0x001BB67C 0x8022B27C 0x8C630004 */ .word 0x8C630004 # lw $v1, 0x4($v1)
/* 0x001BB680 0x8022B280 0x24420008 */ .word 0x24420008 # addiu $v0, $v0, 0x8
/* 0x001BB684 0x8022B284 0xAC820008 */ .word 0xAC820008 # sw $v0, 0x8($a0)
/* 0x001BB688 0x8022B288 0x3C018023 */ .word 0x3C018023 # lui $at, 0x8023
/* 0x001BB68C 0x8022B28C 0xAC23A82C */ .word 0xAC23A82C # sw $v1, -0x57D4($at)
/* 0x001BB690 0x8022B290 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001BB694 0x8022B294 0x00001021 */ .word 0x00001021 # move $v0, $zero
