/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00101000_00111000.s
 * z64 range: 0x00109C04..0x00109C3C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Separate frameless leaf reached by fall-through after func_00109A48's jr $ra+delay slot. No addiu $sp,-N; uses only $a0-$a2/$v0-$v1, no stack frame. Iterates a 0x801F-relocated table (lui $a0,0x801F / addiu 0xD28) clearing a flag bit, ends with its own jr $ra+delay nop at 0x00109C34/0x00109C38. Last end = slice end 0x00109C3C. */
/* 0x00109C04 0x80179804 0x2405001E */ .word 0x2405001E # addiu $a1, $zero, 0x1E
/* 0x00109C08 0x80179808 0x2406F7FF */ .word 0x2406F7FF # addiu $a2, $zero, -0x801
/* 0x00109C0C 0x8017980C 0x3C04801F */ .word 0x3C04801F # lui $a0, 0x801F
/* 0x00109C10 0x80179810 0x24840D28 */ .word 0x24840D28 # addiu $a0, $a0, 0xD28
/* 0x00109C14 0x80179814 0x8C830000 */ .word 0x8C830000 # lw $v1, 0x0($a0)
/* 0x00109C18 0x80179818 0x8C620000 */ .word 0x8C620000 # lw $v0, 0x0($v1)
/* 0x00109C1C 0x8017981C 0x24A50001 */ .word 0x24A50001 # addiu $a1, $a1, 0x1
/* 0x00109C20 0x80179820 0x00461024 */ .word 0x00461024 # and $v0, $v0, $a2
/* 0x00109C24 0x80179824 0xAC620000 */ .word 0xAC620000 # sw $v0, 0x0($v1)
/* 0x00109C28 0x80179828 0x28A20032 */ .word 0x28A20032 # slti $v0, $a1, 0x32
/* 0x00109C2C 0x8017982C 0x1440FFF9 */ .word 0x1440FFF9 # bne $v0, $zero, 0x80179814
/* 0x00109C30 0x80179830 0x24840004 */ .word 0x24840004 # addiu $a0, $a0, 0x4
/* 0x00109C34 0x80179834 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00109C38 0x80179838 0x00000000 */ .word 0x00000000 # nop
