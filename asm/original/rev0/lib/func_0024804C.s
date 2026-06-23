/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00241000_00251000.s
 * z64 range: 0x0024804C..0x00248088 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* PREAMBLE-ORPHAN. Preamble at 0x0024804C (lui $v1,0x8019; lbu $v1,-0x520($v1)); prologue addiu $sp,-0x18 at 0x00248054 reads $v1 at bne $v1,$v0 (0x0024805C) before write. jr $ra at 0x00248080 + delay at 0x00248084. */
func_0024804C:
/* 0x0024804C 0x802B7C4C 0x3C038019 */ .word 0x3C038019 # lui $v1, 0x8019
/* 0x00248050 0x802B7C50 0x9063FAE0 */ .word 0x9063FAE0 # lbu $v1, -0x520($v1)

/* function boundary candidate: func_00248054, size=52, kind=prologue */
func_00248054:
/* 0x00248054 0x802B7C54 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00248058 0x802B7C58 0x24020003 */ .word 0x24020003 # addiu $v0, $zero, 0x3
/* 0x0024805C 0x802B7C5C 0x14620005 */ .word 0x14620005 # bne $v1, $v0, 0x802B7C74
/* 0x00248060 0x802B7C60 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00248064 0x802B7C64 0x0C075D17 */ .word 0x0C075D17 # jal 0x801D745C
/* 0x00248068 0x802B7C68 0x00000000 */ .word 0x00000000 # nop
/* 0x0024806C 0x802B7C6C 0x08075047 */ .word 0x08075047 # j 0x801D411C
/* 0x00248070 0x802B7C70 0x00000000 */ .word 0x00000000 # nop
/* 0x00248074 0x802B7C74 0x0C074EF8 */ .word 0x0C074EF8 # jal 0x801D3BE0
/* 0x00248078 0x802B7C78 0x00000000 */ .word 0x00000000 # nop
/* 0x0024807C 0x802B7C7C 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00248080 0x802B7C80 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00248084 0x802B7C84 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
