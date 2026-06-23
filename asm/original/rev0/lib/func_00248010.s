/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00241000_00251000.s
 * z64 range: 0x00248010..0x0024804C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* PREAMBLE-ORPHAN. Preamble at 0x00248010 (lui $v1,0x8019; lbu $v1,-0x520($v1)); prologue addiu $sp,-0x18 at 0x00248018 reads $v1 at beq $v1,$v0 (0x00248020) before write. jr $ra at 0x00248044 + delay at 0x00248048. */
func_00248010:
/* 0x00248010 0x802B7C10 0x3C038019 */ .word 0x3C038019 # lui $v1, 0x8019
/* 0x00248014 0x802B7C14 0x9063FAE0 */ .word 0x9063FAE0 # lbu $v1, -0x520($v1)

/* function boundary candidate: func_00248018, size=52, kind=prologue */
func_00248018:
/* 0x00248018 0x802B7C18 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0024801C 0x802B7C1C 0x24020003 */ .word 0x24020003 # addiu $v0, $zero, 0x3
/* 0x00248020 0x802B7C20 0x10620005 */ .word 0x10620005 # beq $v1, $v0, 0x802B7C38
/* 0x00248024 0x802B7C24 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00248028 0x802B7C28 0x0C074E5D */ .word 0x0C074E5D # jal 0x801D3974
/* 0x0024802C 0x802B7C2C 0x00000000 */ .word 0x00000000 # nop
/* 0x00248030 0x802B7C30 0x08075038 */ .word 0x08075038 # j 0x801D40E0
/* 0x00248034 0x802B7C34 0x00000000 */ .word 0x00000000 # nop
/* 0x00248038 0x802B7C38 0x0C075BE9 */ .word 0x0C075BE9 # jal 0x801D6FA4
/* 0x0024803C 0x802B7C3C 0x00000000 */ .word 0x00000000 # nop
/* 0x00248040 0x802B7C40 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00248044 0x802B7C44 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00248048 0x802B7C48 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
