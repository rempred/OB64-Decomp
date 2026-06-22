/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00046674..0x00046694 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue fn (parent file 0x46674), jr $ra at 0x4668C + delay 0x46690 */
/* function boundary candidate: func_00046674, size=32, kind=prologue */
func_00046674:
/* 0x00046674 0x800B6274 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00046678 0x800B6278 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004667C 0x800B627C 0x308400FF */ .word 0x308400FF # andi $a0, $a0, 0x00FF
/* 0x00046680 0x800B6280 0x0C05CAFC */ .word 0x0C05CAFC # jal 0x80172BF0
/* 0x00046684 0x800B6284 0x30C500FF */ .word 0x30C500FF # andi $a1, $a2, 0x00FF
/* 0x00046688 0x800B6288 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004668C 0x800B628C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00046690 0x800B6290 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
