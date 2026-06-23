/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00251000_00261000.s
 * z64 range: 0x00260DA0..0x00260DDC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frame addiu$sp,-0x18. jal 0x80070F30, zeroes globals 0x80220D40/D44/D48 and stores 0xF20. jr$ra@0x00260DD4 + delay addiu$sp,0x18@0x00260DD8. Ends at the next function's preamble start 0x00260DDC. */
/* function boundary candidate: func_00260DA0, size=60, kind=prologue */
func_00260DA0:
/* 0x00260DA0 0x802D09A0 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00260DA4 0x802D09A4 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00260DA8 0x802D09A8 0x0C01C3CC */ .word 0x0C01C3CC # jal 0x80070F30
/* 0x00260DAC 0x802D09AC 0x34048000 */ .word 0x34048000 # ori $a0, $zero, 0x8000
/* 0x00260DB0 0x802D09B0 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x00260DB4 0x802D09B4 0xAC220F20 */ .word 0xAC220F20 # sw $v0, 0xF20($at)
/* 0x00260DB8 0x802D09B8 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x00260DBC 0x802D09BC 0xAC200D48 */ .word 0xAC200D48 # sw $zero, 0xD48($at)
/* 0x00260DC0 0x802D09C0 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x00260DC4 0x802D09C4 0xAC200D44 */ .word 0xAC200D44 # sw $zero, 0xD44($at)
/* 0x00260DC8 0x802D09C8 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x00260DCC 0x802D09CC 0xA4200D40 */ .word 0xA4200D40 # sh $zero, 0xD40($at)
/* 0x00260DD0 0x802D09D0 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00260DD4 0x802D09D4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00260DD8 0x802D09D8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
