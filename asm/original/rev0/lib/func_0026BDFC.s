/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x0026BDFC..0x0026BE30 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frame 0x18. Mirror of func_0026B32C/func_0026B7E4 (table ptr 0x6C70). Ends jr$ra@0x0026BE24 + delay@0x0026BE28; trailing nop@0x0026BE2C attaches here. */
/* function boundary candidate: func_0026BDFC, size=48, kind=prologue */
func_0026BDFC:
/* 0x0026BDFC 0x802DB9FC 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0026BE00 0x802DBA00 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x0026BE04 0x802DBA04 0xAC241038 */ .word 0xAC241038 # sw $a0, 0x1038($at)
/* 0x0026BE08 0x802DBA08 0x3C048021 */ .word 0x3C048021 # lui $a0, 0x8021
/* 0x0026BE0C 0x802DBA0C 0x24846C70 */ .word 0x24846C70 # addiu $a0, $a0, 0x6C70
/* 0x0026BE10 0x802DBA10 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0026BE14 0x802DBA14 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x0026BE18 0x802DBA18 0x0C0835DE */ .word 0x0C0835DE # jal 0x8020D778
/* 0x0026BE1C 0x802DBA1C 0xAC25103C */ .word 0xAC25103C # sw $a1, 0x103C($at)
/* 0x0026BE20 0x802DBA20 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0026BE24 0x802DBA24 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0026BE28 0x802DBA28 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
/* 0x0026BE2C 0x802DBA2C 0x00000000 */ .word 0x00000000 # nop
