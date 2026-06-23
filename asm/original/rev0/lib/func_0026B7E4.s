/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x0026B7E4..0x0026B820 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frame 0x18. Mirror of func_0026B32C with a different table pointer (0x6C70 in 0x8021). Ends jr$ra@0x0026B80C + delay@0x0026B810; 12B alignment nops @0x0026B814/0x0026B818/0x0026B81C attach here. */
/* function boundary candidate: func_0026B7E4, size=48, kind=prologue */
func_0026B7E4:
/* 0x0026B7E4 0x802DB3E4 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0026B7E8 0x802DB3E8 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x0026B7EC 0x802DB3EC 0xAC241038 */ .word 0xAC241038 # sw $a0, 0x1038($at)
/* 0x0026B7F0 0x802DB3F0 0x3C048021 */ .word 0x3C048021 # lui $a0, 0x8021
/* 0x0026B7F4 0x802DB3F4 0x248467B0 */ .word 0x248467B0 # addiu $a0, $a0, 0x67B0
/* 0x0026B7F8 0x802DB3F8 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0026B7FC 0x802DB3FC 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x0026B800 0x802DB400 0x0C0835DE */ .word 0x0C0835DE # jal 0x8020D778
/* 0x0026B804 0x802DB404 0xAC25103C */ .word 0xAC25103C # sw $a1, 0x103C($at)
/* 0x0026B808 0x802DB408 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0026B80C 0x802DB40C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0026B810 0x802DB410 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
/* 0x0026B814 0x802DB414 0x00000000 */ .word 0x00000000 # nop
/* 0x0026B818 0x802DB418 0x00000000 */ .word 0x00000000 # nop
/* 0x0026B81C 0x802DB41C 0x00000000 */ .word 0x00000000 # nop
