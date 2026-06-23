/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00241000_00251000.s
 * z64 range: 0x00248088..0x002480D0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* PREAMBLE-ORPHAN. Preamble at 0x00248088 (lui $v1,0x8019; lbu $v1,-0x520($v1)); prologue addiu $sp,-0x18 at 0x00248090 reads $v1 at bne $v1,$v0 (0x00248098) before write. jr $ra at 0x002480BC + delay at 0x002480C0; three trailing align nops at 0x002480C4/C8/CC attach to this function's end. */
func_00248088:
/* 0x00248088 0x802B7C88 0x3C038019 */ .word 0x3C038019 # lui $v1, 0x8019
/* 0x0024808C 0x802B7C8C 0x9063FAE0 */ .word 0x9063FAE0 # lbu $v1, -0x520($v1)

/* function boundary candidate: func_00248090, size=52, kind=prologue */
func_00248090:
/* 0x00248090 0x802B7C90 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00248094 0x802B7C94 0x24020003 */ .word 0x24020003 # addiu $v0, $zero, 0x3
/* 0x00248098 0x802B7C98 0x14620005 */ .word 0x14620005 # bne $v1, $v0, 0x802B7CB0
/* 0x0024809C 0x802B7C9C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x002480A0 0x802B7CA0 0x0C075D19 */ .word 0x0C075D19 # jal 0x801D7464
/* 0x002480A4 0x802B7CA4 0x00000000 */ .word 0x00000000 # nop
/* 0x002480A8 0x802B7CA8 0x08075056 */ .word 0x08075056 # j 0x801D4158
/* 0x002480AC 0x802B7CAC 0x00000000 */ .word 0x00000000 # nop
/* 0x002480B0 0x802B7CB0 0x0C074FB2 */ .word 0x0C074FB2 # jal 0x801D3EC8
/* 0x002480B4 0x802B7CB4 0x00000000 */ .word 0x00000000 # nop
/* 0x002480B8 0x802B7CB8 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x002480BC 0x802B7CBC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002480C0 0x802B7CC0 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
/* 0x002480C4 0x802B7CC4 0x00000000 */ .word 0x00000000 # nop
/* 0x002480C8 0x802B7CC8 0x00000000 */ .word 0x00000000 # nop
/* 0x002480CC 0x802B7CCC 0x00000000 */ .word 0x00000000 # nop
