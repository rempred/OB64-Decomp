/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x0026A4D0..0x0026A510 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Prologue addiu $sp,-0x18. jr $ra 0x0026A504 + delay 0x0026A508. Trailing nop @0x0026A50C (4B alignment gap) attaches to end of this function. */
/* function boundary candidate: func_0026A4D0, size=60, kind=prologue */
func_0026A4D0:
/* 0x0026A4D0 0x802DA0D0 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0026A4D4 0x802DA0D4 0x24020002 */ .word 0x24020002 # addiu $v0, $zero, 0x2
/* 0x0026A4D8 0x802DA0D8 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x0026A4DC 0x802DA0DC 0xAC24103C */ .word 0xAC24103C # sw $a0, 0x103C($at)
/* 0x0026A4E0 0x802DA0E0 0x3C048021 */ .word 0x3C048021 # lui $a0, 0x8021
/* 0x0026A4E4 0x802DA0E4 0x24845654 */ .word 0x24845654 # addiu $a0, $a0, 0x5654
/* 0x0026A4E8 0x802DA0E8 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0026A4EC 0x802DA0EC 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x0026A4F0 0x802DA0F0 0xA4221038 */ .word 0xA4221038 # sh $v0, 0x1038($at)
/* 0x0026A4F4 0x802DA0F4 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x0026A4F8 0x802DA0F8 0x0C0835DE */ .word 0x0C0835DE # jal 0x8020D778
/* 0x0026A4FC 0x802DA0FC 0xAC201040 */ .word 0xAC201040 # sw $zero, 0x1040($at)
/* 0x0026A500 0x802DA100 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0026A504 0x802DA104 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0026A508 0x802DA108 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
/* 0x0026A50C 0x802DA10C 0x00000000 */ .word 0x00000000 # nop
