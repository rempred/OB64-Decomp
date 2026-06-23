/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00131000_00141000.s
 * z64 range: 0x00134690..0x001346C0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Framed function (addiu $sp,-0x18). Ends jr $ra at 0x001346B8 + delay 0x001346BC; true end 0x001346C0. */
/* function boundary candidate: func_00134690, size=48, kind=prologue */
func_00134690:
/* 0x00134690 0x801A4290 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00134694 0x801A4294 0x3C04800C */ .word 0x3C04800C # lui $a0, 0x800C
/* 0x00134698 0x801A4298 0x8C844BB8 */ .word 0x8C844BB8 # lw $a0, 0x4BB8($a0)
/* 0x0013469C 0x801A429C 0x3C05801F */ .word 0x3C05801F # lui $a1, 0x801F
/* 0x001346A0 0x801A42A0 0x8CA53620 */ .word 0x8CA53620 # lw $a1, 0x3620($a1)
/* 0x001346A4 0x801A42A4 0x3C060002 */ .word 0x3C060002 # lui $a2, 0x0002
/* 0x001346A8 0x801A42A8 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x001346AC 0x801A42AC 0x0C024C18 */ .word 0x0C024C18 # jal 0x80093060
/* 0x001346B0 0x801A42B0 0x34C65800 */ .word 0x34C65800 # ori $a2, $a2, 0x5800
/* 0x001346B4 0x801A42B4 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x001346B8 0x801A42B8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001346BC 0x801A42BC 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
