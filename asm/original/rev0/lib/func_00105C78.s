/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00101000_00111000.s
 * z64 range: 0x00105C78..0x00105CC0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Framed function addiu $sp,-0x20. Ends jr $ra 0x105CB4 + delay 0x105CB8; padding nop 0x105CBC absorbed. Trailing 2-word preamble at 0x105CC0 belongs to next part. */
/* function boundary candidate: func_00105C78, size=68, kind=prologue */
func_00105C78:
/* 0x00105C78 0x80175878 0x27BDFFE0 */ .word 0x27BDFFE0 # addiu $sp, $sp, -0x20
/* 0x00105C7C 0x8017587C 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x00105C80 0x80175880 0x00808021 */ .word 0x00808021 # move $s0, $a0
/* 0x00105C84 0x80175884 0xAFBF0018 */ .word 0xAFBF0018 # sw $ra, 0x18($sp)
/* 0x00105C88 0x80175888 0xAFB10014 */ .word 0xAFB10014 # sw $s1, 0x14($sp)
/* 0x00105C8C 0x8017588C 0x8E1100A8 */ .word 0x8E1100A8 # lw $s1, 0xA8($s0)
/* 0x00105C90 0x80175890 0x3C04801F */ .word 0x3C04801F # lui $a0, 0x801F
/* 0x00105C94 0x80175894 0x248438D8 */ .word 0x248438D8 # addiu $a0, $a0, 0x38D8
/* 0x00105C98 0x80175898 0x02002821 */ .word 0x02002821 # move $a1, $s0
/* 0x00105C9C 0x8017589C 0x0C024C18 */ .word 0x0C024C18 # jal 0x80093060
/* 0x00105CA0 0x801758A0 0x240600C0 */ .word 0x240600C0 # addiu $a2, $zero, 0xC0
/* 0x00105CA4 0x801758A4 0xAE1100A8 */ .word 0xAE1100A8 # sw $s1, 0xA8($s0)
/* 0x00105CA8 0x801758A8 0x8FBF0018 */ .word 0x8FBF0018 # lw $ra, 0x18($sp)
/* 0x00105CAC 0x801758AC 0x8FB10014 */ .word 0x8FB10014 # lw $s1, 0x14($sp)
/* 0x00105CB0 0x801758B0 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x00105CB4 0x801758B4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00105CB8 0x801758B8 0x27BD0020 */ .word 0x27BD0020 # addiu $sp, $sp, 0x20
/* 0x00105CBC 0x801758BC 0x00000000 */ .word 0x00000000 # nop
