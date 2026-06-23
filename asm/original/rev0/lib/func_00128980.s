/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00121000_00131000.s
 * z64 range: 0x00128980..0x001289BC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Framed func (addiu $sp,-0x18). bgez gate then jal 0x801B2B78 and sets 0x88($s0)=0x5A. Ends jr $ra @0x001289B4 + delay 0x001289B8. */
/* function boundary candidate: func_00128980, size=60, kind=prologue */
func_00128980:
/* 0x00128980 0x80198580 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00128984 0x80198584 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x00128988 0x80198588 0x00808021 */ .word 0x00808021 # move $s0, $a0
/* 0x0012898C 0x8019858C 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x00128990 0x80198590 0x8E020088 */ .word 0x8E020088 # lw $v0, 0x88($s0)
/* 0x00128994 0x80198594 0x04410005 */ .word 0x04410005 # bgez $v0, 0x801985AC
/* 0x00128998 0x80198598 0x00000000 */ .word 0x00000000 # nop
/* 0x0012899C 0x8019859C 0x0C06CADE */ .word 0x0C06CADE # jal 0x801B2B78
/* 0x001289A0 0x801985A0 0x00000000 */ .word 0x00000000 # nop
/* 0x001289A4 0x801985A4 0x2402005A */ .word 0x2402005A # addiu $v0, $zero, 0x5A
/* 0x001289A8 0x801985A8 0xAE020088 */ .word 0xAE020088 # sw $v0, 0x88($s0)
/* 0x001289AC 0x801985AC 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x001289B0 0x801985B0 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x001289B4 0x801985B4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001289B8 0x801985B8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
