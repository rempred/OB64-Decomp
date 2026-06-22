/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00046654..0x00046674 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue fn (parent file 0x46654), single fn, jr $ra at 0x4666C + delay 0x46670 */
/* function boundary candidate: func_00046654, size=32, kind=prologue */
func_00046654:
/* 0x00046654 0x800B6254 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00046658 0x800B6258 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004665C 0x800B625C 0x308500FF */ .word 0x308500FF # andi $a1, $a0, 0x00FF
/* 0x00046660 0x800B6260 0x0C05AE9B */ .word 0x0C05AE9B # jal 0x8016BA6C
/* 0x00046664 0x800B6264 0x30C400FF */ .word 0x30C400FF # andi $a0, $a2, 0x00FF
/* 0x00046668 0x800B6268 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004666C 0x800B626C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00046670 0x800B6270 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
