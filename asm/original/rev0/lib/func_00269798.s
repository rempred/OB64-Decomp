/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x00269798..0x002697DC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Display-command wrapper (type 0x18 alloc, store $s0 at 0x103C). Prologue addiu $sp,-0x18; ends jr$ra@0x002697D4 + delay@0x002697D8. Slice-start file; high-fanin (35 callers). */
/* function boundary candidate: func_00269798, size=68, kind=prologue */
func_00269798:
/* 0x00269798 0x802D9398 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0026979C 0x802D939C 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x002697A0 0x802D93A0 0x00808021 */ .word 0x00808021 # move $s0, $a0
/* 0x002697A4 0x802D93A4 0x3C048022 */ .word 0x3C048022 # lui $a0, 0x8022
/* 0x002697A8 0x802D93A8 0x24841038 */ .word 0x24841038 # addiu $a0, $a0, 0x1038
/* 0x002697AC 0x802D93AC 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x002697B0 0x802D93B0 0x0C024CE0 */ .word 0x0C024CE0 # jal 0x80093380
/* 0x002697B4 0x802D93B4 0x24050018 */ .word 0x24050018 # addiu $a1, $zero, 0x18
/* 0x002697B8 0x802D93B8 0x3C048021 */ .word 0x3C048021 # lui $a0, 0x8021
/* 0x002697BC 0x802D93BC 0x248448C0 */ .word 0x248448C0 # addiu $a0, $a0, 0x48C0
/* 0x002697C0 0x802D93C0 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x002697C4 0x802D93C4 0x0C0835DE */ .word 0x0C0835DE # jal 0x8020D778
/* 0x002697C8 0x802D93C8 0xAC30103C */ .word 0xAC30103C # sw $s0, 0x103C($at)
/* 0x002697CC 0x802D93CC 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x002697D0 0x802D93D0 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x002697D4 0x802D93D4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002697D8 0x802D93D8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
