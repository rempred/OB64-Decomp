/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00046548..0x00046568 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue fn (parent file 0x46548), jr $ra at 0x46560 + delay 0x46564 */
/* function boundary candidate: func_00046548, size=120, kind=prologue */
func_00046548:
/* 0x00046548 0x800B6148 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004654C 0x800B614C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00046550 0x800B6150 0x0C05ADBF */ .word 0x0C05ADBF # jal 0x8016B6FC
/* 0x00046554 0x800B6154 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x00046558 0x800B6158 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004655C 0x800B615C 0x3042FFFF */ .word 0x3042FFFF # andi $v0, $v0, 0xFFFF
/* 0x00046560 0x800B6160 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00046564 0x800B6164 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
