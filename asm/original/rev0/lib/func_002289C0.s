/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00221000_00231000.s
 * z64 range: 0x002289C0..0x00228A00 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Read-before-write preamble-orphan: 0x002289C0 'lui $v1,0x800F; lw $v1,-0x6460($v1)' loads $v1 read first by the prologue body at 0x002289C8 (addiu $v0,$v1,0x8 @0x002289D4, sw $v0,0x0($v1) @0x002289E4). Folded FORWARD; name=func_002289C0, own label=func_002289C8. Prologue addiu $sp,-0x18; jal 0x801E3A48. Ends jr $ra at 0x002289F8 + delay (addiu $sp,0x18) at 0x002289FC. */
func_002289C0:
/* 0x002289C0 0x802985C0 0x3C03800F */ .word 0x3C03800F # lui $v1, 0x800F
/* 0x002289C4 0x802985C4 0x8C639BA0 */ .word 0x8C639BA0 # lw $v1, -0x6460($v1)

/* function boundary candidate: func_002289C8, size=56, kind=prologue */
func_002289C8:
/* 0x002289C8 0x802985C8 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x002289CC 0x802985CC 0x24840026 */ .word 0x24840026 # addiu $a0, $a0, 0x26
/* 0x002289D0 0x802985D0 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x002289D4 0x802985D4 0x24620008 */ .word 0x24620008 # addiu $v0, $v1, 0x8
/* 0x002289D8 0x802985D8 0x3C01800F */ .word 0x3C01800F # lui $at, 0x800F
/* 0x002289DC 0x802985DC 0xAC229BA0 */ .word 0xAC229BA0 # sw $v0, -0x6460($at)
/* 0x002289E0 0x802985E0 0x3C02FA00 */ .word 0x3C02FA00 # lui $v0, 0xFA00
/* 0x002289E4 0x802985E4 0xAC620000 */ .word 0xAC620000 # sw $v0, 0x0($v1)
/* 0x002289E8 0x802985E8 0x2402FFFF */ .word 0x2402FFFF # addiu $v0, $zero, -0x1
/* 0x002289EC 0x802985EC 0x0C078E92 */ .word 0x0C078E92 # jal 0x801E3A48
/* 0x002289F0 0x802985F0 0xAC620004 */ .word 0xAC620004 # sw $v0, 0x4($v1)
/* 0x002289F4 0x802985F4 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x002289F8 0x802985F8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002289FC 0x802985FC 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
