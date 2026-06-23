/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00231000_00241000.s
 * z64 range: 0x0023B498..0x0023B4BC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* PREAMBLE-ORPHAN fold-forward: read-before-write preamble at 0x0023B498 (lui$a0,0x801F; lw$a0,0x530) loads $a0 read by the body's jal 0x800712C4 before any write. Prologue addiu$sp,-0x18 @0x0023B4A0. Ends jr$ra@0x0023B4B4 + delay addiu$sp,0x18@0x0023B4B8. */
func_0023B498:
/* 0x0023B498 0x802AB098 0x3C04801F */ .word 0x3C04801F # lui $a0, 0x801F
/* 0x0023B49C 0x802AB09C 0x8C840530 */ .word 0x8C840530 # lw $a0, 0x530($a0)

/* function boundary candidate: func_0023B4A0, size=28, kind=prologue */
func_0023B4A0:
/* 0x0023B4A0 0x802AB0A0 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0023B4A4 0x802AB0A4 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0023B4A8 0x802AB0A8 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x0023B4AC 0x802AB0AC 0x00000000 */ .word 0x00000000 # nop
/* 0x0023B4B0 0x802AB0B0 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0023B4B4 0x802AB0B4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0023B4B8 0x802AB0B8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
