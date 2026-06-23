/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x0026B32C..0x0026B360 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frame 0x18. Stores a0/a1 to globals 0x80221038/0x8022103C, jal 0x8020D778. Ends jr$ra@0x0026B354 + delay@0x0026B358; trailing nop@0x0026B35C attaches here. */
/* function boundary candidate: func_0026B32C, size=48, kind=prologue */
func_0026B32C:
/* 0x0026B32C 0x802DAF2C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0026B330 0x802DAF30 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x0026B334 0x802DAF34 0xAC241038 */ .word 0xAC241038 # sw $a0, 0x1038($at)
/* 0x0026B338 0x802DAF38 0x3C048021 */ .word 0x3C048021 # lui $a0, 0x8021
/* 0x0026B33C 0x802DAF3C 0x24846220 */ .word 0x24846220 # addiu $a0, $a0, 0x6220
/* 0x0026B340 0x802DAF40 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0026B344 0x802DAF44 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x0026B348 0x802DAF48 0x0C0835DE */ .word 0x0C0835DE # jal 0x8020D778
/* 0x0026B34C 0x802DAF4C 0xAC25103C */ .word 0xAC25103C # sw $a1, 0x103C($at)
/* 0x0026B350 0x802DAF50 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0026B354 0x802DAF54 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0026B358 0x802DAF58 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
/* 0x0026B35C 0x802DAF5C 0x00000000 */ .word 0x00000000 # nop
