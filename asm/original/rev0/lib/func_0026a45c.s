/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x0026A45C..0x0026A494 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Prologue addiu $sp,-0x18. jr $ra 0x0026A48C + delay 0x0026A490. */
/* function boundary candidate: func_0026A45C, size=56, kind=prologue */
func_0026A45C:
/* 0x0026A45C 0x802DA05C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0026A460 0x802DA060 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x0026A464 0x802DA064 0xAC24103C */ .word 0xAC24103C # sw $a0, 0x103C($at)
/* 0x0026A468 0x802DA068 0x3C048021 */ .word 0x3C048021 # lui $a0, 0x8021
/* 0x0026A46C 0x802DA06C 0x24845654 */ .word 0x24845654 # addiu $a0, $a0, 0x5654
/* 0x0026A470 0x802DA070 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0026A474 0x802DA074 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x0026A478 0x802DA078 0xA4201038 */ .word 0xA4201038 # sh $zero, 0x1038($at)
/* 0x0026A47C 0x802DA07C 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x0026A480 0x802DA080 0x0C0835DE */ .word 0x0C0835DE # jal 0x8020D778
/* 0x0026A484 0x802DA084 0xAC201040 */ .word 0xAC201040 # sw $zero, 0x1040($at)
/* 0x0026A488 0x802DA088 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0026A48C 0x802DA08C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0026A490 0x802DA090 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
