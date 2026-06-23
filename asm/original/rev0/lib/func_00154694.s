/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00151000_00161000.s
 * z64 range: 0x00154694..0x001546C8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Small; addiu $sp,-0x18; j 0x80203544 internal overlay tail-jump; jr $ra@0x001546C0 + delay 0x001546C4. */
/* function boundary candidate: func_00154694, size=52, kind=prologue */
func_00154694:
/* 0x00154694 0x801C4294 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00154698 0x801C4298 0x30C600FF */ .word 0x30C600FF # andi $a2, $a2, 0x00FF
/* 0x0015469C 0x801C429C 0x24020003 */ .word 0x24020003 # addiu $v0, $zero, 0x3
/* 0x001546A0 0x801C42A0 0x14C20003 */ .word 0x14C20003 # bne $a2, $v0, 0x801C42B0
/* 0x001546A4 0x801C42A4 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x001546A8 0x801C42A8 0x08080D51 */ .word 0x08080D51 # j 0x80203544
/* 0x001546AC 0x801C42AC 0x24060011 */ .word 0x24060011 # addiu $a2, $zero, 0x11
/* 0x001546B0 0x801C42B0 0x24060010 */ .word 0x24060010 # addiu $a2, $zero, 0x10
/* 0x001546B4 0x801C42B4 0x0C080374 */ .word 0x0C080374 # jal 0x80200DD0
/* 0x001546B8 0x801C42B8 0x00000000 */ .word 0x00000000 # nop
/* 0x001546BC 0x801C42BC 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x001546C0 0x801C42C0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001546C4 0x801C42C4 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
