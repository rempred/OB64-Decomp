/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00071000_00081000.s
 * z64 range: 0x0007D064..0x0007D0A0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Fresh -0x18 prologue at 0x7D064; ends jr $ra at 0x7D098 + delay slot 0x7D09C. The two words at 0x7D0A0-0x7D0A8 (lui $v1; lhu $v1,-0x7F00($v1)) are a read-before-write preamble for the next function (which uses $v1 at 0x7D0C4 before any store), so they are NOT part of this function. */
/* function boundary candidate: func_0007D064, size=60, kind=prologue */
func_0007D064:
/* 0x0007D064 0x800ECC64 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0007D068 0x800ECC68 0x00802821 */ .word 0x00802821 # move $a1, $a0
/* 0x0007D06C 0x800ECC6C 0x14A00005 */ .word 0x14A00005 # bne $a1, $zero, 0x800ECC84
/* 0x0007D070 0x800ECC70 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0007D074 0x800ECC74 0x3C04800F */ .word 0x3C04800F # lui $a0, 0x800F
/* 0x0007D078 0x800ECC78 0x2484B290 */ .word 0x2484B290 # addiu $a0, $a0, -0x4D70
/* 0x0007D07C 0x800ECC7C 0x0806783F */ .word 0x0806783F # j 0x8019E0FC
/* 0x0007D080 0x800ECC80 0x00002821 */ .word 0x00002821 # move $a1, $zero
/* 0x0007D084 0x800ECC84 0x3C04800F */ .word 0x3C04800F # lui $a0, 0x800F
/* 0x0007D088 0x800ECC88 0x2484B240 */ .word 0x2484B240 # addiu $a0, $a0, -0x4DC0
/* 0x0007D08C 0x800ECC8C 0x0C03A981 */ .word 0x0C03A981 # jal 0x800EA604
/* 0x0007D090 0x800ECC90 0x00000000 */ .word 0x00000000 # nop
/* 0x0007D094 0x800ECC94 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0007D098 0x800ECC98 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0007D09C 0x800ECC9C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
