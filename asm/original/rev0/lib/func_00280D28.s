/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00271000_00281000.s
 * z64 range: 0x00280D28..0x00280D48 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Small leaf, frame -0x18 (sw ra@0x10). Single jal 0x8022874C with arg built via lui 0x8023/addiu -0x3C4C (0x8023C3B4). Epilogue lw ra@0x10, jr ra@0x00280D40 + delay addiu sp,0x18@0x00280D44 ends slice at exactly 0x00280D48 (DATA C follows). */
/* function boundary candidate: func_00280D28, size=32, kind=prologue */
func_00280D28:
/* 0x00280D28 0x802F0928 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00280D2C 0x802F092C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00280D30 0x802F0930 0x3C048023 */ .word 0x3C048023 # lui $a0, 0x8023
/* 0x00280D34 0x802F0934 0x0C08A1D3 */ .word 0x0C08A1D3 # jal 0x8022874C
/* 0x00280D38 0x802F0938 0x2484C3B4 */ .word 0x2484C3B4 # addiu $a0, $a0, -0x3C4C
/* 0x00280D3C 0x802F093C 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00280D40 0x802F0940 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00280D44 0x802F0944 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
