/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00191000_001A1000.s
 * z64 range: 0x00194F6C..0x00194FA8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* 2-word read-before-write preamble (lui/lw $a0,-0x4CF4) feeding body at 0x00194F74 (addiu $sp,-0x18). First body jal 0x800712C4 consumes $a0 from preamble before any rewrite -> fold forward. Frees the three resources allocated by func_00194F1C. Epilogue jr $ra at 0x00194FA0 + delay addiu $sp,0x18 at 0x00194FA4. */
func_00194F6C:
/* 0x00194F6C 0x80204B6C 0x3C048022 */ .word 0x3C048022 # lui $a0, 0x8022
/* 0x00194F70 0x80204B70 0x8C84B30C */ .word 0x8C84B30C # lw $a0, -0x4CF4($a0)

/* function boundary candidate: func_00194F74, size=52, kind=prologue */
func_00194F74:
/* 0x00194F74 0x80204B74 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00194F78 0x80204B78 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00194F7C 0x80204B7C 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x00194F80 0x80204B80 0x00000000 */ .word 0x00000000 # nop
/* 0x00194F84 0x80204B84 0x3C048022 */ .word 0x3C048022 # lui $a0, 0x8022
/* 0x00194F88 0x80204B88 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x00194F8C 0x80204B8C 0x8C84B310 */ .word 0x8C84B310 # lw $a0, -0x4CF0($a0)
/* 0x00194F90 0x80204B90 0x3C048021 */ .word 0x3C048021 # lui $a0, 0x8021
/* 0x00194F94 0x80204B94 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x00194F98 0x80204B98 0x8C844F5C */ .word 0x8C844F5C # lw $a0, 0x4F5C($a0)
/* 0x00194F9C 0x80204B9C 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00194FA0 0x80204BA0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00194FA4 0x80204BA4 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
