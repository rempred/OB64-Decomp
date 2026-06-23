/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x001461D4..0x0014621C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Preamble lui $a2,0x801F / lw $a2,0x367C($a2) at 0x001461D4-0x001461D8 loads $a2 read by inner prologue (0x001461DC, blez $a2 at 0x001461E0) before write. Linear search over 0x801F0CB0 table; j 0x801F502C internal tail-jump. jr $ra at 0x00146214 + delay 0x00146218. */
func_001461D4:
/* 0x001461D4 0x801B5DD4 0x3C06801F */ .word 0x3C06801F # lui $a2, 0x801F
/* 0x001461D8 0x801B5DD8 0x8CC6367C */ .word 0x8CC6367C # lw $a2, 0x367C($a2)

/* function boundary candidate: func_001461DC, size=64, kind=prologue */
func_001461DC:
/* 0x001461DC 0x801B5DDC 0x27BDFFF8 */ .word 0x27BDFFF8 # addiu $sp, $sp, -0x8
/* 0x001461E0 0x801B5DE0 0x18C0000A */ .word 0x18C0000A # blez $a2, 0x801B5E0C
/* 0x001461E4 0x801B5DE4 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x001461E8 0x801B5DE8 0x3C05801F */ .word 0x3C05801F # lui $a1, 0x801F
/* 0x001461EC 0x801B5DEC 0x24A50CB0 */ .word 0x24A50CB0 # addiu $a1, $a1, 0xCB0
/* 0x001461F0 0x801B5DF0 0x8CA20000 */ .word 0x8CA20000 # lw $v0, 0x0($a1)
/* 0x001461F4 0x801B5DF4 0x10440007 */ .word 0x10440007 # beq $v0, $a0, 0x801B5E14
/* 0x001461F8 0x801B5DF8 0x00601021 */ .word 0x00601021 # move $v0, $v1
/* 0x001461FC 0x801B5DFC 0x24630001 */ .word 0x24630001 # addiu $v1, $v1, 0x1
/* 0x00146200 0x801B5E00 0x0066102A */ .word 0x0066102A # slt $v0, $v1, $a2
/* 0x00146204 0x801B5E04 0x1440FFFA */ .word 0x1440FFFA # bne $v0, $zero, 0x801B5DF0
/* 0x00146208 0x801B5E08 0x24A50004 */ .word 0x24A50004 # addiu $a1, $a1, 0x4
/* 0x0014620C 0x801B5E0C 0x0807D40B */ .word 0x0807D40B # j 0x801F502C
/* 0x00146210 0x801B5E10 0x00000000 */ .word 0x00000000 # nop
/* 0x00146214 0x801B5E14 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00146218 0x801B5E18 0x27BD0008 */ .word 0x27BD0008 # addiu $sp, $sp, 0x8
