/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00131000_00141000.s
 * z64 range: 0x001346C0..0x001346F0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Preamble-orphan: lui $a0/lw $a0,0x3620 read-before-write preamble at 0x001346C0 folded forward into inner prologue (addiu $sp,-0x18) at 0x001346C8, whose first body op beq $a0,$zero reads $a0. Ends jr $ra at 0x001346E8 + delay 0x001346EC = slice end. */
func_001346C0:
/* 0x001346C0 0x801A42C0 0x3C04801F */ .word 0x3C04801F # lui $a0, 0x801F
/* 0x001346C4 0x801A42C4 0x8C843620 */ .word 0x8C843620 # lw $a0, 0x3620($a0)

/* function boundary candidate: func_001346C8, size=40, kind=prologue */
func_001346C8:
/* 0x001346C8 0x801A42C8 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x001346CC 0x801A42CC 0x10800005 */ .word 0x10800005 # beq $a0, $zero, 0x801A42E4
/* 0x001346D0 0x801A42D0 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x001346D4 0x801A42D4 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x001346D8 0x801A42D8 0x00000000 */ .word 0x00000000 # nop
/* 0x001346DC 0x801A42DC 0x3C01801F */ .word 0x3C01801F # lui $at, 0x801F
/* 0x001346E0 0x801A42E0 0xAC203620 */ .word 0xAC203620 # sw $zero, 0x3620($at)
/* 0x001346E4 0x801A42E4 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x001346E8 0x801A42E8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001346EC 0x801A42EC 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
