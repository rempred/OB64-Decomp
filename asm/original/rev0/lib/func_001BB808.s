/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001B1000_001C1000.s
 * z64 range: 0x001BB808..0x001BB838 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf on $a0: OR-merge into 0x8023A256 global; jr $ra(0x1BB830)+delay move $v0,$zero(0x1BB834). */
func_001BB808:
/* 0x001BB808 0x8022B408 0x8C850008 */ .word 0x8C850008 # lw $a1, 0x8($a0)
/* 0x001BB80C 0x8022B40C 0x3C038023 */ .word 0x3C038023 # lui $v1, 0x8023
/* 0x001BB810 0x8022B410 0x9463A256 */ .word 0x9463A256 # lhu $v1, -0x5DAA($v1)
/* 0x001BB814 0x8022B414 0x8C820008 */ .word 0x8C820008 # lw $v0, 0x8($a0)
/* 0x001BB818 0x8022B418 0x94A50002 */ .word 0x94A50002 # lhu $a1, 0x2($a1)
/* 0x001BB81C 0x8022B41C 0x24420004 */ .word 0x24420004 # addiu $v0, $v0, 0x4
/* 0x001BB820 0x8022B420 0xAC820008 */ .word 0xAC820008 # sw $v0, 0x8($a0)
/* 0x001BB824 0x8022B424 0x00651825 */ .word 0x00651825 # or $v1, $v1, $a1
/* 0x001BB828 0x8022B428 0x3C018023 */ .word 0x3C018023 # lui $at, 0x8023
/* 0x001BB82C 0x8022B42C 0xA423A256 */ .word 0xA423A256 # sh $v1, -0x5DAA($at)
/* 0x001BB830 0x8022B430 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001BB834 0x8022B434 0x00001021 */ .word 0x00001021 # move $v0, $zero
