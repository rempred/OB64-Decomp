/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020C478..0x0020C4B8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless class-data lookup (sltiu$a0,0x14; lui 0x801D table; internal j 0x801C9020 tail-jump kept internal); jr$ra at C4B0/delay C4B4 nop. */
/* 0x0020C478 0x8027C078 0x2C820014 */ .word 0x2C820014 # sltiu $v0, $a0, 0x14
/* 0x0020C47C 0x8027C07C 0x1040000B */ .word 0x1040000B # beq $v0, $zero, 0x8027C0AC
/* 0x0020C480 0x8027C080 0x00041140 */ .word 0x00041140 # sll $v0, $a0, 5
/* 0x0020C484 0x8027C084 0x3C05801D */ .word 0x3C05801D # lui $a1, 0x801D
/* 0x0020C488 0x8027C088 0x8CA5E8BC */ .word 0x8CA5E8BC # lw $a1, -0x1744($a1)
/* 0x0020C48C 0x8027C08C 0x00441023 */ .word 0x00441023 # subu $v0, $v0, $a0
/* 0x0020C490 0x8027C090 0x000218C0 */ .word 0x000218C0 # sll $v1, $v0, 3
/* 0x0020C494 0x8027C094 0x00A31021 */ .word 0x00A31021 # addu $v0, $a1, $v1
/* 0x0020C498 0x8027C098 0x8C42020C */ .word 0x8C42020C # lw $v0, 0x20C($v0)
/* 0x0020C49C 0x8027C09C 0x10400003 */ .word 0x10400003 # beq $v0, $zero, 0x8027C0AC
/* 0x0020C4A0 0x8027C0A0 0x246201C4 */ .word 0x246201C4 # addiu $v0, $v1, 0x1C4
/* 0x0020C4A4 0x8027C0A4 0x08072408 */ .word 0x08072408 # j 0x801C9020
/* 0x0020C4A8 0x8027C0A8 0x00A21021 */ .word 0x00A21021 # addu $v0, $a1, $v0
/* 0x0020C4AC 0x8027C0AC 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x0020C4B0 0x8027C0B0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020C4B4 0x8027C0B4 0x00000000 */ .word 0x00000000 # nop
